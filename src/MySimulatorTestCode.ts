import CardType from './model/CardType'
import CardMapping from './model/CardMapping'
import LockConfig from './model/LockConfig'
import Simulator, { SimulatorResults } from 'model/Simulator'

export function runSimulator (): void {
  const initial = new Map()
  initial.set(CardType.GREEN, 5)
  initial.set(CardType.RED, 10)
  initial.set(CardType.STICKY, 5)
  initial.set(CardType.DOUBLE, 0)
  initial.set(CardType.FREEZE, 5)
  initial.set(CardType.YELLOW_MINUS1, 2)
  initial.set(CardType.YELLOW_MINUS2, 2)
  initial.set(CardType.YELLOW_PLUS1, 2)
  initial.set(CardType.YELLOW_PLUS2, 2)
  initial.set(CardType.YELLOW_PLUS3, 2)
  initial.set(CardType.RESET, 1)
  initial.set(CardType.DOUBLE, 1)

  const initialMin = new CardMapping(initial)
  const initialMax = initialMin.copyDeep()
  initialMax.setCardsOfType(CardType.RED, 11)

  const lockConfig: LockConfig = {
    intervalMinutes: 60,
    cumulative: true,
    multipleGreensRequired: true,
    initial: {
      min: initialMin,
      max: initialMax
    },
    autoResets: {
      enabled: true,
      frequencyHours: 24, // 1440 = 60 * 24
      maximumResets: 3
    }
  }

  const sim: Simulator = new Simulator(lockConfig, 100)
  // sim.doOneSimulation()
  const results: SimulatorResults = sim.results
  console.log('Draws', results.draws.min, results.draws.ave, results.draws.max)
  console.log('Resets', results.resets.min, results.resets.ave, results.resets.max)
  console.log('Minutes', results.minutes.min, results.minutes.ave, results.minutes.max)
}
