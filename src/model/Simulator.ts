import CardApplierManager from 'cards/CardApplierManager'
import CardMapping from './CardMapping'
import CardType from './CardType'
import Lock from './Lock'
import LockConfig from './LockConfig'

const DEBUG: boolean = true

// TODO: delete after debugging
function prettyPrint (cm: CardMapping): void {
  console.log('G:', cm.getGreen(), ', R:', cm.getRed(), ', S:', cm.getSticky(),
    ', F:', cm.getFreeze(),
    ', Y+3:', cm.getCardsOfType(CardType.YELLOW_PLUS3),
    ', Y+2:', cm.getCardsOfType(CardType.YELLOW_PLUS2),
    ', Y+1:', cm.getCardsOfType(CardType.YELLOW_PLUS1),
    ', Y-1:', cm.getCardsOfType(CardType.YELLOW_MINUS1),
    ', Y-2:', cm.getCardsOfType(CardType.YELLOW_MINUS2),
    ', D:', cm.getDouble(), ', RT:', cm.getReset(), ', GA: ', cm.getGoAgain()
  )
}

class Range {
  min: number = Number.MAX_SAFE_INTEGER
  max: number = Number.MIN_SAFE_INTEGER
  total: number = 0
  ave: number = 0
}

export class SimulatorResults {
  public draws = new Range()
  public resets = new Range()
  public minutes = new Range()
}

/**
 *
 * Needs to run without modifying the LockConfig it receives in constructor
 */
class Simulator {
  private readonly config: LockConfig
  private readonly numberOfSimulations: number
  private readonly manager: CardApplierManager
  private simulationCount: number = 0
  // TODO: Make results private and provide getter ?
  results = new SimulatorResults()

  constructor (config: LockConfig, numberOfSimulations: number = 100) {
    this.config = config
    this.numberOfSimulations = numberOfSimulations
    this.manager = new CardApplierManager()
    for (let i = 0; i < this.numberOfSimulations; i++) {
      this.doOneSimulation()
    }
    // TODO: remove when thoroughly tested
    if (DEBUG) {
      console.log('Draws', this.results.draws.min, this.results.draws.ave, this.results.draws.max)
      console.log('Resets', this.results.resets.min, this.results.resets.ave, this.results.resets.max)
      console.log('Minutes', this.results.minutes.min, this.results.minutes.ave, this.results.minutes.max)
    }
  }

  private doOneSimulation (): void {
    const lock = new Lock(this.config)
    let nextPossibleDraw = lock.elapsedMinutes + lock.nextDraw
    // TODO: remove output when de-bugged
    if (DEBUG) {
      prettyPrint(lock.getCards())
      console.log('Draws', lock.draws, 'Resets', lock.resets, 'Chances', lock.chances,
        'Minutes at last draw', Math.round(lock.elapsedMinutes),
        'Next draw at', Math.round(nextPossibleDraw), '\n')
    }

    while (!lock.isFinished()) {
      lock.update(nextPossibleDraw)
      const card: CardType = lock.drawCard()
      if (DEBUG) {
        console.log('Draw', lock.draws, '->', card)
      }
      this.manager.apply(lock, card)
      // TODO : Remove console output when done testing
      nextPossibleDraw = lock.elapsedMinutes + lock.nextDraw
      if (DEBUG) {
        prettyPrint(lock.getCards())
        if (lock.freeze?.endTime !== undefined) {
          const duration = lock.freeze.endTime - lock.freeze.startTime
          console.log('Lock frozen for', duration, 'minutes')
        }
        console.log('Draws', lock.draws, 'Resets', lock.resets, 'Chances', lock.chances,
          'Minutes at last draw', Math.round(lock.elapsedMinutes),
          'Next draw at', Math.round(nextPossibleDraw), '\n')
      }
    } // end while
    // simulation run finished, so update count and results
    this.simulationCount++
    // TODO : ? Refactor to avoid repeating code? - Probably not worth it and Range would be more obtuse
    this.updateResults(this.results.draws, lock.draws, this.simulationCount)
    this.updateResults(this.results.resets, lock.resets, this.simulationCount)
    this.updateResults(this.results.minutes, lock.elapsedMinutes, this.simulationCount)
  }

  private updateResults (range: Range, value: number, count: number): void {
    if (value < range.min) {
      range.min = value
    }
    if (value > range.max) {
      range.max = value
    }
    range.total += value
    range.ave = range.total / count
  }
}

export default Simulator
