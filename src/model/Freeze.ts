export enum FreezeType {
  CARD = 'CARD',
  KEYHOLDER = 'KEYHOLDER'
}

interface Freeze {
  source: FreezeType
  startTime: number // minutes since the start of the lock
  endTime?: number // minutes since start of lock, undefined for KH freeze until ended.
}

export default Freeze
