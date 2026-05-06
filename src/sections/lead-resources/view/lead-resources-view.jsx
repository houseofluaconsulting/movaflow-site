import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import { getCustomer } from 'src/actions/customer';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const MORTGAGE_SCRIPT_STEPS = [
  {
    step: 'STEP 01',
    title: 'Opener',
    subtitle: 'Re-establish connection',
    blocks: [
      {
        speaker: 'AGENT',
        text: '“Hi [Name], this is [Agent Name] — I’m following up because you recently requested some information online about mortgage protection. I just want to make sure I actually got you the right information, not just a generic quote. Do you have a few minutes?”',
      },
      {
        note: 'If they say they’re busy: “Totally understand — when would be a better time? I’d hate for you to have gone through that process and not get something useful out of it.”',
      },
    ],
  },
  {
    step: 'STEP 02',
    title: 'Situation Check',
    subtitle: 'Understand their real picture',
    blocks: [
      {
        speaker: 'AGENT',
        text: '“Before I get into any numbers, I want to understand where you’re at. When you filled out that form — what was going through your mind? Was there a specific concern, or were you just gathering information?”',
      },
      {
        note: 'Listen fully. Let them talk. Their answer shapes everything that follows.',
      },
      {
        speaker: 'AGENT',
        text: '“And just so I understand your situation — how long have you had the mortgage, roughly? And is this a home you plan to stay in long-term, or could you see yourself selling or downsizing at some point?”',
      },
      {
        note: 'This is key intel. It tells you whether full balance coverage even makes sense for them.',
      },
    ],
  },
  {
    step: 'STEP 03',
    title: 'Education Moment',
    subtitle: 'Reframe what “mortgage protection” actually means',
    blocks: [
      {
        speaker: 'AGENT',
        text: '“Can I share something with you that most people don’t realize when they first look into this? Because it actually changes how we’d approach your coverage.”',
      },
      {
        speaker: 'AGENT',
        text: '“A lot of folks assume mortgage protection means we’re covering the full remaining balance — like whatever you owe today, we insure all of it. And honestly, for some people that’s overkill, and it makes the premiums feel out of reach.”',
      },
      {
        speaker: 'AGENT',
        text: '“What we actually help people figure out is: what does your family really need if something happened to you? Sometimes it’s covering the equity you’ve already built — so your spouse isn’t forced to sell in a panic. Sometimes it’s just buying time — enough coverage to keep the mortgage paid for a few years while they get on their feet or decide whether to stay or move.”',
      },
      {
        speaker: 'AGENT',
        text: '“Does that make sense? It’s not one-size-fits-all — it’s about what the realistic outcome looks like for your family.”',
      },
      {
        note: 'Pause. Let it land. Wait for their response before moving forward.',
      },
    ],
  },
  {
    step: 'STEP 04',
    title: 'Discovery & Fit',
    subtitle: 'Find the right coverage level',
    blocks: [
      {
        speaker: 'AGENT',
        text: '“Based on what you’ve told me, let me ask you this — if you weren’t here tomorrow, what would you want to happen with the house? Would your [spouse/partner] want to stay, or would selling be the most realistic option?”',
      },
      {
        speaker: 'AGENT',
        text: '“And roughly, how much equity have you built up at this point? We’re not looking for an exact number — just ballpark.”',
      },
      {
        note: 'Use their answers to anchor the coverage conversation to a real, specific outcome — not an abstract number.',
      },
      {
        speaker: 'AGENT',
        text: '“So what we’d be looking at is something that protects [that equity / those X years of payments / your spouse’s ability to stay in the home] — not necessarily the full remaining balance. That usually puts us in a much more comfortable range premium-wise.”',
      },
    ],
  },
  {
    step: 'STEP 05',
    title: 'Presentation & Close',
    subtitle: 'Present the option and ask for the decision',
    blocks: [
      {
        speaker: 'AGENT',
        text: '“Based on everything you’ve shared, I think the right fit for you is [plan/coverage amount]. Here’s why that makes sense for your situation specifically: [tie it back to what they said about the house, their spouse, their equity].”',
      },
      {
        speaker: 'AGENT',
        text: '“The premium on that would be around [amount] a month. That’s less than [relatable comparison — a cable bill, a dinner out]. And it means if something happens, [specific outcome tied to their situation — your wife doesn’t have to sell the house in 60 days / your kids don’t inherit a mortgage they can’t afford].”',
      },
      {
        speaker: 'AGENT',
        text: '“Does that feel like it fits what you were looking for?”',
      },
      {
        note: 'Stop talking. The next person who speaks loses. Let the silence work for you.',
      },
    ],
  },
];

const MORTGAGE_OBJECTIONS = [
  {
    objection: '“I thought this would cover my whole mortgage — that’s too little coverage.”',
    response:
      '“That’s exactly the conversation I was hoping to have with you. Covering the full balance sounds safe, but it also usually means paying for coverage your family may never actually need. If your spouse would sell the home after a few years anyway, we’d be insuring a balance that just... goes away. What we’re designing here is protection that matches the actual outcome — not the number on your statement. Does that change how it feels?”',
  },
  {
    objection: '“I need to think about it.” / “I need to talk to my spouse.”',
    response:
      '“Completely fair — this is a real decision. Can I ask what specifically you’d want to think through? Because sometimes there’s a piece I haven’t answered clearly enough, and I’d rather address that now than have you sitting with a question I could just answer. What’s the main thing on your mind?”',
  },
  {
    objection: '“I already have life insurance through work.”',
    response:
      '“That’s good to have — and here’s the thing about group coverage: it’s tied to your job. The moment you leave, get laid off, or retire, it’s gone. Mortgage protection is yours — it follows you, not your employer. And group policies usually aren’t designed with your specific mortgage situation in mind. They’re a general benefit. This is specific to making sure your house is taken care of. Does that distinction make sense?”',
  },
  {
    objection: '“I’m not sure I can afford it right now.”',
    response:
      '“I hear you — and honestly, that’s part of why we talked through what you actually need versus the full balance. Let me make sure I’ve found you the leanest option that still does the job. [Revisit coverage amount if needed.] The real question is: if something happened and this coverage wasn’t in place, what would that cost your family? Because that number is always going to be bigger than this premium.”',
  },
];

const MORTGAGE_TEXT_DRIP = [
  {
    day: 'Day 1',
    label: 'Intro',
    sendTime: 'Immediately upon lead entry',
    goal: 'Open the conversation',
    message:
      'Hey #first_name! This is Ben with Legacy Financial. Are you looking for full or partial mortgage protection?',
  },
  {
    day: 'Day 2',
    label: 'Education',
    sendTime: 'Next morning (~9am)',
    goal: 'Re-engage, educate on what MP really covers',
    message:
      'Hey #first_name, Ben again from Legacy Financial. Quick thing most people don’t realize — mortgage protection doesn’t have to cover your full balance. Sometimes protecting the equity you’ve already built is all your family really needs. Worth a quick conversation?',
  },
  {
    day: 'Day 4',
    label: 'Trust',
    sendTime: 'Mid-morning (~10am)',
    goal: 'Build trust, humanize the purpose',
    message:
      'Hi #first_name — Ben with Legacy Financial. I work with a lot of homeowners who just want to make sure their family isn’t forced to sell the house if something happened. That’s really all this is about. Happy to answer any questions, no pressure at all.',
  },
  {
    day: 'Day 6',
    label: 'Objection',
    sendTime: 'Late morning (~11am)',
    goal: 'Overcome the “I have coverage through work” objection preemptively',
    message:
      'Hey #first_name, one thing I hear a lot — “I have life insurance through work.” That’s great, but group coverage is tied to your job. The moment you leave or retire, it’s gone. Mortgage protection is yours, no matter what. Just something to think about — Ben, Legacy Financial.',
  },
  {
    day: 'Day 8',
    label: 'Soft CTA',
    sendTime: 'Morning (~9:30am)',
    goal: 'Book an appointment',
    message:
      'Hi #first_name — Ben here. I’ve got a few minutes this week if you’d like to go over what a plan would actually look like for your situation. No obligation, just a quick call to see if it makes sense. What does your schedule look like?',
  },
  {
    day: 'Day 10',
    label: 'Education',
    sendTime: 'Mid-morning (~10am)',
    goal: 'Educate on partial coverage, lower the perceived cost barrier',
    message:
      'Hey #first_name — Ben with Legacy Financial. A lot of people assume mortgage protection is expensive because they think it covers the whole loan. When we right-size it to what your family actually needs, the monthly cost usually surprises people — in a good way. Want me to run the numbers for your situation?',
  },
  {
    day: 'Day 12',
    label: 'Value',
    sendTime: 'Morning (~9am)',
    goal: 'Create urgency without pressure, reinforce trust',
    message:
      'Hi #first_name, Ben again. I’m not trying to chase you down — I just know from experience that this is one of those things people mean to get to and then life gets in the way. If your family would ever need that safety net, the time to set it up is before something happens. I’m here when you’re ready.',
  },
  {
    day: 'Day 14',
    label: 'Breakup',
    sendTime: 'Morning (~9am)',
    goal: 'Final touch — leave the door open, no hard sell',
    message:
      'Hey #first_name — this will be my last reach out for now. If protecting your mortgage ever becomes a priority, I’m always here. Just reply “interested” and I’ll pick right back up. Wishing you and your family the best — Ben, Legacy Financial.',
  },
];

// ----------------------------------------------------------------------

function ScriptStepCard({ step }) {
  return (
    <Card sx={{ p: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="overline" sx={{ color: 'primary.main', display: 'block' }}>
          {step.step}
        </Typography>
        <Typography variant="h6">{step.title}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {step.subtitle}
        </Typography>
      </Box>

      <Stack spacing={1.5}>
        {step.blocks.map((block, idx) =>
          block.speaker ? (
            <Box
              key={idx}
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: (theme) => theme.palette.action.hover,
              }}
            >
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, color: 'secondary.main', display: 'block', mb: 0.5 }}
              >
                {block.speaker}
              </Typography>
              <Typography variant="body2">{block.text}</Typography>
            </Box>
          ) : (
            <Box
              key={idx}
              sx={{ display: 'flex', gap: 1, pl: 1, color: 'text.secondary' }}
            >
              <Iconify icon="solar:play-bold" width={16} sx={{ mt: 0.4, flexShrink: 0 }} />
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                {block.note}
              </Typography>
            </Box>
          )
        )}
      </Stack>
    </Card>
  );
}

function DripMessageCard({ item }) {
  return (
    <Card sx={{ p: 3 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="subtitle1" sx={{ color: 'warning.main' }}>
          {item.day}
        </Typography>
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          — {item.label}
        </Typography>
      </Stack>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 0.5, sm: 2 }}
        sx={{ mb: 1.5 }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          <strong>Send time:</strong> {item.sendTime}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          <strong>Goal:</strong> {item.goal}
        </Typography>
      </Stack>

      <Box
        sx={{
          p: 2,
          borderRadius: 1,
          bgcolor: (theme) => theme.palette.action.hover,
        }}
      >
        <Typography variant="body2">{item.message}</Typography>
      </Box>
    </Card>
  );
}

function MortgageResources() {
  return (
    <Stack spacing={5}>
      <Typography variant="h4" sx={{ color: 'primary.main' }}>
        Mortgage Protection
      </Typography>

      <Box>
        <Typography variant="h5" sx={{ mb: 0.5 }}>
          Follow-Up Call Script
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          Steps 1–5
        </Typography>
        <Stack spacing={3}>
          {MORTGAGE_SCRIPT_STEPS.map((step) => (
            <ScriptStepCard key={step.step} step={step} />
          ))}
        </Stack>
      </Box>

      <Divider />

      <Box>
        <Typography variant="h5" sx={{ mb: 0.5 }}>
          Objection Handler Reference
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Common objections and how to respond.
        </Typography>
        <Stack>
          {MORTGAGE_OBJECTIONS.map((item, idx) => (
            <Accordion key={idx} disableGutters>
              <AccordionSummary
                expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
              >
                <Typography variant="subtitle1">{item.objection}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 700, color: 'primary.main', display: 'block', mb: 1 }}
                >
                  YOUR RESPONSE
                </Typography>
                <Typography variant="body2">{item.response}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </Box>

      <Divider />

      <Box>
        <Typography variant="h5" sx={{ mb: 0.5 }}>
          Legacy Financial — 14-Day Text Drip
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          8 touches over 14 days.
        </Typography>
        <Stack spacing={2}>
          {MORTGAGE_TEXT_DRIP.map((item) => (
            <DripMessageCard key={item.day} item={item} />
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}

// ----------------------------------------------------------------------

export function LeadResourcesView() {
  const { user } = useAuthContext();
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    async function fetchData() {
      if (!user?.id || !user?.idToken) return;

      setLoading(true);
      try {
        const result = await getCustomer(user.id, user.idToken.toString());
        setCustomerData(result);
      } catch (error) {
        console.error('Error fetching customer data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user?.id, user?.idToken]);

  if (loading) {
    return <LoadingScreen />;
  }

  const leadTypes = customerData?.LeadType;

  const availableTabs = [
    ...(leadTypes?.VeteranWebsite?.Active ? [{ key: 'VeteranWebsite', label: 'Veteran Leads' }] : []),
    ...(leadTypes?.LegacyWebsite?.Active ? [{ key: 'LegacyWebsite', label: 'Legacy Leads' }] : []),
    ...(leadTypes?.OctavianMortgage?.Active || leadTypes?.LegacyMortgage?.Active ? [{ key: 'MortgageLeads', label: 'Mortgage Leads' }] : []),
    ...(leadTypes?.FinalExpense?.Active ? [{ key: 'FinalExpense', label: 'Final Expense' }] : []),
  ];

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Agent Resources
      </Typography>

      {availableTabs.length > 0 && (
        <Tabs
          value={currentTab}
          onChange={(_, newValue) => setCurrentTab(newValue)}
          sx={{ mb: 3 }}
        >
          {availableTabs.map((tab) => (
            <Tab key={tab.key} label={tab.label} />
          ))}
        </Tabs>
      )}

      {availableTabs[currentTab]?.key === 'VeteranWebsite' && (
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Veteran Leads Resources</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Resources for working your Veteran leads will appear here.
          </Typography>
        </Card>
      )}

      {availableTabs[currentTab]?.key === 'LegacyWebsite' && (
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Legacy Leads Resources</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Resources for working your Legacy leads will appear here.
          </Typography>
        </Card>
      )}

      {availableTabs[currentTab]?.key === 'MortgageLeads' && <MortgageResources />}

      {availableTabs[currentTab]?.key === 'FinalExpense' && (
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Final Expense Resources</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Resources for working your Final Expense leads will appear here.
          </Typography>
        </Card>
      )}

      {availableTabs.length === 0 && (
        <Card sx={{ p: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            No lead types are currently active on your account.
          </Typography>
        </Card>
      )}
    </DashboardContent>
  );
}
