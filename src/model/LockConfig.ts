import CardMapping from './CardMapping'

interface LockConfig {
  intervalMinutes: number
  initial: {
    max: CardMapping
    min: CardMapping
  }
  multipleGreensRequired: boolean
  autoResets: {
    enabled: boolean
    frequencyHours?: number
    maximumResets?: number
  }
}

export default LockConfig
