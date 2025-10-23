#!/bin/bash

# HubLab Setup Script
echo "🚀 Configurando HubLab..."
echo ""

# Check Node.js version
NODE_VERSION=$(node -v 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ Node.js detectado: $NODE_VERSION"
else
    echo "❌ Node.js no está instalado. Por favor instala Node.js 18+"
    exit 1
fi

# Install dependencies
echo ""
echo "📦 Instalando dependencias..."
npm install

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo ""
    echo "📝 Creando archivo .env.local..."
    cp .env.example .env.local
    echo "✅ .env.local creado. Por favor edítalo con tus credenciales."
else
    echo "✅ .env.local ya existe"
fi

echo ""
echo "✨ Setup completado!"
echo ""
echo "Próximos pasos:"
echo "1. Edita .env.local con tus credenciales de Supabase y Stripe"
echo "2. Ejecuta el script SQL en Supabase (supabase-setup.sql)"
echo "3. Ejecuta: npm run dev"
echo ""
echo "Para más información, lee QUICKSTART.md"