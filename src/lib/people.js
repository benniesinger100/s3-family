// The four members of S³. Names + colors are hardcoded on purpose:
// no sign-up, no admin screen, nothing for anyone to manage.
// Each person has a bold `color` and a `soft` tint used for panel backgrounds.
export const PEOPLE = [
  { name: 'Bennie', color: '#2F6FE0', soft: '#DCE8FB' },
  { name: 'Leora',  color: '#EF5D6B', soft: '#FBDEE1' },
  { name: 'Mom',    color: '#2FA36B', soft: '#D6EFE1' },
  { name: 'Gg',     color: '#9B5DE0', soft: '#EADCF9' },
]

export const personByName = (name) => PEOPLE.find((p) => p.name === name)
