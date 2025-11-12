// Production Landing Page Component from HubLab
import React, { useState } from 'react';

export function LandingPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6 text-center">
            Build Beautiful Web Apps Visually
          </h1>
          <p className="text-xl mb-8 text-center">
            Create production-ready React applications with 180+ pre-built components
          </p>
        </div>
      </section>
    </div>
  );
}
