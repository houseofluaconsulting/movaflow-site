import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { getCustomer } from 'src/actions/customer';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

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

const LEGACY_SCRIPT_STEPS = [
  {
    step: 'STEP 01',
    title: 'Opener',
    subtitle: 'Connect and confirm',
    blocks: [
      {
        speaker: 'AGENT',
        text: '“Hi, is this [First Name]? Hey — this is [Agent Name] calling from Legacy Financial. You just finished filling out our protection questionnaire online a few minutes ago, so I wanted to make sure I got you while everything was still fresh. Do you have a few minutes right now?”',
      },
      {
        note: 'If they say they’re busy: “Completely understand — when’s a better time today? I want to make sure we actually get you taken care of, not just send you something to ignore.”',
      },
      {
        note: 'If they don’t remember: “You went through our life insurance questionnaire on Legacy Financial — confirmed your number with a code. That was you, right?” Almost always yes. Just needed the reminder.',
      },
    ],
  },
  {
    step: 'STEP 02',
    title: 'Situation',
    subtitle: 'Find out where they’re at',
    blocks: [
      {
        speaker: 'AGENT',
        text: '“Before I pull up any numbers, I want to make sure I understand your situation. What made you look into life insurance today — was there something specific that prompted it?”',
      },
      {
        note: 'Listen fully. Let them talk. The reason they filled out the form is the emotional hook for everything that follows. New baby, new house, spouse asked about it, friend passed away — whatever it is, that’s your anchor.',
      },
      {
        speaker: 'AGENT',
        text: '“And right now — do you have any coverage in place, or are you starting from scratch?”',
      },
      {
        note: 'Two very different conversations. If they have coverage, the angle is filling the gap. If none, it’s establishing the baseline need.',
      },
      {
        speaker: 'AGENT',
        text: '“Got it. And is it just you we’re covering, or are you thinking about your spouse as well?”',
      },
    ],
  },
  {
    step: 'STEP 03',
    title: 'Need',
    subtitle: 'Establish the real number',
    blocks: [
      {
        speaker: 'AGENT',
        text: '“Let me ask you this — if something happened to you tomorrow, what would your family actually need? Not just to survive the month, but to stay in the house, pay off the mortgage, keep the kids in school — what does that number look like for your family?”',
      },
      {
        note: 'Don’t rush this. Let them think. The number they say out loud becomes the anchor. Most people underestimate — that’s okay, you can calibrate.',
      },
      {
        speaker: 'AGENT',
        text: '“Based on what you’ve told me, realistically we’re probably talking about [X] in coverage. That makes sense for your situation because [tie it to what they said — mortgage, kids, spouse income gap]. Does that feel about right?”',
      },
    ],
  },
  {
    step: 'STEP 04',
    title: 'Presentation',
    subtitle: 'Present the solution',
    blocks: [
      {
        speaker: 'AGENT',
        text: '“Okay — based on your age, health, and what you’re looking for, I can get you [X] in term coverage for around [monthly amount] a month. That’s [relatable comparison]. And unlike a lot of policies, this one [key differentiator — no medical exam, rates locked for 20 years, etc.].”',
      },
      {
        speaker: 'AGENT',
        text: '“The way I look at it — for [monthly amount], your family is protected no matter what happens. Does that feel like something you want to get in place today?”',
      },
      {
        note: 'Stop talking. The next person who speaks loses. Let the silence work.',
      },
    ],
  },
  {
    step: 'STEP 05',
    title: 'Close',
    subtitle: 'Get the decision',
    blocks: [
      {
        speaker: 'AGENT',
        text: '“Let’s go ahead and get this started. I just need to confirm a few quick details and we can have your coverage active today. What’s your date of birth?”',
      },
      {
        note: 'Move directly into the application. Don’t ask “do you want to apply” — assume yes and start gathering info. If they pump the brakes, that’s when an objection surfaces. Don’t create a hesitation point by asking permission.',
      },
    ],
  },
];

const LEGACY_OBJECTIONS = [
  {
    objection: '“It’s too expensive.” / “I can’t afford that right now.”',
    response:
      '“I hear you — and I want to make sure we find something that actually works for your budget. Let me ask — what were you thinking you’d want to spend? We have options starting as low as [low entry price] a month. The question is whether leaving your family unprotected is really cheaper. Let me show you what [lower amount] gets you.”',
  },
  {
    objection: '“I need to talk to my spouse first.”',
    response:
      '“That’s completely reasonable — this is a family decision. Can I ask, is your spouse home right now? Because honestly the best thing is if we can get them on for two minutes. That way nobody’s playing telephone and you’re both making the decision with the same information. Can we do that?” If spouse isn’t available: “Okay — what’s a time today or tomorrow when you’d both be free for 10 minutes? I’ll call back then. I’d rather do this right than rush it.”',
  },
  {
    objection: '“I need to think about it.”',
    response:
      '“Of course — what specifically do you want to think through? Because sometimes there’s a question I haven’t answered clearly enough, and I’d rather address that now than have you sit with something I could just answer. What’s the main thing on your mind?”',
  },
];

const LEGACY_TEXT_DRIP = [
  {
    day: 'Day 1 — Immediate',
    label: 'Missed first call',
    sendTime: 'Within 2 min of failed call attempt',
    goal: 'Establish contact, confirm intent, get a callback time',
    message:
      'Hi [First Name], this is [Agent Name] from Legacy Financial. I just tried to reach you — you filled out our life insurance questionnaire a few minutes ago. I have some options ready for your situation. What’s a good time to connect today?',
  },
  {
    day: 'Day 1 — Evening',
    label: 'Same-day follow up',
    sendTime: '6:00–7:00 PM if no reply',
    goal: 'Second touchpoint same day. Offer two time options to reduce friction',
    message:
      'Hey [First Name] — [Agent Name] again from Legacy Financial. Tried you earlier today. I have life insurance options that fit your situation and I’d love to walk you through them. Takes about 10 minutes. Are you available for a quick call tonight or tomorrow morning?',
  },
  {
    day: 'Day 2',
    label: 'Value add',
    sendTime: '9:00 AM',
    goal: 'Educate without pressure. “No medical exam” and “locked rates” move hesitant leads',
    message:
      'Good morning [First Name] — [Agent Name] from Legacy Financial. Quick note: most people who go through our questionnaire qualify for term life coverage with no medical exam required. Rates are locked from the day you apply. Happy to show you what that looks like for your family — just reply here or let me know a time to call.',
  },
  {
    day: 'Day 3',
    label: 'Address the cost concern',
    sendTime: '10:30 AM',
    goal: 'Pre-empt the “too expensive” objection. Anchor to a real number that feels accessible',
    message:
      'Hi [First Name] — [Agent Name] at Legacy Financial. I know cost is usually the first question. Most of our clients are surprised — a solid policy for a healthy adult is often less than $30–40 a month. Takes 10 minutes to find out exactly what your rate would be. Want me to run it for you?',
  },
  {
    day: 'Day 5',
    label: 'Social proof',
    sendTime: '11:00 AM',
    goal: 'Make it real with a specific example. Specificity builds credibility',
    message:
      'Hey [First Name] — [Agent Name] from Legacy Financial. Helped a client last week in a similar situation get $500k in coverage for $38/month — no exam, approved same day. Happy to see if we can do the same for you. Still a good time to connect?',
  },
  {
    day: 'Day 7',
    label: 'The spouse angle',
    sendTime: '9:30 AM',
    goal: 'Remove the “need to talk to spouse” friction by offering a joint call',
    message:
      'Hi [First Name] — [Agent Name] at Legacy Financial. If you’ve been meaning to loop in your spouse before deciding, I can do a call with both of you — takes about 15 minutes together. A lot of couples find it easier that way. Want to set something up?',
  },
  {
    day: 'Day 10',
    label: 'Soft urgency',
    sendTime: '10:00 AM',
    goal: 'Create genuine urgency without manufactured pressure. Rate/age correlation is real',
    message:
      'Hi [First Name] — [Agent Name] from Legacy Financial. I know life gets busy. Just want to make sure you know the offer I’ve put together for you is still available. Rates can change with age and health — locking them in now always makes more sense than waiting. Reply when you’re ready and I’ll pick right back up.',
  },
  {
    day: 'Day 14',
    label: 'Breakup',
    sendTime: '9:00 AM — final touch',
    goal: 'Leave the door open, no pressure. The “reply interested” gives an easy re-entry point',
    message:
      'Hey [First Name] — this will be my last reach out for now. If protecting your family ever becomes a priority, I’m here. Just reply “interested” and I’ll pick right back up. Wishing you and your family well — [Agent Name], Legacy Financial.',
  },
];

const VETERAN_SCRIPT_STEPS = [
  {
    step: 'STEP 01',
    title: 'Opener',
    subtitle: 'Re-establish connection, confirm identity',
    blocks: [
      {
        speaker: 'AGENT',
        text: '“Hi, is this [Name]? Hey [Name], this is [Agent Name] calling from Benefits for Veterans — you recently filled out some information online looking into your coverage options. I just want to make sure I get you the right information, not just a generic answer. Do you have a few minutes?”',
      },
      {
        note: 'If busy: “Totally understand — when’s a better time? I’d hate for you to have gone through that process and not get something useful out of it.”',
      },
    ],
  },
  {
    step: 'STEP 02',
    title: 'Establish What We Do',
    subtitle: 'Set the frame before asking a single question',
    blocks: [
      {
        speaker: 'AGENT',
        text: '“Before I get into anything, let me tell you a little about what we actually do — because we’re different from what most veterans expect when they first reach out.”',
      },
      {
        speaker: 'AGENT',
        text: '“So you probably know this by now, but the VA doesn’t have many life insurance options for veterans — and most veterans can’t even qualify for the ones they do offer. We help veterans understand exactly what the VA does cover and how to access it. But for most veterans, honestly, it’s not nearly enough.”',
      },
      {
        note: 'If they seem unaware of VA limitations, add: “For example — and this surprises a lot of people — the VA will cover $300 toward a headstone. That’s it. That’s the extent of what most veterans are left with if they don’t have something else in place. $300 toward a headstone and a folded flag.”',
      },
      {
        speaker: 'AGENT',
        text: '“So what we’ve done is build relationships with partner programs that are specifically more lenient with the health issues that are common among veterans — things like PTSD, mobility issues, chronic pain from service — conditions that would get someone declined or rated through a standard carrier. We make sure veterans are getting their best possible policy at their best possible rate. That’s the whole reason we exist.”',
      },
      {
        note: 'Pause. Let it land. Give them a moment to respond before moving forward.',
      },
    ],
  },
  {
    step: 'STEP 03',
    title: 'Situation Check',
    subtitle: 'Understand where they’re starting from',
    blocks: [
      {
        speaker: 'AGENT',
        text: '“Let me ask you — do you currently have any life insurance in place, or are you mostly relying on what the VA offers?”',
      },
      {
        note: 'Listen fully. Their answer shapes everything that follows.',
      },
      { subheading: 'If they have existing coverage:' },
      {
        speaker: 'AGENT',
        text: '“Okay good — and do you know off the top of your head roughly how much coverage that is? And is that through the VA, through an employer, or something you set up on your own?”',
      },
      {
        note: 'This tells you whether they’re underinsured, replacing a bad policy, or supplementing.',
      },
      { subheading: 'If they have nothing:' },
      {
        speaker: 'AGENT',
        text: '“Okay — and is that because you looked into it and ran into roadblocks, or just haven’t had a chance to sit down and figure it out yet?”',
      },
      {
        note: 'This surfaces past objections early so you can address them, not hit them at the close.',
      },
    ],
  },
  {
    step: 'STEP 04',
    title: 'Discovery',
    subtitle: 'Find the real motivation',
    blocks: [
      {
        speaker: 'AGENT',
        text: '“And just so I understand your situation — is there someone depending on your income right now? A spouse, kids, anyone who’d be in a tough spot if something happened to you?”',
      },
      {
        note: 'Let them answer. Don’t rush this. The names and faces they give you here are what you tie the coverage back to at the close.',
      },
      {
        speaker: 'AGENT',
        text: '“And is there a mortgage or any debt in the picture, or is it more about making sure your family isn’t left with final expenses and burial costs?”',
      },
      {
        note: 'This naturally steers toward the right product — mortgage protection, final expense, or income replacement — without leading with a product pitch.',
      },
    ],
  },
  {
    step: 'STEP 05',
    title: 'Health Questions',
    subtitle: 'Qualify for coverage, frame it the right way',
    blocks: [
      {
        speaker: 'AGENT',
        text: '“Okay — I want to make sure I’m showing you options you’d actually qualify for, so I need to ask a few quick health questions. These are the same things our partner carriers look at, and it only takes a minute. Fair enough?”',
      },
      {
        note: 'Keep your tone conversational — not clinical. These veterans have often been through medical screenings and bureaucracy. Don’t make this feel like another form.',
      },
      { subheading: 'Core questions to cover:' },
      {
        bullets: [
          '“Are you currently working, retired, or on any kind of disability?”',
          '“Height and weight — just roughly?”',
          '“Any major health conditions — things like heart issues, diabetes, PTSD, mobility problems from service?”',
          '“Any hospitalizations or surgeries in the last two years?”',
          '“Tobacco use in the last 12 months?”',
        ],
      },
      {
        note: 'If a condition comes up: “Okay, that’s actually really helpful to know — that’s exactly the kind of thing our partner programs are built around. A lot of our veterans come to us because a standard carrier already turned them down for that. Let’s see what we can do.”',
      },
      {
        note: 'Never react negatively to a health disclosure. Veterans are conditioned to expect rejection on this — your calm, matter-of-fact response is itself trust-building.',
      },
    ],
  },
  {
    step: 'STEP 06',
    title: 'Presentation & Close / Transfer',
    subtitle: 'Tie everything back to what they told you',
    blocks: [
      {
        speaker: 'AGENT',
        text: '“Okay — based on everything you’ve shared, let me tell you what I think makes the most sense for your situation.”',
      },
      {
        speaker: 'AGENT',
        text: '“What we’re looking at is something that protects [spouse’s name / your family / the house] — specifically built around [their situation — the PTSD / the mobility issue / the fact that the VA left them with nothing]. Our partner programs are going to give you options that a standard carrier wouldn’t even quote you.”',
      },
      {
        speaker: 'AGENT',
        text: '“The premium on something like this typically runs around [amount] a month — less than [relatable comparison]. And it means if something happens, [specific outcome — your wife isn’t left with a $300 headstone benefit and a stack of bills / your kids don’t inherit nothing after everything you gave].”',
      },
      { subheading: 'If closing yourself:' },
      {
        speaker: 'AGENT',
        text: '“Does that feel like it fits what you were looking for?”',
      },
      {
        note: 'Stop talking. The next person who speaks loses. Let the silence work.',
      },
      { subheading: 'If transferring:' },
      {
        speaker: 'AGENT',
        text: '“I’ve got everything I need. I want to bring in [Agent Name] who specializes in putting together the right fit for veterans in your exact situation — they’re going to walk you through the actual numbers and get you something real. Give me just one second.”',
      },
      {
        note: 'Warm transfer. Pass along: health flags, coverage motivation, who depends on them, and the emotional anchor they gave you.',
      },
    ],
  },
];

const VETERAN_OBJECTIONS = [
  {
    objection: '“I already got it taken care of…”',
    blocks: [
      {
        speaker: 'Agent',
        text: '“Ahh yeah that’s exactly why they’re having me call…you’re in (whatever state they’re in) right?”',
      },
      { speaker: 'Client', text: '“Yes”' },
      {
        speaker: 'Agent',
        text: '“Ok so we have been a lot of complaints in your area about people’s not getting the policies they thought they did”',
      },
      {
        aside: '(give an example - had 2 people vets today already that thought they got whole life but they got 5 year term/got a ADB)',
      },
      { plain: 'Anyway, did you receive your policy in the mail yet?' },
      { speaker: 'Client', text: '“Yes/No”' },
      {
        speaker: 'If “Yes”',
        text: '“Ok perfect, and again I’m just trying to help you figure this out so your family doesn’t find out the hard way after you pass”',
      },
      {
        speaker: 'If “No”',
        text: '“Ok, no worries… if you know the name of the company I might be able to help you figure it out that way.”',
      },
      { aside: '(also get the price and amount of the death benefit)' },
      { speaker: 'Agent', text: '“Have you made your first payment yet?”' },
      { aside: '(check bank statement)' },
    ],
  },
  {
    objection: '“I’m not interested anymore…”',
    blocks: [
      {
        speaker: 'Agent',
        text: '“Ahh yeah that’s actually why they’re having me call…we’ve been getting complaints about our vets getting tons of people calling, has that been happening to you?”',
      },
      { speaker: 'Client', text: '“Yes please stop!”' },
      {
        speaker: 'Agent',
        text: '“I know I know, it’s NOT us…most of the vets I’ve talked to this week have given up because the process was so annoying…I’m assuming you never got the information you wanted?”',
      },
      {
        speaker: 'Agent',
        text: '“We want to apologize and most importantly, get you the info you wanted, why were you looking for life insurance in the first place?”',
      },
      { aside: '(get the convo steered towards useful info…)' },
    ],
  },
  {
    objection: '“I didn’t fill that out…”',
    blocks: [
      {
        speaker: 'Agent',
        text: '“No problem, hang tight so I can get you taken off here, I need to confirm a few things so I can take you off”',
      },
      { speaker: 'Client', text: '“Ok…”' },
      { instruction: 'confirm email, state, that they’re a veteran if its a vet lead' },
      {
        speaker: 'Agent',
        text: '“Look if you’re just annoyed about getting a bunch of calls…most of the vets I’ve talked to this week have given up because the process was so annoying…I’m assuming you never got the information you wanted?”',
      },
      {
        speaker: 'Agent',
        text: '“We want to apologize and most importantly, get you the info you wanted, why were you looking for life insurance in the first place?”',
      },
      { aside: '(get the convo steered towards useful info…)' },
    ],
  },
];

const VETERAN_AGENT_NOTES = [
  'Never thank them for their service in a way that feels scripted — if you say it, mean it, say it once, and move on. Veterans can smell performance from a mile away.',
  'The $300 headstone line lands differently depending on the veteran. Some will laugh, some will go quiet. Either reaction is engagement — don’t fill the silence.',
  'The partner program framing is your edge. You’re not selling insurance. You’re solving a problem the VA created. Keep coming back to that when the conversation drifts.',
];

const VETERAN_TEXT_DRIP = [
  {
    day: 'Day 1',
    label: 'Same day',
    sendTime: 'Same day',
    goal: 'Open with a question that meets them where they are — no assumption, no pitch',
    message:
      'Hey [Name], this is [Agent] from Benefits for Veterans. do you know exactly what you want or want assistance looking at options?',
  },
  {
    day: 'Day 2',
    label: 'Next morning',
    sendTime: 'Next morning',
    goal: 'Reframe the silence as yours, not theirs. Two specific time windows force a choice',
    message:
      'Hey [Name], I got slammed yesterday but I have a few minutes today to help you look at options. I can talk now or after 4:30 — which works better for you?',
  },
  {
    day: 'Day 4',
    label: '+2 days',
    sendTime: 'Two days after Day 2',
    goal: 'Availability reframe — you’re offering your time, not chasing them',
    message:
      'Hey [Name] — I’ve got some availability this afternoon if you still want help.',
  },
  {
    day: 'Day 6',
    label: '+2 days',
    sendTime: 'Two days after Day 4',
    goal: 'Pattern interrupt. Removes the sales dynamic — most reply just to clarify',
    message:
      'Hey [Name], quick one — are you still looking into options or did you already get taken care of? just want to make sure I’m not reaching out if you’re all set.',
  },
  {
    day: 'Day 9',
    label: '+3 days',
    sendTime: 'Three days after Day 6',
    goal: 'Social proof without being salesy — a real story, no name, no embellishment',
    message:
      'Hey [Name] — I had a veteran in a similar situation last week who thought he wouldn’t qualify. ended up getting covered for less than he expected. worth finding out if the same applies to you. I’m around today if you want to talk.',
  },
  {
    day: 'Day 12',
    label: '+3 days',
    sendTime: 'Three days after Day 9',
    goal: 'Two specific windows again. Empathetic — gives them a graceful way back in',
    message:
      'Hey [Name], I know life gets busy. I’ve got 15 minutes open tomorrow morning or Thursday after 2 — if either of those works, I can walk you through exactly what’s available and we can go from there. just say the word.',
  },
  {
    day: 'Day 14',
    label: '+2 days — close',
    sendTime: 'Two days after Day 12',
    goal: 'The close. Signals respect for their time and consistently gets replies. Never skip',
    message:
      'Hey [Name], going to leave this one here. if you ever want to understand what you actually have and what’s out there beyond it, I’m a text away. no rush, no pressure — you served, you deserve to at least know what’s available to you.',
  },
];

const VETERAN_DRIP_NOTES = [
  'If they reply to any text at any point — stop the drip and call them immediately. A reply is a live lead. Don’t waste it with another text.',
  'Keep the tone exactly like Day 1 and Day 2 — casual, lowercase where it feels natural, specific time windows, no exclamation points. It should read like a real person, not a campaign.',
  'The availability reframe is the engine of this sequence. You’re not chasing them — you’re offering your time. That subtle shift changes how every message lands.',
  'Personalize [Name] and [Agent] on every single message. A text that starts with someone’s name gets opened. One that doesn’t feels like spam.',
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
        {step.blocks.map((block, idx) => {
          if (block.speaker) {
            return (
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
            );
          }
          if (block.subheading) {
            return (
              <Typography
                key={idx}
                variant="subtitle2"
                sx={{ mt: 1, color: 'text.primary' }}
              >
                {block.subheading}
              </Typography>
            );
          }
          if (block.bullets) {
            return (
              <Stack key={idx} spacing={0.75} sx={{ pl: 1 }}>
                {block.bullets.map((bullet, bIdx) => (
                  <Box key={bIdx} sx={{ display: 'flex', gap: 1 }}>
                    <Typography variant="body2" sx={{ color: 'secondary.main', lineHeight: 1.5 }}>
                      •
                    </Typography>
                    <Typography variant="body2">{bullet}</Typography>
                  </Box>
                ))}
              </Stack>
            );
          }
          return (
            <Box
              key={idx}
              sx={{ display: 'flex', gap: 1, pl: 1, color: 'text.secondary' }}
            >
              <Iconify icon="solar:play-bold" width={16} sx={{ mt: 0.4, flexShrink: 0 }} />
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                {block.note}
              </Typography>
            </Box>
          );
        })}
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

function ObjectionBlocks({ blocks }) {
  return (
    <Stack spacing={1.25}>
      {blocks.map((block, idx) => {
        if (block.speaker) {
          return (
            <Typography key={idx} variant="body2">
              <Box
                component="span"
                sx={{
                  fontWeight: 700,
                  color: block.speaker === 'Client' ? 'primary.main' : 'secondary.main',
                  mr: 0.75,
                }}
              >
                {block.speaker}:
              </Box>
              {block.text}
            </Typography>
          );
        }
        if (block.aside) {
          return (
            <Typography
              key={idx}
              variant="body2"
              sx={{ color: 'text.secondary', fontStyle: 'italic', pl: 1 }}
            >
              {block.aside}
            </Typography>
          );
        }
        if (block.instruction) {
          return (
            <Typography
              key={idx}
              variant="body2"
              sx={{
                fontStyle: 'italic',
                color: 'warning.dark',
                bgcolor: (theme) => theme.palette.action.hover,
                p: 1,
                borderRadius: 1,
              }}
            >
              *{block.instruction}*
            </Typography>
          );
        }
        return (
          <Typography key={idx} variant="body2">
            {block.plain}
          </Typography>
        );
      })}
    </Stack>
  );
}

function SectionNav() {
  return (
    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
      <Button
        variant="outlined"
        color="inherit"
        size="small"
        startIcon={<Iconify icon="solar:document-text-bold-duotone" />}
        onClick={() => scrollToSection('call-script')}
      >
        Call Script
      </Button>
      <Button
        variant="outlined"
        color="inherit"
        size="small"
        startIcon={<Iconify icon="solar:shield-warning-bold-duotone" />}
        onClick={() => scrollToSection('objection-handlers')}
      >
        Objection Handlers
      </Button>
      <Button
        variant="outlined"
        color="inherit"
        size="small"
        startIcon={<Iconify icon="solar:chat-round-line-bold-duotone" />}
        onClick={() => scrollToSection('text-drip')}
      >
        Text Drip
      </Button>
    </Stack>
  );
}

function VeteranResources() {
  return (
    <Stack spacing={5}>
      <Box>
        <Typography variant="h4" sx={{ color: 'primary.main', mb: 1.5 }}>
          Benefits for Veterans
        </Typography>
        <SectionNav />
      </Box>

      <Box id="call-script" sx={{ scrollMarginTop: 80 }}>
        <Typography variant="h5" sx={{ mb: 0.5 }}>
          Call Script
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0 }}>
          Steps 1–6
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          <strong>Goal:</strong> close on the call
        </Typography>
        <Stack spacing={3}>
          {VETERAN_SCRIPT_STEPS.map((step) => (
            <ScriptStepCard key={step.step} step={step} />
          ))}
        </Stack>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Card sx={{ p: 3, maxWidth: 1180, width: '100%' }}>
          <Typography variant="h5" sx={{ mb: 0.5 }}>
            Notes for Agents
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Tone and framing reminders for the call.
          </Typography>
          <Stack spacing={1} sx={{ pl: 1 }}>
            {VETERAN_AGENT_NOTES.map((note, idx) => (
              <Box key={idx} sx={{ display: 'flex', gap: 1 }}>
                <Typography variant="body2" sx={{ color: 'secondary.main', lineHeight: 1.5 }}>
                  •
                </Typography>
                <Typography variant="body2">{note}</Typography>
              </Box>
            ))}
          </Stack>
        </Card>
      </Box>

      <Divider />

      <Box id="objection-handlers" sx={{ scrollMarginTop: 80 }}>
        <Typography variant="h5" sx={{ mb: 0.5 }}>
          Objection Handlers
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Common objections and how to respond.
        </Typography>
        <Stack>
          {VETERAN_OBJECTIONS.map((item, idx) => (
            <Accordion key={idx} disableGutters>
              <AccordionSummary
                expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
              >
                <Typography variant="subtitle1">{item.objection}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ObjectionBlocks blocks={item.blocks} />
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </Box>

      <Divider />

      <Box id="text-drip" sx={{ scrollMarginTop: 80 }}>
        <Typography variant="h5" sx={{ mb: 0.5 }}>
          2-Week Text Drip Sequence
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0 }}>
          7 messages — cadence: Days 1, 2, 4, 6, 9, 12, 14.
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Front-loaded when intent is hottest. If they reply at any point, stop the drip and call immediately.
        </Typography>
        <Stack spacing={2}>
          {VETERAN_TEXT_DRIP.map((item) => (
            <DripMessageCard key={item.day} item={item} />
          ))}
        </Stack>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Card sx={{ p: 3, maxWidth: 1250, width: '100%' }}>
            <Typography variant="h5" sx={{ mb: 1.5 }}>
              Drip Notes
            </Typography>
            <Stack spacing={1} sx={{ pl: 1 }}>
              {VETERAN_DRIP_NOTES.map((note, idx) => (
                <Box key={idx} sx={{ display: 'flex', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: 'secondary.main', lineHeight: 1.5 }}>
                    •
                  </Typography>
                  <Typography variant="body2">{note}</Typography>
                </Box>
              ))}
            </Stack>
          </Card>
        </Box>
      </Box>
    </Stack>
  );
}

function LegacyFexResources() {
  return (
    <Stack spacing={5}>
      <Box>
        <Typography variant="h4" sx={{ color: 'primary.main', mb: 1.5 }}>
          Final Expense / Legacy
        </Typography>
        <SectionNav />
      </Box>

      <Box id="call-script" sx={{ scrollMarginTop: 80 }}>
        <Typography variant="h5" sx={{ mb: 0.5 }}>
          Call Script
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0 }}>
          Steps 1–5
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          <strong>Goal:</strong> close on the call
        </Typography>
        <Stack spacing={3}>
          {LEGACY_SCRIPT_STEPS.map((step) => (
            <ScriptStepCard key={step.step} step={step} />
          ))}
        </Stack>
      </Box>

      <Divider />

      <Box id="objection-handlers" sx={{ scrollMarginTop: 80 }}>
        <Typography variant="h5" sx={{ mb: 0.5 }}>
          Objection Handlers
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Common objections and how to respond.
        </Typography>
        <Stack>
          {LEGACY_OBJECTIONS.map((item, idx) => (
            <Accordion key={idx} disableGutters>
              <AccordionSummary
                expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
              >
                <Typography variant="subtitle1">{item.objection}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 700, color: 'secondary.main', display: 'block', mb: 1 }}
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

      <Box id="text-drip" sx={{ scrollMarginTop: 80 }}>
        <Typography variant="h5" sx={{ mb: 0.5 }}>
          14-Day Text Drip
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Fires when agent can’t reach on first call attempt. Stops automatically on reply or booking.
        </Typography>
        <Stack spacing={2}>
          {LEGACY_TEXT_DRIP.map((item) => (
            <DripMessageCard key={item.day} item={item} />
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}

function MortgageResources() {
  return (
    <Stack spacing={5}>
      <Box>
        <Typography variant="h4" sx={{ color: 'primary.main', mb: 1.5 }}>
          Mortgage Protection
        </Typography>
        <SectionNav />
      </Box>

      <Box id="call-script" sx={{ scrollMarginTop: 80 }}>
        <Typography variant="h5" sx={{ mb: 0.5 }}>
          Call Script
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0 }}>
          Steps 1–5
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          <strong>Goal:</strong> close on the call
        </Typography>
        <Stack spacing={3}>
          {MORTGAGE_SCRIPT_STEPS.map((step) => (
            <ScriptStepCard key={step.step} step={step} />
          ))}
        </Stack>
      </Box>

      <Divider />

      <Box id="objection-handlers" sx={{ scrollMarginTop: 80 }}>
        <Typography variant="h5" sx={{ mb: 0.5 }}>
          Objection Handler Reference
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Common objections and how to respond
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
                  sx={{ fontWeight: 700, color: 'secondary.main', display: 'block', mb: 1 }}
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

      <Box id="text-drip" sx={{ scrollMarginTop: 80 }}>
        <Typography variant="h5" sx={{ mb: 0.5 }}>
          14-Day Text Drip
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Fires when agent can’t reach on first call attempt. Stops automatically on reply or booking.
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
  const router = useRouter();
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
    ...(leadTypes?.FinalExpense?.Active || leadTypes?.LegacyWebsite?.Active ? [{ key: 'LegacyFex', label: 'Final Expense/Legacy Leads' }] : []),
    ...(leadTypes?.OctavianMortgage?.Active || leadTypes?.LegacyMortgage?.Active ? [{ key: 'MortgageLeads', label: 'Mortgage Leads' }] : []),
  ];

  return (
    <DashboardContent>
      <Box
        sx={{
          mb: 3,
          gap: 2,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ mb: 0.5 }}>
            Agent Resources
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Resources for working your leads
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push(paths.dashboard.maximizeContactRate)}
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
        >
          Maximize Your Contact Rate
        </Button>
      </Box>

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

      {availableTabs[currentTab]?.key === 'VeteranWebsite' && <VeteranResources />}

      {availableTabs[currentTab]?.key === 'MortgageLeads' && <MortgageResources />}

      {availableTabs[currentTab]?.key === 'LegacyFex' && <LegacyFexResources />}

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
