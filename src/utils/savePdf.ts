import { generatePdf } from "./generatePdf";
import fs from 'fs';
import path from 'path';
import { getUniqueFilename } from 'lib/getUniqueFileName';

export const savePdf = async ({htmlString,buffer}:{htmlString?:string,buffer?:Uint8Array}) => {
    let pdfBuffer
    if(htmlString){
        pdfBuffer = await generatePdf(htmlString);
    }else if(buffer){
        pdfBuffer = buffer
    } else {
        return false
    }

    const today = new Date();
    const dateString = today.toLocaleDateString().replace(/\//g, '-');
    const pdfFileName = `report_${dateString}`;
    const fileExtension = 'pdf';
    const initialFileName = `${pdfFileName}`;
    const publicFolderPath = path.join(process.cwd(), 'public', 'reports');
    const newFileName = getUniqueFilename(publicFolderPath, initialFileName);
    const newFullFileName = `${newFileName}.${fileExtension}`;
    const pdfFilePath = path.join(publicFolderPath, newFullFileName);

    // Create the directory if it doesn't exist
    if (!fs.existsSync(publicFolderPath)) {
        fs.mkdirSync(publicFolderPath, { recursive: true });
    }

    // Save the PDF file to the file system
    fs.writeFileSync(pdfFilePath, pdfBuffer);

    // Return the URL of the saved PDF
    const pdfUrl = `/reports/${newFullFileName}`;
    return pdfUrl;
}