import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { fNumber, fPercent } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export function AppWidgetSummary({ title, percent, total, chart, sx, ...other }) {
  const theme = useTheme();

  const chartColors = chart.colors ?? [theme.palette.primary.main];

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors,
    stroke: { width: 0 },
    xaxis: { categories: chart.categories },
    tooltip: {
      y: { formatter: (value) => fNumber(value), title: { formatter: () => '' } },
    },
    plotOptions: { bar: { borderRadius: 1.5, columnWidth: '64%' } },
    ...chart.options,
  });


  return (
    <Card
      sx={[
        () => ({
          p: 3,
          display: 'flex',
          zIndex: 'unset',
          overflow: 'unset',
          alignItems: 'center',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box sx={{ flexGrow: 1 }}>

        <Box sx={{ typography: 'subtitle2' }}>{title}</Box>

        <Box sx={{ mt: 1.5, mb: 1, typography: 'h3' }}>{fNumber(total)}</Box>

        <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
          <Box component="span" sx={{ typography: 'body2', color: 'text.secondary' }}>
            Lead Credit
          </Box>
        </Box>
      </Box>

      {/* 
      <Chart
        type="bar"
        series={[{ data: chart.series }]}
        options={chartOptions}
        sx={{ width: 60, height: 40 }}
      /> */}
    </Card>
  );
}

export function LeadCreditSummary({ type, opportunity, total, sx, ...other }) {
  const theme = useTheme();

  const labelColor = ({ Aged: 'secondary', Fresh: 'primary' }[opportunity]) || 'default';

  const renderTrending = () => (
    <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>

      <Box component="span" sx={{ typography: 'body2', color: 'text.secondary' }}>
        Lead Credit
      </Box>
    </Box>
  );

  return (
    <Card
      sx={[
        () => ({
          p: 3,
          display: 'flex',
          zIndex: 'unset',
          overflow: 'unset',
          alignItems: 'center',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Stack>
        <Box sx={{ display: 'flex', }}>
          
          <Typography variant="subtitle2" sx={{ textTransform: 'capitalize', }}>
            {type}
          </Typography>
          
          <Label
            variant="soft"
            color={labelColor}
            sx={{
            ml: 5,
            alignSelf: 'center',
            typography: 'text',
            fontWeight: 700
          }}
          >
            {opportunity}
          </Label>

          {/* <Typography
          component="span"
          sx={{
            ml: 1,
            alignSelf: 'center',
            color: 'text.primary',
            typography: 'subtitle1',
            fontWeight: 400
          }}
        >
          {opportunity}
        </Typography> */}
        </Box>
        <Box sx={{ flexGrow: 1 }}>

          <Box sx={{ mt: 1.5, mb: 1, typography: 'h3' }}>{fNumber(total)}</Box>

          {renderTrending()}
        </Box>

      </Stack>


    </Card>
  );
}
