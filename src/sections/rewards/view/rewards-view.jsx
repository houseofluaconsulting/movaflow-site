import { useEffect, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { getRewards } from 'src/actions/rewards';
import { _rewardsPricingPlans } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { getCustomer, getCustomerOrders } from 'src/actions/customer';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { Carousel, useCarousel, CarouselArrowBasicButtons } from 'src/components/carousel';

import { useAuthContext } from 'src/auth/hooks';

import { RewardsPricingCard } from '../rewards-pricing-card';
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

function isCurrentMonth(utcTimestamp) {
  if (!utcTimestamp) return false;
  const [datePart] = utcTimestamp.split(', ');
  const [month, , year] = datePart.split('/');
  const now = new Date();
  return Number(year) === now.getFullYear() && Number(month) === now.getMonth() + 1;
}

export function RewardsView() {
  const { user } = useAuthContext();
  const [rewards, setRewards] = useState([]);
  const [rewardsTotal, setRewardsTotal] = useState(0);
  const [ordersMap, setOrdersMap] = useState({});
  const [loading, setLoading] = useState(true);

  const carousel = useCarousel({
    slidesToShow: { xs: 1, sm: 1, md: 2, lg: 3.5 },
    slideSpacing: '24px',
  });

  const fetchData = useCallback(async () => {
    if (!user?.id || !user?.idToken) return;

    setLoading(true);
    try {
      const [rewardsResult, customerResult, ordersResult] = await Promise.all([
        getRewards(user.id, user.idToken.toString()),
        getCustomer(user.id, user.idToken.toString()),
        getCustomerOrders(user.id, user.idToken.toString()),
      ]);

      // Build orders lookup by OrderId
      const ordersLookup = {};
      (ordersResult || []).forEach((order) => {
        if (order.OrderId) {
          ordersLookup[order.OrderId] = order;
        }
      });

      // Resolve referring customer names for Referral rewards
      const referralRewards = rewardsResult.filter(
        (r) => r.RewardType === 'Referral' && r.ReferringCustomer
      );
      const referralNames = {};
      await Promise.all(
        referralRewards.map(async (r) => {
          try {
            const refCustomer = await getCustomer(r.ReferringCustomer, user.idToken.toString());
            referralNames[r.ReferringCustomer] = refCustomer?.Name || 'Unknown';
          } catch {
            referralNames[r.ReferringCustomer] = 'Unknown';
          }
        })
      );

      const enrichedRewards = rewardsResult.map((r) =>
        r.RewardType === 'Referral' && r.ReferringCustomer
          ? { ...r, ReferringCustomerName: referralNames[r.ReferringCustomer] }
          : r
      );

      setRewards(enrichedRewards);
      setOrdersMap(ordersLookup);
      setRewardsTotal(customerResult?.RewardsTotal ?? 0);
    } catch (error) {
      console.error('Error fetching rewards:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.idToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
        <Typography variant="h3">
          Rewards
        </Typography>

        <Button
          component={RouterLink}
          href={paths.dashboard.rewardsProgram}
          variant="contained"
          color="secondary"
          sx={{ color: 'common.white' }}
          endIcon={<Iconify icon="solar:arrow-right-linear" />}
        >
          Learn More
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Welcome to our new <b>Rewards Program</b>! Earn points on every purchase and redeem them for lead credits. All purchases from March 2026 onward count toward your rewards balance.
      </Alert>

      <Box component="ul" sx={{ mb: 3, pl: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 1 }}>
        <li><Iconify icon="solar:star-bold-duotone" width={16} sx={{ color: 'warning.main', mr: 0.5, verticalAlign: 'text-bottom' }} /> Earn one point for every dollar you spend</li>
        <li><Iconify icon="solar:star-bold-duotone" width={16} sx={{ color: 'warning.main', mr: 0.5, verticalAlign: 'text-bottom' }} /> Earn 2500 points for referring a new customer<Tooltip title="Have a new customer mention your name during onboarding to earn 2500 bonus points!" arrow slotProps={{ tooltip: { sx: { maxWidth: 255 } } }}><Iconify icon="solar:info-circle-bold" width={10} sx={{ color: 'text.disabled', ml: 0.5, verticalAlign: 'middle', cursor: 'pointer' }} /></Tooltip></li>
        <li><Iconify icon="solar:star-bold-duotone" width={16} sx={{ color: 'warning.main', mr: 0.5, verticalAlign: 'text-bottom' }} /> Points from current-month purchases become available at the start of the following month</li>
        <li><Iconify icon="solar:star-bold-duotone" width={16} sx={{ color: 'warning.main', mr: 0.5, verticalAlign: 'text-bottom' }} /> Unlock higher-tier redemptions as you accumulate more points — your points go further</li>
      </Box>

      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <RewardsWidgetSummary
            title="Available Points"
            total={rewardsTotal}
            icon={
              <Iconify icon="solar:star-bold-duotone" width={48} />
            }
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 9, mb: -10 }}>
          <Carousel carousel={carousel}>
            {_rewardsPricingPlans.map((card) => (
              <RewardsPricingCard key={card.priceId} card={card} rewardsTotal={rewardsTotal} onRedeemed={fetchData} />
            ))}
          </Carousel>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <CarouselArrowBasicButtons {...carousel.arrows} />
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mb: 15 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {rewardsTotal.toLocaleString()} Points
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            10,000
          </Typography>
        </Box>
        <Box sx={{ position: 'relative' }}>
          <LinearProgress
            variant="determinate"
            value={Math.min((rewardsTotal / 10000) * 100, 100)}
            color="primary"
            sx={{ height: 10, borderRadius: 5 }}
          />

          <Box
            sx={{
              position: 'absolute',
              left: '30%',
              top: '100%',
              transform: 'translateX(-50%)',
              mt: 0.5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Iconify icon="solar:star-bold-duotone" width={16} sx={{ color: 'warning.main' }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, maxWidth: 90, textAlign: 'center' }}>
              Redeem Fresh or Aged Leads
            </Typography>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              left: '60%',
              top: '100%',
              transform: 'translateX(-50%)',
              mt: 0.5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Iconify icon="solar:star-bold-duotone" width={16} sx={{ color: 'warning.main' }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, maxWidth: 80, textAlign: 'center' }}>
              Redeem 1.5x Fresh Leads
            </Typography>
          </Box>
        </Box>
      </Box>

      {rewards.length === 0 ? (
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          No rewards yet.
        </Typography>
      ) : (
        <Stack spacing={3}>
          {[...rewards].sort((a, b) => {
            const parseDate = (str) => {
              if (!str) return 0;
              const [datePart, timePart] = str.split(', ');
              const [month, day, year] = datePart.split('/');
              const [hour, minute, second] = timePart.split(':');
              return new Date(Date.UTC(year, month - 1, day, hour, minute, second)).getTime();
            };
            return parseDate(b.Created) - parseDate(a.Created);
          }).map((reward, index) => (
            <Card key={reward.RewardId || index} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: reward.RewardType !== 'Redeemed' && isCurrentMonth(reward.Created) ? 'text.disabled' : undefined }}>
                    {reward.RewardType}
                  </Typography>
                  {reward.RewardOrderName && (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {reward.RewardOrderName}
                    </Typography>
                  )}
                  {reward.RewardType === 'Referral' && reward.ReferringCustomerName && (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Referred by {reward.ReferringCustomerName}
                    </Typography>
                  )}
                  {reward.RewardType === 'Redeemed' && reward.OrderId && ordersMap[reward.OrderId] && (() => {
                    const order = ordersMap[reward.OrderId];
                    const leadTypeLabel = order.LeadType === 'VeteranWebsite'
                      ? 'Veteran'
                      : order.LeadType === 'LegacyWebsite'
                        ? 'Legacy'
                        : order.LeadType === 'FinalExpense'
                          ? 'Final Expense'
                          : order.LeadType === 'OctavianMortgage'
                            ? 'Octavian Mortgage'
                            : order.LeadType === 'LegacyMortgage'
                              ? 'Legacy Mortgage'
                              : order.LeadType;
                    const labels = [];
                    if (Number(order?.CreditFresh) > 0) labels.push(`${order.CreditFresh} ${leadTypeLabel || ''} Fresh`.trim());
                    if (Number(order?.CreditAged) > 0) labels.push(`${order.CreditAged} ${leadTypeLabel || ''} Aged`.trim());
                    return labels.length > 0 ? (
                      <Label
                        variant="soft"
                        color={Number(order?.CreditFresh) > 0 ? 'primary' : 'secondary'}
                        sx={{ mt: 0.5, fontWeight: 700 }}
                      >
                        {labels.join(' · ')}
                      </Label>
                    ) : null;
                  })()}
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: reward.RewardType === 'Redeemed' ? 'error.main' : isCurrentMonth(reward.Created) ? 'text.disabled' : 'success.main' }}>
                    {reward.RewardType === 'Redeemed' ? '-' : '+'}{reward.Points}
                  </Typography>
                  {reward.RewardType !== 'Redeemed' && isCurrentMonth(reward.Created) && (
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                      (pending)
                    </Typography>
                  )}
                </Box>
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
