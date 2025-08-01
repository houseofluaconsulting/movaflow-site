import { useEffect, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';

import { getLeadCredit } from 'src/actions/leadcredit'
import { DashboardContent } from 'src/layouts/dashboard';
import { SeoIllustration } from 'src/assets/illustrations';
import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';

import { svgColorClasses } from 'src/components/svg-color';

import { useAuthContext } from 'src/auth/hooks';

import { AppWidget } from '../app-widget';
import { AppWelcome } from '../app-welcome';
import { AppFeatured } from '../app-featured';
import { AppTopAuthors } from '../app-top-authors';
import { AppTopRelated } from '../app-top-related';
import { AppNewInvoices } from '../app-new-invoices';
import { AppAreaInstalled } from '../app-area-installed';
import { AppWidgetSummary } from '../app-widget-summary';
import { AppCurrentDownload } from '../app-current-download';
import { AppTopInstalledCountries } from '../app-top-installed-countries';

// ----------------------------------------------------------------------

export function OverviewAppView() {
  const { user } = useAuthContext();

  const user_id = user?.id
  // const leadCredit = getLeadCredit(user_id)

  const leadCredit = useState([])
  const [data, setData] = useState([]);
  
  useEffect(() => {
    async function fetchData() {
      const promise = getLeadCredit(user_id); // returns a Promise that resolves to an array
      const result = await promise; // result is the array
      console.log(result)
      setData(result);
    }

    fetchData();
  }, []);


  console.log(data)
  console.log('Final Expense: ' + data['FinalExpense'])
  console.log('Final Expense Number Verified: ' + data['FXNumVerified'])

  const theme = useTheme();

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 12 }}>
          <AppWelcome
            title={`Welcome back 👋 \n ${user?.displayName} \n`}
          // description="If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything."
          // img={<SeoIllustration hideBackground />}
          // action={
          //   <Button variant="contained" color="primary">
          //     Go now
          //   </Button>
          // }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <AppWidgetSummary
            title="Final Expense Lead Credit"
            percent={17.4}
            total={data['FinalExpense']}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [102, 47, 68, 39, 71, 63, 78, 106],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <AppWidgetSummary
            title="Final Expense Number Verified Lead Credit"
            percent={17.4}
            total={data['FXNumVerified']}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [102, 47, 68, 39, 71, 63, 78, 106],
            }}
          />
        </Grid>

        {/* <Grid size={{ xs: 12, md: 4 }}>
          <AppWidgetSummary
            title="Leads Sold"
            percent={6.7}
            total={92}
            chart={{
              colors: [theme.palette.info.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [7, 11, 14, 9, 8, 13, 12, 17],
            }}
          />
        </Grid> */}

        {/* <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AppCurrentDownload
            title="Conversion"
            subheader="Lead Disposition"
            chart={{
              series: [
                { label: 'No Contact', value: 146 },
                { label: 'Unsold', value: 336 },
                { label: 'Sold', value: 92 },
              ],
            }}
          />
        </Grid> */}
      </Grid>
    </DashboardContent>
  );
}
