import type { HubLab } from '../client'

export interface CapsuleDefinition {
  id: string
  type: string
  name: string
  category: string
  description: string
  icon: string
  props: any[]
  requiredIntegrations?: string[]
  examples: any[]
}

export class Catalog {
  constructor(private client: HubLab) {}

  async listCapsules(params?: {
    category?: string
    search?: string
  }): Promise<CapsuleDefinition[]> {
    const queryParams = new URLSearchParams()
    if (params?.category) queryParams.set('category', params.category)
    if (params?.search) queryParams.set('search', params.search)

    const query = queryParams.toString()
    const { data } = await this.client.get<{ capsules: CapsuleDefinition[] }>(
      `/catalog/capsules${query ? '?' + query : ''}`
    )
    return data.capsules
  }

  async getCapsule(capsuleType: string): Promise<CapsuleDefinition> {
    const { data } = await this.client.get<{ capsule: CapsuleDefinition }>(
      `/catalog/capsules/${capsuleType}`
    )
    return data.capsule
  }
}
