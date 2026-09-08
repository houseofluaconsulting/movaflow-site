import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

const EFFECTIVE_DATE = 'September 8, 2026';

const SECTIONS = [
  {
    title: '1. Introduction',
    body: `Mova ("Mova", "we", "us", or "our") respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services, including our lead distribution partner platforms.`,
  },
  {
    title: '2. Information We Collect',
    body: `We collect information you provide directly to us, such as your name, email address, phone number, and any other details you submit when creating an account, contacting support, or using our services.`,
  },
  {
    title: '3. How We Use Your Information',
    body: `We use your information to provide, operate, and improve our services; send related communications; respond to inquiries and provide customer support; send administrative messages, updates, and marketing communications (which you may opt out of at any time); detect, investigate, and prevent fraudulent or unauthorized activity; and comply with legal obligations.`,
  },
  {
    title: '4. Sharing of Information',
    body: `We do not sell your personal information. We may share information with service providers who perform services on our behalf (such as payment processing, hosting, and analytics), with affiliates and business partners as needed to deliver our services, in connection with a merger, acquisition, or sale of assets, or when required by law or to protect our rights and the safety of others.

No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. All of the categories described above exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.`,
  },
  {
    title: '5. SMS and Text Messaging',
    body: `If you provide your mobile phone number and affirmatively consent, we may send you SMS text messages related to your account and our services — including lead delivery alerts, lead credit balance updates, rewards notifications, promotional offers, and customer care responses.

Consent is obtained at account registration through two separate, independent checkboxes on our web sign-up form, each unchecked by default and separate from any other agreement: one for automated account alerts and one for recurring marketing and promotional messages.

Neither checkbox is required. You can create an account and use every part of the platform without consenting to either, and consent to receive marketing text messages is never a condition of purchase. Account alerts are sent only to users who opted in to them, and marketing or promotional messages only to users who separately opted in to those.

Mobile opt-in data and consent are never shared or sold to third parties or affiliates for marketing or promotional purposes. We share your mobile number only with the messaging service providers strictly necessary to transmit messages you have asked to receive, and those providers are contractually prohibited from using it for any other purpose.

You may opt out at any time by replying STOP to any message, and you will receive a single confirmation that you have been unsubscribed. Reply HELP for assistance, or contact us at info@movaflow.co. Message and data rates may apply. Message frequency varies. Carriers are not liable for delayed or undelivered messages.`,
  },
  {
    title: '6. Data Retention',
    body: `We retain personal information for as long as necessary to provide our services, comply with our legal obligations, resolve disputes, and enforce our agreements. When information is no longer needed, we securely delete or anonymize it.`,
  },
  {
    title: '7. Data Security',
    body: `We implement reasonable administrative, technical, and physical safeguards designed to protect your information. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.`,
  },
  {
    title: '8. Your Rights and Choices',
    body: `Depending on your jurisdiction, you may have rights to access, correct, delete, or restrict the use of your personal information, as well as the right to data portability and to withdraw consent. To exercise these rights, please contact us using the details below.`,
  },
  {
    title: '9. Children’s Privacy',
    body: `Our services are not directed to children under 18, and we do not knowingly collect personal information from children. If we learn we have collected personal information from a child, we will delete it.`,
  },
  {
    title: '10. Changes to This Policy',
    body: `We may update this Privacy Policy from time to time. When we make material changes, we will notify you by updating the effective date above and, where appropriate, providing additional notice.`,
  },
  {
    title: '11. Contact Us',
    body: `If you have questions or concerns about this Privacy Policy or our privacy practices, please contact us at info@movaflow.co.`,
  },
];

// ----------------------------------------------------------------------

export function PrivacyPolicyView() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
      <Stack spacing={1} sx={{ mb: { xs: 5, md: 8 }, textAlign: 'center' }}>
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          Legal
        </Typography>
        <Typography variant="h2">Privacy Policy</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Effective date: {EFFECTIVE_DATE}
        </Typography>
      </Stack>

      <Stack spacing={4}>
        {SECTIONS.map((section) => (
          <Box key={section.title}>
            <Typography variant="h5" sx={{ mb: 1.5 }}>
              {section.title}
            </Typography>
            <Stack spacing={1.5}>
              {section.body.split('\n\n').map((paragraph, index) => (
                <Typography key={index} variant="body1" sx={{ color: 'text.secondary' }}>
                  {paragraph}
                </Typography>
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Container>
  );
}
