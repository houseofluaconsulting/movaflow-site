import { CONFIG } from 'src/global-config';

import { LeadResourcesView } from 'src/sections/lead-resources/view';

// ----------------------------------------------------------------------

const metadata = { title: `Agent Resources | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <LeadResourcesView />
    </>
  );
}
