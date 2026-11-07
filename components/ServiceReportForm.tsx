'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, LoaderCircle, Phone, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { UserCheck, Send, ShieldCheck, } from "lucide-react";
import FormField, { textClass } from './service-report/FormField'
import FormSection from './service-report/FormSection'
import MachineList from './service-report/MachineList'
import PartsList from './service-report/PartsList'
import { useCurrentUser } from './UserContext'

import {
  emptyMachine,
  emptyPart,
  initialReport,
  type Machine,
  type Part,
  type ServiceReportData,
} from './service-report/types'

const serviceOptions = [
  'Routine Visit',
  'Breakdown',
  'Inspection',
  'Installation',
  'AMC',
  'Others',
]

export default function ServiceReportForm() {
  const router = useRouter()
  const {
    allowedUserId,
    authUser,
    name: engineerName,
    email: engineerEmail,
  } = useCurrentUser()
  const [report, setReport] = useState<ServiceReportData>(initialReport)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [customerPhone, setCustomerPhone] = useState("");
  const [otp, setOtp] = useState('')
  const [isOtpVerified, setIsOtpVerified] = useState(false)
  const [otpCountdown, setOtpCountdown] = useState(0)

  const update = <K extends keyof ServiceReportData>(
    key: K,
    value: ServiceReportData[K],
  ) => {
    setReport((current) => ({
      ...current,
      [key]: value,
    }))
  }

  const updateItem = <T,>(
    key: 'machines' | 'parts',
    index: number,
    field: keyof T,
    value: string,
  ) => {
    setReport((current) => ({
      ...current,
      [key]: current[key].map((item, itemIndex) =>
        itemIndex === index
          ? {
            ...item,
            [field]: value,
          }
          : item,
      ),
    }))
  }

  const toggleType = (type: string) => {
    update(
      'serviceTypes',
      report.serviceTypes.includes(type)
        ? report.serviceTypes.filter((item) => item !== type)
        : [...report.serviceTypes, type],
    )
  }

  const handleSendOtp = () => {
    if (otpCountdown > 0) return

    // TODO: Add your OTP sending setup here.
    // Example: call your API/Supabase function to send the OTP to the customer.

    setIsOtpSent(true)
    setIsOtpVerified(false)
    setOtp('')
    setOtpCountdown(60)

    const countdown = window.setInterval(() => {
      setOtpCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(countdown)
          return 0
        }
        return current - 1
      })
    }, 1000)
  }

  const handleVerifyOtp = () => {
    if (!otp.trim()) return

    // TODO: Add your OTP verification setup here.
    // Replace this placeholder with your API/Supabase verification call.
    setIsOtpVerified(true)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setMessage('')
    setError('')
    setIsSaving(true)

    const isLocalDevelopment = process.env.NODE_ENV === 'development'
    const supabase = createClient()

    if (!isLocalDevelopment && !authUser) {
      setError('Your session has expired. Please sign in again.')
      setIsSaving(false)
      return
    }

    try {
      const { error: insertError } = await supabase
        .from('service_reports')
        .insert({
          created_by: allowedUserId,
          service_report_no: report.serviceReportNo || null,
          customer_name: report.customerName,
          date: report.date,
          location: report.location,
          contact_person: report.contactPerson,
          phone: report.phone,
          service_types: report.serviceTypes,
          other_service_type: report.otherServiceType || null,
          machines: report.machines,
          service_details: report.serviceDetails,
          parts_materials: report.parts.filter(
            (part) => part.name || part.quantity || part.remarks,
          ),
          technician_remarks: report.technicianRemarks,
          next_due_service_date: report.nextDueDate || null,
          technician_name: engineerName,
          technician_signature: report.technicianSignature || null,
          customer_site_incharge_name: report.customerSiteName,
          customer_site_incharge_signature:
            report.customerSiteSignature || null,
          customer_signature_seal: report.customerSignatureSeal || null,
          // Mark the new report as active so it passes the is_active = true filter.
          is_active: true,
        })

      if (insertError) {
        setError(
          insertError.message.includes('service_reports')
            ? 'The service report table is not ready yet. Apply the Supabase schema migration and try again.'
            : 'Could not save the service report. Please try again.',
        )
      } else {
        setMessage('Service report saved successfully.')
        setReport(initialReport)
        setIsOtpSent(false)
        setOtp('')
        setIsOtpVerified(false)
        setOtpCountdown(0)
        router.replace('/service-report')
      }
    } catch {
      setError('Could not save the service report. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="bg-[#f6f9fc] px-3 py-8 md:px-7 md:py-12">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-6xl space-y-6"
      >
        {/* Header */}
        <header className="border-b border-slate-200 pb-7">
          <p className="text-gradient-brand text-xs font-bold uppercase tracking-[0.18em]">
            Engineer workspace
          </p>

          <h1 className="text-gradient-brand mt-2 text-3xl font-extrabold tracking-tight">
            Service report
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Record the visit, work completed, and next steps for the customer.
          </p>
        </header>

        {/* Customer Details */}
        <FormSection title="Customer details">
          <div className="grid gap-4 md:grid-cols-2">
            {(
              [
                ['customerName', 'Customer Name', true],
                ['date', 'Date', true],
                ['location', 'Location', true],
                ['serviceReportNo', 'Service Report Number', false],
                ['contactPerson', 'Contact Person', true],
                ['phone', 'Phone', true],
              ] as const
            ).map(([key, label, required]) => (
              <FormField
                key={key}
                label={label}
                required={required}
                type={
                  key === 'date'
                    ? 'date'
                    : key === 'phone'
                      ? 'tel'
                      : 'text'
                }
                value={report[key]}
                onChange={(event) =>
                  update(key, event.target.value)
                }
              />
            ))}
          </div>
        </FormSection>

        {/* Service Type */}
        <FormSection title="Service type">
          <div className="flex flex-wrap gap-3">
            {serviceOptions.map((type) => (
              <label
                key={type}
                className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700"
              >
                <input
                  type="checkbox"
                  checked={report.serviceTypes.includes(type)}
                  onChange={() => toggleType(type)}
                  className="accent-[#002B8B]"
                />

                {type}
              </label>
            ))}
          </div>

          {report.serviceTypes.includes('Others') && (
            <div className="mt-4 max-w-md">
              <FormField
                label="Other Service Type"
                required
                type='radio'
                value={report.otherServiceType}
                onChange={(event) =>
                  update('otherServiceType', event.target.value)
                }
              />
            </div>
          )}
        </FormSection>

        {/* Machine Details */}
        <FormSection title="Machine details">
          <MachineList
            items={report.machines}
            update={(index, field, value) =>
              updateItem<Machine>(
                'machines',
                index,
                field,
                value,
              )
            }
            add={() =>
              update('machines', [
                ...report.machines,
                emptyMachine(),
              ])
            }
            remove={(index) =>
              update(
                'machines',
                report.machines.filter(
                  (_, itemIndex) => itemIndex !== index,
                ),
              )
            }
          />
        </FormSection>

        {/* Service Details */}
        <FormSection title="Service details">
          <textarea
            required
            value={report.serviceDetails}
            onChange={(event) =>
              update('serviceDetails', event.target.value)
            }
            placeholder="Work performed, installation, testing, cleaning, maintenance, and other service activities"
            className={textClass}
          />
        </FormSection>

        {/* Parts / Materials */}
        <FormSection title="Parts / materials used">
          <PartsList
            items={report.parts}
            update={(index, field, value) =>
              updateItem<Part>(
                'parts',
                index,
                field,
                value,
              )
            }
            add={() =>
              update('parts', [
                ...report.parts,
                emptyPart(),
              ])
            }
            remove={(index) =>
              update(
                'parts',
                report.parts.filter(
                  (_, itemIndex) => itemIndex !== index,
                ),
              )
            }
          />
        </FormSection>

        {/* Technician Remarks */}
        <FormSection title="Technician remarks / recommendations">
          <textarea
            value={report.technicianRemarks}
            onChange={(event) =>
              update('technicianRemarks', event.target.value)
            }
            className={textClass}
          />
        </FormSection>

        {/* Service Completion */}
        <FormSection title="Service completion">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              label="Next Due Service Date"
              type="date"
              value={report.nextDueDate}
              onChange={(event) =>
                update('nextDueDate', event.target.value)
              }
            />

            <FormField
              label="Technician Name"
              required
              readOnly
              value={engineerName}
              tooltip={engineerEmail}
            />

            <FormField
              label="Technician Signature"
              value={report.technicianSignature}
              onChange={(event) =>
                update(
                  'technicianSignature',
                  event.target.value,
                )
              }
            />
            <div className="rounded-lg border border-slate-200 bg-white p-4 md:col-span-2">
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-50">
                    <UserCheck className="h-5 w-5 text-[#125FD0]" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Customer Acknowledgement
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Enter the customer&apos;s mobile number and send an OTP to confirm
                      their acknowledgement of the service report.
                    </p>
                  </div>
                </div>

                {isOtpVerified ? (
                  <div className="flex items-center gap-3 rounded-md border border-green-200 bg-green-50 px-4 py-3">
                    <CheckCircle2
                      className="h-5 w-5 shrink-0 text-green-600"
                      aria-hidden="true"
                    />

                    <div>
                      <p className="text-sm font-semibold text-green-800">
                        Customer acknowledgement completed
                      </p>
                      <p className="mt-0.5 text-xs text-green-700">
                        The customer has successfully verified their acknowledgement.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-end gap-3">
                    {/* Mobile Number - visible only before OTP is sent */}
                    {!isOtpSent && (




                      <div className="w-full max-w-xs">
                        <label
                          htmlFor="customer-phone"
                          className="mb-1.5 block text-sm font-medium text-slate-700"
                        >
                          Customer mobile number
                        </label>

                        <div className="relative">
                          <Phone
                            className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400"
                            aria-hidden="true"
                          />

                          <input
                            id="customer-phone"
                            type="tel"
                            inputMode="numeric"
                            autoComplete="tel"
                            maxLength={10}
                            value={customerPhone}
                            onChange={(event) =>
                              setCustomerPhone(event.target.value.replace(/\D/g, ""))
                            }
                            placeholder="Enter mobile number"
                            style={{
                              paddingLeft: "48px",
                            }}
                            className="h-10 w-full rounded-md border border-slate-300 bg-white pr-3 text-sm outline-none transition focus:border-[#125FD0] focus:ring-2 focus:ring-[#125FD0]/20"
                          />
                        </div>
                      </div>
                    )}

                    {/* Send OTP */}
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={
                        otpCountdown > 0 ||
                        (!isOtpSent && customerPhone.length !== 10)
                      }
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#125FD0] px-4 text-sm font-semibold text-white hover:bg-[#0E4FAF] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Send className="h-4 w-4" aria-hidden="true" />

                      {otpCountdown > 0
                        ? `Resend OTP in ${otpCountdown}s`
                        : isOtpSent
                          ? "Send OTP Again"
                          : "Send OTP"}
                    </button>

                    {/* OTP Input + Verification */}
                    {isOtpSent && (
                      <>
                        <div className="w-full max-w-xs">
                          <label
                            htmlFor="customer-otp"
                            className="mb-1.5 block text-sm font-medium text-slate-700"
                          >
                            Enter OTP
                          </label>

                          <input
                            id="customer-otp"
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={6}
                            value={otp}
                            onChange={(event) =>
                              setOtp(event.target.value.replace(/\D/g, ""))
                            }
                            placeholder="Enter OTP"
                            className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-[#125FD0] focus:ring-2 focus:ring-[#125FD0]/20"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          disabled={!otp.trim()}
                          className="inline-flex h-10 items-center gap-2 rounded-md border border-[#125FD0] px-4 text-sm font-semibold text-[#125FD0] hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <ShieldCheck
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                          Verify acknowledgement
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>



          </div>
        </FormSection>

        {/* Status Messages */}
        {message && (
          <p
            role="status"
            className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            {message}
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex h-11 items-center gap-2 rounded-md bg-[#002B8B] px-5 text-sm font-semibold text-white hover:bg-[#001F66] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}

            {isSaving ? 'Saving...' : 'Save Service Report'}
          </button>
        </div>
      </form>
    </main>
  )
}