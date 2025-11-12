// ============================================
// Projects Resource
// Methods for managing projects
// ============================================

import type { HubLab } from '../client'
import type {
  Project,
  CreateProjectRequest,
  ExportRequest,
  DeployRequest,
  AddCapsuleRequest,
  Capsule,
  IntegrationConfig,
} from '../types'

export class Projects {
  constructor(private client: HubLab) {}

  /**
   * Create a new project
   */
  async create(data: CreateProjectRequest): Promise<Project> {
    const { data: result } = await this.client.post<{ project: Project }>(
      '/projects',
      data
    )
    return result.project
  }

  /**
   * List all projects
   */
  async list(params?: {
    page?: number
    limit?: number
    status?: string
    template?: string
  }): Promise<{ projects: Project[]; pagination: any }> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.set('page', params.page.toString())
    if (params?.limit) queryParams.set('limit', params.limit.toString())
    if (params?.status) queryParams.set('status', params.status)
    if (params?.template) queryParams.set('template', params.template)

    const query = queryParams.toString()
    const { data } = await this.client.get<{ projects: Project[]; pagination: any }>(
      `/projects${query ? '?' + query : ''}`
    )
    return data
  }

  /**
   * Get a project by ID
   */
  async get(projectId: string): Promise<Project> {
    const { data } = await this.client.get<{ project: Project }>(`/projects/${projectId}`)
    return data.project
  }

  /**
   * Update a project
   */
  async update(
    projectId: string,
    data: Partial<Pick<Project, 'name' | 'description' | 'theme' | 'status'>>
  ): Promise<Project> {
    const { data: result } = await this.client.put<{ project: Project }>(
      `/projects/${projectId}`,
      data
    )
    return result.project
  }

  /**
   * Delete a project
   */
  async delete(projectId: string): Promise<void> {
    await this.client.delete(`/projects/${projectId}`)
  }

  /**
   * Add a capsule to a project
   */
  async addCapsule(projectId: string, data: AddCapsuleRequest): Promise<Capsule> {
    const { data: result } = await this.client.post<{ capsule: Capsule }>(
      `/projects/${projectId}/capsules`,
      data
    )
    return result.capsule
  }

  /**
   * List capsules in a project
   */
  async listCapsules(projectId: string): Promise<Capsule[]> {
    const { data } = await this.client.get<{ capsules: Capsule[] }>(
      `/projects/${projectId}/capsules`
    )
    return data.capsules
  }

  /**
   * Update a capsule
   */
  async updateCapsule(
    projectId: string,
    capsuleId: string,
    data: Partial<Capsule>
  ): Promise<Capsule> {
    const { data: result } = await this.client.put<{ capsule: Capsule }>(
      `/projects/${projectId}/capsules/${capsuleId}`,
      data
    )
    return result.capsule
  }

  /**
   * Delete a capsule
   */
  async deleteCapsule(projectId: string, capsuleId: string): Promise<void> {
    await this.client.delete(`/projects/${projectId}/capsules/${capsuleId}`)
  }

  /**
   * Add an integration to a project
   */
  async addIntegration(
    projectId: string,
    data: IntegrationConfig
  ): Promise<IntegrationConfig> {
    const { data: result } = await this.client.post<{ integration: IntegrationConfig }>(
      `/projects/${projectId}/integrations`,
      data
    )
    return result.integration
  }

  /**
   * List integrations in a project
   */
  async listIntegrations(projectId: string): Promise<IntegrationConfig[]> {
    const { data } = await this.client.get<{ integrations: IntegrationConfig[] }>(
      `/projects/${projectId}/integrations`
    )
    return data.integrations
  }

  /**
   * Delete an integration
   */
  async deleteIntegration(projectId: string, integrationType: string): Promise<void> {
    await this.client.delete(`/projects/${projectId}/integrations/${integrationType}`)
  }

  /**
   * Export a project
   */
  async export(projectId: string, data: ExportRequest): Promise<{ files: any[] }> {
    const { data: result } = await this.client.post<{ files: any[] }>(
      `/projects/${projectId}/export`,
      data
    )
    return result
  }

  /**
   * Deploy a project
   */
  async deploy(
    projectId: string,
    data: DeployRequest
  ): Promise<{ deploymentId: string; url: string }> {
    const { data: result } = await this.client.post<{
      deploymentId: string
      url: string
    }>(`/projects/${projectId}/deploy`, data)
    return result
  }

  /**
   * Generate preview URL
   */
  async preview(projectId: string): Promise<{ previewUrl: string; expiresAt: string }> {
    const { data } = await this.client.post<{ previewUrl: string; expiresAt: string }>(
      `/projects/${projectId}/preview`
    )
    return data
  }
}
