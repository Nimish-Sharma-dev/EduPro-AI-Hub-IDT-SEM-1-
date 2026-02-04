import pdf from 'pdf-parse';
import mammoth from 'mammoth';

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
    try {
        const data = await pdf(buffer);
        return data.text;
    } catch (error) {
        console.error('PDF extraction error:', error);
        throw new Error('Failed to extract text from PDF');
    }
}

export async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
    try {
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
    } catch (error) {
        console.error('DOCX extraction error:', error);
        throw new Error('Failed to extract text from DOCX');
    }
}

export async function extractTextFromTXT(buffer: Buffer): Promise<string> {
    try {
        return buffer.toString('utf-8');
    } catch (error) {
        console.error('TXT extraction error:', error);
        throw new Error('Failed to extract text from TXT');
    }
}

export async function extractTextFromFile(
    file: File
): Promise<string> {
    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = file.name.split('.').pop()?.toLowerCase();

    switch (extension) {
        case 'pdf':
            return extractTextFromPDF(buffer);
        case 'docx':
            return extractTextFromDOCX(buffer);
        case 'txt':
            return extractTextFromTXT(buffer);
        default:
            throw new Error(`Unsupported file type: ${extension}`);
    }
}
