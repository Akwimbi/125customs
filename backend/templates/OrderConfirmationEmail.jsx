// backend/templates/OrderConfirmationEmail.jsx
// Order confirmation email template for 125Customs
import { Html, Head, Body, Container, Section, Text, Heading, Button, Hr } from '@react-email/components';

export default function OrderConfirmationEmail({ order, customerName }) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Thank You for Your Order!</Heading>
          
          <Text style={text}>Hello {customerName},</Text>
          
          <Text style={text}>
            Your order has been successfully placed. Here are your order details:
          </Text>

          <Section style={box}>
            <Text style={boldText}>Order #: {order.id}</Text>
            <Text style={text}>Date: {new Date(order.createdAt).toLocaleDateString()}</Text>
            <Text style={boldText}>Total: KES {order.total.toLocaleString()}</Text>
          </Section>

          <Section style={box}>
            <Heading style={h2}>Order Items:</Heading>
            {order.items.map((item, index) => (
              <Text key={index} style={itemText}>
                {item.quantity}x {item.name} - KES {(item.quantity * item.price).toLocaleString()}
              </Text>
            ))}
          </Section>

          <Section style={buttonContainer}>
            <Button
              href={`${process.env.FRONTEND_URL}/orders/${order.id}`}
              style={button}
            >
              View Order Details
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

// Styles
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

const itemText = {
  color: '#525f7f',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 5px',
};

const box = {
  backgroundColor: '#f9fafb',
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
