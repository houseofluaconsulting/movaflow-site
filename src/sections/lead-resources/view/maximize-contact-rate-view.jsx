import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const NON_ANSWER_BREAKDOWN = [
  {
    pct: '30–35%',
    why: 'Agent not available or client forgets they filled out the form',
    fix: 'Right timing + follow-up cadence',
  },
  {
    pct: '20–25%',
    why: 'Silence Unknown Callers or call screening enabled',
    fix: 'SMS-first strategy (see below)',
  },
  {
    pct: '15–20%',
    why: 'Carrier blocking or spam label on your number',
    fix: 'Number registration + rotation',
  },
  {
    pct: '10–15%',
    why: 'Changed their mind but did not opt out',
    fix: 'Normal attrition',
  },
  {
    pct: '5–10%',
    why: 'Bad number — verified via WiFi calling or Google Voice',
    fix: 'Structural — not recoverable',
  },
];

const REGISTRIES = [
  { name: 'Free Caller Registry', url: 'freecallerregistry.com' },
  { name: 'Hiya', url: 'hiya.com/hiya-for-business' },
  { name: 'First Orion', url: 'firstorion.com/branded-communication' },
  { name: 'TNS', url: 'tnsi.com' },
];

const SMS_SEQUENCE = [
  {
    label: 'Immediately after they verify',
    body: 'Send a human-sounding text:',
    messages: [
      '“Hey [Name], got your info — someone from our team will reach out shortly. Feel free to reply here with any questions.”',
      '“Hey [Name], got your info — someone from our team will reach out in 3-5 minutes. Reply here with a 1 to confirm you received this message to save your spot.”',
    ],
  },
  {
    label: 'Within 3-5 minutes',
    body: 'Call while they are still in context from filling out the form.',
  },
  {
    label: 'No answer after 2 hours',
    body: 'Send a second text:',
    messages: [
      '“Hey [Name], tried reaching you before your request expires — respond with a preferred time to receive your options”',
    ],
  },
];

const CALL_WINDOWS = [
  {
    label: '8–9am local time',
    text: 'highest answer rates of the day — people are up, not yet in meetings',
  },
  {
    label: '4–6pm local time',
    text: 'second best window — commute and wind-down time',
  },
  {
    label: 'Wednesday and Thursday',
    text: 'outperform Monday and Friday consistently',
  },
  {
    label: 'Saturday 9–11am',
    text: 'underrated for this demographic — answer rates rival weekday mornings',
  },
  {
    label: 'Avoid 10am–3pm',
    text: 'lowest contact rates across the board — most agents default to this window',
  },
];

// ----------------------------------------------------------------------

function Callout({ children }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 1,
        borderLeft: 4,
        borderColor: 'success.main',
        bgcolor: (theme) => theme.palette.action.hover,
      }}
    >
      <Typography variant="body2">{children}</Typography>
    </Box>
  );
}

function StepCard({ number, title, children }) {
  return (
    <Card sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 1.5 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'common.white',
            fontWeight: 700,
            bgcolor: 'primary.main',
            flexShrink: 0,
          }}
        >
          {number}
        </Box>
        <Typography variant="h6" sx={{ pt: 0.5 }}>
          {title}
        </Typography>
      </Stack>
      {children}
    </Card>
  );
}

function Bullet({ children }) {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Typography variant="body2" sx={{ color: 'secondary.main', lineHeight: 1.5 }}>
        •
      </Typography>
      <Typography variant="body2" component="div">
        {children}
      </Typography>
    </Box>
  );
}

// ----------------------------------------------------------------------

export function MaximizeContactRateView() {
  const router = useRouter();

  return (
    <DashboardContent>
      <Box sx={{ mb: 3 }}>
        <Button
          variant="text"
          color="inherit"
          onClick={() => router.push(paths.dashboard.leadResources)}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          sx={{ mb: 2 }}
        >
          Back to Agent Resources
        </Button>

        <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block' }}>
          Life Jacket Leads — Agent Resource
        </Typography>
        <Typography variant="h4" sx={{ mb: 0.5 }}>
          How to Maximize Your Contact Rate
        </Typography>
      </Box>

      <Stack spacing={5}>
        <Box>
          <Typography variant="h5" sx={{ color: 'primary.main', mb: 0.5 }}>
            Why Verified Leads Still Don’t Answer
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Of every 100 leads who OTP verify, here is a realistic breakdown of what you are
            dealing with:
          </Typography>

          <TableContainer component={Card} sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, width: '15%' }}>% of list</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Why they didn’t pick up</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>What you can do</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {NON_ANSWER_BREAKDOWN.map((row) => (
                  <TableRow key={row.pct}>
                    <TableCell sx={{ color: 'success.main', fontWeight: 700 }}>
                      {row.pct}
                    </TableCell>
                    <TableCell>{row.why}</TableCell>
                    <TableCell sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                      {row.fix}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Callout>
            The good news: the middle two buckets — Silence Unknown Callers and carrier blocking —
            represent 35–45% of your list and are directly fixable with the steps below. These are
            not dead leads. They are leads being stopped before the conversation even starts.
          </Callout>
        </Box>

        <Divider />

        <Box>
          <Typography variant="h5" sx={{ color: 'primary.main', mb: 2 }}>
            Four Things to Do Right Now
          </Typography>

          <Stack spacing={3}>
            <StepCard number={1} title="Register your numbers">
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                This is free, takes less than an hour, and most agents never do it. Hiya, First
                Orion, and TNS are the data providers that feed carrier spam labeling. When your
                number is not registered, high call volume alone can get it labeled as Spam Risk or
                Insurance Services — cutting your answer rate by 50–70% on affected calls.{' '}
                <Box component="strong">
                  Agents make 10k+ per week when they get a hold of their leads, it’s worth making
                  sure all of this is in order before dialing on a weekly or bi-weekly basis.
                </Box>
              </Typography>

              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Register at all four:
              </Typography>
              <Stack spacing={0.75} sx={{ pl: 1, mb: 1.5 }}>
                {REGISTRIES.map((reg) => (
                  <Bullet key={reg.name}>
                    <Box component="strong">{reg.name}</Box> — {reg.url}
                  </Bullet>
                ))}
              </Stack>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Once registered your numbers show as a verified business instead of an unknown
                caller. Answer rates on registered numbers consistently outperform unregistered
                numbers on the same lists.
              </Typography>
            </StepCard>

            <StepCard number={2} title="Rotate your numbers — protect your scores">
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                No single number should make more than 40–50 calls per day. High volume from one
                number is the primary signal carriers use to classify it as a robocaller. Once that
                happens, your calls are silently routed to voicemail — your agent thinks it rang,
                the prospect never saw it.
              </Typography>
              <Typography variant="body2">
                Ringy’s local presence dialing helps by rotating area codes to match the prospect’s
                region, which improves answer rates on its own. Combine that with volume spread
                across multiple numbers and your individual number scores stay clean long-term.
              </Typography>
            </StepCard>

            <StepCard number={3} title="Check your STIR/SHAKEN attestation level">
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                STIR/SHAKEN is the carrier-level protocol that verifies your call is coming from
                who it says it is. Numbers with A-level attestation are significantly less likely
                to be blocked because the carrier has confirmed the caller identity before the call
                even connects.
              </Typography>
              <Typography variant="body2">
                Ask Ringy or your dialer provider what attestation level your outbound calls carry.
                If you are not at A-level, ask what is needed to get there. This is a one-time
                infrastructure fix that protects every call you make going forward.
              </Typography>
            </StepCard>

            <StepCard
              number={4}
              title="!!! Go SMS-first — it bypasses everything above !!!"
            >
              <Typography variant="body2" sx={{ mb: 2 }}>
                SMS bypasses carrier call blocking entirely. A prospect with Silence Unknown
                Callers active, or whose carrier has flagged your number, will still receive and
                read a text. Once they reply, your number is no longer unknown and the next call
                gets answered.
              </Typography>

              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                The sequence that works:
              </Typography>
              <Stack spacing={2} sx={{ mb: 2 }}>
                {SMS_SEQUENCE.map((step) => (
                  <Box key={step.label}>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <Box component="strong">{step.label}</Box> — {step.body}
                    </Typography>
                    {step.messages?.map((msg, mIdx) => (
                      <Box
                        key={mIdx}
                        sx={{
                          mt: 0.75,
                          p: 1.5,
                          borderRadius: 1,
                          bgcolor: (theme) => theme.palette.action.hover,
                        }}
                      >
                        <Typography variant="body2">{msg}</Typography>
                      </Box>
                    ))}
                  </Box>
                ))}
              </Stack>

              <Typography variant="body2">
                When they reply to the text, call/text immediately and say you will be there in two
                minutes. They have been acknowledged and are now expecting it, the number is saved
                or recognized, and Silence Unknown Callers does not apply. That single reply
                converts an unreachable lead into a warm pickup.
              </Typography>
            </StepCard>
          </Stack>

          <Box sx={{ mt: 3 }}>
            <Callout>
              Number registration plus SMS-first plus local presence dialing addresses 35–45% of
              your unreachable verified leads. That is not a small number. On a list of 200
              verified leads that is 70–90 more conversations your competition is not having.
            </Callout>
          </Box>
        </Box>

        <Divider />

        <Box>
          <Typography variant="h5" sx={{ color: 'primary.main', mb: 0.5 }}>
            When to Call
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Everything above helps. So does calling at the right time. Contact rate data across
            outbound insurance operations consistently shows the same windows:
          </Typography>

          <Card sx={{ p: 3, mb: 2 }}>
            <Stack spacing={1}>
              {CALL_WINDOWS.map((win) => (
                <Bullet key={win.label}>
                  <Box component="strong">{win.label}</Box> — {win.text}
                </Bullet>
              ))}
            </Stack>
          </Card>

          <Typography
            variant="body2"
            sx={{ fontStyle: 'italic', fontWeight: 700, color: 'text.primary' }}
          >
            If you are dialing 10am to 3pm and writing off the list, try the same leads at 8am or
            5pm before moving on. The lead did not change. The window did.
          </Typography>
        </Box>

        <Divider />

        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', textAlign: 'center', display: 'block' }}
        >
          Life Jacket Leads · Life Jacket Agency · Life Jacket Academy
        </Typography>
      </Stack>
    </DashboardContent>
  );
}
