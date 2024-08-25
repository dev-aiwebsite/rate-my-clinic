import fs from 'fs';
import path from 'path';

// Utility function to generate a unique filename
export const getUniqueFilename = (directory: string, fileName: string): string => {
    let newFileName = fileName;
    let counter = 1;

    // Extract the file extension
    const ext = path.extname(fileName);
    // Extract the file base name without extension
    const baseName = path.basename(fileName, ext);

    while (fs.existsSync(path.join(directory, newFileName))) {
        newFileName = `${baseName} (${counter})${ext}`;
        counter++;
    }

    return newFileName.replace(/\s+/gi, '_');
};
