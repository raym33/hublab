'use client'

import { useState } from 'react'
import { Zap, Layout, ShoppingCart, BarChart3, MessageSquare, Calendar, GraduationCap, Utensils, Search, Star, Clock, TrendingUp } from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string
  icon: any
  color: string
  gradient: string
  capsules: string[]
  preview: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  buildTime: string
  category: string
  popularity: number
}

interface VisualTemplateGalleryProps {
  onSelectTemplate: (template: Template) => void
}

export default function VisualTemplateGallery({ onSelectTemplate }: VisualTemplateGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const templates: Template[] = [
    {
      id: 'landing-page',
      name: 'Landing Page SaaS',
      description: 'Página de aterrizaje profesional con hero, features, pricing y CTA',
      icon: Layout,
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-500',
      capsules: ['hero', 'features-grid', 'pricing-table', 'cta-section', 'footer'],
      preview: '/previews/landing-page.jpg',
      difficulty: 'beginner',
      buildTime: '10 min',
      category: 'Marketing',
      popularity: 95
    },
    {
      id: 'dashboard',
      name: 'Dashboard Analítico',
      description: 'Dashboard completo con gráficos, KPIs y tablas de datos',
      icon: BarChart3,
      color: 'text-purple-600',
      gradient: 'from-purple-500 to-pink-500',
      capsules: ['stat-card', 'line-chart', 'bar-chart', 'data-table', 'filter-panel'],
      preview: '/previews/dashboard.jpg',
      difficulty: 'intermediate',
      buildTime: '20 min',
      category: 'Analytics',
      popularity: 88
    },
    {
      id: 'ecommerce',
      name: 'Tienda Online',
      description: 'E-commerce completo con carrito, checkout y gestión de productos',
      icon: ShoppingCart,
      color: 'text-green-600',
      gradient: 'from-green-500 to-emerald-500',
      capsules: ['product-grid', 'shopping-cart', 'checkout-form', 'product-card', 'payment'],
      preview: '/previews/ecommerce.jpg',
      difficulty: 'advanced',
      buildTime: '30 min',
      category: 'E-commerce',
      popularity: 92
    },
    {
      id: 'blog',
      name: 'Blog Personal',
      description: 'Blog moderno con posts, comentarios y búsqueda',
      icon: MessageSquare,
      color: 'text-orange-600',
      gradient: 'from-orange-500 to-red-500',
      capsules: ['blog-post-card', 'comment-section', 'search-bar', 'sidebar', 'author-bio'],
      preview: '/previews/blog.jpg',
      difficulty: 'beginner',
      buildTime: '15 min',
      category: 'Content',
      popularity: 76
    },
    {
      id: 'booking',
      name: 'Sistema de Reservas',
      description: 'Plataforma de reservas con calendario y disponibilidad',
      icon: Calendar,
      color: 'text-indigo-600',
      gradient: 'from-indigo-500 to-blue-500',
      capsules: ['calendar', 'time-slots', 'booking-form', 'confirmation', 'availability-grid'],
      preview: '/previews/booking.jpg',
      difficulty: 'intermediate',
      buildTime: '25 min',
      category: 'Services',
      popularity: 82
    },
    {
      id: 'learning',
      name: 'Plataforma Educativa',
      description: 'LMS con cursos, videos, progreso y certificados',
      icon: GraduationCap,
      color: 'text-teal-600',
      gradient: 'from-teal-500 to-cyan-500',
      capsules: ['course-grid', 'video-player', 'progress-tracker', 'quiz', 'certificate'],
      preview: '/previews/learning.jpg',
      difficulty: 'advanced',
      buildTime: '35 min',
      category: 'Education',
      popularity: 79
    },
    {
      id: 'restaurant',
      name: 'Menú Restaurant',
      description: 'Menú digital interactivo con carrito y pedidos',
      icon: Utensils,
      color: 'text-yellow-600',
      gradient: 'from-yellow-500 to-orange-500',
      capsules: ['menu-header', 'category-tabs', 'dish-card', 'cart-widget', 'order-summary'],
      preview: '/previews/restaurant.jpg',
      difficulty: 'beginner',
      buildTime: '12 min',
      category: 'Hospitality',
      popularity: 71
    },
    {
      id: 'portfolio',
      name: 'Portfolio Creativo',
      description: 'Portfolio profesional con proyectos, skills y contacto',
      icon: Star,
      color: 'text-pink-600',
      gradient: 'from-pink-500 to-rose-500',
      capsules: ['portfolio-hero', 'project-grid', 'skills-section', 'about', 'contact-form'],
      preview: '/previews/portfolio.jpg',
      difficulty: 'beginner',
      buildTime: '15 min',
      category: 'Personal',
      popularity: 85
    }
  ]

  const categories = [
    { id: 'all', name: 'Todos', count: templates.length },
    { id: 'Marketing', name: 'Marketing', count: templates.filter(t => t.category === 'Marketing').length },
    { id: 'Analytics', name: 'Analytics', count: templates.filter(t => t.category === 'Analytics').length },
    { id: 'E-commerce', name: 'E-commerce', count: templates.filter(t => t.category === 'E-commerce').length },
    { id: 'Content', name: 'Contenido', count: templates.filter(t => t.category === 'Content').length },
    { id: 'Services', name: 'Servicios', count: templates.filter(t => t.category === 'Services').length },
    { id: 'Education', name: 'Educación', count: templates.filter(t => t.category === 'Education').length }
  ]

  const filteredTemplates = templates
    .filter(t => selectedCategory === 'all' || t.category === selectedCategory)
    .filter(t =>
      !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => b.popularity - a.popularity)

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700 border-green-300',
    intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    advanced: 'bg-red-100 text-red-700 border-red-300'
  }

  const difficultyLabels = {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado'
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-3">
          <Zap className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Starter Templates</h2>
            <p className="text-sm text-gray-600">Comienza rápido con templates pre-diseñados</p>
          </div>
        </div>

        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar templates..."
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Categorías */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex gap-2 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium text-sm transition ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <Layout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron templates</h3>
            <p className="text-sm text-gray-600">Intenta con otros términos de búsqueda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(template => {
              const Icon = template.icon
              return (
                <button
                  key={template.id}
                  onClick={() => onSelectTemplate(template)}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 text-left group"
                >
                  {/* Preview con gradient */}
                  <div className={`h-48 bg-gradient-to-br ${template.gradient} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className="w-24 h-24 text-white opacity-80" />
                    </div>
                    {/* Badge de popularidad */}
                    {template.popularity > 80 && (
                      <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 rounded-full flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-orange-500" />
                        <span className="text-xs font-bold text-gray-900">Popular</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition">
                        {template.name}
                      </h3>
                      <Icon className={`w-5 h-5 ${template.color} flex-shrink-0`} />
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-2 py-1 rounded border text-xs font-medium ${difficultyColors[template.difficulty]}`}>
                        {difficultyLabels[template.difficulty]}
                      </span>
                      <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 border border-blue-300 text-xs font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {template.buildTime}
                      </span>
                    </div>

                    {/* Capsules count */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="flex -space-x-2">
                        {template.capsules.slice(0, 3).map((_, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center"
                          >
                            <span className="text-[10px] font-bold text-gray-600">{i + 1}</span>
                          </div>
                        ))}
                      </div>
                      <span>
                        {template.capsules.length} cápsulas incluidas
                      </span>
                    </div>

                    {/* CTA */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm font-semibold">
                        <span className="text-blue-600 group-hover:text-blue-700">Usar template</span>
                        <Zap className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition" />
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
