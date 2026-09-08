import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';

// ----------------------------------------------------------------------

const FooterRoot = styled('footer')(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.vars.palette.background.default,
}));

const YEAR = new Date().getFullYear();

export function HomeFooter({ sx, ...other }) {
  return (
    <FooterRoot
      sx={[{ py: 5, textAlign: 'center' }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <Container>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <Logo />

          <Stack
            direction="row"
            spacing={3}
            sx={{ justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link
              component={RouterLink}
              href="/purchase"
              variant="body2"
              color="text.secondary"
              underline="hover"
            >
              Purchase Leads
            </Link>
            <Link
              component={RouterLink}
              href="/rewards"
              variant="body2"
              color="text.secondary"
              underline="hover"
            >
              Mova Rewards
            </Link>
            <Link
              component={RouterLink}
              href="/privacy-policy"
              variant="body2"
              color="text.secondary"
              underline="hover"
            >
              Privacy Policy
            </Link>
            <Link
              component={RouterLink}
              href="/terms-conditions"
              variant="body2"
              color="text.secondary"
              underline="hover"
            >
              Terms & Conditions
            </Link>
          </Stack>

          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
            © {YEAR} Mova Flow. All rights reserved.
          </Typography>
        </Stack>
      </Container>
    </FooterRoot>
  );
}
