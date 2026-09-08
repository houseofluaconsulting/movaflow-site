import { CONFIG } from 'src/global-config';

import { PurchaseView } from 'src/sections/purchase/view';

// ----------------------------------------------------------------------

const metadata = { title: `Purchase Leads - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <PurchaseView />
    </>
  );
}
