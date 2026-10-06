// The brand layer: this project's palette and faces, and nothing else. Values
// are the brand bible's (projects/wolf-children/brand-bible.md §2 and §3). A
// second project gets its own file here; nothing else in the system changes.
export const id = 'wolf-children';

export const css = `:root{
  /* bible §2 */
  --b-cream:#DFD7C3; --b-green:#495543; --b-green-deep:#3A4435; --b-tan:#CDB494;
  --b-orange:#DA4635; --b-cta:#AC2E20; --b-bark:#6B4A2F;
  /* two tones this project uses that the bible does not name: the deep ground
     the dark bands sit on, and the paper white inside a photo frame. */
  --b-shell:#333D2F; --b-paper:#F8F5EC;
  /* the muted gold on the rating stars, light grounds only (2.80:1 on cream) */
  --b-gold:#9C7A2B;
  /* bible §3 */
  --b-display:"Morning Memories",sans-serif; --b-body:"Special Elite",monospace;
}`;
