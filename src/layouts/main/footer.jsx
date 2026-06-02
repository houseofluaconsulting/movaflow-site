import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';

import { Logo } from 'src/components/logo';

// ----------------------------------------------------------------------

const FooterRoot = styled('footer')(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.vars.palette.background.default,
}));

export function HomeFooter({ sx, ...other }) {
  return (
    <FooterRoot
      sx={[{ py: 5, textAlign: 'center' }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <Container>
        <Logo />
      </Container>
    </FooterRoot>
  );
}
