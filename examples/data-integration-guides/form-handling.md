# Form Handling Guide

Handle form submissions, validation, and error states in your HubLab components.

## Basic Form

```typescript
'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to send message')

      setSuccess(true)
      setFormData({ name: '', email: '', message: '' })
    } catch (err) {
      setError('Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Name"
        required
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        required
      />
      <textarea
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        placeholder="Message"
        required
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Message sent!</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Sending...' : 'Send'}
      </button>
    </form>
  )
}
```

## Client-Side Validation

```typescript
const [errors, setErrors] = useState<Record<string, string>>({})

const validateForm = () => {
  const newErrors: Record<string, string> = {}

  if (!formData.name.trim()) {
    newErrors.name = 'Name is required'
  }

  if (!formData.email.trim()) {
    newErrors.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'Email is invalid'
  }

  if (!formData.message.trim()) {
    newErrors.message = 'Message is required'
  } else if (formData.message.length < 10) {
    newErrors.message = 'Message must be at least 10 characters'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!validateForm()) return

  // Submit form...
}
```

## Using React Hook Form (Recommended)

```bash
npm install react-hook-form zod @hookform/resolvers
```

```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type FormData = z.infer<typeof schema>

export default function ContactForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (response.ok) {
      reset()
      alert('Message sent!')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input {...register('name')} placeholder="Name" />
        {errors.name && <span>{errors.name.message}</span>}
      </div>

      <div>
        <input {...register('email')} type="email" placeholder="Email" />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div>
        <textarea {...register('message')} placeholder="Message" />
        {errors.message && <span>{errors.message.message}</span>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send'}
      </button>
    </form>
  )
}
```

## File Upload

```typescript
const [file, setFile] = useState<File | null>(null)

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    setFile(e.target.files[0])
  }
}

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!file) return

  const formData = new FormData()
  formData.append('file', file)
  formData.append('name', 'example')

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData, // Don't set Content-Type header
  })

  if (response.ok) {
    const data = await response.json()
    console.log('Upload successful:', data.url)
  }
}

return (
  <form onSubmit={handleSubmit}>
    <input type="file" onChange={handleFileChange} accept="image/*" />
    <button type="submit">Upload</button>
  </form>
)
```

## Multi-Step Form

```typescript
const [step, setStep] = useState(1)
const [formData, setFormData] = useState({
  // Step 1
  name: '',
  email: '',
  // Step 2
  company: '',
  role: '',
  // Step 3
  interests: [],
})

const nextStep = () => setStep(step + 1)
const prevStep = () => setStep(step - 1)

return (
  <div>
    {step === 1 && (
      <div>
        <h2>Step 1: Personal Info</h2>
        <input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <button onClick={nextStep}>Next</button>
      </div>
    )}

    {step === 2 && (
      <div>
        <h2>Step 2: Work Info</h2>
        <input
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
        />
        <button onClick={prevStep}>Back</button>
        <button onClick={nextStep}>Next</button>
      </div>
    )}

    {step === 3 && (
      <div>
        <h2>Step 3: Interests</h2>
        {/* Interests checkboxes */}
        <button onClick={prevStep}>Back</button>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    )}
  </div>
)
```

## Best Practices

1. **Always validate** - Both client and server side
2. **Show errors inline** - Next to the field that has the error
3. **Disable submit** - While form is submitting
4. **Clear after success** - Reset form after successful submission
5. **Use TypeScript** - Type your form data
6. **Loading states** - Show feedback during submission
7. **Accessibility** - Use proper labels and ARIA attributes

## Next Steps

- [REST API Guide](./rest-api.md) - Submit forms to APIs
- [Supabase Integration](./supabase.md) - Save form data to database
