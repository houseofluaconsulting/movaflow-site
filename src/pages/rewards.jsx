import { CONFIG } from 'src/global-config';

import { RewardsView } from 'src/sections/rewards/view';

// ----------------------------------------------------------------------

const metadata = { title: `Mova Rewards - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <RewardsView />
    </>
  );
}
