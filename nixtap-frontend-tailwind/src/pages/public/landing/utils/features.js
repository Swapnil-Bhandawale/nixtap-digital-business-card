import {
  UserSearch,
  ScanEye,
  Tags,
  Wifi,
  RefreshCcw,
  Send,
  QrCode,
  Wallet,
  LayoutGrid,
  Radio,
} from 'lucide-react'

export const connectionFeatures = [
  {
    title: 'Auto-enrichment',
    description: 'Add LinkedIn profiles, emails, job titles, and phone numbers automatically.',
    icon: UserSearch,
  },
  {
    title: 'AI card scanner',
    description: 'Scan physical paper cards and convert them into digital contacts instantly with AI.',
    icon: ScanEye,
  },
  {
    title: 'Notes, tags & reminders',
    description: 'Tag contacts by event, add personal notes, and organize your network with ease.',
    icon: Tags,
  },
  {
    title: 'Capture leads anywhere',
    description: 'Collect contacts at events or conferences, even offline without Wi-Fi.',
    icon: Wifi,
  },
  {
    title: 'One-click CRM sync',
    description: 'Push contacts directly into Salesforce, HubSpot, and Pipedrive — no manual entry.',
    icon: RefreshCcw,
  },
  {
    title: 'Automated follow-ups',
    description: 'Trigger personalized email or SMS follow-ups the moment you connect.',
    icon: Send,
  },
]

export const shareMethods = [
  {
    title: 'Custom QR code',
    description: 'Share your profile with a quick scan. No app required for recipients.',
    icon: QrCode,
    link: 'Learn more',
  },
  {
    title: 'Apple & Google Wallet',
    description: 'Add your card directly to Apple or Google Wallet for easy access, even offline.',
    icon: Wallet,
    link: 'Learn more',
  },
  {
    title: 'Home screen widget',
    description: 'Pin your QR code to your home screen — the fastest way to share on the go.',
    icon: LayoutGrid,
    link: 'Learn more',
  },
  {
    title: 'NFC business cards',
    description: 'Tap to share. Transfer your contact info to any smartphone instantly.',
    icon: Radio,
    link: 'Shop now',
  },
]
