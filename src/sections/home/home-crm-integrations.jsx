import { m } from 'framer-motion';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { varFade, MotionViewport } from 'src/components/animate';

import { SectionTitle } from './components/section-title';
import { FloatLine, FloatPlusIcon } from './components/svg-elements';

// ----------------------------------------------------------------------

// To swap in real logos later, drop an SVG into /public/assets/logos/<file>.svg
// and replace the `mark` field with `<Box component="img" src="/assets/logos/<file>.svg" />`.
const CRMS = [
  {
    name: 'GoHighLevel',
    description:
      'Push purchased leads directly into GoHighLevel pipelines and nurture campaigns.',
    initials: 'GHL',
    color: '#FFCE2D',
    textColor: '#101828',
  },
  {
    name: 'Ringy',
    description: 'Hand off leads to Ringy for instant dialer routing and SMS follow-up.',
    initials: 'R',
    color: '#0A66C2',
    textColor: '#FFFFFF',
  },
  {
    name: 'Close',
    description:
      'Sync leads into Close so sales reps can call, email, and track every touchpoint.',
    initials: 'C',
    color: '#0F1B2D',
    textColor: '#FFFFFF',
  },
];

const renderLines = () => (
  <>
    <FloatPlusIcon sx={{ top: 72, right: 72 }} />
    <FloatPlusIcon sx={{ bottom: 72, left: 72 }} />
    <FloatLine sx={{ top: 80, left: 0 }} />
    <FloatLine sx={{ bottom: 80, left: 0 }} />
    <FloatLine vertical sx={{ top: 0, left: 80 }} />
  </>
);

// ----------------------------------------------------------------------

export function HomeCRMIntegrations({ sx, ...other }) {
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
            caption="CRM integrations"
            title="Plug into the CRMs"
            txtGradient="your team already uses."
            description="Mova Flow delivers purchased leads directly into your CRM of choice — no spreadsheets, no copy-paste, no missed follow-ups."
            sx={{
              mb: { xs: 5, md: 10 },
              textAlign: 'center',
              mx: 'auto',
              maxWidth: 720,
            }}
          />

          <Box
            sx={{
              display: 'grid',
              gap: { xs: 2.5, md: 3 },
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
            }}
          >
            {CRMS.map((crm) => (
              <CRMCard key={crm.name} crm={crm} />
            ))}
          </Box>
        </Container>
      </MotionViewport>
    </Box>
  );
}

// ----------------------------------------------------------------------

function CRMCard({ crm }) {
  return (
    <Stack
      component={m.div}
      variants={varFade('inUp', { distance: 24 })}
      direction="row"
      spacing={2.5}
      sx={[
        (theme) => ({
          p: 3,
          borderRadius: 2,
          alignItems: 'flex-start',
          bgcolor: 'background.neutral',
          boxShadow: `-12px 12px 32px 0px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
          transition: theme.transitions.create(['transform', 'box-shadow'], {
            duration: theme.transitions.duration.shorter,
          }),
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `-12px 16px 40px 0px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
          },
          ...theme.applyStyles('dark', {
            boxShadow: `-12px 12px 32px 0px ${varAlpha(theme.vars.palette.common.blackChannel, 0.16)}`,
          }),
        }),
      ]}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          flexShrink: 0,
          display: 'flex',
          borderRadius: 1.5,
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: crm.color,
          color: crm.textColor,
          fontWeight: 700,
          fontSize: crm.initials.length > 1 ? 14 : 20,
          letterSpacing: 0.5,
        }}
      >
        {crm.initials}
      </Box>

      <Stack spacing={0.5} sx={{ minWidth: 0 }}>
        <Typography variant="subtitle1">{crm.name}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {crm.description}
        </Typography>
      </Stack>
    </Stack>
  );
}
