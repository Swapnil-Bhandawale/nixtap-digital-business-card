import {
  Layers,
  RefreshCcw,
  Keyboard,
  BellOff,
  Recycle,
  ScanLine,
} from 'lucide-react'

export const trustLogos = [
  'Orbitel', 'Nimbus Labs', 'Solace', 'Vertex Group', 'Quanta', 'Halcyon',
  'Meridian', 'Cobalt & Co', 'Northwind', 'Ferro Works',
]

export const painPoints = [
  {
    title: 'Stacks of paper cards collecting dust',
    description: 'Piles of business cards end up in drawers and never make it into your workflow.',
    icon: Layers,
  },
  {
    title: "Outdated info you can't update",
    description: 'Printed cards are static — titles, numbers, and emails change, leaving them instantly stale.',
    icon: RefreshCcw,
  },
  {
    title: 'Manually typing CRM data after events',
    description: 'Hours wasted entering contact details instead of focusing on real sales activity.',
    icon: Keyboard,
  },
  {
    title: 'Forgetting to follow up with new contacts',
    description: 'By the time you remember, the lead has gone cold or moved on.',
    icon: BellOff,
  },
  {
    title: 'Reprinting cards is costly and wasteful',
    description: 'Printing costs add up quickly, and your cards go stale the moment something changes.',
    icon: Recycle,
  },
  {
    title: "Generic scanners that don't sync",
    description: "You're left exporting spreadsheets or losing data in the process.",
    icon: ScanLine,
  },
]
