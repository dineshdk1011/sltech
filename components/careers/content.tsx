import {
  GraduationCap,
  Handshake,
  MapPinned,
  Rocket,
  Truck,
  Wrench,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type WhyJoinItem = {
  title: string
  description: string
  icon: LucideIcon
}

export const whyJoinUs: WhyJoinItem[] = [
  {
    title: 'Hands-on Technical Experience',
    description:
      'Work directly with commercial laundry machines, installations and service visits that build real, transferable expertise.',
    icon: Wrench,
  },
  {
    title: 'Career Growth',
    description:
      'Structured progression from field support to senior service and project roles as the business expands.',
    icon: GraduationCap,
  },
  {
    title: 'Work With Industry Experts',
    description:
      'Learn alongside experienced engineers and laundry technology specialists who have supported customers for years.',
    icon: Handshake,
  },
  {
    title: 'Field & Project Opportunities',
    description:
      'Take on installation, commissioning and maintenance projects across commercial laundry operations of every size.',
    icon: Truck,
  },
  {
    title: 'Supportive Team',
    description:
      'A close-knit team that shares knowledge, backs each other on site and celebrates every milestone together.',
    icon: Rocket,
  },
  {
    title: 'Opportunities Across India',
    description:
      'Growing service coverage means new openings for technicians, coordinators and support roles in multiple regions.',
    icon: MapPinned,
  },
]

export const employmentTypeOptions = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Freelance',
]

export const departmentOptions = [
  'Service & Maintenance',
  'Installation & Projects',
  'Sales & Business Development',
  'Operations',
  'Customer Support',
  'Administration',
  'Other',
]