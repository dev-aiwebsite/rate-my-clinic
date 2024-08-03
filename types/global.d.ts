declare module 'html2pdf.js' {
    interface Html2PdfOptions {
        margin?: number | { top: number; bottom: number; left: number; right: number };
        filename?: string;
        image?: { type: string; quality: number };
        html2canvas?: { scale: number };
        jsPDF?: { unit: string; format: string; orientation: string };
    }

    function html2pdf(): {
        set(options: Html2PdfOptions): any;
        from(element: HTMLElement): any;
        toPdf(): any;
        save(filename: string): void;
    };

    export = html2pdf;
}
