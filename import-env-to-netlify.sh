#!/bin/bash

# Script para importar variables de .env.local a Netlify
# Uso: ./import-env-to-netlify.sh

echo "🔄 Importando variables de entorno a Netlify..."
echo "============================================"

# Verificar que existe .env.local
if [ ! -f ".env.local" ]; then
    echo "❌ Error: No se encontró el archivo .env.local"
    exit 1
fi

# Verificar que netlify CLI está instalado
if ! command -v netlify &> /dev/null; then
    echo "❌ Error: Netlify CLI no está instalado"
    echo "Instálalo con: npm install -g netlify-cli"
    exit 1
fi

# Contador de variables
count=0
skipped=0

# Leer .env.local línea por línea
while IFS= read -r line || [ -n "$line" ]; do
    # Ignorar líneas vacías y comentarios
    if [[ -z "$line" || "$line" =~ ^[[:space:]]*# || "$line" =~ ^[[:space:]]*$ ]]; then
        continue
    fi

    # Extraer clave y valor
    if [[ "$line" =~ ^([^=]+)=(.*)$ ]]; then
        key="${BASH_REMATCH[1]}"
        value="${BASH_REMATCH[2]}"

        # Remover espacios en blanco al inicio y final de la clave
        key=$(echo "$key" | xargs)

        # Remover comillas del valor si las tiene
        value="${value#\"}"
        value="${value%\"}"
        value="${value#\'}"
        value="${value%\'}"

        # Verificar que la clave no esté vacía
        if [[ -n "$key" ]]; then
            echo "📝 Configurando: $key"

            # Configurar la variable en Netlify
            if netlify env:set "$key" "$value" 2>/dev/null; then
                echo "   ✅ $key configurado correctamente"
                ((count++))
            else
                echo "   ⚠️  No se pudo configurar $key (puede que ya exista o haya un error)"
                ((skipped++))
            fi
        fi
    fi
done < .env.local

echo ""
echo "============================================"
echo "📊 Resumen:"
echo "   ✅ Variables configuradas: $count"
echo "   ⚠️  Variables omitidas: $skipped"
echo ""

# Mostrar las variables configuradas
echo "📋 Variables actuales en Netlify:"
echo "============================================"
netlify env:list

echo ""
echo "✨ ¡Proceso completado!"
echo ""
echo "⚠️  IMPORTANTE:"
echo "1. Las variables se aplicarán en el próximo deploy"
echo "2. Para hacer deploy ahora, ejecuta: netlify deploy --prod"
echo "3. Verifica las variables en: https://app.netlify.com/sites/hublab-dev/configuration/env"