import { m } from 'framer-motion';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

import { SectionTitle } from './components/section-title';
import { FloatLine, FloatPlusIcon } from './components/svg-elements';

// ----------------------------------------------------------------------

const STACK = [
  {
    name: 'React',
    description: 'Front-end framework powering both the admin and customer portals.',
    icon: 'logos:react',
  },
  {
    name: 'AWS Amplify',
    description: 'Hosting and CI/CD pipeline serving the production application.',
    icon: 'logos:aws-amplify',
  },
  {
    name: 'AWS Cognito',
    description: 'User authentication, sign-in flows, and session management.',
    icon: 'logos:aws-cognito',
  },
  {
    name: 'AWS DynamoDB',
    description: 'Serverless NoSQL store for leads, customers, and transactional data.',
    icon: 'logos:aws-dynamodb',
  },
  {
    name: 'AWS CloudWatch',
    description: 'Centralized logging, metrics, and alerts across every service.',
    icon: 'logos:aws-cloudwatch',
  },
  {
    name: 'Twilio',
    description: 'SMS and voice infrastructure for lead delivery and notifications.',
    icon: 'logos:twilio-icon',
  },
];

const renderLines = () => (
  <>
    <FloatPlusIcon sx={{ top: 72, left: 72 }} />
    <FloatPlusIcon sx={{ bottom: 72, right: 72 }} />
    <FloatLine sx={{ top: 80, left: 0 }} />
    <FloatLine sx={{ bottom: 80, left: 0 }} />
    <FloatLine vertical sx={{ top: 0, right: 80 }} />
  </>
);

// ----------------------------------------------------------------------

export function HomeTechnology({ sx, ...other }) {
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
            caption="Under the hood"
            title="Built on a"
            txtGradient="modern, serverless stack."
            description="Mova Flow runs on managed AWS services and proven open-source tooling — so the platform stays fast, secure, and easy to scale."
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
            {STACK.map((tech) => (
              <TechCard key={tech.name} tech={tech} />
            ))}
          </Box>
        </Container>
      </MotionViewport>
    </Box>
  );
}

// ----------------------------------------------------------------------

function TechCard({ tech }) {
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
          bgcolor: 'background.paper',
        }}
      >
        <Iconify icon={tech.icon} width={32} />
      </Box>

      <Stack spacing={0.5} sx={{ minWidth: 0 }}>
        <Typography variant="subtitle1">{tech.name}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {tech.description}
        </Typography>
      </Stack>
    </Stack>
  );
}
