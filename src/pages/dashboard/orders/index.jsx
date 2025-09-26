import { CONFIG } from 'src/global-config';

import { OrderListView } from 'src/sections/orders/view';

// ----------------------------------------------------------------------

const metadata = { title: `Orders | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  
  return (
    <>
      <title>{metadata.title}</title>

      <OrderListView />
    </>
  );
}
