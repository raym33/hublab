'use client'

import Link from 'next/link'
import {
  Zap, Database, Package, Sparkles, ArrowRight, CheckCircle, Code2, Workflow, ShoppingBag
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section - SUPER CLARO */}
      <section className="pt-24 pb-16 px-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-6">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-gray-900">3 herramientas en 1 plataforma</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Construye Apps Más Rápido<br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Con AI y Automatización
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              HubLab te da 3 formas de acelerar tu desarrollo: compra prototipos listos,
              construye workflows visuales, o automatiza tu CRM con AI.
            </p>
          </div>

          {/* 3 OPCIONES CLARAS */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Opción 1: Studio */}
            <Link
              href="/studio"
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-purple-500"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Visual Studio
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Construye workflows completos con drag & drop.
                Conecta 29 capsules sin escribir código.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Sin código, solo visual</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>29 capsules listos</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Exporta código real</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-purple-600 font-semibold group-hover:gap-3 transition-all">
                Abrir Studio
                <ArrowRight className="w-5 h-5" />
              </div>
            </Link>

            {/* Opción 2: CRM */}
            <Link
              href="/studio?capsule=crm-agent"
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-blue-500"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Database className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                CRM Agent
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Automatiza HubSpot/Salesforce con AI. Lee emails, crea deals,
                actualiza contactos automáticamente.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Integración HubSpot</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>AI automático 24/7</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Dashboard en vivo</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                Configurar en Studio
                <ArrowRight className="w-5 h-5" />
              </div>
            </Link>

            {/* Opción 3: Marketplace */}
            <Link
              href="/marketplace"
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-green-500"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Marketplace
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Compra apps completas hechas con Cursor, v0, Claude.
                Deploy en minutos con código incluido.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>500+ prototipos listos</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Código fuente completo</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Deploy instantáneo</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-green-600 font-semibold group-hover:gap-3 transition-all">
                Explorar Apps
                <ArrowRight className="w-5 h-5" />
              </div>
            </Link>
          </div>

          {/* Quick Start */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              ¿No estás seguro por dónde empezar?
            </p>
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Sparkles className="w-5 h-5" />
              Empieza en el Studio (Gratis)
            </Link>
          </div>
        </div>
      </section>

      {/* ¿Qué es cada cosa? */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ¿Cómo funciona cada herramienta?
            </h2>
            <p className="text-xl text-gray-600">
              Explicado simple y directo
            </p>
          </div>

          <div className="space-y-12">
            {/* Studio */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 rounded-full mb-4">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-900">STUDIO</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Construye Workflows Visuales
                </h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Arrastra capsules (autenticación, base de datos, pagos, email, etc.)
                  al canvas, conéctalos, y genera código funcional.
                  Es como Figma pero para backend.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-sm font-bold text-purple-600">1</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Arrastra capsules</p>
                      <p className="text-sm text-gray-600">29 módulos listos: Auth, DB, Stripe, SendGrid...</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-sm font-bold text-purple-600">2</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Conecta visualmente</p>
                      <p className="text-sm text-gray-600">Sin código, solo drag & drop</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-sm font-bold text-purple-600">3</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Exporta código</p>
                      <p className="text-sm text-gray-600">TypeScript production-ready</p>
                    </div>
                  </div>
                </div>
                <Link
                  href="/studio"
                  className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Probar Studio Ahora
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 border-2 border-purple-200">
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Code2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Auth Capsule</div>
                      <div className="text-xs text-gray-600">JWT + Sessions</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 font-mono">
                    auth().signIn(email, password)<br />
                    .then(user =&gt; database.save(user))
                  </div>
                </div>
              </div>
            </div>

            {/* CRM */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-8 border-2 border-blue-200">
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-gray-900">Agente activo</span>
                    </div>
                    <span className="text-xs text-gray-600">47 contactos hoy</span>
                  </div>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Email de Juan → Deal creado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Meeting con ACME → HubSpot actualizado</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full mb-4">
                  <Database className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-900">CRM AGENT</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Tu CRM en Piloto Automático
                </h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Conecta Gmail, Calendar y Slack. El agente lee eventos,
                  detecta intenciones con AI, y actualiza HubSpot/Salesforce
                  automáticamente. Tú solo apruebas.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-sm font-bold text-blue-600">1</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Conecta tu CRM</p>
                      <p className="text-sm text-gray-600">OAuth con HubSpot en 2 clicks</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-sm font-bold text-blue-600">2</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">AI trabaja 24/7</p>
                      <p className="text-sm text-gray-600">Lee emails, meetings, slack messages</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-sm font-bold text-blue-600">3</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Tú solo apruebas</p>
                      <p className="text-sm text-gray-600">Dashboard con acciones pendientes</p>
                    </div>
                  </div>
                </div>
                <Link
                  href="/studio?capsule=crm-agent"
                  className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Configurar CRM Agent
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Marketplace */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full mb-4">
                  <ShoppingBag className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-900">MARKETPLACE</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Compra Apps Ya Construidas
                </h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  ¿Para qué empezar de cero? Compra un prototipo completo
                  hecho con Cursor, v0 o Claude. Incluye código fuente,
                  deploy automático, y documentación.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-sm font-bold text-green-600">1</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Encuentra tu app</p>
                      <p className="text-sm text-gray-600">500+ prototipos: dashboards, SaaS, landing pages...</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-sm font-bold text-green-600">2</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Compra y descarga</p>
                      <p className="text-sm text-gray-600">Código completo en .zip listo para usar</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-sm font-bold text-green-600">3</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Deploy en minutos</p>
                      <p className="text-sm text-gray-600">Vercel, Netlify, o tu propio servidor</p>
                    </div>
                  </div>
                </div>
                <Link
                  href="/marketplace"
                  className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Explorar Marketplace
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-8 border-2 border-green-200">
                <div className="bg-white rounded-lg p-4 shadow-lg mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">SaaS Dashboard</span>
                    <span className="text-lg font-bold text-gray-900">$99</span>
                  </div>
                  <div className="text-xs text-gray-600 mb-3">Next.js + Supabase + Stripe</div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      ⭐ 4.8
                    </div>
                    <span>•</span>
                    <span>127 ventas</span>
                  </div>
                </div>
                <div className="text-xs text-gray-600 text-center">
                  + 499 apps más disponibles
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Empieza Gratis Ahora
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Elige tu herramienta favorita y acelera tu desarrollo hoy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/studio"
              className="px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Probar Studio
            </Link>
            <Link
              href="/studio?capsule=crm-agent"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Database className="w-5 h-5" />
              CRM Agent
            </Link>
            <Link
              href="/marketplace"
              className="px-8 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Explorar Apps
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
