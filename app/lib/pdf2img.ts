/**
 * Converts a PDF file to a PNG image using PDF.js (loaded from CDN).
 * Returns both a File object and a base64 data URL.
 */

export interface ConversionResult {
    file: File | null;
    dataUrl: string | null;
    error?: string;
}

declare global {
    interface Window {
        pdfjsLib: any;
    }
}

const PDFJS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174';

function loadPdfJs(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (window.pdfjsLib) {
            if (!window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = `${PDFJS_CDN}/pdf.worker.min.js`;
            }
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = `${PDFJS_CDN}/pdf.min.js`;
        script.onload = () => {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = `${PDFJS_CDN}/pdf.worker.min.js`;
            resolve();
        };
        script.onerror = () =>
            reject(new Error('Failed to load PDF.js from CDN. Check your internet connection.'));
        document.head.appendChild(script);
    });
}

export async function convertPdfToImage(file: File): Promise<ConversionResult> {
    try {
        await loadPdfJs();

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2.0 });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const context = canvas.getContext('2d');
        if (!context) {
            return { file: null, dataUrl: null, error: 'Canvas 2D context not available' };
        }

        await page.render({ canvasContext: context, viewport }).promise;

        // Get data URL synchronously
        const dataUrl = canvas.toDataURL('image/png', 0.95);

        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        resolve({ file: null, dataUrl, error: 'Failed to create image blob' });
                        return;
                    }
                    const imageFile = new File([blob], file.name.replace(/\.pdf$/i, '.png'), {
                        type: 'image/png',
                    });
                    resolve({ file: imageFile, dataUrl });
                },
                'image/png',
                0.95
            );
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { file: null, dataUrl: null, error: `PDF conversion failed: ${message}` };
    }
}
