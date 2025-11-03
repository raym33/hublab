import type { HubLab } from '../client'
import type { ThemeConfig } from '../types'

export class Themes {
  constructor(private client: HubLab) {}

  async list(): Promise<ThemeConfig[]> {
    const { data } = await this.client.get<{ themes: ThemeConfig[] }>('/themes')
    return data.themes
  }

  async get(themeId: string): Promise<ThemeConfig> {
    const { data } = await this.client.get<{ theme: ThemeConfig }>(`/themes/${themeId}`)
    return data.theme
  }
}
