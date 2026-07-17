// backend/services/email.service.js
// Transactional email service (Resend)
const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

// Send order confirmation email
async function sendOrderConfirmation({ to, orderNumber, customerName, totalAmount, items }) {
  try {
    const { data, error } = await resend.emails.send({
      from: '125Customs <info@125customs.co.ke>',
      to: [to],
      subject: `Order Confirmation #${orderNumber}`,
      html: `
        <h2>Thank you for your order!</h2>
        <p>Hi ${customerName},</p>
        <p>Your order <strong>#${orderNumber}</strong> has been received.</p>
        
        <h3>Order Summary:</h3>
        <ul>
          ${items.map(item => `<li>${item.quantity}x ${item.product.name} - KES ${item.subtotal}</li>`).join('')}
        </ul>
        
        <p><strong>Total: KES ${totalAmount}</strong></p>
        
        <p>We'll notify you when your order is ready for pickup.</p>
        
        <p>Questions? WhatsApp us: <a href="https://wa.me/254712345678">Chat with us</a></p>
        
        <p>Best regards,<br/>125Customs Team</p>
      `
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error('Failed to send order confirmation email');
    }

    return data;
  } catch (error) {
    console.error('Email service error:', error);
    throw error;
  }
}

// Send quote approval email (B2B)
async function sendQuoteApproval({ to, quoteNumber, companyName, totalAmount, pdfUrl }) {
  try {
    const { data, error } = await resend.emails.send({
      from: '125Customs <info@125customs.co.ke>',
      to: [to],
      subject: `Quote Approved #${quoteNumber}`,
      html: `
        <h2>Your quote has been approved!</h2>
        <p>Hi ${companyName},</p>
        <p>Your quote <strong>#${quoteNumber}</strong> has been approved.</p>
        
        <h3>Quote Summary:</h3>
        <p><strong>Total Amount: KES ${totalAmount}</strong></p>
        
        ${pdfUrl ? `<p><a href="${pdfUrl}">Download Quote PDF</a></p>` : ''}
        
        <p>To proceed with the order, please reply to this email or contact us.</p>
        
        <p>Best regards,<br/>125Customs Team</p>
      `
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error('Failed to send quote approval email');
    }

    return data;
  } catch (error) {
    console.error('Email service error:', error);
    throw error;
  }
}

// Send payment notification (to admin)
async function sendPaymentNotification({ orderNumber, amount, channel, reference }) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@125customs.co.ke';
    
    const { data, error } = await resend.emails.send({
      from: '125Customs <info@125customs.co.ke>',
      to: [adminEmail],
      subject: `Payment Received #${orderNumber}`,
      html: `
        <h2>New Payment Received</h2>
        <p><strong>Order:</strong> #${orderNumber}</p>
        <p><strong>Amount:</strong> KES ${amount}</p>
        <p><strong>Channel:</strong> ${channel}</p>
        <p><strong>Reference:</strong> ${reference}</p>
        
        <p>Please log in to the admin dashboard to process this order.</p>
      `
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error('Failed to send payment notification');
    }

    return data;
  } catch (error) {
    console.error('Email service error:', error);
    throw error;
  }
}

module.exports = {
  sendOrderConfirmation,
  sendQuoteApproval,
  sendPaymentNotification
};
