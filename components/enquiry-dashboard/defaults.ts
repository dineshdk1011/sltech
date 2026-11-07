import type { SortColumn } from './utils'

export const summaryCardsDefaults = [
  { label: 'Total enquiries', value: 0 },
  { label: 'Showing now', value: 0 },
  { label: 'Converted enquiries', value: 0 },
] as const

export const tableColumnsDefaults: Array<{ label: string; column: SortColumn }> = [
  { label: 'Contact', column: 'contact' },
  { label: 'Enquiry', column: 'enquiry' },
  { label: 'Location', column: 'location' },
  { label: 'Status', column: 'status' },
  { label: 'Received', column: 'received' },
]

export const sortOptionsDefaults: Array<{ label: string; value: SortColumn }> = [
  { label: 'Received', value: 'received' },
  { label: 'Contact', value: 'contact' },
  { label: 'Enquiry', value: 'enquiry' },
  { label: 'Location', value: 'location' },
  { label: 'Status', value: 'status' },
]
