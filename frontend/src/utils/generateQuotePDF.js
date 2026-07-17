// frontend/src/utils/generateQuotePDF.js
// Generate PDF for B2B quotes using jsPDF
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const generateQuotePDF = (quote) => {
  const doc = new jsPDF();
  
  // Company Header
  doc.setFontSize(20);
  doc.setTextColor(220, 38, 38); // Red primary color
  doc.text('125Customs', 20, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Custom Engraving Solutions', 20, 27);
  doc.text('Nairobi, Kenya', 20, 32);
  doc.text('Email: info@125customs.co.ke', 20, 37);
  doc.text('Phone: +254 700 000 000', 20, 42);
  
  // Quote Title
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('QUOTE', 150, 20);
  doc.setFontSize(10);
  doc.text(`#Q-${quote.id}`, 150, 27);
  doc.text(`Date: ${new Date(quote.date).toLocaleDateString()}`, 150, 32);
  doc.text(`Valid Until: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}`, 150, 37);
  
  // Divider line
  doc.setDrawColor(220, 38, 38);
  doc.line(20, 50, 190, 50);
  
  // Company Information
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Quote For:', 20, 60);
  doc.setFontSize(10);
  doc.text(quote.companyName, 20, 67);
  doc.text(`Attn: ${quote.contactName}`, 20, 72);
  doc.text(quote.email, 20, 77);
  doc.text(quote.phone, 20, 82);
  
  // Project Details
  doc.setFontSize(12);
  doc.text('Project Details:', 20, 95);
  doc.setFontSize(10);
  doc.text(`Title: ${quote.title}`, 20, 102);
  doc.text(`Category: ${quote.productCategory}`, 20, 107);
  doc.text(`Quantity: ${quote.quantity} units`, 20, 112);
  doc.text(`Timeline: ${quote.timeline}`, 20, 117);
  
  // Specifications
  if (quote.specifications) {
    doc.setFontSize(12);
    doc.text('Specifications:', 20, 130);
    doc.setFontSize(9);
    const specLines = doc.splitTextToSize(quote.specifications, 170);
    doc.text(specLines, 20, 137);
  }
  
  // Items Table
  const tableStartY = quote.specifications ? 160 : 140;
  doc.autoTable({
    startY: tableStartY,
    head: [['Description', 'Qty', 'Unit Price', 'Total']],
    body: quote.items.map(item => [
      item.description,
      item.quantity,
      `KES ${item.unitPrice.toLocaleString()}`,
      `KES ${(item.quantity * item.unitPrice).toLocaleString()}`
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [220, 38, 38] },
    margin: { left: 20, right: 20 }
  });
  
  // Totals
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(10);
  doc.text('Subtotal:', 130, finalY);
  doc.text(`KES ${quote.subtotal.toLocaleString()}`, 170, finalY, { align: 'right' });
  
  if (quote.discount > 0) {
    doc.text(`Discount (${quote.discount}%):`, 130, finalY + 7);
    doc.text(`- KES ${((quote.subtotal * quote.discount) / 100).toLocaleString()}`, 170, finalY + 7, { align: 'right' });
  }
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Total:', 130, finalY + 15);
  doc.text(`KES ${quote.total.toLocaleString()}`, 170, finalY + 15, { align: 'right' });
  
  // Terms and Conditions
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text('Terms & Conditions:', 20, finalY + 30);
  doc.setFontSize(9);
  const terms = [
    '1. This quote is valid for 30 days from the date of issue.',
    '2. Payment terms: 50% deposit required to commence work.',
    '3. Balance payable before delivery.',
    '4. Delivery timeline starts after approval and deposit.',
    '5. All prices are in Kenyan Shillings (KES) and inclusive of VAT.'
  ];
  doc.text(terms, 20, finalY + 37);
  
  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Thank you for choosing 125Customs!', 105, pageHeight - 20, { align: 'center' });
  doc.text('For questions, contact us at info@125customs.co.ke', 105, pageHeight - 15, { align: 'center' });
  
  // Save the PDF
  doc.save(`Quote_Q-${quote.id}_125Customs.pdf`);
};

export default generateQuotePDF;
