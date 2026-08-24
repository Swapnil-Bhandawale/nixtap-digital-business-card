import {
  IdCard,
  ScanLine,
  MailPlus,
  BookOpen,
  FileText,
  Users2,
  Briefcase,
  HelpCircle,
  MessageCircleMore,
} from 'lucide-react'

export const audienceLinks = [
  {
    label: 'For Teams',
    tag: '3–100',
    description: 'Create, share, and manage digital cards across your whole team.',
    href: '#',
  },
  {
    label: 'For Enterprise',
    tag: '100+',
    description: 'Scale digital identity company-wide with SSO and provisioning.',
    href: '#',
  },
]

export const productLinks = [
  {
    label: 'Digital Business Card',
    description: 'Share your contact info instantly with a tap or scan.',
    href: '#',
    icon: IdCard,
  },
  {
    label: 'Event Lead Capture',
    description: 'Scan badges and sync leads to your CRM in seconds.',
    href: '#',
    icon: ScanLine,
  },
  {
    label: 'Email Signature',
    description: 'Branded signatures for Gmail, Outlook, and Apple Mail.',
    href: '#',
    icon: MailPlus,
  },
]

export const resourceLinks = {
  main: [
    {
      label: 'Blog',
      description: 'Tips, customer stories, and product updates.',
      href: '#',
      icon: BookOpen,
    },
    {
      label: 'Docs',
      description: 'Step-by-step walkthroughs and troubleshooting.',
      href: '#',
      icon: FileText,
    },
  ],
  company: [
    {
      label: 'About Us',
      description: 'Meet the team building Nixtap.',
      href: '#',
      icon: Users2,
    },
    {
      label: 'Careers',
      description: 'Help us build the future of networking.',
      href: '#',
      icon: Briefcase,
    },
    {
      label: 'FAQ',
      description: 'Common questions, answered.',
      href: '#',
      icon: HelpCircle,
    },
    {
      label: 'Contact Us',
      description: 'Talk to a real human on our team.',
      href: '#',
      icon: MessageCircleMore,
    },
  ],
}
