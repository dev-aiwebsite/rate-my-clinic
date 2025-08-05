import { SaveReport } from "lib/generateReportData";
import { AppSendMail } from "lib/server-actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const result = {
    success: false,
    message: "",
    data: null as any,
  };

  const userId = searchParams.get("userid");

  if (!userId) {
    return NextResponse.json(
      { error: "Missing userid" },
      { status: 400 }
    );
  }

  const saveReportRes = await SaveReport({ currentUserId: userId });

  if (saveReportRes.success && saveReportRes.data) {
    const userData = saveReportRes.data;
    const report = userData.reports?.at(-1);
    const userEmail = userData.useremail

    if (!report?.pdf_link || !userEmail) {
      result.message = "Report or user email missing.";
      return NextResponse.json(result, { status: 500 });
    }

    const domain = process.env.NEXTAUTH_URL;

  

    const fileName = report.pdf_link.split("/").pop();

    const mailOptions = {
      to: [userEmail],
      cc: ["dev@aiwebsiteservices.com", "allaine@aiwebsiteservices.com"],
      subject: "New Report Generated",
      htmlBody: `
        <p>Hi ${userData.fname},</p>
        <p>Your new report has been successfully added to your profile.</p>
        <p>You can download it here:</p>
        <a href="${domain + report.pdf_link}" target="_blank">${fileName}</a>
      `,
    };

    const emailStatus = await AppSendMail(mailOptions);

    result.success = true;
    result.message = emailStatus.success ? "Report generated and email sent." : `Report generated but email failed. ERROR: ${emailStatus.message}`;
    result.data = {
      name: `${userData.fname} ${userData.lname}`.trim(),
      email: userData.useremail,
      pdf_link: domain + report.pdf_link,
    };

  } else {
    result.message = saveReportRes.message || "Failed to generate report.";
  }

  return NextResponse.json(result);
}
