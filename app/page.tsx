'use client'

import Link from 'next/link'
import { Sparkles, ArrowRight, Zap, Code2, Rocket, Wand2 } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-white">AI-Powered App Generation</span>
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Describe tu app.<br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              La AI la construye.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Escribe en lenguaje natural lo que necesitas. Nuestro compilador AI genera código React completo,
            con preview en vivo, y listo para descargar.
          </p>

          {/* CTA */}
          <Link
            href="/compiler"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105"
          >
            <Sparkles className="w-6 h-6" />
            Probar AI Compiler Gratis
            <ArrowRight className="w-6 h-6" />
          </Link>

          {/* Example */}
          <p className="text-sm text-gray-500 mt-6">
            Ejemplo: "Crea un todo app con drag & drop, categorías y dark mode"
          </p>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Así de simple
            </h2>
            <p className="text-xl text-gray-400">
              De idea a app funcional en 30 segundos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                <Wand2 className="w-7 h-7 text-white" />
              </div>
              <div className="text-6xl font-bold text-white/10 mb-4">01</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Describe tu app
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Escribe en lenguaje natural lo que quieres crear. Sé específico:
                funciones, diseño, comportamiento.
              </p>
              <div className="mt-4 p-3 bg-black/30 rounded-lg border border-white/10">
                <p className="text-xs text-gray-400 font-mono">
                  "Un dashboard con gráficas en tiempo real, tabla de datos exportable, y filtros dinámicos"
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div className="text-6xl font-bold text-white/10 mb-4">02</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                AI genera código
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Nuestro compilador AI analiza tu prompt, selecciona los componentes necesarios,
                y genera código React production-ready.
              </p>
              <div className="mt-4 p-3 bg-black/30 rounded-lg border border-white/10">
                <p className="text-xs text-purple-400 font-mono">
                  ✓ React + TypeScript<br />
                  ✓ Tailwind CSS<br />
                  ✓ Componentes optimizados
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6">
                <Rocket className="w-7 h-7 text-white" />
              </div>
              <div className="text-6xl font-bold text-white/10 mb-4">03</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Preview y descarga
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Ve el resultado en vivo, itera con AI para mejorarlo,
                y descarga el código completo listo para deploy.
              </p>
              <div className="mt-4 p-3 bg-black/30 rounded-lg border border-white/10">
                <p className="text-xs text-green-400 font-mono">
                  ✓ Preview en tiempo real<br />
                  ✓ Chat AI para mejoras<br />
                  ✓ Descarga .zip completo
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Más que solo generar código
            </h2>
            <p className="text-xl text-gray-400">
              Un compilador completo con herramientas profesionales
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Monaco Editor (VS Code)</h3>
              </div>
              <p className="text-gray-300">
                Editor de código profesional integrado. Syntax highlighting, autocomplete,
                y todas las funciones de VS Code en el navegador.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Preview en Vivo</h3>
              </div>
              <p className="text-gray-300">
                Ve tu app corriendo en tiempo real. Sandbox seguro con iframe,
                console output, y responsive design testing.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <Wand2 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Chat AI Iterativo</h3>
              </div>
              <p className="text-gray-300">
                Mejora tu app conversando con AI. "Haz que sea responsive", "Añade dark mode",
                "Mejora los colores" - todo sin escribir código.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-500/30 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Templates Profesionales</h3>
              </div>
              <p className="text-gray-300">
                Empieza con templates pre-hechos: dashboards, landing pages, e-commerce,
                SaaS apps. Personalízalos con AI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Examples */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Qué puedes crear
            </h2>
            <p className="text-xl text-gray-400">
              Desde MVPs hasta prototipos complejos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
              <div className="text-4xl mb-4">📝</div>
              <h4 className="text-lg font-bold text-white mb-2">Todo Apps</h4>
              <p className="text-sm text-gray-400">
                Con drag & drop, categorías, filtros, localStorage, dark mode
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
              <div className="text-4xl mb-4">📊</div>
              <h4 className="text-lg font-bold text-white mb-2">Dashboards</h4>
              <p className="text-sm text-gray-400">
                Con gráficas interactivas, tablas de datos, exportación a CSV
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
              <div className="text-4xl mb-4">🛍️</div>
              <h4 className="text-lg font-bold text-white mb-2">E-commerce</h4>
              <p className="text-sm text-gray-400">
                Catálogos de productos, carrito de compras, checkout flows
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
              <div className="text-4xl mb-4">🎨</div>
              <h4 className="text-lg font-bold text-white mb-2">Landing Pages</h4>
              <p className="text-sm text-gray-400">
                Con secciones hero, features, pricing, testimonials, CTAs
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
              <div className="text-4xl mb-4">🔐</div>
              <h4 className="text-lg font-bold text-white mb-2">Auth Flows</h4>
              <p className="text-sm text-gray-400">
                Login, signup, password reset, social auth, protected routes
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
              <div className="text-4xl mb-4">💬</div>
              <h4 className="text-lg font-bold text-white mb-2">Chat Apps</h4>
              <p className="text-sm text-gray-400">
                Mensajería en tiempo real, grupos, notificaciones, typing indicators
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            ¿Listo para crear?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Genera tu primera app en menos de un minuto
          </p>
          <Link
            href="/compiler"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xl font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105"
          >
            <Sparkles className="w-6 h-6" />
            Abrir AI Compiler
            <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="text-sm text-gray-500 mt-8">
            No requiere registro • Totalmente gratis • Sin límites
          </p>
        </div>
      </section>
    </div>
  )
}
