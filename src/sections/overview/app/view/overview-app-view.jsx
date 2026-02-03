import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { getLeadCredit } from 'src/actions/leadcredit'
import { DashboardContent } from 'src/layouts/dashboard';
import { SeoIllustration } from 'src/assets/illustrations';
import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';

import { svgColorClasses } from 'src/components/svg-color';
import { LoadingScreen } from 'src/components/loading-screen';

import { useAuthContext } from 'src/auth/hooks';

import { AppWidget } from '../app-widget';
import { AppWelcome } from '../app-welcome';
import { AppFeatured } from '../app-featured';
import { AppTopAuthors } from '../app-top-authors';
import { AppTopRelated } from '../app-top-related';
import { AppNewInvoices } from '../app-new-invoices';
import { AppAreaInstalled } from '../app-area-installed';
import { AppWidgetSummary, LeadCreditSummary } from '../app-widget-summary';

// ----------------------------------------------------------------------

export function OverviewAppView() {
  const { user } = useAuthContext();
  const user_id = user?.id;
  const [data, setData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    let isInitialLoad = true;

    async function fetchData() {
      if (!user?.id || !user?.idToken) return;

      // Only show loading screen on initial load
      if (isInitialLoad) {
        setLoading(true);
      }

      const promise = getLeadCredit(user.id, user.idToken.toString()); // returns a Promise that resolves to an array
      const result = await promise; // result is the array
      const stateLicenses = result?.StateLicenses || [];
      if (stateLicenses.length === 0) {
        setShowAlert(true);
      }

      setData(result);

      if (isInitialLoad) {
        setLoading(false);
        isInitialLoad = false;
      }
    }

    fetchData();

    // Reload data 3 seconds after initial load
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 3000);

    // Cleanup timeout on unmount
    return () => clearTimeout(timeoutId);
  }, [user?.id, user?.idToken]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 12 }}>
          <AppWelcome
            title={`Welcome back 👋 \n ${user?.displayName} \n`}
          />
        </Grid>

        {showAlert && (
          <Grid size={{ xs: 12, md: 12 }}>
            <Alert
              variant="outlined"
              severity="info"
              sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              action={
                <Button
                  color="info"
                  variant="outlined"
                  size="small"
                  component={RouterLink}
                  href="/dashboard/user/account"
                >
                  Go to Account Settings
                </Button>
              }
            >
              You haven’t added any <b>State Licenses</b> yet.
            </Alert>
          </Grid>
        )}

        <Grid size={{ xs: 12, md: 3 }}>
          <LeadCreditSummary
            type="Veteran Website"
            opportunity="Fresh"
            total={data['VeteranWebsiteFresh']}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <LeadCreditSummary
            type="Veteran Website"
            opportunity="Aged"
            total={data['VeteranWebsiteAged']}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <LeadCreditSummary
            type="Legacy Website"
            opportunity="Fresh"
            total={data['LegacyWebsiteFresh']}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <LeadCreditSummary
            type="Legacy Website"
            opportunity="Aged"
            total={data['LegacyWebsiteAged']}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
