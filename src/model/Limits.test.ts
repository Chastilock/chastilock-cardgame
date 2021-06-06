import MAX_CARDS from '../MaxCardConfig'
import Lock from './Lock'
import CardMapping from './CardMapping'
import CardType, { ALL_CARDS } from './CardType'
import LockConfig from './LockConfig'

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

describe('Lock.limit() Tests', () => {
  it('Lock.limit applies maximums correctly', () => {
    const lock = new Lock(lockConfig30cum)
    ALL_CARDS.forEach(card => {
      lock.getCards().setCardsOfType(card, Number.MAX_SAFE_INTEGER)
    })
    lock.limit(MAX_CARDS)
    ALL_CARDS.forEach(card => {
      expect(lock.getCards().getCardsOfType(card)).toEqual(MAX_CARDS.max[card])
    })
  })

  it('Lock.limit prevents negatives correctly', () => {
    const lock = new Lock(lockConfig30cum)
    ALL_CARDS.forEach(card => {
      lock.getCards().setCardsOfType(card, -1)
    })
    lock.limit(MAX_CARDS)
    ALL_CARDS.forEach(card => {
      expect(lock.getCards().getCardsOfType(card)).toEqual(0)
    })
  })

  it('Lock.limit() is called when prevents negatives correctly', () => {
    const lock = new Lock(lockConfig30cum)
    lock.getCards().setCardsOfType(CardType.RED, 0)
    ALL_CARDS.forEach(card => {
      lock.getCards().setCardsOfType(card, -1)
    })
    lock.limit(MAX_CARDS)
    ALL_CARDS.forEach(card => {
      expect(lock.getCards().getCardsOfType(card)).toEqual(0)
    })
  })
  /*
  it('template', () => {
    expect(0).toEqual(0);
  })

*/
})
