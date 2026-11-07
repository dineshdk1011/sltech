export type EnquiryRecord = Record<string, unknown>

export type SortColumn = 'contact' | 'enquiry' | 'location' | 'status' | 'received'
export type SortDirection = 'asc' | 'desc'

export const getText = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'object') {
    const objectValue = value as Record<string, unknown>
    return String(objectValue.name ?? objectValue.label ?? objectValue.value ?? '—')
  }
  return String(value)
}

export const getLocation = (enquiry: EnquiryRecord): string => {
  const state = getText(enquiry.state)
  const district = getText(enquiry.district)
  if (state === '—' && district === '—') return '—'
  return [district, state].filter((value) => value !== '—').join(', ')
}

export const getStatus = (enquiry: EnquiryRecord): string => {
  if (enquiry.is_converted === true) return 'Converted'
  if (enquiry.is_connected === true) return 'Connected'
  return 'New'
}

export const getDate = (value: unknown): string => {
  if (!value) return '—'
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) return getText(value)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${day} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`
}

export const getSortValue = (enquiry: EnquiryRecord, column: SortColumn): string | number => {
  if (column === 'contact') return getText(enquiry.name)
  if (column === 'enquiry') return `${getText(enquiry.enquiry_type)} ${getText(enquiry.enquiry)}`
  if (column === 'location') return getLocation(enquiry)
  if (column === 'status') return getStatus(enquiry)

  const timestamp = enquiry.created_at ? new Date(String(enquiry.created_at)).getTime() : 0
  return Number.isNaN(timestamp) ? getText(enquiry.created_at) : timestamp
}
