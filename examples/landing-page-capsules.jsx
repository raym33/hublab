// Example: Landing Page built with Capsules
// This shows how the capsule system can build a complete landing page

// Capsule 1: Hero Section
export function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-4">Welcome to HubLab</h1>
        <p className="text-xl mb-8">Build AI-powered apps with capsules</p>
        <div className="flex gap-4">
          <Button variant="primary">Get Started</Button>
          <Button variant="secondary">Learn More</Button>
        </div>
      </div>
    </section>
  );
}

// Capsule 2: Feature Card
export function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

// Capsule 3: Features Section
export function FeaturesSection() {
  const features = [
    { icon: "🚀", title: "Fast Development", description: "Build apps in minutes with AI" },
    { icon: "🧩", title: "Modular Capsules", description: "Reusable components that work together" },
    { icon: "🤖", title: "AI-Powered", description: "Generate code with natural language" }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Capsule 4: Testimonial
export function Testimonial({ quote, author, role }) {
  return (
    <div className="bg-white p-8 rounded-lg shadow">
      <blockquote className="text-lg italic mb-4">"{quote}"</blockquote>
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
        <div>
          <div className="font-semibold">{author}</div>
          <div className="text-gray-600">{role}</div>
        </div>
      </div>
    </div>
  );
}

// Capsule 5: CTA Section
export function CTASection() {
  return (
    <section className="bg-blue-600 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to build something amazing?</h2>
        <p className="text-xl mb-8">Start creating with AI-powered capsules today</p>
        <Button variant="white">Start Free Trial</Button>
      </div>
    </section>
  );
}

// Main App - Combines all capsules
export default function App() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}