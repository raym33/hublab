'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, createPrototype, uploadFile, getCurrentUser } from '@/lib/supabase'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const TECH_OPTIONS = [
  'React', 'Next.js', 'Vue', 'Svelte', 'Angular',
  'TypeScript', 'Node.js', 'Python', 'Django', 'FastAPI',
  'Tailwind', 'CSS', 'HTML', 'JavaScript',
  'Firebase', 'Supabase', 'PostgreSQL', 'MongoDB',
  'Stripe', 'Auth0', 'OpenAI', 'Claude'
]

const CATEGORIES = [
  'Web App',
  'Mobile App',
  'Dashboard',
  'Landing Page',
  'Tool',
  'Other',
]

export default function UploadPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '29',
    category: 'Web App',
    tech_stack: [] as string[],
    preview_image: null as File | null,
    zip_file: null as File | null,
  })

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push('/login')
      } else {
        setUser(currentUser)
      }
      setLoading(false)
    }

    checkAuth()
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleTechStackChange = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      tech_stack: prev.tech_stack.includes(tech)
        ? prev.tech_stack.filter(t => t !== tech)
        : [...prev.tech_stack, tech]
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'preview_image' | 'zip_file') => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        [type]: file
      }))
    }
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setError('')

    if (!formData.title.trim()) {
      setError('Title is required')
      return
    }

    if (!formData.zip_file) {
      setError('Please upload a ZIP file')
      return
    }

    if (formData.tech_stack.length === 0) {
      setError('Select at least one technology')
      return
    }

    setSubmitting(true)

    try {
      // Upload files
      let preview_image_url = null
      let file_url = null

      if (formData.preview_image) {
        const imagePath = `${user.id}/${Date.now()}-preview.${formData.preview_image.name.split('.').pop()}`
        await uploadFile('previews', imagePath, formData.preview_image)
        preview_image_url = `https://${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]}/storage/v1/object/public/previews/${imagePath}`
      }

      const zipPath = `${user.id}/${Date.now()}-${formData.zip_file.name}`
      await uploadFile('prototypes', zipPath, formData.zip_file)
      file_url = zipPath

      // Create prototype record
      const prototype = await createPrototype({
        creator_id: user.id,
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        tech_stack: formData.tech_stack,
        preview_image_url,
        file_url,
        published: true,
      })

      // Redirect to prototype page
      router.push(`/prototype/${prototype.id}`)
    } catch (err: any) {
      setError(err.message || 'Upload failed')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-light">Loading...</p>
        </div>
      </div>
    )
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.title.trim() && formData.description.trim()
      case 2:
        return formData.tech_stack.length > 0
      case 3:
        return formData.zip_file !== null
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-8 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4 text-gray-400" />
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-900 rounded" />
              <span className="text-gray-900 font-light">HubLab</span>
            </div>
          </Link>

          <div className="flex items-center space-x-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-light ${
                  step === i ? 'bg-gray-900 text-white' :
                  step > i ? 'bg-gray-200 text-gray-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {i}
                </div>
                {i < 3 && (
                  <div className={`w-12 h-px ml-2 ${
                    step > i ? 'bg-gray-300' : 'bg-gray-100'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-8 py-16">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-8 text-sm">
            {error}
          </div>
        )}

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h1 className="text-4xl font-light text-gray-900 mb-2">
              Tell us about your prototype
            </h1>
            <p className="text-gray-500 font-light mb-12">
              Start with the basics. What did you build?
            </p>

            <div className="space-y-8">
              <div>
                <label className="block text-sm text-gray-600 mb-3 font-light">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Analytics Dashboard"
                  className="w-full px-0 py-3 border-0 border-b border-gray-300 focus:border-gray-900 text-lg font-light outline-none transition-colors bg-transparent"
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-3 font-light">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your prototype, features, use cases..."
                  rows={4}
                  className="w-full px-0 py-3 border-0 border-b border-gray-300 focus:border-gray-900 font-light outline-none resize-none transition-colors bg-transparent"
                  disabled={submitting}
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm text-gray-600 mb-3 font-light">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-0 py-3 border-0 border-b border-gray-300 focus:border-gray-900 font-light outline-none bg-transparent cursor-pointer"
                    disabled={submitting}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-3 font-light">
                    Price (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-0 top-3 text-gray-500 font-light">$</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="1"
                      max="9999"
                      className="w-full pl-6 py-3 border-0 border-b border-gray-300 focus:border-gray-900 font-light outline-none bg-transparent"
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Tech Stack */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h1 className="text-4xl font-light text-gray-900 mb-2">
              Tech stack
            </h1>
            <p className="text-gray-500 font-light mb-12">
              What technologies power your prototype?
            </p>

            <div className="grid grid-cols-3 gap-3">
              {TECH_OPTIONS.map(tech => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => handleTechStackChange(tech)}
                  disabled={submitting}
                  className={`px-4 py-3 rounded-md text-sm font-light transition-all ${
                    formData.tech_stack.includes(tech)
                      ? 'bg-gray-900 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>

            {formData.tech_stack.length > 0 && (
              <p className="text-gray-600 text-sm mt-8 font-light">
                Selected: {formData.tech_stack.join(', ')}
              </p>
            )}
          </div>
        )}

        {/* Step 3: Files */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h1 className="text-4xl font-light text-gray-900 mb-2">
              Upload files
            </h1>
            <p className="text-gray-500 font-light mb-12">
              Add your prototype files and preview image
            </p>

            <div className="space-y-8">
              {/* Preview Image */}
              <div>
                <label className="block text-sm text-gray-600 mb-3 font-light">
                  Preview Image (optional)
                </label>
                <div className="border border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'preview_image')}
                    className="hidden"
                    id="preview-input"
                    disabled={submitting}
                  />
                  <label htmlFor="preview-input" className="cursor-pointer">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <div className="w-8 h-8 bg-gray-300 rounded" />
                    </div>
                    <p className="text-gray-700 font-light mb-1">
                      {formData.preview_image?.name || 'Click to upload image'}
                    </p>
                    <p className="text-gray-400 text-sm font-light">
                      PNG or JPG up to 5MB
                    </p>
                  </label>
                </div>
              </div>

              {/* ZIP File */}
              <div>
                <label className="block text-sm text-gray-600 mb-3 font-light">
                  Prototype ZIP File *
                </label>
                <div className="border border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept=".zip"
                    onChange={(e) => handleFileChange(e, 'zip_file')}
                    className="hidden"
                    id="zip-input"
                    disabled={submitting}
                  />
                  <label htmlFor="zip-input" className="cursor-pointer">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <div className="w-8 h-8 bg-gray-300 rounded" />
                    </div>
                    <p className="text-gray-700 font-light mb-1">
                      {formData.zip_file?.name || 'Click to upload ZIP'}
                    </p>
                    <p className="text-gray-400 text-sm font-light">
                      ZIP file up to 100MB
                    </p>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-16">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              disabled={submitting}
              className="text-gray-600 hover:text-gray-900 font-light transition-colors flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => canProceed() && setStep(step + 1)}
              disabled={!canProceed() || submitting}
              className={`px-8 py-3 rounded-md font-light transition-all flex items-center ${
                canProceed()
                  ? 'bg-gray-900 hover:bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed() || submitting}
              className={`px-8 py-3 rounded-md font-light transition-all flex items-center ${
                canProceed() && !submitting
                  ? 'bg-gray-900 hover:bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {submitting ? 'Publishing...' : 'Publish Prototype'}
              {!submitting && <ArrowRight className="w-4 h-4 ml-2" />}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}