import type { ValidationConfig } from './types'
import { loadConfig } from 'bunfig'

export const defaultConfig: ValidationConfig = {
  verbose: true,
}

// eslint-disable-next-line antfu/no-top-level-await
export const config: ValidationConfig = await loadConfig({
  name: 'validation',
  defaultConfig,
})
