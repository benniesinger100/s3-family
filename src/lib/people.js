// The four members of S³. Names + colors are hardcoded on purpose:
// no sign-up, no admin screen, nothing for anyone to manage.
// Each person has a bold `color` and a `soft` tint used for panel backgrounds.
export const PEOPLE = [
  { name: 'Bennie', color: '#7CC47F', soft: '#E3F3E4' },
  { name: 'Leora',  color: '#E26D8A', soft: '#FBE2E9' },
  { name: 'Mom',    color: '#F3A8C0', soft: '#FDEAF1' },
  { name: 'Gg',     color: '#F0A45E', soft: '#FDEED9' },
]

export const personByName = (name) => PEOPLE.find((p) => p.name === name)
