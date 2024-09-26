// utils/generatePdf.js
import puppeteer from 'puppeteer';

export const generatePdf = async (htmlString: string) => {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        await page.setContent(htmlString, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
        });

        return pdfBuffer;
    } catch (error) {
        console.error('Error launching browser or generating PDF:', error);
        throw error; // Rethrow the error for further handling
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};
