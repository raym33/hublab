#!/bin/bash

# HubLab Verification Script
echo "🔍 Verificando instalación de HubLab..."
echo "======================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for issues
ISSUES=0

# Check Node.js
echo "1. Verificando Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js instalado: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js no está instalado"
    ((ISSUES++))
fi

# Check npm
echo ""
echo "2. Verificando npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} npm instalado: $NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm no está instalado"
    ((ISSUES++))
fi

# Check if node_modules exists
echo ""
echo "3. Verificando dependencias..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules existe"

    # Check specific packages
    PACKAGES=("next" "react" "@supabase/supabase-js" "stripe" "tailwindcss")
    for package in "${PACKAGES[@]}"; do
        if [ -d "node_modules/$package" ]; then
            echo -e "  ${GREEN}✓${NC} $package instalado"
        else
            echo -e "  ${RED}✗${NC} $package NO instalado"
            ((ISSUES++))
        fi
    done
else
    echo -e "${RED}✗${NC} node_modules no existe. Ejecuta: npm install"
    ((ISSUES++))
fi

# Check .env.local
echo ""
echo "4. Verificando variables de entorno..."
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓${NC} .env.local existe"

    # Check required env variables
    REQUIRED_VARS=(
        "NEXT_PUBLIC_SUPABASE_URL"
        "NEXT_PUBLIC_SUPABASE_ANON_KEY"
        "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
        "STRIPE_SECRET_KEY"
        "NEXT_PUBLIC_SITE_URL"
    )

    for var in "${REQUIRED_VARS[@]}"; do
        if grep -q "^$var=" .env.local; then
            VALUE=$(grep "^$var=" .env.local | cut -d'=' -f2)
            if [[ "$VALUE" == *"your"* ]] || [[ "$VALUE" == *"..."* ]] || [ -z "$VALUE" ]; then
                echo -e "  ${YELLOW}⚠${NC}  $var necesita configurarse"
                ((ISSUES++))
            else
                echo -e "  ${GREEN}✓${NC} $var configurado"
            fi
        else
            echo -e "  ${RED}✗${NC} $var no encontrado"
            ((ISSUES++))
        fi
    done
else
    echo -e "${RED}✗${NC} .env.local no existe. Ejecuta: cp .env.example .env.local"
    ((ISSUES++))
fi

# Check required files
echo ""
echo "5. Verificando archivos principales..."
FILES=(
    "package.json"
    "tsconfig.json"
    "tailwind.config.js"
    "next.config.js"
    "app/page.tsx"
    "app/layout.tsx"
    "lib/supabase.ts"
    "supabase-setup.sql"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  ${GREEN}✓${NC} $file existe"
    else
        echo -e "  ${RED}✗${NC} $file NO existe"
        ((ISSUES++))
    fi
done

# Check directories
echo ""
echo "6. Verificando estructura de carpetas..."
DIRS=("app" "components" "lib" "public")
for dir in "${DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "  ${GREEN}✓${NC} /$dir existe"
    else
        echo -e "  ${RED}✗${NC} /$dir NO existe"
        ((ISSUES++))
    fi
done

# Summary
echo ""
echo "======================================="
if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}✅ Verificación completada sin problemas${NC}"
    echo ""
    echo "Próximos pasos:"
    echo "1. Configura las credenciales en .env.local"
    echo "2. Ejecuta el SQL en Supabase"
    echo "3. Ejecuta: npm run dev"
    echo "4. Abre: http://localhost:3000"
else
    echo -e "${YELLOW}⚠️  Se encontraron $ISSUES problemas${NC}"
    echo ""
    echo "Acciones recomendadas:"

    if [ ! -d "node_modules" ]; then
        echo "• Ejecuta: npm install"
    fi

    if [ ! -f ".env.local" ]; then
        echo "• Ejecuta: cp .env.example .env.local"
        echo "• Edita .env.local con tus credenciales"
    fi

    echo ""
    echo "Para más ayuda, consulta INSTALACION.md"
fi

echo ""
echo "======================================="
echo "Para ejecutar el proyecto: npm run dev"