import { NextResponse } from 'next/server';
import { generatePdf } from 'utils/generatePdf';
import fs from 'fs';
import path from 'path';
import { getUniqueFilename } from 'lib/getUniqueFileName';
import { buffer } from 'stream/consumers';
import { savePdf } from 'utils/savePdf';

export async function POST(req: Request) {
    const { htmlString, save } = await req.json();

    try {
        const pdfBuffer = await generatePdf(htmlString);

        if (save) {
            // Save the PDF to the server if `save` is true
            const pdfUrl = await savePdf({buffer:pdfBuffer})
            return NextResponse.json({ url: pdfUrl });
        } else {
            // If `save` is false or not provided, return the PDF for download
            return new NextResponse(pdfBuffer, {
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename=report.pdf',
                },
            });
        }   
    } catch (error) {
        return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
    }
}
