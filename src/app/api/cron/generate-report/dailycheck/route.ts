import { CronLog } from "lib/models";
import { GetUsers } from "lib/server-actions";
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

    users.forEach((user) => {
      const lastReportDate = user.reports.at(-1)?.date;
      const userRegDate = user.createdAt;
      const shouldGenerate = shouldGenerateReport(userRegDate, lastReportDate);

      logMessages.push(`👤 ${user.useremail}`);
      logMessages.push(`   • Registered: ${userRegDate}`);
      logMessages.push(`   • Last Report: ${lastReportDate || "None"}`);

      if (shouldGenerate) {
        logMessages.push(`   ✅ Generate report`);
        // Add your report generation logic here
      } else {
        logMessages.push(`   ⏭️ Skip (up-to-date)`);
      }
    });

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
