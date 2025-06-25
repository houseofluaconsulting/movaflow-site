import { CONFIG } from 'src/global-config';

import { UserListView } from 'src/sections/lead/view';

// ----------------------------------------------------------------------

const metadata = { title: `Leads | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <UserListView />
    </>
  );
}
