// backend/templates/QuoteApprovedEmail.jsx
// Quote approval email template for B2B customers
import { Html, Head, Body, Container, Section, Text, Heading, Button, Hr } from '@react-email/components';

export default function QuoteApprovedEmail({ quote, companyName }) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Quote Approved!</Heading>
          
          <Text style={text}>Dear {companyName},</Text>
          
          <Text style={text}>
            Great news! Your quote request has been approved. Please find the details below.
          </Text>

          <Section style={box}>
            <Text style={boldText}>Quote #: Q-{quote.id}</Text>
            <Text style={text}>Project: {quote.title}</Text>
            <Text style={text}>Category: {quote.productCategory}</Text>
            <Text style={boldText}>Total: KES {quote.total.toLocaleString()}</Text>
          </Section>

          <Section style={box}>
            <Heading style={h2}>Next Steps:</Heading>
            <Text style={text}>1. Review the attached quote document</Text>
            <Text style={text}>2. Sign and return the quote (if required)</Text>
            <Text style={text}>3. Make the initial deposit payment (50%)</Text>
            <Text style={text}>4. We'll commence production upon payment confirmation</Text>
          </Section>

          <Section style={buttonContainer}>
            <Button
              href={`${process.env.FRONTEND_URL}/quotes/${quote.id}`}
              style={button}
            >
              View Quote Details
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={footerText}>
            For any clarifications, contact our B2B team at b2b@125customs.co.ke
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
  backgroundColor: '#fef3c7',
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
