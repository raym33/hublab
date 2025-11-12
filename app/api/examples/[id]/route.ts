import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Map of example IDs to their file paths
const exampleFiles: Record<string, string> = {
  'landing-page-saas': 'landing-page-saas.tsx',
  'dashboard-analytics': 'dashboard-analytics.tsx',
  'ecommerce-store': 'ecommerce-store.tsx',
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Validate example ID
    if (!exampleFiles[id]) {
      return NextResponse.json(
        { error: 'Example not found' },
        { status: 404 }
      )
    }

    // Read the example file from the public/examples directory
    const examplesDir = path.join(process.cwd(), 'public', 'examples')
    const filePath = path.join(examplesDir, exampleFiles[id])

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Example file not found' },
        { status: 404 }
      )
    }

    // Read file content
    const content = fs.readFileSync(filePath, 'utf-8')

    // Return the code with proper headers
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="${exampleFiles[id]}"`,
      },
    })
  } catch (error) {
    console.error('Error fetching example:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
