'use client'

import { useState } from 'react'
import { Download, FileSpreadsheet, FileText, LoaderCircle } from 'lucide-react'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import ExcelJS from 'exceljs'

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type Machine = {
  machine_name?: string | null
  model?: string | null
  serial_no?: string | null
  [key: string]: unknown
}

type PartMaterial = {
  name?: string | null
  quantity?: string | number | null
  [key: string]: unknown
}

export type ServiceReport = {
  id: string | number
  service_report_no: string | null

  customer_name: string | null
  date: string | null
  location: string | null
  contact_person: string | null
  phone: string | null

  service_types: string[]
  other_service_type: string | null

  machines: Machine[]

  service_details: string | null

  parts_materials: PartMaterial[]

  technician_remarks: string | null

  next_due_service_date: string | null

  technician_name: string | null
  technician_signature: string | null

  customer_site_incharge_name: string | null
  customer_site_incharge_signature: string | null
  customer_signature_seal: string | null

  created_by: string | number | null
  created_at: string | null
  updated_at: string | null
}

type Props = {
  report: ServiceReport
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatDate(value: string | null | undefined) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function valueOrDash(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return '—'
  }

  return String(value)
}

/* -------------------------------------------------------------------------- */
/* PDF                                                                       */
/* -------------------------------------------------------------------------- */

async function exportPDF(report: ServiceReport) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = doc.internal.pageSize.getWidth()

  /*
   * Theme colors matching your service report UI.
   */
  const NAVY: [number, number, number] = [0, 43, 139]
  const BLUE: [number, number, number] = [18, 95, 208]
  const LIGHT_BLUE: [number, number, number] = [239, 246, 255]
  const SLATE: [number, number, number] = [71, 85, 105]
  const LIGHT_SLATE: [number, number, number] = [241, 245, 249]
  const BORDER: [number, number, number] = [226, 232, 240]
  const GREEN: [number, number, number] = [22, 163, 74]

  let y = 18

  /* ---------------------------------------------------------------------- */
  /* Header                                                                 */
  /* ---------------------------------------------------------------------- */

  doc.setFillColor(...NAVY)
  doc.rect(0, 0, pageWidth, 4, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...BLUE)

  doc.text('SERVICE REPORT', 14, y)

  y += 8

  doc.setFontSize(22)
  doc.setTextColor(...NAVY)

  doc.text('Report Details', 14, y)

  /* Report number box */

  const reportBoxWidth = 55

  doc.setFillColor(...LIGHT_BLUE)
  doc.roundedRect(
    pageWidth - reportBoxWidth - 14,
    12,
    reportBoxWidth,
    25,
    3,
    3,
    'F',
  )

  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...SLATE)

  doc.text(
    'REPORT NUMBER',
    pageWidth - reportBoxWidth - 9,
    20,
  )

  doc.setFontSize(11)
  doc.setTextColor(...NAVY)

  doc.text(
    valueOrDash(report.service_report_no),
    pageWidth - reportBoxWidth - 9,
    28,
  )

  y += 9

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...SLATE)

  doc.text(
    'Detailed service visit record, work completed, materials used,',
    14,
    y,
  )

  doc.text(
    'recommendations, and customer acknowledgement.',
    14,
    y + 5,
  )

  y += 18

  /* ---------------------------------------------------------------------- */
  /* Summary boxes                                                          */
  /* ---------------------------------------------------------------------- */

  const summaryWidth = (pageWidth - 28 - 8) / 3

  const summaries = [
    {
      label: 'SERVICE DATE',
      value: formatDate(report.date),
    },
    {
      label: 'CUSTOMER',
      value: valueOrDash(report.customer_name),
    },
    {
      label: 'TECHNICIAN',
      value: valueOrDash(report.technician_name),
    },
  ]

  summaries.forEach((item, index) => {
    const x = 14 + index * (summaryWidth + 4)

    doc.setDrawColor(...BORDER)
    doc.setFillColor(255, 255, 255)

    doc.roundedRect(
      x,
      y,
      summaryWidth,
      24,
      2,
      2,
      'FD',
    )

    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...SLATE)

    doc.text(item.label, x + 5, y + 7)

    doc.setFontSize(9)
    doc.setTextColor(...NAVY)

    const value =
      item.value.length > 28
        ? `${item.value.substring(0, 28)}...`
        : item.value

    doc.text(value, x + 5, y + 16)
  })

  y += 33

  /* ---------------------------------------------------------------------- */
  /* Section helper                                                         */
  /* ---------------------------------------------------------------------- */

  const sectionTitle = (title: string) => {
    doc.setFillColor(...NAVY)

    doc.roundedRect(
      14,
      y,
      pageWidth - 28,
      8,
      2,
      2,
      'F',
    )

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(255, 255, 255)

    doc.text(title.toUpperCase(), 18, y + 5.5)

    y += 13
  }

  /* ---------------------------------------------------------------------- */
  /* Customer Details                                                       */
  /* ---------------------------------------------------------------------- */

  sectionTitle('Customer Details')

  autoTable(doc, {
    startY: y,
    margin: {
      left: 14,
      right: 14,
    },
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      textColor: SLATE,
      cellPadding: 4,
      lineColor: BORDER,
      lineWidth: 0.25,
    },
    headStyles: {
      fillColor: LIGHT_SLATE,
      textColor: SLATE,
      fontStyle: 'bold',
    },
    body: [
      [
        'Customer Name',
        valueOrDash(report.customer_name),
        'Contact Person',
        valueOrDash(report.contact_person),
      ],
      [
        'Phone',
        valueOrDash(report.phone),
        'Location',
        valueOrDash(report.location),
      ],
      [
        'Service Date',
        formatDate(report.date),
        'Report Number',
        valueOrDash(report.service_report_no),
      ],
    ],
    columnStyles: {
      0: {
        cellWidth: 34,
        fontStyle: 'bold',
      },
      1: {
        cellWidth: 56,
      },
      2: {
        cellWidth: 34,
        fontStyle: 'bold',
      },
      3: {
        cellWidth: 'auto',
      },
    },
  })

  y = (doc as any).lastAutoTable.finalY + 8

  /* ---------------------------------------------------------------------- */
  /* Service Type                                                           */
  /* ---------------------------------------------------------------------- */

  sectionTitle('Service Type')

  const serviceTypes =
    report.service_types?.length
      ? report.service_types.join('  •  ')
      : 'No service type recorded'

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...SLATE)

  const serviceTypeLines = doc.splitTextToSize(
    serviceTypes,
    pageWidth - 36,
  )

  doc.text(serviceTypeLines, 18, y + 2)

  y += Math.max(10, serviceTypeLines.length * 5 + 3)

  if (report.other_service_type) {
    doc.setFont('helvetica', 'bold')
    doc.text(
      `Other: ${report.other_service_type}`,
      18,
      y,
    )

    y += 6
  }

  /* ---------------------------------------------------------------------- */
  /* Machine Details                                                        */
  /* ---------------------------------------------------------------------- */

  sectionTitle('Machine Details')

  const machineRows =
    report.machines?.length
      ? report.machines.map((machine) => [
        valueOrDash(machine.machine_name),
        valueOrDash(machine.model),
        valueOrDash(machine.serial_no),
      ])
      : [['—', '—', '—']]

  autoTable(doc, {
    startY: y,
    margin: {
      left: 14,
      right: 14,
    },
    theme: 'grid',
    head: [
      [
        'Machine Name',
        'Model',
        'Serial Number',
      ],
    ],
    body: machineRows,
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      textColor: SLATE,
      cellPadding: 4,
      lineColor: BORDER,
      lineWidth: 0.25,
    },
    headStyles: {
      fillColor: BLUE,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
  })

  y = (doc as any).lastAutoTable.finalY + 8

  /* ---------------------------------------------------------------------- */
  /* Service Details                                                        */
  /* ---------------------------------------------------------------------- */

  sectionTitle('Service Details')

  const serviceText =
    report.service_details ||
    'No service details were recorded.'

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...SLATE)

  const serviceLines = doc.splitTextToSize(
    serviceText,
    pageWidth - 36,
  )

  const serviceBoxHeight =
    Math.max(18, serviceLines.length * 5 + 10)

  doc.setDrawColor(...BORDER)
  doc.setFillColor(255, 255, 255)

  doc.roundedRect(
    14,
    y,
    pageWidth - 28,
    serviceBoxHeight,
    2,
    2,
    'FD',
  )

  doc.text(serviceLines, 19, y + 8)

  y += serviceBoxHeight + 8

  /* ---------------------------------------------------------------------- */
  /* Parts / Materials                                                      */
  /* ---------------------------------------------------------------------- */

  sectionTitle('Parts / Materials Used')

  const partRows =
    report.parts_materials?.length
      ? report.parts_materials.map((part) => [
        valueOrDash(part.name),
        valueOrDash(part.quantity),
      ])
      : [['—', '—']]

  autoTable(doc, {
    startY: y,
    margin: {
      left: 14,
      right: 14,
    },
    theme: 'grid',
    head: [
      [
        'Part / Material',
        'Quantity',
      ],
    ],
    body: partRows,
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      textColor: SLATE,
      cellPadding: 4,
      lineColor: BORDER,
      lineWidth: 0.25,
    },
    headStyles: {
      fillColor: BLUE,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
  })

  y = (doc as any).lastAutoTable.finalY + 8

  /* ---------------------------------------------------------------------- */
  /* Technician Remarks                                                     */
  /* ---------------------------------------------------------------------- */

  sectionTitle('Technician Remarks / Recommendations')

  const remarks =
    report.technician_remarks ||
    'No remarks or recommendations were provided.'

  const remarkLines = doc.splitTextToSize(
    remarks,
    pageWidth - 36,
  )

  const remarksHeight =
    Math.max(18, remarkLines.length * 5 + 10)

  doc.setDrawColor(...BORDER)
  doc.setFillColor(255, 255, 255)

  doc.roundedRect(
    14,
    y,
    pageWidth - 28,
    remarksHeight,
    2,
    2,
    'FD',
  )

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...SLATE)

  doc.text(remarkLines, 19, y + 8)

  y += remarksHeight + 8

  /* ---------------------------------------------------------------------- */
  /* Service Completion                                                     */
  /* ---------------------------------------------------------------------- */

  sectionTitle('Service Completion')

  autoTable(doc, {
    startY: y,
    margin: {
      left: 14,
      right: 14,
    },
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      textColor: SLATE,
      cellPadding: 4,
      lineColor: BORDER,
      lineWidth: 0.25,
    },
    body: [
      [
        'Technician',
        valueOrDash(report.technician_name),
        'Next Due Service',
        formatDate(report.next_due_service_date),
      ],
    ],
    columnStyles: {
      0: {
        cellWidth: 34,
        fontStyle: 'bold',
      },
      1: {
        cellWidth: 56,
      },
      2: {
        cellWidth: 34,
        fontStyle: 'bold',
      },
      3: {
        cellWidth: 'auto',
      },
    },
  })

  y = (doc as any).lastAutoTable.finalY + 8

  /* ---------------------------------------------------------------------- */
  /* Customer Acknowledgement                                               */
  /* ---------------------------------------------------------------------- */

  sectionTitle('Customer Acknowledgement')

  autoTable(doc, {
    startY: y,
    margin: {
      left: 14,
      right: 14,
    },
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      textColor: SLATE,
      cellPadding: 4,
      lineColor: BORDER,
      lineWidth: 0.25,
    },
    body: [
      [
        'Customer Site In-charge',
        valueOrDash(
          report.customer_site_incharge_name,
        ),
      ],
      [
        'Site In-charge Signature',
        report.customer_site_incharge_signature
          ? 'Provided'
          : 'Not provided',
      ],
      [
        'Customer Signature / Seal',
        report.customer_signature_seal
          ? 'Provided'
          : 'Not provided',
      ],
    ],
    columnStyles: {
      0: {
        cellWidth: 60,
        fontStyle: 'bold',
      },
      1: {
        cellWidth: 'auto',
      },
    },
  })

  y = (doc as any).lastAutoTable.finalY + 8

  /* ---------------------------------------------------------------------- */
  /* Footer                                                                 */
  /* ---------------------------------------------------------------------- */

  const pageCount = doc.getNumberOfPages()

  for (let page = 1; page <= pageCount; page++) {
    doc.setPage(page)

    const height = doc.internal.pageSize.getHeight()

    doc.setDrawColor(...BORDER)
    doc.line(14, height - 14, pageWidth - 14, height - 14)

    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...SLATE)

    doc.text(
      `Service Report ${valueOrDash(
        report.service_report_no,
      )}`,
      14,
      height - 8,
    )

    doc.text(
      `Page ${page} of ${pageCount}`,
      pageWidth - 14,
      height - 8,
      {
        align: 'right',
      },
    )
  }

  /* ---------------------------------------------------------------------- */
  /* Download                                                               */
  /* ---------------------------------------------------------------------- */

  const filename = report.service_report_no
    ? `${report.service_report_no}.pdf`
    : 'service-report.pdf'

  doc.save(filename)
}

/* -------------------------------------------------------------------------- */
/* EXCEL                                                                      */
/* -------------------------------------------------------------------------- */

async function exportExcel(report: ServiceReport) {
  const workbook = new ExcelJS.Workbook()

  workbook.creator = 'Service Report System'
  workbook.created = new Date()

  const worksheet = workbook.addWorksheet(
    'Service Report',
  )

  /* ---------------------------------------------------------------------- */
  /* Worksheet setup                                                        */
  /* ---------------------------------------------------------------------- */

  worksheet.views = [
    {
      showGridLines: false,
    },
  ]

  worksheet.columns = [
    {
      width: 19,
    },
    {
      width: 19,
    },
    {
      width: 22,
    },
    {
      width: 22,
    },
  ]

  /* ---------------------------------------------------------------------- */
  /* Company Header                                                         */
  /* ---------------------------------------------------------------------- */

  worksheet.mergeCells('A1:D1')
  worksheet.mergeCells('A2:D9')

  worksheet.getRow(1).height = 22

  for (let row = 2; row <= 9; row++) {
    worksheet.getRow(row).height = 16
  }

  worksheet.getRow(10).height = 8
  worksheet.getRow(12).height = 8
  worksheet.getRow(13).height = 34
  worksheet.getRow(14).height = 8

  const logoCell = worksheet.getCell('A2')

  const logoResponse = await fetch('/SL-Logo.png')

  if (!logoResponse.ok) {
    throw new Error('Failed to load the company logo.')
  }

  const logoBlob = await logoResponse.blob()
  const logoBase64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(logoBlob)
  })

  const logoImageId = workbook.addImage({
    base64: logoBase64,
    extension: 'png',
  })

  worksheet.addImage(logoImageId, {
    tl: { col: 1.57, row: 1.25 },
    ext: { width: 160, height: 160 },
  })

  logoCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: {
      argb: 'FFFFFF',
    },
  }

  logoCell.border = {
    top: {
      style: 'thin',
      color: {
        argb: 'CBD5E1',
      },
    },
    bottom: {
      style: 'thin',
      color: {
        argb: 'CBD5E1',
      },
    },
    left: {
      style: 'thin',
      color: {
        argb: 'CBD5E1',
      },
    },
    right: {
      style: 'thin',
      color: {
        argb: 'CBD5E1',
      },
    },
  }

  const dateCell = worksheet.getCell('A1')

  dateCell.value = `Date: ${formatDate(report.date)}`

  dateCell.font = {
    name: 'Arial',
    size: 10,
    bold: true,
    color: {
      argb: '475569',
    },
  }

  dateCell.alignment = {
    horizontal: 'right',
    vertical: 'middle',
  }

  /* ---------------------------------------------------------------------- */
  /* Report Title                                                           */
  /* ---------------------------------------------------------------------- */

  worksheet.mergeCells('A11:D11')

  const title = worksheet.getCell('A11')

  title.value = 'SERVICE REPORT'

  title.font = {
    name: 'Arial',
    size: 18,
    bold: true,
    color: {
      argb: 'FFFFFF',
    },
  }

  title.alignment = {
    horizontal: 'center',
    vertical: 'middle',
  }

  title.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: {
      argb: '002B8B',
    },
  }

  worksheet.getRow(11).height = 30

  /* ---------------------------------------------------------------------- */
  /* Report Number                                                          */
  /* ---------------------------------------------------------------------- */

  worksheet.mergeCells('A13:B13')
  worksheet.mergeCells('C13:D13')

  const reportNumberLabel = worksheet.getCell('A13')
  const reportNumberValue = worksheet.getCell('C13')

  reportNumberLabel.value = 'Report Number'
  reportNumberValue.value =
    report.service_report_no || '—'

  reportNumberLabel.font = {
    bold: true,
    color: {
      argb: '475569',
    },
  }

  reportNumberLabel.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: {
      argb: 'F1F5F9',
    },
  }

  reportNumberLabel.alignment = {
    horizontal: 'left',
    vertical: 'middle',
  }

  reportNumberValue.font = {
    bold: true,
    color: {
      argb: '002B8B',
    },
  }

  reportNumberValue.alignment = {
    horizontal: 'left',
    vertical: 'middle',
  }

  /* ---------------------------------------------------------------------- */
  /* Section helper                                                         */
  /* ---------------------------------------------------------------------- */

  let row = 15

  const addSection = (title: string) => {
    worksheet.mergeCells(`A${row}:D${row}`)

    const cell = worksheet.getCell(`A${row}`)

    cell.value = title

    cell.font = {
      name: 'Arial',
      size: 11,
      bold: true,
      color: {
        argb: 'FFFFFF',
      },
    }

    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {
        argb: '125FD0',
      },
    }

    cell.alignment = {
      horizontal: 'left',
      vertical: 'middle',
    }

    worksheet.getRow(row).height = 22

    row++
  }

  const addKeyValue = (
    label: string,
    value: unknown,
  ) => {
    worksheet.getCell(`A${row}`).value = label
    worksheet.mergeCells(`B${row}:D${row}`)

    worksheet.getCell(`B${row}`).value =
      valueOrDash(value)

    worksheet.getCell(`A${row}`).font = {
      bold: true,
      color: {
        argb: '475569',
      },
    }

    worksheet.getCell(`B${row}`).font = {
      color: {
        argb: '1E293B',
      },
    }

    worksheet.getCell(`A${row}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {
        argb: 'F8FAFC',
      },
    }

    row++
  }

  /* ---------------------------------------------------------------------- */
  /* Customer Details                                                       */
  /* ---------------------------------------------------------------------- */

  addSection('CUSTOMER DETAILS')

  addKeyValue(
    'Customer Name',
    report.customer_name,
  )

  addKeyValue(
    'Contact Person',
    report.contact_person,
  )

  addKeyValue(
    'Phone',
    report.phone,
  )

  addKeyValue(
    'Location',
    report.location,
  )

  addKeyValue(
    'Service Date',
    formatDate(report.date),
  )

  addKeyValue(
    'Service Report Number',
    report.service_report_no,
  )

  row++

  /* ---------------------------------------------------------------------- */
  /* Service Type                                                           */
  /* ---------------------------------------------------------------------- */

  addSection('SERVICE TYPE')

  addKeyValue(
    'Service Type',
    report.service_types?.join(', '),
  )

  if (report.other_service_type) {
    addKeyValue(
      'Other Service Type',
      report.other_service_type,
    )
  }

  row++

  /* ---------------------------------------------------------------------- */
  /* Machine Details                                                        */
  /* ---------------------------------------------------------------------- */

  addSection('MACHINE DETAILS')

  worksheet.getCell(`A${row}`).value = 'Machine Name'
  worksheet.getCell(`B${row}`).value = 'Model'
  worksheet.getCell(`C${row}`).value = 'Serial Number'
  worksheet.getCell(`D${row}`).value = 'Additional Details'

    ;['A', 'B', 'C', 'D'].forEach((column) => {
      const cell = worksheet.getCell(`${column}${row}`)

      cell.font = {
        bold: true,
        color: {
          argb: 'FFFFFF',
        },
      }

      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: '0E4FAF',
        },
      }

      cell.alignment = {
        horizontal: 'left',
        vertical: 'middle',
      }
    })

  row++

  if (report.machines?.length) {
    report.machines.forEach((machine) => {
      worksheet.getCell(`A${row}`).value =
        machine.machine_name || '—'

      worksheet.getCell(`B${row}`).value =
        machine.model || '—'

      worksheet.getCell(`C${row}`).value =
        machine.serial_no || '—'

      /*
       * If you later add additional machine fields,
       * they will appear here automatically.
       */
      const extraFields = Object.entries(machine)
        .filter(
          ([key]) =>
            ![
              'machine_name',
              'model',
              'serial_no',
            ].includes(key),
        )
        .filter(
          ([, value]) =>
            value !== null &&
            value !== undefined &&
            value !== '',
        )
        .map(
          ([key, value]) =>
            `${key}: ${valueOrDash(value)}`,
        )
        .join('\n')

      worksheet.getCell(`D${row}`).value =
        extraFields || '—'

      row++
    })
  } else {
    worksheet.getCell(`A${row}`).value = 'No machines recorded'
    worksheet.mergeCells(`A${row}:D${row}`)
    row++
  }

  row++

  /* ---------------------------------------------------------------------- */
  /* Service Details                                                        */
  /* ---------------------------------------------------------------------- */

  addSection('SERVICE DETAILS')

  addKeyValue(
    'Work Performed',
    report.service_details,
  )

  row++

  /* ---------------------------------------------------------------------- */
  /* Parts / Materials                                                      */
  /* ---------------------------------------------------------------------- */

  addSection('PARTS / MATERIALS USED')

  worksheet.getCell(`A${row}`).value = 'Part / Material'
  worksheet.getCell(`B${row}`).value = 'Quantity'
  worksheet.mergeCells(`C${row}:D${row}`)
  worksheet.getCell(`C${row}`).value = 'Additional Details'

    ;['A', 'B', 'C'].forEach((column) => {
      const cell = worksheet.getCell(`${column}${row}`)

      cell.font = {
        bold: true,
        color: {
          argb: 'FFFFFF',
        },
      }

      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: '0E4FAF',
        },
      }
    })

  row++

  if (report.parts_materials?.length) {
    report.parts_materials.forEach((part) => {
      worksheet.getCell(`A${row}`).value =
        part.name || '—'

      worksheet.getCell(`B${row}`).value =
        part.quantity ?? '—'

      worksheet.mergeCells(`C${row}:D${row}`)

      const extraFields = Object.entries(part)
        .filter(
          ([key]) =>
            !['name', 'quantity'].includes(key),
        )
        .filter(
          ([, value]) =>
            value !== null &&
            value !== undefined &&
            value !== '',
        )
        .map(
          ([key, value]) =>
            `${key}: ${valueOrDash(value)}`,
        )
        .join('\n')

      worksheet.getCell(`C${row}`).value =
        extraFields || '—'

      row++
    })
  } else {
    worksheet.getCell(`A${row}`).value =
      'No parts or materials recorded'

    worksheet.mergeCells(`A${row}:D${row}`)

    row++
  }

  row++

  /* ---------------------------------------------------------------------- */
  /* Technician Remarks                                                     */
  /* ---------------------------------------------------------------------- */

  addSection(
    'TECHNICIAN REMARKS / RECOMMENDATIONS',
  )

  addKeyValue(
    'Remarks',
    report.technician_remarks,
  )

  row++

  /* ---------------------------------------------------------------------- */
  /* Service Completion                                                     */
  /* ---------------------------------------------------------------------- */

  addSection('SERVICE COMPLETION')

  addKeyValue(
    'Technician Name',
    report.technician_name,
  )

  addKeyValue(
    'Next Due Service Date',
    formatDate(report.next_due_service_date),
  )

  addKeyValue(
    'Technician Signature',
    report.technician_signature
      ? 'Provided'
      : 'Not provided',
  )

  row++

  /* ---------------------------------------------------------------------- */
  /* Customer Acknowledgement                                              */
  /* ---------------------------------------------------------------------- */

  addSection('CUSTOMER ACKNOWLEDGEMENT')

  addKeyValue(
    'Customer Site In-charge',
    report.customer_site_incharge_name,
  )

  addKeyValue(
    'Site In-charge Signature',
    report.customer_site_incharge_signature
      ? 'Provided'
      : 'Not provided',
  )

  addKeyValue(
    'Customer Signature / Seal',
    report.customer_signature_seal
      ? 'Provided'
      : 'Not provided',
  )

  row++

  /* ---------------------------------------------------------------------- */
  /* Report Information                                                    */
  /* ---------------------------------------------------------------------- */

  addSection('REPORT INFORMATION')

  addKeyValue(
    'Report ID',
    report.id,
  )

  addKeyValue(
    'Created By',
    report.created_by,
  )

  addKeyValue(
    'Created At',
    formatDateTime(report.created_at),
  )

  addKeyValue(
    'Last Updated',
    formatDateTime(report.updated_at),
  )

  /* ---------------------------------------------------------------------- */
  /* Global Styling                                                         */
  /* ---------------------------------------------------------------------- */

  worksheet.eachRow((worksheetRow) => {
    worksheetRow.eachCell((cell) => {
      cell.alignment = {
        ...cell.alignment,
        vertical: cell.alignment?.vertical ?? 'top',
        wrapText: true,
      }

      cell.border = {
        top: {
          style: 'thin',
          color: {
            argb: 'E2E8F0',
          },
        },
        bottom: {
          style: 'thin',
          color: {
            argb: 'E2E8F0',
          },
        },
        left: {
          style: 'thin',
          color: {
            argb: 'E2E8F0',
          },
        },
        right: {
          style: 'thin',
          color: {
            argb: 'E2E8F0',
          },
        },
      }
    })
  })

  /* ---------------------------------------------------------------------- */
  /* Freeze / Print setup                                                   */
  /* ---------------------------------------------------------------------- */

  worksheet.pageSetup = {
    orientation: 'portrait',
    paperSize: 9,
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
  }

  worksheet.views = [
    {
      state: 'frozen',
      ySplit: 10,
      xSplit: 0,
    },
  ]

  worksheet.pageSetup = {
    orientation: 'portrait',
    paperSize: 9,
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,

    margins: {
      left: 0.3,
      right: 0.3,
      top: 0.5,
      bottom: 0.5,
      header: 0.2,
      footer: 0.2,
    },
  }

  /* ---------------------------------------------------------------------- */
  /* Download                                                               */
  /* ---------------------------------------------------------------------- */

  const buffer =
    await workbook.xlsx.writeBuffer()

  const blob = new Blob(
    [buffer],
    {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
  )

  const url = URL.createObjectURL(blob)

  const anchor = document.createElement('a')

  anchor.href = url

  anchor.download = report.service_report_no
    ? `${report.service_report_no}.xlsx`
    : 'service-report.xlsx'

  document.body.appendChild(anchor)

  anchor.click()

  document.body.removeChild(anchor)

  URL.revokeObjectURL(url)
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function ServiceReportExport({
  report,
}: Props) {
  const [isExportingPDF, setIsExportingPDF] =
    useState(false)

  const [isExportingExcel, setIsExportingExcel] =
    useState(false)

  const handlePDF = async () => {
    try {
      setIsExportingPDF(true)

      await exportPDF(report)
    } catch (error) {
      console.error(
        'Failed to export PDF:',
        error,
      )
    } finally {
      setIsExportingPDF(false)
    }
  }

  const handleExcel = async () => {
    try {
      setIsExportingExcel(true)

      await exportExcel(report)
    } catch (error) {
      console.error(
        'Failed to export Excel:',
        error,
      )
    } finally {
      setIsExportingExcel(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* PDF */}
      <button
        type="button"
        onClick={handlePDF}
        disabled={isExportingPDF}
        className="inline-flex h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-[#125FD0] bg-white px-4 text-sm font-semibold text-[#125FD0] transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isExportingPDF ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <FileText className="h-4 w-4" aria-hidden="true" />}

        {isExportingPDF
          ? 'Generating PDF...'
          : 'Download PDF'}
      </button>

      {/* Excel */}
      <button
        type="button"
        onClick={handleExcel}
        disabled={isExportingExcel}
        className="inline-flex h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-[#002B8B] px-4 text-sm font-semibold text-white transition hover:bg-[#001F66] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isExportingExcel ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />}

        {isExportingExcel
          ? 'Generating Excel...'
          : 'Download Excel'}
      </button>
    </div>
  )
}