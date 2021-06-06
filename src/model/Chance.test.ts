import Lock from './Lock'
import CardMapping from './CardMapping'
import CardType, { ALL_CARDS, DOUBLEABLE_CARDS } from './CardType'
import LockConfig from './LockConfig'
// import Config from './Config'
import CardApplierManager from 'cards/CardApplierManager'
import { FreezeType } from './Freeze'

const FiveOfEveryCard = new CardMapping()
ALL_CARDS.forEach(value => {
  FiveOfEveryCard.setCardsOfType(value, 5)
})

const lockConfig30cum: LockConfig = {
  intervalMinutes: 30,
  cumulative: true,
  multipleGreensRequired: true,
  initial: {
    min: FiveOfEveryCard.copyDeep(),
    max: FiveOfEveryCard.copyDeep()
  },
  autoResets: {
    enabled: false
  }
}

const lockConfig30NONcum: LockConfig = {
  intervalMinutes: 30,
  cumulative: false,
  multipleGreensRequired: true,
  initial: {
    min: FiveOfEveryCard.copyDeep(),
    max: FiveOfEveryCard.copyDeep()
  },
  autoResets: {
    enabled: false
  }
}

const manager: CardApplierManager = new CardApplierManager()

class TestResults {
  chances: number
  chanceTime: number
  drawTime: number

  constructor (lock: Lock) {
    this.chances = lock.chances
    this.chanceTime = lock.lastChanceTime
    this.drawTime = lock.lastDrawTime
  }

  public valid (expectedChances: number,
    expectedLastChanceTime: number,
    expectedLastDrawTime: number): boolean {
    return expectedChances === this.chances &&
      expectedLastChanceTime === this.chanceTime &&
      expectedLastDrawTime === this.drawTime
  }
}

describe('Lock Chances Tests', () => {
  it('one chance given initially correctly', () => {
    const lock = new Lock(lockConfig30cum)

    expect(new TestResults(lock).valid(1, 0, 0)).toBe(true)
  })

  it('cumulative lock updates correctly as elapseMinutes is increased', () => {
    const lock = new Lock(lockConfig30cum)
    expect(new TestResults(lock).valid(1, 0, 0)).toBe(true)
    lock.update(29)
    expect(new TestResults(lock).valid(1, 0, 0)).toBe(true)
    lock.update(30)
    expect(new TestResults(lock).valid(2, 30, 0)).toBe(true)
    lock.update(149)
    expect(new TestResults(lock).valid(5, 120, 0)).toBe(true)
    lock.update(150)
    expect(new TestResults(lock).valid(6, 150, 0)).toBe(true)
    lock.update(300) // testing multiple chances at same time
    expect(new TestResults(lock).valid(11, 300, 0)).toBe(true)
  })

  it('NON-cumulative lock updates correctly as elapseMinutes is increased', () => {
    const lock = new Lock(lockConfig30NONcum)

    expect(new TestResults(lock).valid(1, 0, 0)).toBe(true)
    lock.update(29)
    expect(new TestResults(lock).valid(1, 0, 0)).toBe(true)
    lock.update(30)
    expect(new TestResults(lock).valid(1, 0, 0)).toBe(true)
    lock.update(149)
    expect(new TestResults(lock).valid(1, 0, 0)).toBe(true)
    lock.update(150)
    expect(new TestResults(lock).valid(1, 0, 0)).toBe(true)
    lock.update(300)
    expect(new TestResults(lock).valid(1, 0, 0)).toBe(true)
  })

  it('cumulative lock handles picking appropriately', () => {
    const lock = new Lock(lockConfig30cum)
    expect(new TestResults(lock).valid(1, 0, 0)).toBe(true)
    lock.update(305)
    expect(new TestResults(lock).valid(11, 300, 0)).toBe(true)
    lock.drawCard()
    // drawing alone shouldn't affect chances without applying
    expect(new TestResults(lock).valid(11, 300, 305)).toBe(true)
  })

  it('NON-cumulative lock handles picking appropriately', () => {
    const lock = new Lock(lockConfig30NONcum)
    expect(new TestResults(lock).valid(1, 0, 0)).toBe(true)
    lock.update(305)
    expect(new TestResults(lock).valid(1, 0, 0)).toBe(true)
    lock.drawCard()
    // drawing alone shouldn't affect chances without applying
    expect(new TestResults(lock).valid(1, 0, 305)).toBe(true)
  })

  it('Green Applier works correctly', () => {
    const lock = new Lock(lockConfig30cum)
    lock.update(305)
    expect(new TestResults(lock).valid(11, 300, 0)).toBe(true)
    let card = lock.drawCard()
    card = CardType.GREEN // simulate green being picked above
    manager.apply(lock, card)
    expect(new TestResults(lock).valid(11, 300, 305)).toBe(true)
    expect(lock.greensDrawn).toEqual(1)
    expect(lock.getCards().getCardsOfType(CardType.GREEN)).toEqual(
      FiveOfEveryCard.getCardsOfType(CardType.GREEN) - 1)
  })

  it('STICKY Applier works correctly', () => {
    const lock = new Lock(lockConfig30cum)
    lock.update(305)
    expect(new TestResults(lock).valid(11, 300, 0)).toBe(true)
    let card = lock.drawCard()
    card = CardType.STICKY // simulate sticky being picked
    manager.apply(lock, card)
    expect(new TestResults(lock).valid(10, 300, 305)).toBe(true)
    expect(lock.getCards().getCardsOfType(CardType.STICKY)).toEqual(
      FiveOfEveryCard.getCardsOfType(CardType.STICKY))
  })

  it('RED Applier works correctly', () => {
    const lock = new Lock(lockConfig30cum)
    lock.update(305)
    expect(new TestResults(lock).valid(11, 300, 0)).toBe(true)
    let card = lock.drawCard()
    card = CardType.RED // simulate red being picked
    manager.apply(lock, card)
    expect(new TestResults(lock).valid(10, 300, 305)).toBe(true)
    expect(lock.getCards().getCardsOfType(CardType.RED)).toEqual(
      FiveOfEveryCard.getCardsOfType(CardType.RED) - 1)
  })

  it('Yellow Applier works correctly', () => {
    const lock = new Lock(lockConfig30cum)
    lock.update(305)
    expect(new TestResults(lock).valid(11, 300, 0)).toBe(true)

    const RED_CARDS = 5

    // the following could be less with functional programming but best to be thorough here
    lock.getCards().setCardsOfType(CardType.RED, RED_CARDS)
    let card = lock.drawCard()
    card = CardType.YELLOW_PLUS3
    manager.apply(lock, card)
    expect(new TestResults(lock).valid(11, 300, 305)).toBe(true)
    expect(lock.getCards().getCardsOfType(CardType.YELLOW_PLUS3)).toEqual(
      FiveOfEveryCard.getCardsOfType(CardType.YELLOW_PLUS3) - 1)
    expect(lock.getCards().getCardsOfType(CardType.RED)).toEqual(RED_CARDS + 3)

    lock.getCards().setCardsOfType(CardType.RED, RED_CARDS)
    card = lock.drawCard()
    card = CardType.YELLOW_PLUS2
    manager.apply(lock, card)
    expect(new TestResults(lock).valid(11, 300, 305)).toBe(true)
    expect(lock.getCards().getCardsOfType(CardType.YELLOW_PLUS2)).toEqual(
      FiveOfEveryCard.getCardsOfType(CardType.YELLOW_PLUS2) - 1)
    expect(lock.getCards().getCardsOfType(CardType.RED)).toEqual(RED_CARDS + 2)

    lock.getCards().setCardsOfType(CardType.RED, RED_CARDS)
    card = lock.drawCard()
    card = CardType.YELLOW_PLUS1
    manager.apply(lock, card)
    expect(new TestResults(lock).valid(11, 300, 305)).toBe(true)
    expect(lock.getCards().getCardsOfType(CardType.YELLOW_PLUS1)).toEqual(
      FiveOfEveryCard.getCardsOfType(CardType.YELLOW_PLUS1) - 1)
    expect(lock.getCards().getCardsOfType(CardType.RED)).toEqual(RED_CARDS + 1)

    lock.getCards().setCardsOfType(CardType.RED, RED_CARDS)
    card = lock.drawCard()
    card = CardType.YELLOW_MINUS1
    manager.apply(lock, card)
    expect(new TestResults(lock).valid(11, 300, 305)).toBe(true)
    expect(lock.getCards().getCardsOfType(CardType.YELLOW_MINUS1)).toEqual(
      FiveOfEveryCard.getCardsOfType(CardType.YELLOW_MINUS1) - 1)
    expect(lock.getCards().getCardsOfType(CardType.RED)).toEqual(RED_CARDS - 1)

    lock.getCards().setCardsOfType(CardType.RED, RED_CARDS)
    card = lock.drawCard()
    card = CardType.YELLOW_MINUS2
    manager.apply(lock, card)
    expect(new TestResults(lock).valid(11, 300, 305)).toBe(true)
    expect(lock.getCards().getCardsOfType(CardType.YELLOW_MINUS2)).toEqual(
      FiveOfEveryCard.getCardsOfType(CardType.YELLOW_MINUS2) - 1)
    expect(lock.getCards().getCardsOfType(CardType.RED)).toEqual(RED_CARDS - 2)
  })

  it('DOUBLE Applier works correctly', () => {
    const lock = new Lock(lockConfig30cum)
    lock.update(305)
    expect(new TestResults(lock).valid(11, 300, 0)).toBe(true)
    let card = lock.drawCard()
    card = CardType.DOUBLE // simulate red being picked
    manager.apply(lock, card)
    expect(new TestResults(lock).valid(11, 300, 305)).toBe(true)
    expect(lock.getCards().getCardsOfType(CardType.DOUBLE)).toEqual(
      FiveOfEveryCard.getCardsOfType(CardType.DOUBLE) - 1)
    DOUBLEABLE_CARDS.forEach(value => {
      expect(lock.getCards().getCardsOfType(value)).toEqual(
        2 * FiveOfEveryCard.getCardsOfType(value))
    })
  })

  it('FREEZE applier works correctly', () => {
    const lock = new Lock(lockConfig30cum)
    lock.update(300)
    expect(new TestResults(lock).valid(11, 300, 0)).toBe(true)
    lock.elapsedMinutes = 310
    let card = lock.drawCard() // triggers changes to chance, etc.
    card = CardType.FREEZE // simulate reset being picked
    manager.apply(lock, card)
    expect(lock.getCards().getCardsOfType(CardType.FREEZE)).toEqual(
      FiveOfEveryCard.getCardsOfType(CardType.FREEZE) - 1)
    expect(new TestResults(lock).valid(10, 300, 310)).toBe(true)
    expect(lock.freeze).toBeDefined() // freeze created?
    if (lock.freeze !== undefined) {
      expect(lock.freeze.source).toEqual(FreezeType.CARD)
      expect(lock.freeze.startTime).toEqual(310)
      expect(lock.freeze.endTime).toBeDefined()
      if (lock.freeze.endTime !== undefined) {
        expect(lock.freeze.endTime - lock.freeze.startTime).toBeLessThanOrEqual(4 * lock.config.intervalMinutes)
        expect(lock.freeze.endTime - lock.freeze.startTime).toBeGreaterThanOrEqual(2 * lock.config.intervalMinutes)
      }
    }
  })

  it('card freeze ends correctly on lock', () => {
    // I don't think a separate test is needed for a non-cumulative lock
    // since neither FreezeCardApplier nor Lock.checkForFreezeExpiration()
    // makes a distinction between cumulative and non-cumulative locks.
    const lock = new Lock(lockConfig30cum)
    lock.update(310)
    let card = lock.drawCard() // triggers changes to chance, etc.
    card = CardType.FREEZE // simulate reset being picked
    manager.apply(lock, card)
    expect(lock.freeze).toBeDefined()
    if (lock.freeze !== undefined) {
      // so I can test if it ends appropriately
      lock.freeze.endTime = lock.freeze.startTime + 3 * lock.config.intervalMinutes
      expect(lock.freeze.endTime).toEqual(400) // (310 + 3 * 30)
      lock.update(399) // lock should still be frozen
      expect(new TestResults(lock).valid(10, 300, 310)).toBe(true)
      expect(lock.freeze).toBeDefined()
      lock.update(400)
      expect(lock.freeze).toBeUndefined()
      // one chance given when card freeze ends
      expect(new TestResults(lock).valid(11, 400, 310)).toBe(true)
      lock.update(429)
      expect(new TestResults(lock).valid(11, 400, 310)).toBe(true)
      lock.update(430)
      expect(new TestResults(lock).valid(12, 430, 310)).toBe(true)
    }
  })

  it('cumulative lock handles card resets correctly', () => {
    const lock = new Lock(lockConfig30cum)
    lock.update(300)
    expect(new TestResults(lock).valid(11, 300, 0)).toBe(true)
    lock.elapsedMinutes = 310
    let card = lock.drawCard() // triggers changes to chance, etc.
    card = CardType.RESET // simulate reset being picked
    manager.apply(lock, card)
    expect(lock.getCards().getCardsOfType(CardType.RESET)).toEqual(
      FiveOfEveryCard.getCardsOfType(CardType.RESET) - 1)
    expect(new TestResults(lock).valid(1, 310, 310)).toBe(true)
    lock.update(339)
    expect(new TestResults(lock).valid(1, 310, 310)).toBe(true)
    lock.update(340)
    expect(new TestResults(lock).valid(2, 340, 310)).toBe(true)
  })

  it('NON-cumulative lock handles card resets correctly', () => {
    const lock = new Lock(lockConfig30NONcum)
    lock.update(300)
    expect(new TestResults(lock).valid(1, 0, 0)).toBe(true)
    lock.elapsedMinutes = 310
    let card = lock.drawCard() // triggers changes to chance, etc.
    card = CardType.RESET // simulate reset being picked
    manager.apply(lock, card)
    expect(lock.getCards().getCardsOfType(CardType.RESET)).toEqual(
      FiveOfEveryCard.getCardsOfType(CardType.RESET) - 1)
    expect(new TestResults(lock).valid(1, 310, 310)).toBe(true)
    lock.drawCard() // another draw after reset
    manager.apply(lock, CardType.STICKY)
    expect(new TestResults(lock).valid(0, 310, 310)).toBe(true)
    lock.update(339)
    expect(new TestResults(lock).valid(0, 310, 310)).toBe(true)
    lock.update(340)
    expect(new TestResults(lock).valid(1, 340, 310)).toBe(true)
  })

  /*
  it('template', () => {
    expect(0).toEqual(0);
  })

*/
})
