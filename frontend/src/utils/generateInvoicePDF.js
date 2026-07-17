// frontend/src/utils/generateInvoicePDF.js
// Generate PDF for invoices using jsPDF
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const generateInvoicePDF = (order) => {
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
  doc.text('KRA PIN: P0000000X', 20, 47);
  doc.text('Tax Compliance Certificate: TCC000000', 20, 52);
  
  // Invoice Title
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('TAX INVOICE', 150, 20);
  doc.setFontSize(10);
  doc.text(`#INV-${order.id}`, 150, 27);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 150, 32);
  doc.text(`Due Date: ${new Date(order.dueDate).toLocaleDateString()}`, 150, 37);
  doc.text(`Status: ${order.status.toUpperCase()}`, 150, 42);
  
  // Divider line
  doc.setDrawColor(220, 38, 38);
  doc.line(20, 55, 190, 55);
  
  // Customer Information
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Bill To:', 20, 65);
  doc.setFontSize(10);
  doc.text(order.customerName, 20, 72);
  doc.text(order.customerEmail, 20, 77);
  doc.text(order.customerPhone, 20, 82);
  if (order.companyName) {
    doc.text(`Company: ${order.companyName}`, 20, 87);
  }
  
  // Shipping Address
  if (order.shippingAddress) {
    doc.text('Ship To:', 20, 100);
    doc.text(order.shippingAddress, 20, 107);
  }
  
  // Order Items Table
  const tableStartY = order.shippingAddress ? 120 : 100;
  doc.autoTable({
    startY: tableStartY,
    head: [['#', 'Description', 'Qty', 'Unit Price', 'Total']],
    body: order.items.map((item, index) => [
      index + 1,
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
  
  const subtotal = order.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const vat = subtotal * 0.16; // 16% VAT in Kenya
  const total = subtotal + vat;
  
  doc.text('Subtotal:', 130, finalY);
  doc.text(`KES ${subtotal.toLocaleString()}`, 170, finalY, { align: 'right' });
  
  doc.text('VAT (16%):', 130, finalY + 7);
  doc.text(`KES ${vat.toLocaleString()}`, 170, finalY + 7, { align: 'right' });
  
  if (order.discount > 0) {
    doc.text(`Discount:`, 130, finalY + 14);
    doc.text(`- KES ${order.discount.toLocaleString()}`, 170, finalY + 14, { align: 'right' });
  }
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('TOTAL:', 130, finalY + 22);
  doc.text(`KES ${total.toLocaleString()}`, 170, finalY + 22, { align: 'right' });
  
  // Payment Information
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text('Payment Information:', 20, finalY + 40);
  doc.setFontSize(9);
  
  const paymentInfo = [
    'Pay via M-Pesa: Till Number 000000',
    'Pay via Bank Transfer:',
    '  Bank: Equity Bank',
    '  Account: 0000000000',
    '  Account Name: 125Customs Ltd',
    '  Branch: Nairobi CBD'
  ];
  
  doc.text(paymentInfo, 20, finalY + 47);
  
  // M-Pesa Transaction (if paid)
  if (order.mpesaReceipt) {
    doc.setFontSize(10);
    doc.setTextColor(0, 128, 0);
    doc.text(`M-Pesa Receipt: ${order.mpesaReceipt}`, 20, finalY + 75);
    doc.setTextColor(0, 0, 0);
  }
  
  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Thank you for your business!', 105, pageHeight - 20, { align: 'center' });
  doc.text('For questions, contact us at info@125customs.co.ke | +254 700 000 000', 105, pageHeight - 15, { align: 'center' });
  
  // Add "PAID" watermark if order is paid
  if (order.status === 'paid') {
    doc.setFontSize(60);
    doc.setTextColor(0, 128, 0, 50); // Green with transparency
    doc.text('PAID', 105, pageHeight / 2, { align: 'center', angle: 45 });
  }
  
  // Save the PDF
  doc.save(`Invoice_INV-${order.id}_125Customs.pdf`);
};

export default generateInvoicePDF;
