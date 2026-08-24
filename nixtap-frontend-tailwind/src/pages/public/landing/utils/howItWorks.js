import {
  UserPlus,
  QrCode,
  RefreshCw,
  Smartphone,
  ShieldCheck,
  Sparkles,
  Leaf,
} from 'lucide-react'

export const steps = [
  {
    label: 'Create',
    title: 'Design your card in minutes',
    description:
      'Build a professional digital business card in minutes. Customize colors, add your contact details, and update them anytime — no reprints, ever.',
    icon: UserPlus,
  },
  {
    label: 'Share',
    title: 'Connect with anyone in seconds',
    description:
      'Use your QR code, NFC card, or Apple/Google Wallet pass to share your contact info with any iOS or Android device instantly.',
    icon: QrCode,
  },
  {
    label: 'Capture & Sync',
    title: 'Never forget a face',
    description:
      'Add notes and follow-up reminders to every new connection, or sync straight to your CRM so no lead is ever left behind.',
    icon: RefreshCw,
  },
]

export const highlights = [
  {
    title: 'No app required',
    description: 'Recipients view your card instantly in their browser — no download or account needed.',
    icon: Smartphone,
  },
  {
    title: 'Trusted & secure',
    description: 'Rated 4.9/5 by over 150,000 professionals using Nixtap every day.',
    icon: ShieldCheck,
  },
  {
    title: 'Create in minutes',
    description: 'Design your free digital card right now and start sharing immediately.',
    icon: Sparkles,
  },
  {
    title: '100% eco-friendly',
    description: 'Cut your carbon footprint and stop wasting money reprinting paper cards.',
    icon: Leaf,
  },
]
