import { CONFIG } from 'src/global-config';

import { PrivacyPolicyView } from 'src/sections/privacy-policy/view';

// ----------------------------------------------------------------------

const metadata = { title: `Privacy Policy - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <PrivacyPolicyView />
    </>
  );
}
