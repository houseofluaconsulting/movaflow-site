import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { getRewards } from 'src/actions/rewards';
import { getCustomer } from 'src/actions/customer';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';

import { useAuthContext } from 'src/auth/hooks';

import { RewardsWidgetSummary } from '../rewards-widget-summary';

// ----------------------------------------------------------------------

function formatToLocalTime(utcTimestamp) {
  if (!utcTimestamp) return '';

  const [datePart, timePart] = utcTimestamp.split(', ');
  const [month, day, year] = datePart.split('/');
  const [hour, minute, second] = timePart.split(':');

  const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute, second));

  return utcDate.toLocaleString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function RewardsView() {
  const { user } = useAuthContext();
  const [rewards, setRewards] = useState([]);
  const [rewardsTotal, setRewardsTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user?.id || !user?.idToken) return;

      setLoading(true);
      try {
        const [rewardsResult, customerResult] = await Promise.all([
          getRewards(user.id, user.idToken.toString()),
          getCustomer(user.id, user.idToken.toString()),
        ]);
        setRewards(rewardsResult);
        setRewardsTotal(customerResult?.RewardsTotal ?? 0);
      } catch (error) {
        console.error('Error fetching rewards:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user?.id, user?.idToken]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h3" sx={{ mb: 5 }}>
        Rewards
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <b>Coming Soon</b> — Our Rewards Program is launching soon! Earn points on every purchase and redeem them for lead credits. All purchases from March 2026 onward are already counting toward your rewards balance.
      </Alert>

      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <RewardsWidgetSummary
            title="Total Points"
            total={rewardsTotal}
            icon={
              <Iconify icon="solar:star-bold-duotone" width={48} />
            }
          />
        </Grid>
      </Grid>

      {rewards.length === 0 ? (
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          No rewards yet.
        </Typography>
      ) : (
        <Stack spacing={3}>
          {rewards.map((reward, index) => (
            <Card key={reward.RewardId || index} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {reward.RewardType}
                  </Typography>
                  {reward.RewardOrderName && (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {reward.RewardOrderName}
                    </Typography>
                  )}
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  +{reward.Points}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                {formatToLocalTime(reward.Created)}
              </Typography>
            </Card>
          ))}
        </Stack>
      )}
    </DashboardContent>
  );
}
