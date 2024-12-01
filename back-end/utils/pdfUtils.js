const PDFDocument = require('pdfkit');
const fs = require('fs');

const generatePDF = async (data, outputPath) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const writeStream = fs.createWriteStream(outputPath);

        doc.pipe(writeStream);

        doc.fontSize(20).text('Certificado de Participação', { align: 'center' });
        doc.moveDown();
        doc.fontSize(16).text(`Certificamos que ${data.studentName} participou do workshop "${data.workshopName}"`, {
            align: 'center',
        });
        doc.moveDown();
        doc.text(`Realizado por ${data.professorName}.`, { align: 'center' });

        doc.end();

        writeStream.on('finish', () => resolve());
        writeStream.on('error', reject);
    });
};

module.exports = { generatePDF };
