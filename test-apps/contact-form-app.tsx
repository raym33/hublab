'use client'

import React from 'react'
import Form from '@/components/capsules/Form'
import Input from '@/components/capsules/Input'
import Button from '@/components/capsules/Button'
import Alert from '@/components/capsules/Alert'

/**
 * Test App 2: Contact Form App
 * Tests: Form components, user interaction, validation flows
 * Components: 4
 * Expected: Functional form with proper structure
 */

export default function ContactFormApp() {
  const [showSuccess, setShowSuccess] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 5000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl mx-auto p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-gray-600">We'd love to hear from you. Send us a message!</p>
        </div>

        {showSuccess && (
          <div className="mb-6">
            <Alert
              title="Success!"
              message="Your message has been sent successfully. We'll get back to you soon."
              variant="success"
            />
          </div>
        )}

        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <Form title="Contact Form" fields={[
            { name: 'name', type: 'text', label: 'Full Name', required: true },
            { name: 'email', type: 'email', label: 'Email Address', required: true },
            { name: 'message', type: 'textarea', label: 'Message', required: true }
          ]} />

          <div className="mt-8 space-y-4">
            <Input
              label="Name"
              placeholder="John Doe"
              value={formData.name}
            />
            <Input
              label="Email"
              placeholder="john@example.com"
              type="email"
              value={formData.email}
            />
            <Input
              label="Message"
              placeholder="Your message here..."
              value={formData.message}
            />

            <Button
              text="Send Message"
              variant="primary"
              size="lg"
            />
          </div>
        </div>

        <div className="mt-8 text-center text-gray-600">
          <p>Or reach us directly at:</p>
          <p className="font-semibold mt-2">contact@hublab.dev</p>
        </div>
      </div>
    </div>
  )
}
