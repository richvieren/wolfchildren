// transits.mjs — the transits product page. Rewritten 2026-09-23 (Richard): Transits is one
// product, a full year, and the three-month version is gone. The year runs from intake, so a
// parent buying in March starts in March.
//
// What the page may promise is what the product does, and no more. The weekly note lives in the
// portal; the weekly email says it is there and carries nothing about the child (spec §10: no
// child name and no reading content leaves the server). Price comes from the registry.
import { readingPage } from '../lib/reading-page.mjs';

// The live Stripe Payment Link (plink_1UFYiyED8VMwHJ64dYBNguCQ, created 2026-09-14 by stripe_sync.py --links --live).
// The price behind it moves with the catalog; the link id does not.
const page = readingPage({
  slug: 'transits',
  checkoutUrl: 'https://buy.stripe.com/cNibJ1ghw4wcdsGeSG1kA08',
  description: 'A year of transits for your child: one report covering twelve months from the day you give the details, and a note for every one of the fifty-two weeks, in your portal.',
  bannerLine: 'a year for your child, and a note every week',
  eyebrowLine: 'one child · twelve months',
  hero: {
    h1: 'A year of your child’s sky, and a note for every week of it.',
    sub: 'Transits reads where the planets move over the twelve months from the day you give the details, against your child’s own birth chart. You get one report for the year, and then a note each week in your portal, with an email to tell you it is there.',
    bullets: [
      'The long thread: the one or two slow movements that run through the whole year, named early, so a long stretch of change is one thing and not a run of bad weeks',
      'The year in four movements, each with its own dates, so you can read ahead to the stretch that matters',
      'A note every week for fifty-two weeks, short, in your portal, about the week your child is actually in',
      'The quiet weeks named as quiet, because most years hold about ten of them and pretending otherwise helps nobody',
    ],
  },
  needsHeading: 'The birth details and three answers.',
  needs: [
    { name: 'Date and place', key: true, tag: 'The birth time helps but is not required', line: 'The birth date and the place, chosen from a list. With the time, the reading can also say where in the chart each movement lands.' },
    { name: 'What has changed', line: 'What has changed in your child over the last few months?' },
    { name: 'What is coming', line: 'What is coming up this year that will matter to your child?' },
    { name: 'What is harder', line: 'What is your child finding harder than usual right now?' },
  ],
  insideHeading: 'What is in the report, in the order you read it.',
  inside: [
    { title: 'The year in one page', line: 'What this year asks of your child, and the few dates that carry it.' },
    { title: 'The year in four movements', line: 'Four stretches, named by what is moving rather than by the calendar, each with its own dates.' },
    { title: 'The long thread', line: 'The slow movement that runs through most of the year: what it is, when it is closest, and what it is not.' },
    { title: 'The moments', line: 'The weeks that carry something of their own, each in a paragraph, with the dates to put on the fridge.' },
    { title: 'The quiet stretches', line: 'The weeks where nothing peaks, named, with what they are good for.' },
    { title: 'What does not change this year', line: 'The chart your child was born with, under all of it, so the year reads as weather over open country.' },
    { title: 'The year’s own question', line: 'One question for you, from the chart. A question, never an instruction.' },
    { title: 'The transits, explained', line: 'Every placement named in the report, set out plainly at the end.' },
  ],
  tagline: 'One year, one report, fifty-two weekly notes.',
  includes: [
    'The report itself, eighteen to twenty-six pages, written for your child’s next twelve months',
    'A note for each of the fifty-two weeks, in your portal, with an email each week to say it is there',
    'Your three answers, read against the chart',
    'A page of questions to keep reading it with Claude or ChatGPT',
    'Your private portal, sign-in by email link. You can stop the weekly emails at any time and the report stays yours',
  ],
  photos: {
    hero: { intent: 'A child walking a path in changing weather, seen from behind; the season visible in the light.' },
    heroDetail: { intent: 'A detail from the same walk: boots on wet leaves, a hand on a gate.' },
    band: { intent: 'A long field under a moving sky, one child far off.' },
    inside: { intent: 'The Transits report open on a phone beside a paper calendar on a table.', crop: 'landscape, close, the phone screen readable' },
    offer: { intent: 'A parent reading at a kitchen table in the morning, a school bag by the door.', crop: 'landscape, morning light' },
  },
  final: { heading: 'Read the year before you are in it.', sub: 'One report, and a note every week.' },
});

export const path = page.path;
export const title = page.title;
export const description = page.description;
export const indexable = page.indexable;
export const sections = page.sections;
