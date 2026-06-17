import bennieIcon from '../assets/bennie-icon.png'

// The four members of S³. Names + colors are hardcoded on purpose:
// no sign-up, no admin screen, nothing for anyone to manage.
// Each person has a bold `color` and a `soft` tint used for panel backgrounds.
export const PEOPLE = [
  { name: 'Bennie', color: '#7CC47F', soft: '#E3F3E4', icon: bennieIcon },
  { name: 'Leora',  color: '#0xFFF06292', soft: '#DEEDF8' },
  { name: 'Mom',    color: '#F3A8C0', soft: '#FDEAF1' },
  { name: 'Gg',     color: '#F0A45E', soft: '#FDEED9' },
]

export const personByName = (name) => PEOPLE.find((p) => p.name === name)
