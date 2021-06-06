import Lock from './Lock'
import CardMapping from './CardMapping'
import CardType from './CardType'
import LockConfig from './LockConfig'
import CardApplierManager from 'cards/CardApplierManager'

const lotsOfGreensOneRed = new CardMapping()
lotsOfGreensOneRed.setCardsOfType(CardType.GREEN, 100)
lotsOfGreensOneRed.setCardsOfType(CardType.RED, 1)

const configLotsOfGreensOneRed: LockConfig = {
  intervalMinutes: 30,
  cumulative: true,
  multipleGreensRequired: true,
  initial: {
    min: lotsOfGreensOneRed,
    max: lotsOfGreensOneRed
  },
  autoResets: {
    enabled: false
  }
}

const green100Red100 = new CardMapping()
green100Red100.setCardsOfType(CardType.GREEN, 100)
green100Red100.setCardsOfType(CardType.RED, 100)

const green100Red101 = green100Red100.copyDeep()
green100Red101.setCardsOfType(CardType.RED, 101)

const configGreen100Red100To101: LockConfig = {
  intervalMinutes: 30,
  cumulative: true,
  multipleGreensRequired: true,
  initial: {
    min: green100Red100,
    max: green100Red101
  },
  autoResets: {
    enabled: false
  }
}

describe('Restrictions on Early Greens Test', () => {
  it('Green not drawn on first draw', () => {
    for (let i = 0; i < 20; i++) {
      const lock = new Lock(configLotsOfGreensOneRed)
      const card = lock.drawCard()
      expect(card).toEqual(CardType.RED)
    }
  })

  it('Green not drawn on 100 draws when reds are 100-101', () => {
    // first 100 draws should all be red
    // the probability of drawing a green on 101st draw is >99%, but
    // not 100%, so will do multiple runs
    // 10 runs should raise probability of success to at about
    // 99.99999999999999999999%, so...
    let success = false
    for (let testRun = 1; testRun < 10; testRun++) {
      const lock = new Lock(configGreen100Red100To101)
      const manager = new CardApplierManager()
      // first 100 draws should all be reds
      for (let draw = 1; draw <= 100; draw++) {
        expect(lock.chances).toEqual(1)
        const card = lock.drawCard()
        expect(card).toEqual(CardType.RED)
        manager.apply(lock, card)
        lock.update(lock.config.intervalMinutes * draw) // advance elapsedMinutes and get another chance
      }
      // should have 100 greens and 0-1 reds left
      // and should be allowed to draw greens, so one of the next 2 draws should be green
      // but only ~99% probability on next draw
      const card = lock.drawCard()
      if (card === CardType.GREEN) {
        success = true
        break
      }
    } // end for
    expect(success).toEqual(true)
  })

  it('green can be drawn early if no other cards left', () => {
    const lock = new Lock(configGreen100Red100To101)
    lock.getCards().setCardsOfType(CardType.RED, 0)
    const card = lock.drawCard()
    expect(card).toEqual(CardType.GREEN)
  })
})
