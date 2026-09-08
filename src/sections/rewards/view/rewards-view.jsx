import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const SIGN_UP_URL = 'https://lifejacketleads.movaflow.co/auth/amplify/sign-up';

const EARN_METHODS = [
  {
    icon: 'solar:cart-large-4-bold-duotone',
    title: 'Purchases',
    description:
      'Earn 1 point for every dollar you spend on leads. Every purchase counts toward your rewards balance automatically.',
  },
  {
    icon: 'solar:users-group-rounded-bold-duotone',
    title: 'Referrals',
    description:
      'Earn 2,500 bonus points when you refer a new customer. Just have them mention your name during onboarding.',
  },
];

const REDEMPTION_TIERS = [
  { points: '3,000', leads: '25', type: 'Aged Veteran Website Leads' },
  { points: '5,000', leads: '25', type: 'Aged Legacy Website Leads' },
  { points: '3,000', leads: '5', type: 'Fresh Legacy Website Leads' },
  { points: '5,000', leads: '5', type: 'Fresh Veteran Website Leads' },
  { points: '6,000', leads: '15', type: 'Fresh Legacy Website Leads' },
  { points: '10,000', leads: '15', type: 'Fresh Veteran Website Leads' },
];

const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'Make a Purchase',
    description: 'Buy leads as you normally would. Every dollar spent earns you 1 reward point.',
  },
  {
    step: '2',
    title: 'Points Accumulate',
    description:
      'Points from current-month purchases become available at the start of the following month.',
  },
  {
    step: '3',
    title: 'Choose Your Reward',
    description:
      'Once you have enough points, open the Rewards page in your account and pick from the available redemption options.',
  },
  {
    step: '4',
    title: 'Receive Free Lead Credits',
    description:
      'Redeemed leads are added to your lead credit balance and delivered just like a regular purchase — at no cost.',
  },
];

const FAQ_ITEMS = [
  {
    question: 'What is a lead credit?',
    answer:
      'A lead credit is one prepaid lead sitting in your account, ready to be delivered. Purchases and reward redemptions both add credits to your lead credit balance, and each lead delivered to you draws down that balance by one. You can check your balance at any time from your account dashboard.',
  },
  {
    question: 'When do my points become available?',
    answer:
      'Points from purchases made in the current month become available at the start of the following month. For example, points earned from March purchases are available starting April 1st.',
  },
  {
    question: 'Do my points expire?',
    answer:
      'No. Your points never expire and will remain in your account until you redeem them.',
  },
  {
    question: 'How do referrals work?',
    answer:
      'When a new customer signs up and mentions your name during onboarding, you automatically receive 2,500 bonus points. There is no limit to the number of referrals you can make.',
  },
  {
    question: 'Can I redeem points for any lead type?',
    answer:
      'Yes. You can redeem points for both Fresh and Aged leads across Veteran Website and Legacy Website lead types. Higher point tiers unlock better value with more leads per redemption.',
  },
  {
    question: 'Which purchases count toward rewards?',
    answer:
      'All lead purchases from March 2026 onward count toward your rewards balance. Points are calculated at 1 point per dollar spent.',
  },
  {
    question: 'Will you text me about my rewards?',
    answer:
      'Only if you ask us to. During sign-up you can opt in to SMS updates about your lead credit balance, new lead deliveries, and Mova Rewards offers. Opting in is never required to buy leads or to earn and redeem points. Reply STOP to any message to unsubscribe, or HELP for assistance. Message and data rates may apply, and message frequency varies. We never share or sell mobile opt-in data to third parties or affiliates for marketing.',
  },
];

// ----------------------------------------------------------------------

export function RewardsView() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      <Stack spacing={1} sx={{ mb: { xs: 5, md: 8 }, textAlign: 'center' }}>
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          Mova Rewards
        </Typography>
        <Typography variant="h2">Earn Points. Redeem Free Leads.</Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 680, mx: 'auto' }}>
          Mova Rewards is the loyalty program built into Lifejacket Leads, the Mova Flow lead
          marketplace. Earn points on every purchase and referral, then redeem them for free lead
          credits. The more you earn, the better the value.
        </Typography>
      </Stack>

      <Typography variant="h4" sx={{ mb: 3 }}>
        How to Earn Points
      </Typography>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        {EARN_METHODS.map((method) => (
          <Grid key={method.title} size={{ xs: 12, md: 6 }}>
            <Card sx={{ p: 4, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'primary.lighter', flexShrink: 0 }}>
                  <Iconify icon={method.icon} width={36} sx={{ color: 'primary.main' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {method.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {method.description}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h4" sx={{ mb: 1 }}>
        Redemption Options
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        Higher point tiers unlock greater value — your points go further as you accumulate more.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        {REDEMPTION_TIERS.map((tier, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                textAlign: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h3" sx={{ color: 'secondary.main', mb: 1 }}>
                {tier.leads}
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {tier.type}
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Box
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}
              >
                <Iconify icon="solar:star-bold-duotone" width={18} sx={{ color: 'warning.main' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {tier.points} points
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h4" sx={{ mb: 3 }}>
        How It Works
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
          Start earning on your next purchase
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Mova Rewards is included with every Lifejacket Leads account at no extra cost.
        </Typography>
        <Button
          size="large"
          variant="contained"
          color="primary"
          href={SIGN_UP_URL}
          startIcon={<Iconify icon="solar:star-bold-duotone" />}
        >
          Create your account
        </Button>
        <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.disabled' }}>
          Already a customer?{' '}
          <Link href="https://lifejacketleads.movaflow.co" underline="hover">
            Sign in to view your rewards balance
          </Link>
          .
        </Typography>
      </Card>
    </Container>
  );
}
