import { CONFIG } from 'src/global-config';

import { RewardsProgramView } from 'src/sections/rewards/view';

// ----------------------------------------------------------------------

const metadata = { title: `Rewards Program - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <RewardsProgramView isPublic />
    </>
  );
}
