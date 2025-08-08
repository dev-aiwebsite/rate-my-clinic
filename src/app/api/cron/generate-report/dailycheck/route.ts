import { CronLog } from "lib/models";
import { AppSendMail, GetUsers } from "lib/server-actions";
import { NextRequest, NextResponse } from "next/server";
import { User } from "../../../../../../types/types";

export async function GET(req: NextRequest) {
  const result = {
    success: false,
    message: "",
    data: null as any,
  };

  const logMessages: string[] = [];

  const key = req.nextUrl.searchParams.get("key");
  if (key !== process.env.CRON_SECRET_KEY) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  let users: User[] = [];

  try {
    const today = new Date();
    logMessages.push(`📆 Today: ${today.toISOString()}`);

    const res = await GetUsers();
    users = res.data;

    for (const user of users) {
      const lastReportDate = user.reports.at(-1)?.date;
      const userRegDate = user.createdAt;
      
    
      logMessages.push(`👤 ${user.useremail}`);
      logMessages.push(`   • Registered: ${userRegDate}`);
      logMessages.push(`   • Last Report: ${lastReportDate || "None"}`);
    
      if (isSixMonthMilestone(userRegDate)) {
        logMessages.push(`   📧 Sending survey reminder email`);

        try {
          const mailOptions = {
            to: [user.useremail],
            cc: ["dev@aiwebsiteservices.com", "allaine@aiwebsiteservices.com"],
            subject: "Reminder | Update Your Clinic’s Performance Insights",
            htmlBody: `
              <p>Hi ${user.fname},</p>
              <p>I hope you’re finding the platform valuable.</p>
              <p>We recommend taking the survey every 6 to 12 months to stay up to date with your clinic’s performance.</p>
              <p>If you’ve already generated a report, please disregard this message.</p>
              <br>
              <p>Kind regards,</p>
              <p>The RateMyClinic Team</p>

            `,
          };
        
          const emailStatus = await AppSendMail(mailOptions);
        
          if (emailStatus.success) {
            logMessages.push(`   ✅ Reminder email sent to ${user.useremail}`);
          } else {
            logMessages.push(`   ❌ Failed to send email: ${emailStatus.message}`);
          }
        } catch (err) {
          logMessages.push(`   ❌ Exception sending email: ${(err as Error).message}`);
        }
    
      } else {
        logMessages.push(`   ⏭️ Skip (up-to-date)`);
      }
    }
    

    result.success = true;
    result.message = "Report check completed";
  } catch (error: any) {
    result.message = error.message || "Unexpected error";
    logMessages.push(`❌ Error: ${result.message}`);
  } finally {
    await CronLog.create({
      name: "daily-report",
      status: result.success ? "success" : "failed",
      message: logMessages.join("\n"),
      data: {
        totalUsers: users.length,
        date: new Date(),
      },
    });
    console.log('✅ Cron log inserted');

    return NextResponse.json(result);
  }
}

const shouldGenerateReport = (
  registrationDate: string | Date,
  lastReportDate?: string | Date
) => {
  const reg = new Date(registrationDate);
  const now = new Date();

  const monthsSinceReg =
    (now.getFullYear() - reg.getFullYear()) * 12 +
    (now.getMonth() - reg.getMonth());
  const completedIntervals = Math.floor(monthsSinceReg / 6);

  const last6MonthMark = new Date(reg);
  last6MonthMark.setMonth(reg.getMonth() + completedIntervals * 6);
  last6MonthMark.setHours(0, 0, 0, 0);

  if (!lastReportDate) return true;

  const last = new Date(lastReportDate);
  last.setHours(0, 0, 0, 0);

  return last < last6MonthMark;
};

function isSixMonthMilestone (registrationDate: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let milestone = new Date(registrationDate);
  milestone.setHours(0, 0, 0, 0);

  // Keep adding 6 months until we reach or pass today
  while (milestone < today) {
    milestone.setMonth(milestone.getMonth() + 6);

    // Adjust if the month doesn't have the same date (e.g., Jan 31 → Feb 28/29)
    if (milestone.getDate() !== registrationDate.getDate()) {
      milestone.setDate(0); // last day of previous month
    }
  }

  return milestone.getTime() === today.getTime();
};