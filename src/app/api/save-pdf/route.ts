import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';
import { getUniqueFilename } from 'lib/getUniqueFileName';

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData();
        const file = data.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const today = new Date()
        const dateString = today.toLocaleDateString().replaceAll('/','-')
        const pdfFileName = `${file.name} ${dateString}`;
        const fileExtension = 'pdf'
        const initialFileName = `${pdfFileName}`;
        const publicFolderPath = path.join(process.cwd(), 'public', 'reports');
        const newFileName = getUniqueFilename(publicFolderPath,initialFileName)
        const newFullFileName = `${newFileName}.${fileExtension}`
        const pdfFilePath = path.join(publicFolderPath, newFullFileName);

        // Create the directory if it doesn't exist
        if (!fs.existsSync(publicFolderPath)) {
            fs.mkdirSync(publicFolderPath, { recursive: true });
        }

        // Save the file to the public folder
        fs.writeFileSync(pdfFilePath, fileBuffer);

        // Return the URL of the saved PDF
        const pdfUrl = `/reports/${newFullFileName}`;
        return NextResponse.json({ url: pdfUrl });
    } catch (error) {
        console.error('Error saving file:', error);
        return NextResponse.json({ error: 'Error saving file' }, { status: 500 });
    }
}
