import { CONFIG } from 'src/global-config';

import { RewardsView } from 'src/sections/rewards/view';

// ----------------------------------------------------------------------

const metadata = { title: `Rewards | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <RewardsView />
    </>
  );
}
