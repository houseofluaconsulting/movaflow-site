import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

import { CircleSvg, FloatLine, FloatPlusIcon } from './components/svg-elements';

// ----------------------------------------------------------------------

const renderLines = () => (
  <>
    <FloatPlusIcon sx={{ top: 72, left: 72 }} />
    <FloatPlusIcon sx={{ top: 72, right: 72 }} />
    <FloatLine vertical sx={{ top: 0, left: 80 }} />
    <FloatLine vertical sx={{ top: 0, right: 80 }} />
  </>
);

export function HomeCTA({ sx, ...other }) {
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
          <Stack
            spacing={4}
            sx={{
              mx: 'auto',
              maxWidth: 720,
              textAlign: 'center',
              alignItems: 'center',
            }}
          >
            <Box
              component={m.span}
              variants={varFade('inUp', { distance: 24 })}
              sx={{ typography: 'overline', color: 'text.disabled' }}
            >
              See it in action
            </Box>

            <Typography
              component={m.h2}
              variant="h2"
              variants={varFade('inUp', { distance: 24 })}
              sx={[
                (theme) => ({
                  m: 0,
                  fontFamily: theme.typography.fontSecondaryFamily,
                }),
              ]}
            >
              {`Mova Flow `}
              <Box
                component="span"
                sx={[
                  (theme) => ({
                    display: 'inline-block',
                    ...theme.mixins.textGradient(
                      `to right, ${theme.vars.palette.primary.main}, ${theme.vars.palette.warning.main}`
                    ),
                  }),
                ]}
              >
                Partners.
              </Box>
            </Typography>

            <Typography
              component={m.p}
              variants={varFade('inUp', { distance: 24 })}
              sx={{ color: 'text.secondary', maxWidth: 560 }}
            >
              LifeJacket Leads is a specialized configuration of Mova Flow, built for a lead-generation agency. Take a look at how the platform powers a real lead-gen operation end-to-end.
            </Typography>

            <Box
              component={m.div}
              variants={varFade('inUp', { distance: 24 })}
              sx={{ mt: 2 }}
            >
              <Button
                size="large"
                variant="contained"
                color="primary"
                href="https://lifejacketleads.movaflow.io"
                target="_blank"
                rel="noopener"
                endIcon={<Iconify icon="solar:arrow-right-linear" />}
              >
                Visit LifeJacket Leads
              </Button>
            </Box>
          </Stack>

          <CircleSvg
            variants={varFade('in')}
            sx={{ display: { xs: 'none', md: 'block' }, opacity: 0.4, pointerEvents: 'none' }}
          />
        </Container>
      </MotionViewport>
    </Box>
  );
}
