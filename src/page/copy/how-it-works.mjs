// Copy for the how-it-works module. The eyebrow, the headline and the three
// titles are Richard's, 2026-10-08. The three one-line descriptions were written
// here with the copywriting skill and the brand bible's §7 voice.
export const variants = {
  A: {
    eyebrow: 'The process',
    heading: 'How it works',
    steps: [
      { title: 'Enter their details', line: 'Their date of birth, the time, and the place.' },
      { title: 'The cauldron', line: 'We cook up their Compass from the night they were born.' },
      { title: 'Open their Compass', line: 'One page about your child, waiting in your portal.' },
    ],
  },
  // home page, 2026-10-16: the Statistics section. Each figure is from a survey
  // or study, named in its line. Richard has not yet approved the wording.
  S: {
    eyebrow: 'Statistics',
    heading: 'It\'s not looking good',
    steps: [
      { title: '8 h 39 min', line: 'On screens every day, outside school and homework, for the average American teenager. Common Sense Media, 2021.' },
      { title: '37%', line: 'Of American children aged 3 to 5 play outdoors for an hour or less on a weekday. CDC, National Survey of Children\'s Health, 2021.' },
      { title: '49.8%', line: 'Of the world is projected to be short-sighted by 2050, with less time outdoors named as a cause. Ophthalmology, 2016.' },
    ],
  },
  // home page, 2026-10-16: lorem ipsum until Richard writes it
  L: {
    eyebrow: 'Lorem ipsum',
    heading: 'Lorem ipsum dolor',
    steps: [
      { title: 'Lorem ipsum', line: 'Lorem ipsum dolor sit amet, consectetur.' },
      { title: 'Dolor sit amet', line: 'Sed do eiusmod tempor incididunt ut labore.' },
      { title: 'Consectetur', line: 'Ut enim ad minim veniam, quis nostrud.' },
    ],
  },
};
