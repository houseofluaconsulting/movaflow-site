import { m } from 'framer-motion';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

import { SectionTitle } from './components/section-title';
import { FloatLine, FloatPlusIcon } from './components/svg-elements';

// ----------------------------------------------------------------------

const ADMIN_FEATURES = [
  {
    title: 'Customer & Lead Management',
    description:
      'Manage every customer and the leads flowing to them from a single source of truth.',
    icon: 'solar:users-group-rounded-bold-duotone',
  },
  {
    title: 'Lead Metrics',
    description:
      'Real-time visibility into generation, distribution, and conversion across every campaign.',
    icon: 'solar:chart-2-bold-duotone',
  },
  {
    title: 'Financial Dashboard',
    description:
      'Track revenue, payouts, and account balances at a glance — no spreadsheets required.',
    icon: 'solar:wallet-money-bold-duotone',
  },
];

const CUSTOMER_FEATURES = [
  {
    title: 'CRM Integration',
    description: 'Push purchased leads directly into the CRM your team already uses.',
    icon: 'solar:plug-circle-bold-duotone',
  },
  {
    title: 'Lead Marketplace',
    description: 'Browse, filter, and purchase leads that match your buying criteria.',
    icon: 'solar:shop-2-bold-duotone',
  },
  {
    title: 'Lead Management',
    description: 'Score, track, and work every lead through your funnel.',
    icon: 'solar:checklist-minimalistic-bold-duotone',
  },
  {
    title: 'Rewards Program',
    description: 'Earn rewards as your volume grows and unlock platform benefits.',
    icon: 'solar:gift-bold-duotone',
  },
];

// ----------------------------------------------------------------------

const renderLines = () => (
  <>
    <FloatPlusIcon sx={{ top: 72, left: 72 }} />
    <FloatPlusIcon sx={{ bottom: 72, left: 72 }} />
    <FloatLine sx={{ top: 80, left: 0 }} />
    <FloatLine sx={{ bottom: 80, left: 0 }} />
    <FloatLine vertical sx={{ top: 0, left: 80 }} />
  </>
);

export function HomeFeatures({ sx, ...other }) {
  return (
    <Box
      component="section"
      sx={[
        {
          overflow: 'hidden',
          position: 'relative',
          py: { xs: 10, md: 20 },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <MotionViewport>
        {renderLines()}

        <Container sx={{ position: 'relative', zIndex: 9 }}>
          <SectionTitle
            caption="Two portals, one platform"
            title="Built for both"
            txtGradient="sides of the lead funnel."
            description="Mova Flow gives lead-generation teams an admin command center and gives lead buyers a self-serve customer portal — connected by the same data."
            sx={{
              mb: { xs: 5, md: 10 },
              textAlign: { xs: 'center', md: 'left' },
              maxWidth: 720,
            }}
          />

          <Grid container columnSpacing={{ xs: 0, md: 8 }} rowSpacing={{ xs: 8, md: 0 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <PortalBlock
                label="Admin Portal"
                tagline="For lead-generation teams"
                items={ADMIN_FEATURES}
                accentDirection="left"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <PortalBlock
                label="Customer Portal"
                tagline="For lead buyers"
                items={CUSTOMER_FEATURES}
                accentDirection="right"
              />
            </Grid>
          </Grid>
        </Container>
      </MotionViewport>
    </Box>
  );
}

// ----------------------------------------------------------------------

function PortalBlock({ label, tagline, items, accentDirection }) {
  return (
    <Stack spacing={5}>
      <Box
        component={m.div}
        variants={varFade('inUp', { distance: 24 })}
        sx={[
          (theme) => ({
            p: 3,
            borderRadius: 2,
            bgcolor: 'background.neutral',
            borderLeft: accentDirection === 'left' ? `3px solid ${theme.vars.palette.primary.main}` : 'none',
            borderRight:
              accentDirection === 'right' ? `3px solid ${theme.vars.palette.warning.main}` : 'none',
            boxShadow: `-12px 12px 32px 0px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            ...theme.applyStyles('dark', {
              boxShadow: `-12px 12px 32px 0px ${varAlpha(theme.vars.palette.common.blackChannel, 0.16)}`,
            }),
          }),
        ]}
      >
        <Typography variant="overline" sx={{ color: 'text.disabled' }}>
          {tagline}
        </Typography>
        <Typography variant="h4" sx={{ mt: 0.5 }}>
          {label}
        </Typography>
      </Box>

      <Stack spacing={4} sx={{ pl: { xs: 0, md: 1 } }}>
        {items.map((item) => (
          <Box
            key={item.title}
            component={m.div}
            variants={varFade('inUp', { distance: 24 })}
            sx={{ gap: 2.5, display: 'flex' }}
          >
            <Iconify
              icon={item.icon}
              width={32}
              sx={{
                mt: '2px',
                flexShrink: 0,
                color: accentDirection === 'left' ? 'primary.main' : 'warning.main',
              }}
            />
            <Stack spacing={0.75}>
              <Typography variant="h6">{item.title}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {item.description}
              </Typography>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}
