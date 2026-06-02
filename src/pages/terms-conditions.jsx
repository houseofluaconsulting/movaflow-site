import { CONFIG } from 'src/global-config';

import { TermsConditionsView } from 'src/sections/terms-conditions/view';

// ----------------------------------------------------------------------

const metadata = { title: `Terms & Conditions - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <TermsConditionsView />
    </>
  );
}
