import bennieIcon from '../assets/bennie-icon.png'
import leoraIcon from '../assets/leora-icon.png'
import momIcon from '../assets/mom-icon.png'
import ggIcon from '../assets/gg-icon.png'

// The four members of S³. Names + colors are hardcoded on purpose:
// no sign-up, no admin screen, nothing for anyone to manage.
// Each person has a bold `color`, a `soft` tint, and an `icon`.
export const PEOPLE = [
  { name: 'Bennie', color: '#7CC47F', soft: '#E3F3E4', icon: bennieIcon },
  { name: 'Leora',  color: '#F06292', soft: '#FCE4EC', icon: leoraIcon },
  { name: 'Mom',    color: '#F542D7', soft: '#FCE4F0', icon: momIcon },
  { name: 'Gg',     color: '#F0A45E', soft: '#FDEED9', icon: ggIcon },
]

export const personByName = (name) => PEOPLE.find((p) => p.name === name)
