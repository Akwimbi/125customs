// backend/templates/PaymentNotificationEmail.jsx
// Payment notification email template
import { Html, Head, Body, Container, Section, Text, Heading, Button, Hr } from '@react-email/components';

export default function PaymentNotificationEmail({ order, paymentMethod, transactionId }) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Payment Received</Heading>
          
          <Text style={text}>Dear {order.customerName},</Text>
          
          <Text style={text}>
            We have successfully received your payment. Thank you!
          </Text>

          <Section style={box}>
            <Text style={boldText}>Order #: {order.id}</Text>
            <Text style={text}>Payment Method: {paymentMethod}</Text>
            <Text style={text}>Transaction ID: {transactionId}</Text>
            <Text style={boldText}>Amount Paid: KES {order.total.toLocaleString()}</Text>
          </Section>

          <Section style={statusBox}>
            <Heading style={h2}>What's Next?</Heading>
            <Text style={text}>✓ Payment confirmed</Text>
            <Text style={text}>→ Production in progress</Text>
            <Text style={text}>→ You'll receive shipping notification soon</Text>
          </Section>

          <Section style={buttonContainer}>
            <Button
              href={`${process.env.FRONTEND_URL}/orders/${order.id}`}
              style={button}
            >
              Track Your Order
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={footerText}>
            Questions? Contact us at info@125customs.co.ke or +254 700 000 000
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
};

const h1 = {
  color: '#dc2626',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0 20px',
};

const h2 = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: '600',
  margin: '20px 0 10px',
};

const text = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 10px',
};

const boldText = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 10px',
};

const box = {
  backgroundColor: '#d1fae5',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
};

const statusBox = {
  backgroundColor: '#eff6ff',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
};

const buttonContainer = {
  textAlign: 'center',
  margin: '30px 0',
};

const button = {
  backgroundColor: '#dc2626',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
  padding: '12px 24px',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '20px 0',
};

const footerText = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '20px 0 0',
};
