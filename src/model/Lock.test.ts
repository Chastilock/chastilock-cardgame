import Lock from './Lock'
import CardMapping from './CardMapping'
import CardType from './CardType'
import LockConfig from './LockConfig'
import Config from './Config'

const initial = new Map()
initial.set(CardType.RED, 100)
initial.set(CardType.DOUBLE, 2)
initial.set(CardType.FREEZE, 2)
initial.set(CardType.YELLOW_MINUS1, 10)
initial.set(CardType.YELLOW_PLUS1, 10)
initial.set(CardType.RESET, 1)

const initialCardMapping = new CardMapping(initial)

export const lockConfig: LockConfig = {
  intervalMinutes: 30,
  multipleGreensRequired: false,
  initial: {
    min: initialCardMapping,
    max: initialCardMapping
  },
  autoResets: {
    enabled: false
  }
}

describe('Lock', () => {
  it('sums yellow cards correctly', () => {
    const cards: CardMapping = new CardMapping()
    cards.setCardsOfType(CardType.YELLOW_MINUS1, 1)
    cards.setCardsOfType(CardType.YELLOW_MINUS2, 2)
    cards.setCardsOfType(CardType.YELLOW_PLUS1, 4)
    cards.setCardsOfType(CardType.YELLOW_PLUS2, 5)
    cards.setCardsOfType(CardType.YELLOW_PLUS3, 6)

    const lock = new Lock(lockConfig, cards)

    expect(lock.getCards().getYellow()).toEqual(18)
  })

  it('applies the limit correctly', () => {
    const config: Config = {
      max: {
        [CardType.RED]: 150
      }
    }

    const lock = new Lock(lockConfig, initialCardMapping)

    lock.getCards().setCardsOfType(CardType.RED, 200)

    expect(lock.getCards().getRed()).toBe(200)

    // Apply limits
    lock.limit(config)

    expect(lock.getCards().getRed()).toBe(150)
  })
})
