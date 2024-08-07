// components/BulkEmailTemplate.tsx
import React from 'react';
import { Html, Head, Body, Container, Text, Link } from '@react-email/components';
import { EmailTemplateProps } from '@/lib/type';

export const BulkEmailTemplate: React.FC<EmailTemplateProps> = ({ subject, body, recipientName }) => (
  <Html>
    <Head />
    <Body>
      <Container>
        <Text>Dear {recipientName},</Text>
        <Text>{body}</Text>
        <Text>Best regards,</Text>
        <Text>Your Company</Text>
        <Link href="https://ai-formbuilder-one.vercel.app.com/unsubscribe">Unsubscribe</Link>
      </Container>
    </Body>
  </Html>
);