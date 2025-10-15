import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const serviceId = parseInt(params.id)
    
    if (isNaN(serviceId) || serviceId < 1) {
      return NextResponse.json(
        { error: 'Invalid service ID' },
        { status: 400 }
      )
    }

    // Simular datos de servicios predefinidos
    const predefinedServices = {
      1: {
        id: 1,
        provider: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        title: 'Desarrollo Web Full-Stack',
        description: 'Desarrollo completo de aplicaciones web modernas con React, Node.js y bases de datos.',
        price: '1000000000000000000', // 1 ETH en wei
        tokenType: 0, // ETH
        category: 0, // Desarrollo
        isActive: true,
        minReputation: '100'
      },
      2: {
        id: 2,
        provider: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        title: 'Consultoría Blockchain',
        description: 'Asesoramiento especializado en implementación de soluciones blockchain y smart contracts.',
        price: '500000000000000000', // 0.5 ETH en wei
        tokenType: 1, // ARB
        category: 1, // Consultoría
        isActive: true,
        minReputation: '200'
      },
      3: {
        id: 3,
        provider: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        title: 'Diseño UI/UX',
        description: 'Diseño de interfaces de usuario modernas y experiencias de usuario optimizadas.',
        price: '300000000000000000', // 0.3 ETH en wei
        tokenType: 0, // ETH
        category: 2, // Diseño
        isActive: true,
        minReputation: '50'
      }
    }

    const service = predefinedServices[serviceId as keyof typeof predefinedServices]
    
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error('Error fetching service:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
