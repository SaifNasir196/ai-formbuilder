// emails/FeedbackEmail.tsx
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface FeedbackEmailProps {
  name: string;
  email: string;
  company?: string;
  source: string;
  recommendation: string;
  feedback: string;
}

export const FeedbackEmail: React.FC<FeedbackEmailProps> = ({
  name,
  email,
  company,
  source,
  recommendation,
  feedback,
}) => (
  <Html>
    <Head />
    <Preview>New Feedback Submission from {name}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New Feedback Received</Heading>
        <Section style={section}>
          <Text style={text}><strong>Name:</strong> {name}</Text>
          <Text style={text}><strong>Email:</strong> {email}</Text>
          <Text style={text}><strong>Company:</strong> {company || 'Not provided'}</Text>
          <Text style={text}><strong>Source:</strong> {source}</Text>
          <Text style={text}><strong>Recommendation:</strong> {recommendation}</Text>
          <Text style={text}><strong>Feedback:</strong> {feedback}</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default FeedbackEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const h1 = {
  color: '#333',
  fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center',
  margin: '30px 0',
} as const;

const section = {
  padding: '0 48px',
};

const text = {
  color: '#333',
  fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
  fontSize: '16px',
  lineHeight: '24px',
};