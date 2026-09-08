import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const SIGN_UP_URL = 'https://lifejacketleads.movaflow.co/auth/amplify/sign-up';

const LEAD_TYPES = [
  {
    category: 'Veteran Life',
    title: 'Veteran leads',
    description:
      'U.S. military veterans who have actively requested information on life insurance coverage. Generated fresh, routed through a dedicated landing page, and OTP-verified prior to delivery.',
    tags: ['Generated Fresh', 'OTP verified', 'Veteran-specific funnel'],
  },
  {
    category: 'General Life',
    title: 'General life leads',
    description:
      'Consumers actively seeking life insurance coverage. Generated fresh from targeted campaigns, routed through a landing page, and OTP-verified to confirm intent and contact accuracy.',
    tags: ['Generated Fresh', 'OTP verified', 'Broad market'],
  },
  {
    category: 'Mortgage Protection',
    title: 'Mortgage leads',
    description:
      'Homeowners and recent buyers requesting information on mortgage protection coverage. Generated fresh, landing page routed, and OTP-verified — high intent tied to an active financial event.',
    tags: ['Generated Fresh', 'OTP verified', 'Homeowner-specific'],
  },
  {
    category: 'Final Expense',
    title: 'FEX leads',
    description:
      'Seniors seeking final expense coverage to protect their families from end-of-life costs. Generated fresh, routed through a dedicated landing page, and OTP-verified before delivery.',
    tags: ['Generated Fresh', 'OTP verified', 'Senior-focused funnel'],
  },
];

const FRESHNESS_TIERS = [
  {
    icon: 'solar:bolt-bold-duotone',
    label: 'Fresh',
    description:
      'Delivered within minutes of the consumer submitting the form. Highest intent and highest contact rate, priced at a premium.',
  },
  {
    icon: 'solar:layers-bold-duotone',
    label: 'Mixed',
    description:
      'A blended package of Fresh and Aged leads in a single purchase, for agents who want volume without giving up first-contact opportunities.',
  },
  {
    icon: 'solar:clock-circle-bold-duotone',
    label: 'Aged',
    description:
      'Previously generated leads that have passed their fresh window. The same OTP-verified consumers at a substantially lower cost per lead — the best value for high-volume dialing and long-cycle follow-up. Aged Products are the tier we most often discount in limited-time offers.',
  },
];

const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'Create an account',
    description:
      'Sign up on the Lifejacket Leads portal and complete onboarding. There is no subscription or platform fee — you pay only for the leads you buy.',
  },
  {
    step: '2',
    title: 'Choose your product',
    description:
      'Pick a lead type (Veteran, General Life, Mortgage Protection, or Final Expense) and a freshness tier (Fresh, Mixed, or Aged). Current per-lead pricing and package sizes are shown on the Purchase page inside your account.',
  },
  {
    step: '3',
    title: 'Check out securely',
    description:
      'Payment is processed by Stripe. We never see or store your full card details.',
  },
  {
    step: '4',
    title: 'Leads land in your lead credit balance',
    description:
      'Every purchase adds lead credits to your account. As leads are delivered — into the portal and, if you have connected one, straight into your CRM — your lead credit balance draws down by one per lead. You can check the balance at any time from your dashboard.',
  },
];

const FAQ_ITEMS = [
  {
    question: 'What is a lead credit?',
    answer:
      'A lead credit is one prepaid lead sitting in your account, ready to be delivered. Purchases and Mova Rewards redemptions both add credits to your lead credit balance, and each delivered lead draws it down by one.',
  },
  {
    question: 'What does "Aged" mean?',
    answer:
      'Aged leads are consumers who submitted a request earlier than the current fresh window. They went through the same landing page and the same OTP verification as Fresh leads — the only difference is elapsed time, which is why they cost significantly less per lead.',
  },
  {
    question: 'Are leads exclusive?',
    answer:
      'Exclusivity varies by product and is stated on each product card at the point of purchase. Some packages, including Octavian Mortgage, are sold as exclusive leads with live transfer directly into your CRM.',
  },
  {
    question: 'Do purchases earn rewards?',
    answer:
      'Yes. Every dollar spent earns 1 point in Mova Rewards, redeemable for free lead credits. See the Mova Rewards page for redemption tiers.',
  },
  {
    question: 'Will you text me about offers?',
    answer:
      'Only if you opt in. During sign-up you can check a separate, unchecked box to receive SMS updates about your lead credit balance, new lead deliveries, and limited-time offers such as Aged Product promotions. Consent to receive marketing texts is never a condition of purchase. Reply STOP to any message to unsubscribe, or HELP for assistance. Message and data rates may apply, and message frequency varies. We never share or sell mobile opt-in data to third parties or affiliates for marketing.',
  },
];

// ----------------------------------------------------------------------

export function PurchaseView() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      <Stack spacing={1} sx={{ mb: { xs: 5, md: 8 }, textAlign: 'center' }}>
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          Purchase Leads
        </Typography>
        <Typography variant="h2">OTP-verified insurance leads, on demand</Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 700, mx: 'auto' }}>
          Lifejacket Leads is the Mova Flow lead marketplace. Buy Fresh, Mixed, or Aged leads across
          four insurance verticals, pay per lead with no subscription, and have them delivered into
          the portal or straight into your CRM.
        </Typography>
      </Stack>

      <Typography variant="h4" sx={{ mb: 3 }}>
        Lead Types
      </Typography>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        {LEAD_TYPES.map((lead) => (
          <Grid key={lead.title} size={{ xs: 12, md: 6 }}>
            <Card sx={{ p: 4, height: '100%' }}>
              <Chip
                size="small"
                variant="outlined"
                label={lead.category}
                sx={{ mb: 1.5, color: 'primary.main', borderColor: 'primary.main' }}
              />
              <Typography variant="h6" sx={{ mb: 1 }}>
                {lead.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                {lead.description}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {lead.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" variant="outlined" />
                ))}
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h4" sx={{ mb: 1 }}>
        Freshness Tiers
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        Every lead type is sold in three tiers. All three are OTP-verified — the difference is how
        recently the consumer submitted their request.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        {FRESHNESS_TIERS.map((tier) => (
          <Grid key={tier.label} size={{ xs: 12, md: 4 }}>
            <Card sx={{ p: 4, height: '100%' }}>
              <Box sx={{ mb: 2, p: 1.5, borderRadius: 2, bgcolor: 'primary.lighter', width: 'fit-content' }}>
                <Iconify icon={tier.icon} width={36} sx={{ color: 'primary.main' }} />
              </Box>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {tier.label}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {tier.description}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h4" sx={{ mb: 3 }}>
        How Purchasing Works
      </Typography>

      <Card sx={{ p: 4, mb: 6 }}>
        <Stack spacing={3}>
          {HOW_IT_WORKS.map((item) => (
            <Box key={item.step} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  flexShrink: 0,
                  display: 'flex',
                  fontWeight: 700,
                  borderRadius: '50%',
                  alignItems: 'center',
                  bgcolor: 'primary.main',
                  color: 'common.white',
                  justifyContent: 'center',
                }}
              >
                {item.step}
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {item.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </Card>

      <Typography variant="h4" sx={{ mb: 3 }}>
        Frequently Asked Questions
      </Typography>

      <Stack spacing={2} sx={{ mb: 6 }}>
        {FAQ_ITEMS.map((faq) => (
          <Card key={faq.question} sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
              {faq.question}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {faq.answer}
            </Typography>
          </Card>
        ))}
      </Stack>

      <Card sx={{ p: 5, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          See current pricing and buy
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Live per-lead pricing, package sizes, and any active limited-time offers are shown on the
          Purchase page inside your Lifejacket Leads account.
        </Typography>
        <Button
          size="large"
          variant="contained"
          color="primary"
          href={SIGN_UP_URL}
          startIcon={<Iconify icon="solar:cart-large-4-bold-duotone" />}
        >
          Create your account
        </Button>
        <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.disabled' }}>
          Already a customer?{' '}
          <Link href="https://lifejacketleads.movaflow.co" underline="hover">
            Sign in to purchase
          </Link>
          .
        </Typography>
      </Card>
    </Container>
  );
}
