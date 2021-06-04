import CardMapping from './CardMapping'
import CardType, { ALL_CARDS, ALL_YELLOWS, DOUBLEABLE_CARDS, RESETABLE_CARDS } from './CardType'
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
  public intervals = new Range()
  public draws = new Range()
  public resets = new Range()
  public minutes = new Range()
}

/**
 *
 * Needs to run without modifying the LockConfig it receives in constructor
 */
class Simulator {
  // these two should be from some configuration file
  MAX_REDS = 599
  MAX_YELLOWS = 299 // Current CK game allows only 299 of each type of yellow, for total of 1495

  private readonly config: LockConfig
  private readonly numberOfSimulations: number
  // TODO: Make results private? and provide getter
  results = new SimulatorResults()

  // the number of intervals where a green cannot be drawn
  // currently CK prohibits green on first draw and possibly
  // additional draws based on minimum reds
  private readonly noGreenIntervals: number = 1
  private readonly resetable: boolean
  private readonly resetInMinutes: number = Number.MAX_SAFE_INTEGER
  private readonly maximumResets: number = 0

  private simulationCount: number = 0

  constructor (config: LockConfig, numberOfSimulations: number = 100) {
    this.config = config
    this.numberOfSimulations = numberOfSimulations

    // http://chastikey.com/help/doku.php?id=minimum_lock_durations
    const minReds = config.initial.min.getRed()
    if (minReds > 1 && minReds !== config.initial.max.getRed()) {
      this.noGreenIntervals = minReds
    }

    this.resetable = config.autoResets.enabled
    if (this.resetable) {
      this.resetInMinutes =
        (config.autoResets.frequencyHours === undefined) ? Number.MAX_SAFE_INTEGER
          : config.autoResets.frequencyHours * 60
      this.maximumResets = (config.autoResets.maximumResets === undefined) ? 0 : config.autoResets.maximumResets
    }

    for (let i = 0; i < this.numberOfSimulations; i++) {
      this.doOneSimulation()
    }
    // TODO: remove when thoroughly tested
    if (DEBUG) {
      console.log('Intervals', this.results.intervals.min, this.results.intervals.ave, this.results.intervals.max)
      console.log('Draws', this.results.draws.min, this.results.draws.ave, this.results.draws.max)
      console.log('Resets', this.results.resets.min, this.results.resets.ave, this.results.resets.max)
      console.log('Minutes', this.results.minutes.min, this.results.minutes.ave, this.results.minutes.max)
    }
  }

  private doOneSimulation (): void {
    const lock = new Lock(this.config)
    const deck: CardMapping = lock.getCards()
    const originalDeck: CardMapping = deck.copyDeep()
    let intervals = 0 // number of intervals elapsed
    let draws = 0 // number of draws made
    let resets = 0 // number of resets (card resetss and autoresets are both included)
    let resetting: boolean = this.resetable // local variable to control autoresets
    let autoResets = 0 // number of autoresets done
    let nextResetInterval = Number.MAX_SAFE_INTEGER // interval at which to do next autoreset
    if (resetting) {
      // schedule first autoreset
      // TODO: research issues with division. Is 30 / 15 always exactly equal to 2 in Javascript
      // If not, resets could be delayed one interval?
      // In original CK game, I believe reset times are always integer multiples of the interval
      // not sure if that's guaranteed with LockConfig
      nextResetInterval = this.resetInMinutes / this.config.intervalMinutes
    }

    // TODO: remove output when de-bugged
    if (DEBUG) {
      prettyPrint(deck)
      console.log('Draws: ', draws, 'Intervals:', intervals, ', Resets: ', resets,
        'Minutes: ', intervals * this.config.intervalMinutes)
      console.log()
    }
    let done = false
    while (!done) { // done will be modified when green(s) drawn
      // TODO: Consider using ! lock.isFinished()

      if (resetting) {
        if (DEBUG) {
          console.log('Next autoreset at interval', nextResetInterval)
        }
        if (intervals >= nextResetInterval) {
          // reset all cards to original distribution
          ALL_CARDS.forEach(cd => deck.setCardsOfType(cd, originalDeck.getCardsOfType(cd)))
          autoResets++ // autoreset counter
          resets++ // total reset counter
          if (DEBUG) {
            console.log('Auto-reset occurred')
            prettyPrint(deck)
            console.log('')
          }
          if (autoResets < this.maximumResets) {
            // schedule next autoreset
            nextResetInterval += this.resetInMinutes / this.config.intervalMinutes
          } else { // no more auto-resets
            resetting = false
          }
        }
      }

      const card: CardType = deck.drawRandomType()
      draws++
      // TODO: use appliers? or write code for efficiency?
      // TODO: ? reorder ifs for better efficiency: Reds, Yellows, then rest
      if (card === CardType.GREEN) {
        // check to see if GREEN can be drawn based on miminum reds
        // need to also check and make sure that there are other cards left beside green
        if (intervals >= this.noGreenIntervals || deck.getTotalCards() === deck.getGreen()) {
          deck.setCardsOfType(CardType.GREEN, deck.getCardsOfType(CardType.GREEN) - 1)
          if (!this.config.multipleGreensRequired || deck.getCardsOfType(CardType.GREEN) === 0) {
            done = true
          }
        } else {
          // ignore draw, so roll back increment of draws that was done after card draw
          draws--
        }
      } else if (card === CardType.RED) {
        deck.setCardsOfType(CardType.RED, deck.getCardsOfType(CardType.RED) - 1)
        intervals++
      } else if (card === CardType.STICKY) {
        intervals++
      } else if (card === CardType.FREEZE) {
        deck.setCardsOfType(CardType.FREEZE, deck.getCardsOfType(CardType.FREEZE) - 1)
        intervals += 3 // 2 - 4 intervals, will use 3 as average, rather than decimal numbers
      } else if (card === CardType.YELLOW_MINUS1) {
        deck.setCardsOfType(CardType.YELLOW_MINUS1, deck.getCardsOfType(CardType.YELLOW_MINUS1) - 1)
        const reds = deck.getCardsOfType(CardType.RED) - 1
        deck.setCardsOfType(CardType.RED, Math.max(0, reds))
      } else if (card === CardType.YELLOW_MINUS2) {
        deck.setCardsOfType(CardType.YELLOW_MINUS2, deck.getCardsOfType(CardType.YELLOW_MINUS2) - 1)
        const reds = deck.getCardsOfType(CardType.RED) - 2
        deck.setCardsOfType(CardType.RED, Math.max(0, reds))
      } else if (card === CardType.YELLOW_PLUS1) {
        deck.setCardsOfType(CardType.YELLOW_PLUS1, deck.getCardsOfType(CardType.YELLOW_PLUS1) - 1)
        const reds = deck.getCardsOfType(CardType.RED) + 1
        deck.setCardsOfType(CardType.RED, Math.min(this.MAX_REDS, reds))
      } else if (card === CardType.YELLOW_PLUS2) {
        deck.setCardsOfType(CardType.YELLOW_PLUS2, deck.getCardsOfType(CardType.YELLOW_PLUS2) - 1)
        const reds = deck.getCardsOfType(CardType.RED) + 2
        deck.setCardsOfType(CardType.RED, Math.min(this.MAX_REDS, reds))
      } else if (card === CardType.YELLOW_PLUS3) {
        deck.setCardsOfType(CardType.YELLOW_PLUS3, deck.getCardsOfType(CardType.YELLOW_PLUS3) - 1)
        const reds = deck.getCardsOfType(CardType.RED) + 3
        deck.setCardsOfType(CardType.RED, Math.min(this.MAX_REDS, reds))
      } else if (card === CardType.RESET) {
        deck.setCardsOfType(CardType.RESET, deck.getCardsOfType(CardType.RESET) - 1)
        // reset greens, reds, yellows to original count
        RESETABLE_CARDS.forEach(cd => {
          deck.setCardsOfType(cd, originalDeck.getCardsOfType(cd))
        })
        resets++
      } else if (card === CardType.DOUBLE) {
        deck.setCardsOfType(CardType.DOUBLE, deck.getCardsOfType(CardType.DOUBLE) - 1)
        DOUBLEABLE_CARDS.forEach(cd => {
          deck.setCardsOfType(cd, 2 * deck.getCardsOfType(cd))
        })
        // check maximums and adjust as needed
        deck.setCardsOfType(CardType.RED, Math.min(this.MAX_REDS, deck.getCardsOfType(CardType.RED)))
        ALL_YELLOWS.forEach(cd => {
          deck.setCardsOfType(cd, Math.min(this.MAX_YELLOWS, deck.getCardsOfType(cd)))
        })
      } else if (card === CardType.GO_AGAIN) {
        // shouldn't happen unless ALL_CARDS is changed to include GO_AGAIN
        // or the initial config includes GO_AGAIN cards
        // but if it does, the simulator will not count draws of GO_AGAIN cards
        deck.setCardsOfType(card, deck.getCardsOfType(card))
        draws-- // roll back draw count
      } else {
      // TODO: Remove this else block after testing
        if (DEBUG) {
          console.log('ERROR: unexpected card:', card)
        }
      }

      // TODO : Remove console output when done testing
      if (DEBUG) {
        prettyPrint(deck)
        console.log('Draws: ', draws, 'Intervals:', intervals, ', Resets: ', resets,
          'Minutes: ', intervals * this.config.intervalMinutes)
        console.log(' ')
      }
    } // end while
    // simulation run finished, so update count and results
    this.simulationCount++
    // TODO : ? Refactor to avoid repeating code? - Probably not worth it and Range would be more obtuse
    this.updateResults(this.results.intervals, intervals, this.simulationCount)
    this.updateResults(this.results.draws, draws, this.simulationCount)
    this.updateResults(this.results.resets, resets, this.simulationCount)
    const minutes = intervals * this.config.intervalMinutes
    this.updateResults(this.results.minutes, minutes, this.simulationCount)
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
