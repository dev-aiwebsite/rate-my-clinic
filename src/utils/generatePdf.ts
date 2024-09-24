// utils/generatePdf.js
import puppeteer from 'puppeteer';

export const generatePdf = async (htmlString: string) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(htmlString, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
    });

    await browser.close();
    return pdfBuffer;
};
