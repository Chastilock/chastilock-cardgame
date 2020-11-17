import CardApplierManager from './CardApplierManager'
import Lock from 'model/Lock'
import { lockConfig } from 'model/Lock.test'
import CardMapping from 'model/CardMapping'
import CardType, { ALL_YELLOWS } from 'model/CardType'

describe('CardApplierManager', () => {
  const applierManager = new CardApplierManager()

  it('applies red card correctly', () => {
    const lock = new Lock(lockConfig, new CardMapping(new Map()))
    lock.getCards().setCardsOfType(CardType.RED, 100)

    applierManager.apply(lock, CardType.RED)

    expect(lock.getNextDraw()).toBe(lockConfig.intervalMinutes)
    expect(lock.getCards().getRed()).toBe(99)
  })

  it('applies green card correctly', () => {
    const lock = new Lock(lockConfig, new CardMapping(new Map()))
    lock.getCards().setCardsOfType(CardType.GREEN, 10)

    applierManager.apply(lock, CardType.GREEN)

    expect(lock.getNextDraw()).toBe(0)
    expect(lock.getCards().getGreen()).toBe(9)
    expect(lock.greensDrawn).toBe(1)
  })

  it('applies yellow cards correctly', () => {
    const lock = new Lock(lockConfig, new CardMapping(new Map()))
    lock.getCards().setCardsOfType(CardType.RED, 100)

    ALL_YELLOWS.forEach(yellowType => {
      lock.getCards().setCardsOfType(yellowType, 2)
    })

    applierManager.apply(lock, CardType.YELLOW_PLUS1)
    expect(lock.getNextDraw()).toBe(0)
    expect(lock.getCards().getRed()).toBe(101)
    expect(lock.getCards().getYellow()).toBe(11)

    applierManager.apply(lock, CardType.YELLOW_PLUS2)
    expect(lock.getNextDraw()).toBe(0)
    expect(lock.getCards().getRed()).toBe(103)
    expect(lock.getCards().getYellow()).toBe(10)

    applierManager.apply(lock, CardType.YELLOW_PLUS3)
    expect(lock.getNextDraw()).toBe(0)
    expect(lock.getCards().getRed()).toBe(106)
    expect(lock.getCards().getYellow()).toBe(9)

    applierManager.apply(lock, CardType.YELLOW_MINUS1)
    expect(lock.getNextDraw()).toBe(0)
    expect(lock.getCards().getRed()).toBe(105)
    expect(lock.getCards().getYellow()).toBe(8)

    applierManager.apply(lock, CardType.YELLOW_MINUS2)
    expect(lock.getNextDraw()).toBe(0)
    expect(lock.getCards().getRed()).toBe(103)
    expect(lock.getCards().getYellow()).toBe(7)

    applierManager.apply(lock, CardType.YELLOW_MINUS3)
    expect(lock.getNextDraw()).toBe(0)
    expect(lock.getCards().getRed()).toBe(100)
    expect(lock.getCards().getYellow()).toBe(6)
  })

  it('applies reset cards correctly', () => {
    const lock = new Lock(lockConfig, new CardMapping(new Map()))
    lock.getCards().setCardsOfType(CardType.RED, 1)
    lock.getCards().setCardsOfType(CardType.GREEN, 10)
    lock.getCards().setCardsOfType(CardType.YELLOW_PLUS1, 5)
    lock.getCards().setCardsOfType(CardType.RESET, 2)
    lock.getCards().setCardsOfType(CardType.DOUBLE, 3)
    lock.greensDrawn = 5

    applierManager.apply(lock, CardType.RESET)

    // greens, reds and yellows should be reset
    expect(lock.getCards().getRed()).toBe(lockConfig.initial.getRed())
    expect(lock.getCards().getGreen()).toBe(lockConfig.initial.getGreen())
    expect(lock.getCards().getYellow()).toBe(lockConfig.initial.getYellow())

    // one reset should have been removed
    expect(lock.getCards().getReset()).toBe(1)

    // double up should be untouched
    expect(lock.getCards().getDouble()).toBe(3)

    // greens drawn should also be reset
    expect(lock.greensDrawn).toBe(0)
  })

  it('applies sticky cards correctly', () => {
    const lock = new Lock(lockConfig, new CardMapping(new Map()))
    lock.getCards().setCardsOfType(CardType.STICKY, 20)

    applierManager.apply(lock, CardType.STICKY)

    expect(lock.getNextDraw()).toBe(lockConfig.intervalMinutes)
    expect(lock.getCards().getSticky()).toBe(20)
  })

  it('applies freeze cards correctly', () => {
    const lock = new Lock(lockConfig, new CardMapping(new Map()))
    lock.getCards().setCardsOfType(CardType.FREEZE, 20)

    applierManager.apply(lock, CardType.FREEZE)

    expect(lock.nextDraw > 2 * lockConfig.intervalMinutes && lock.nextDraw < 4 * lockConfig.intervalMinutes).toBeTruthy()
    expect(lock.getCards().getFreeze()).toBe(19)
  })
})
