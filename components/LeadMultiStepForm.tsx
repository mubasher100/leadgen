import React from 'react'
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'

type LeadFormInputs = {
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  jobTitle?: string
  city?: string
  state?: string
  country?: string
  address?: string

  businessType: string
  serviceInterest?: string
  leadSource?: string

  budget?: number
  budgetBracket?: string

  timeline?: string
  projectScope?: string

  website?: string // honeypot
  notes?: string
  ipAddress?: string
  userAgent?: string
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Field({ label, name, register, required, type = 'text', placeholder }: { label: string; name: keyof LeadFormInputs; register: any; required?: boolean; type?: string; placeholder?: string }) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={String(name)}>
        {label}
      </label>
      <input id={String(name)} type={type} placeholder={placeholder} {...register(name as string, { required })} className="mt-1 block w-full rounded-md border border-gray-300 p-2" />
    </div>
  )
}

const LeadMultiStepForm: React.FC = () => {
  const methods = useForm<LeadFormInputs>({
    mode: 'onChange',
    defaultValues: { businessType: 'Digital Marketing' },
  })
  const { register, handleSubmit, watch, formState: { errors, isValid } } = methods
  const steps = ['Your Info', 'Company & Location', 'Budget & Scope', 'Review']
  const [step, setStep] = React.useState(0)
  const budget = watch('budget', 0)
  const showBudgetDetails = typeof budget === 'number' && budget > 5000

  const onSubmit: SubmitHandler<LeadFormInputs> = async (data) => {
    if (data.website && data.website.trim().length > 0) {
      console.warn('Bot detected via honeypot')
      return
    }
    const payload = { ...data, status: 'New', created_at: new Date().toISOString() }
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      alert('Lead captured! We will be in touch.')
    } catch (e) {
      console.error(e)
      alert('Submission failed. Please try again.')
    }
  }

  const StepContent = () => {
    if (step === 0) {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="First Name" name="firstName" register={register} required placeholder="Jane" />
            <Field label="Last Name" name="lastName" register={register} required placeholder="Doe" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
              <input id="email" type="email" placeholder="you@example.com" {...register('email', { required: true, pattern: emailRegex })} className="mt-1 block w-full rounded-md border border-gray-300 p-2" />
              {errors.email && <span className="text-sm text-red-600">Enter a valid email</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">Phone</label>
              <input id="phone" placeholder="(555) 555-5555" {...register('phone')} className="mt-1 block w-full rounded-md border border-gray-300 p-2" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="City" name="city" register={register} placeholder="City" />
            <Field label="State" name="state" register={register} placeholder="State" />
          </div>
        </div>
      )
    }
    if (step === 1) {
      return (
        <div className="space-y-4">
          <Field label="Company" name="company" register={register} placeholder="Company" />
          <Field label="Job Title" name="jobTitle" register={register} placeholder="Your Title" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="City" name="city" register={register} placeholder="City" />
            <Field label="State" name="state" register={register} placeholder="State" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="country">Country</label>
            <select id="country" {...register('country')} className="w-full rounded-md border border-gray-300 p-2">
              <option value="">Select country</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="leadSource">Lead Source</label>
            <input id="leadSource" placeholder="Website, Referral, Social" {...register('leadSource')} className="mt-1 block w-full rounded-md border border-gray-300 p-2" />
          </div>
        </div>
      )
    }
    if (step === 2) {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="budget">Budget (USD)</label>
            <input id="budget" type="number" placeholder="e.g., 7500" step="100" {...register('budget', { valueAsNumber: true })} className="mt-1 block w-full rounded-md border border-gray-300 p-2" />
          </div>
          {showBudgetDetails && (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="timeline">Project Timeline</label>
                <select id="timeline" {...register('timeline')} className="w-full rounded-md border border-gray-300 p-2">
                  <option value="">Select timeline</option>
                  <option value="4 weeks">4 weeks</option>
                  <option value="8-12 weeks">8-12 weeks</option>
                  <option value="3-6 months">3-6 months</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="projectScope">Project Scope</label>
                <textarea id="projectScope" placeholder="Describe the scope" {...register('projectScope')} className="mt-1 block w-full rounded-md border border-gray-300 p-2" rows={4} />
              </div>
            </div>
          )}
        </div>
      )
    }
    // Step 4: Review
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Review Your Lead</h3>
        <p className="text-sm text-gray-700">Review the information before submission. You can go back to edit.</p>
        <div className="bg-white border rounded-md p-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><strong>Name:</strong> {watch('firstName')} {watch('lastName')}</div>
            <div><strong>Email:</strong> {watch('email')}</div>
            <div><strong>Company:</strong> {watch('company') ?? '—'}</div>
            <div><strong>Budget:</strong> {watch('budget') ? `$${watch('budget')}` : '—'}</div>
            <div><strong>Data Source:</strong> {watch('data_source') ?? '—'}</div>
            <div><strong>Source Timestamp:</strong> {watch('source_timestamp') ?? '—'}</div>
          </div>
        </div>
      </div>
    )
  }

  // Honeypot field (hidden)
  const Honeypot = () => (
    <input {...register('website')} aria-label="Website (honeypot)" type="text" style={{ display: 'none' }} tabIndex={-1} />
  )

  const stepsCount = steps.length
  const progressPct = Math.min(100, Math.round(((step + 1) / stepsCount) * 100))

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="mb-2">
          <div className="h-2 rounded-full bg-gray-200 w-full overflow-hidden" aria-label="progress-bar">
            <div className="h-2 bg-indigo-600" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="text-xs text-gray-600 mt-1">Step {step + 1} / {stepsCount}</div>
        </div>

        <StepContent />
        <Honeypot />

        <div className="flex items-center justify-between">
          <button type="button" className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            Back
          </button>
          {step < stepsCount - 1 ? (
            <button
              type="button"
              className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
              onClick={() => setStep((s) => Math.min(stepsCount - 1, s + 1))}
              disabled={!isValid}
            >
              Next
            </button>
          ) : (
            <button type="submit" className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700" disabled={false}>
              Submit Lead
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  )
}

export default LeadMultiStepForm
