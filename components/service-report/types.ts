export type Machine = {
  model: string
  serial: string
  issue: string
  capacity: string
  type: string
  location: string
}

export type Part = {
  name: string
  quantity: string
  remarks: string
}

export type ServiceReportData = {
  customerName: string
  date: string
  location: string
  serviceReportNo: string
  contactPerson: string
  phone: string
  serviceTypes: string[]
  otherServiceType: string
  machines: Machine[]
  serviceDetails: string
  parts: Part[]
  technicianRemarks: string
  nextDueDate: string
  technicianSignature: string
  customerSiteName: string
  customerSiteSignature: string
  customerSignatureSeal: string
}

export const emptyMachine = (): Machine => ({ model: '', serial: '', issue: '', capacity: '', type: '', location: '' })
export const emptyPart = (): Part => ({ name: '', quantity: '', remarks: '' })

export const initialReport: ServiceReportData = {
  customerName: '', date: '', location: '', serviceReportNo: '', contactPerson: '', phone: '',
  serviceTypes: [], otherServiceType: '', machines: [emptyMachine()], serviceDetails: '', parts: [emptyPart()],
  technicianRemarks: '', nextDueDate: '', technicianSignature: '', customerSiteName: '',
  customerSiteSignature: '', customerSignatureSeal: '',
}