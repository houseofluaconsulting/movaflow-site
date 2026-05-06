import { CONFIG } from 'src/global-config';

import { MaximizeContactRateView } from 'src/sections/lead-resources/view';

// ----------------------------------------------------------------------

const metadata = { title: `Maximize Your Contact Rate | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <MaximizeContactRateView />
    </>
  );
}
