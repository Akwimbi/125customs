// backend/templates/B2BWelcomeEmail.jsx
// B2B welcome email template
import { Html, Head, Body, Container, Section, Text, Heading, Button, Hr, Img } from '@react-email/components';

export default function B2BWelcomeEmail({ companyName, contactName }) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${process.env.FRONTEND_URL}/logo.png`}
            width="150"
            height="50"
            alt="125Customs"
            style={logo}
          />
          
          <Heading style={h1}>Welcome to 125Customs B2B!</Heading>
          
          <Text style={text}>Dear {contactName},</Text>
          
          <Text style={text}>
            Thank you for registering your company <strong>{companyName}</strong> on our B2B platform.
          </Text>

          <Section style={benefitsBox}>
            <Heading style={h2}>Your B2B Benefits:</Heading>
            <Text style={benefitText}>• Bulk order discounts (5-15%)</Text>
            <Text style={benefitText}>• Dedicated account manager</Text>
            <Text style={benefitText}>• Priority production queue</Text>
            <Text style={benefitText}>• Compliance documentation (AGPO, Tax)</Text>
            <Text style={benefitText}>• Custom invoicing & payment terms</Text>
          </Section>

          <Section style={buttonContainer}>
            <Button
              href={`${process.env.FRONTEND_URL}/b2b/dashboard`}
              style={button}
            >
              Access B2B Dashboard
            </Button>
          </Section>

          <Section style={nextSteps}>
            <Heading style={h2}>Next Steps:</Heading>
            <Text style={text}>1. Complete your company profile</Text>
            <Text style={text}>2. Upload compliance documents (if applicable)</Text>
            <Text style={text}>3. Request your first quote</Text>
            <Text style={text}>4. Our B2B team will contact you within 24 hours</Text>
          </Section>

          <Hr style={hr} />

          <Text style={footerText}>
            Your dedicated B2B team is ready to assist. Contact us at b2b@125customs.co.ke
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

const logo = {
  margin: '0 auto 20px',
  display: 'block',
};

const h1 = {
  color: '#dc2626',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0 20px',
  textAlign: 'center',
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

const benefitText = {
  color: '#525f7f',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 5px',
};

const benefitsBox = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
  border: '1px solid #e5e7eb',
};

const nextSteps = {
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
  textAlign: 'center',
};
