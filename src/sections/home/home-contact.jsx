import axios from 'axios';
import { z as zod } from 'zod';
import { m } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { varFade, MotionViewport } from 'src/components/animate';

import { FloatLine, FloatPlusIcon } from './components/svg-elements';

// ----------------------------------------------------------------------

const CONTACT_API_URL = import.meta.env.VITE_CONTACT_API_URL ?? '';

export const ContactSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required' }).max(200),
  email: zod
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Enter a valid email address' })
    .max(320),
  subject: zod.string().min(1, { message: 'Subject is required' }).max(300),
  message: zod
    .string()
    .min(1, { message: 'Message is required' })
    .max(5000, { message: 'Message is too long' }),
  // Honeypot — must stay empty.
  company: zod.string().max(0).optional(),
});

const defaultValues = {
  name: '',
  email: '',
  subject: '',
  message: '',
  company: '',
};

const renderLines = () => (
  <>
    <FloatPlusIcon sx={{ top: 72, left: 72 }} />
    <FloatPlusIcon sx={{ top: 72, right: 72 }} />
    <FloatLine vertical sx={{ top: 0, left: 80 }} />
    <FloatLine vertical sx={{ top: 0, right: 80 }} />
  </>
);

// ----------------------------------------------------------------------

export function HomeContact({ sx, ...other }) {
  const methods = useForm({
    mode: 'onTouched',
    resolver: zodResolver(ContactSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    if (!CONTACT_API_URL) {
      toast.error('Contact form is not configured. Set VITE_CONTACT_API_URL.');
      return;
    }
    try {
      await axios.post(CONTACT_API_URL, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      toast.success('Thanks — your message is on its way.');
      reset();
    } catch (error) {
      console.error(error);
      const message =
        error?.response?.data?.error || 'Something went wrong. Please try again.';
      toast.error(message);
    }
  });

  return (
    <Box
      id="contact"
      component="section"
      sx={[
        {
          overflow: 'hidden',
          position: 'relative',
          py: { xs: 10, md: 20 },
          scrollMarginTop: { xs: 80, md: 96 },
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
            sx={{ mx: 'auto', maxWidth: 720, textAlign: 'center', alignItems: 'center' }}
          >
            <Box
              component={m.span}
              variants={varFade('inUp', { distance: 24 })}
              sx={{ typography: 'overline', color: 'text.disabled' }}
            >
              Get in touch
            </Box>

            <Typography
              component={m.h2}
              variant="h2"
              variants={varFade('inUp', { distance: 24 })}
              sx={[(theme) => ({ m: 0, fontFamily: theme.typography.fontSecondaryFamily })]}
            >
              Contact us
            </Typography>

            <Typography
              component={m.p}
              variants={varFade('inUp', { distance: 24 })}
              sx={{ color: 'text.secondary', maxWidth: 560 }}
            >
              Tell us about your operation and what you&apos;re trying to solve. We&apos;ll get
              back to you within one business day.
            </Typography>
          </Stack>

          <Box
            component={m.div}
            variants={varFade('inUp', { distance: 24 })}
            sx={{ mt: { xs: 5, md: 8 }, mx: 'auto', maxWidth: 720 }}
          >
            <Form methods={methods} onSubmit={onSubmit}>
              <Stack spacing={2.5}>
                <Box
                  sx={{
                    display: 'grid',
                    gap: 2.5,
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  }}
                >
                  <Field.Text name="name" label="Name" />
                  <Field.Text name="email" label="Email" />
                </Box>

                <Field.Text name="subject" label="Subject" />

                <Field.Text name="message" label="Message" multiline rows={6} />

                {/* Honeypot — hidden from real users; bots fill it and get rejected. */}
                <Box
                  component="input"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  {...methods.register('company')}
                  sx={{
                    position: 'absolute',
                    left: '-10000px',
                    width: 1,
                    height: 1,
                    opacity: 0,
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    size="large"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    endIcon={<Iconify icon="solar:plain-bold" />}
                  >
                    {isSubmitting ? 'Sending…' : 'Send message'}
                  </Button>
                </Box>
              </Stack>
            </Form>
          </Box>
        </Container>
      </MotionViewport>
    </Box>
  );
}
