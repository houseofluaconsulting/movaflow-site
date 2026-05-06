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
import { CircleSvg, FloatLine, FloatPlusIcon } from './components/svg-elements';

// ----------------------------------------------------------------------

const STEPS = [
  {
    number: '01',
    title: 'Aggregate',
    description:
      'Lead-gen teams capture and consolidate leads from every source into the admin portal.',
    icon: 'solar:inbox-archive-bold-duotone',
  },
  {
    number: '02',
    title: 'Distribute',
    description:
      'Leads flow into the marketplace where vetted buyers can browse, filter, and purchase what fits.',
    icon: 'solar:routing-3-bold-duotone',
  },
  {
    number: '03',
    title: 'Integrate',
    description:
      'Purchased leads route automatically into the buyer’s CRM — no manual exports, no copy-paste.',
    icon: 'solar:plug-circle-bold-duotone',
  },
  {
    number: '04',
    title: 'Measure & Reward',
    description:
      'Both sides see real-time performance metrics. Buyers earn rewards as they grow on the platform.',
    icon: 'solar:medal-ribbon-star-bold-duotone',
  },
];

// ----------------------------------------------------------------------

const renderLines = () => (
  <>
    <FloatPlusIcon sx={{ top: 72, right: 72 }} />
    <FloatPlusIcon sx={{ bottom: 72, right: 72 }} />
    <FloatLine sx={{ top: 80, left: 0 }} />
    <FloatLine sx={{ bottom: 80, left: 0 }} />
    <FloatLine vertical sx={{ top: 0, right: 80 }} />
  </>
);

export function HomeHowItWorks({ sx, ...other }) {
  return (
    <Box
      component="section"
      sx={[
        (theme) => ({
          overflow: 'hidden',
          position: 'relative',
          py: { xs: 10, md: 20 },
          bgcolor: 'background.neutral',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <MotionViewport>
        {renderLines()}

        <Container sx={{ position: 'relative', zIndex: 9 }}>
          <SectionTitle
            caption="How it works"
            title="From capture to"
            txtGradient="conversion."
            description="Mova Flow connects every step of the lead lifecycle so generators, buyers, and platform operators stay in sync."
            sx={{
              mb: { xs: 5, md: 10 },
              textAlign: { xs: 'center', md: 'left' },
              maxWidth: 720,
            }}
          />

          <Grid container spacing={{ xs: 4, md: 4 }}>
            {STEPS.map((step, index) => (
              <Grid key={step.number} size={{ xs: 12, sm: 6, md: 3 }}>
                <StepCard step={step} index={index} />
              </Grid>
            ))}
          </Grid>

          <CircleSvg
            variants={varFade('in')}
            sx={{ display: { xs: 'none', md: 'block' }, opacity: 0.4 }}
          />
        </Container>
      </MotionViewport>
    </Box>
  );
}

// ----------------------------------------------------------------------

function StepCard({ step }) {
  return (
    <Box
      component={m.div}
      variants={varFade('inUp', { distance: 24 })}
      sx={[
        (theme) => ({
          p: 4,
          height: 1,
          borderRadius: 2,
          position: 'relative',
          bgcolor: 'background.default',
          boxShadow: `-12px 12px 32px 0px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
          ...theme.applyStyles('dark', {
            boxShadow: `-12px 12px 32px 0px ${varAlpha(theme.vars.palette.common.blackChannel, 0.16)}`,
          }),
        }),
      ]}
    >
      <Stack spacing={2.5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Iconify icon={step.icon} width={36} sx={{ color: 'primary.main' }} />
          <Typography
            variant="h3"
            sx={[
              (theme) => ({
                opacity: 0.16,
                fontFamily: theme.typography.fontSecondaryFamily,
              }),
            ]}
          >
            {step.number}
          </Typography>
        </Stack>

        <Stack spacing={1}>
          <Typography variant="h6">{step.title}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {step.description}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
