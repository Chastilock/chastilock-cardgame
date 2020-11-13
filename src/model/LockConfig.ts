import CardMapping from './CardMapping';

type LockConfig = {
  interval: number,
  initial: CardMapping,
  multipleGreensRequired: boolean,
  autoResets: {
    enabled: boolean,
    frequencyHours?: number,
    maximumResets?: number
  }
}

export default LockConfig;