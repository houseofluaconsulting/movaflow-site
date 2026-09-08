import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

const EFFECTIVE_DATE = 'September 8, 2026';

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: `These Terms and Conditions ("Terms") govern your access to and use of the Mova website, products, and services, including our lead distribution partner platforms (collectively, the "Services"). By accessing or using the Services, you agree to be bound by these Terms. If you do not agree, do not use the Services.`,
  },
  {
    title: '2. Eligibility',
    body: `You must be at least 18 years old and capable of forming a binding contract to use the Services. By using the Services, you represent and warrant that you meet these requirements and that all information you provide is accurate and current.`,
  },
  {
    title: '3. Accounts and Registration',
    body: `Some features of the Services require an account. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree to notify us immediately of any unauthorized access or use of your account.`,
  },
  {
    title: '4. SMS and Text Messaging',
    body: `If you provide your mobile phone number and affirmatively consent, we may send you SMS text messages relating to your account and the Services, including lead delivery alerts, lead credit balance updates, rewards and referral credit notifications, promotional offers, and customer care responses.

Consent is collected at account registration through two separate, independent checkboxes, each unchecked by default: one for automated account alerts and one for recurring marketing and promotional messages. Neither checkbox is required. You may create an account and use every part of the Services without consenting to either, and consent to receive marketing text messages is never a condition of purchase.

You may withdraw consent at any time by replying STOP to any message, after which you will receive a single confirmation that you have been unsubscribed. Reply HELP for assistance, or contact us at support@movaflow.co. Message and data rates may apply, and message frequency varies. Carriers are not liable for delayed or undelivered messages.

Mobile opt-in data and consent are never shared or sold to third parties or affiliates for marketing or promotional purposes. Our handling of this information is described further in our Privacy Policy.`,
  },
  {
    title: '5. Fees, and Payments',
    body: `Certain Services are offered on a subscription or paid basis through our lead distribution partner platforms. By purchasing a subscription, you authorize us to charge the applicable fees to your chosen payment method. Fees are non-refundable except as required by law or as expressly stated in these Terms.`,
  },
  {
    title: '6. Acceptable Use',
    body: `You agree not to misuse the Services. You will not (a) violate any applicable law or regulation; (b) infringe the intellectual property or other rights of any third party; (c) upload or transmit malicious code, spam, or harmful content; (d) attempt to gain unauthorized access to any part of the Services; or (e) use the Services in a way that could damage, disable, or impair them.`,
  },
  {
    title: '7. Leads and Customer Data',
    body: `If you purchase or receive leads through the Services, you are responsible for using such information in compliance with all applicable laws, including telemarketing, anti-spam, and privacy regulations (such as TCPA, CAN-SPAM, GDPR, and CCPA, where applicable). You are solely responsible for your communications with leads and the suitability of the leads for your business.`,
  },
  {
    title: '8. Intellectual Property',
    body: `The Services, including all content, features, and functionality, are owned by Mova or its licensors and are protected by intellectual property laws. We grant you a limited, non-exclusive, non-transferable, revocable license to use the Services in accordance with these Terms. You may not copy, modify, distribute, sell, or reverse-engineer any portion of the Services.`,
  },
  {
    title: '9. User Content',
    body: `You retain ownership of any content you submit to the Services. By submitting content, you grant Mova a worldwide, non-exclusive, royalty-free license to use, host, store, reproduce, and display such content solely as needed to provide and improve the Services. You are responsible for ensuring your content does not violate any law or third-party rights.`,
  },
  {
    title: '10. Third-Party Services',
    body: `The Services may integrate with or contain links to third-party services. We are not responsible for the availability, content, or practices of any third-party services, and your use of such services is governed by their own terms and policies.`,
  },
  {
    title: '11. Termination',
    body: `We may suspend or terminate your access to the Services at any time, with or without cause or notice, including if you breach these Terms. Upon termination, your right to use the Services will immediately cease. Sections that by their nature should survive termination will continue to apply.`,
  },
  {
    title: '12. Disclaimers',
    body: `The Services are provided "as is" and "as available" without warranties of any kind, whether express or implied. Mova disclaims all warranties, including merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Services will be uninterrupted, error-free, or that any leads will result in business outcomes.`,
  },
  {
    title: '13. Limitation of Liability',
    body: `To the maximum extent permitted by law, Mova and its affiliates will not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, revenue, or data, arising out of or in connection with your use of the Services. Our total liability for any claim relating to the Services will not exceed the amounts you paid to Mova in the twelve (12) months preceding the claim.`,
  },
  {
    title: '14. Indemnification',
    body: `You agree to defend, indemnify, and hold harmless Mova and its officers, directors, employees, and agents from any claims, damages, liabilities, costs, and expenses (including reasonable attorneys’ fees) arising from your use of the Services, your content, or your breach of these Terms.`,
  },
  {
    title: '15. Governing Law and Dispute Resolution',
    body: `These Terms are governed by the laws of the jurisdiction in which Mova is established, without regard to its conflict-of-law principles. Any disputes will be resolved in the courts located in that jurisdiction, unless otherwise required by applicable law.`,
  },
  {
    title: '16. Changes to These Terms',
    body: `We may update these Terms from time to time. When changes are material, we will provide notice by updating the effective date and, where appropriate, by additional means. Your continued use of the Services after changes take effect constitutes acceptance of the revised Terms.`,
  },
  {
    title: '17. Contact Us',
    body: `If you have questions about these Terms, please contact us at support@movaflow.co.`,
  },
];

// ----------------------------------------------------------------------

export function TermsConditionsView() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
      <Stack spacing={1} sx={{ mb: { xs: 5, md: 8 }, textAlign: 'center' }}>
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          Legal
        </Typography>
        <Typography variant="h2">Terms & Conditions</Typography>
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
