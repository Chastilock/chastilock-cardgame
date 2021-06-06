import CardApplierManager from 'cards/CardApplierManager'
import CardMapping from './CardMapping'
import CardType, { ALL_CARDS } from './CardType'
import Lock from './Lock'
import LockConfig from './LockConfig'

const guaranteedResetCardsMin = new CardMapping()
guaranteedResetCardsMin.setCardsOfType(CardType.GREEN, 1)
guaranteedResetCardsMin.setCardsOfType(CardType.RED, 500)

const guaranteedResetCardsMax = guaranteedResetCardsMin.copyDeep()
guaranteedResetCardsMax.setCardsOfType(CardType.RED, 501)

const configResetTimes3: LockConfig = {
  intervalMinutes: 30,
  cumulative: true,
  multipleGreensRequired: true,
  initial: {
    min: guaranteedResetCardsMin,
    max: guaranteedResetCardsMax
  },
  autoResets: {
    enabled: true,
    frequencyHours: 24,
    maximumResets: 3
  }
}

const frequencyHours = (configResetTimes3.autoResets.frequencyHours !== undefined)
  ? configResetTimes3.autoResets.frequencyHours : Number.MAX_SAFE_INTEGER
const frequencyMinutes = frequencyHours * 60
const maximumResets = (configResetTimes3.autoResets.maximumResets !== undefined)
  ? configResetTimes3.autoResets.maximumResets : 0
const intervalsInResetPeriod = frequencyMinutes / configResetTimes3.intervalMinutes

const FiveOfEveryCard = new CardMapping()
ALL_CARDS.forEach(value => {
  FiveOfEveryCard.setCardsOfType(value, 5)
})

const configTestHardReset: LockConfig = {
  intervalMinutes: 5,
  cumulative: true,
  multipleGreensRequired: true,
  initial: {
    min: FiveOfEveryCard,
    max: FiveOfEveryCard
  },
  autoResets: {
    enabled: true,
    frequencyHours: 1,
    maximumResets: 3
  }
}

describe('AutoReset Tests', () => {
  it('Auto Resets are configured correctly', () => {
    const lock = new Lock(configResetTimes3)
    expect(lock.autoResetting).toEqual(lock.config.autoResets.enabled)
    expect(lock.autoResetIntervalInMinutes).toEqual(frequencyMinutes)
    expect(lock.nextAutoResetTime).toEqual(frequencyMinutes)
    expect(lock.remainingAutoResets).toEqual(3)
    expect(lock.resets).toEqual(0)
  })

  it('Autoresets occur as scheduled', () => {
    const lock = new Lock(configResetTimes3)
    for (let period = 1; period <= maximumResets; period++) {
      lock.update(period * frequencyMinutes - 1)
      // autoReset should not have occurred
      expect(lock.resets).toEqual(period - 1)
      expect(lock.remainingAutoResets).toEqual(maximumResets - period + 1)
      expect(lock.nextAutoResetTime).toEqual(period * frequencyMinutes)
      expect(lock.chances).toEqual(intervalsInResetPeriod)
      expect(lock.lastChanceTime).toEqual(period * frequencyMinutes - lock.config.intervalMinutes)

      lock.update(period * frequencyMinutes)
      // autoReset should have occurred
      expect(lock.resets).toEqual(period)
      expect(lock.remainingAutoResets).toEqual(maximumResets - period)
      expect(lock.chances).toEqual(1)
      expect(lock.lastChanceTime).toEqual(period * frequencyMinutes)
      lock.update(period * frequencyMinutes + lock.config.intervalMinutes - 1)
      expect(lock.chances).toEqual(1)
      lock.update(period * frequencyMinutes + lock.config.intervalMinutes)
      expect(lock.chances).toEqual(2)
    } // end for
    // all autoResets should have been done
    expect(lock.autoResetting).toEqual(false)
    expect(lock.remainingAutoResets).toEqual(0)
    expect(lock.nextAutoResetTime).toEqual(Number.MAX_SAFE_INTEGER)
    lock.update((maximumResets + 2) * frequencyMinutes)
    // no further resets shold have occurred
    expect(lock.resets).toEqual(maximumResets)
    expect(lock.chances).toEqual(intervalsInResetPeriod * 2 + 1)
  })

  it('autoreset resets deck and greensDrawn correctly', () => {
    const lock = new Lock(configTestHardReset)
    lock.update(59)
    expect(lock.chances).toEqual(12)
    ALL_CARDS.forEach(value => {
      lock.getCards().setCardsOfType(value, 3)
    })
    lock.greensDrawn = 2
    expect(lock.autoResetting).toEqual(true)
    expect(lock.autoResetIntervalInMinutes).toEqual(60)
    expect(lock.nextAutoResetTime).toEqual(60)
    expect(lock.resets).toEqual(0)
    lock.update(60)
    expect(lock.autoResetting).toEqual(true)
    expect(lock.autoResetIntervalInMinutes).toEqual(60)
    expect(lock.nextAutoResetTime).toEqual(120)
    expect(lock.resets).toEqual(1)
    ALL_CARDS.forEach(value => {
      expect(lock.getCards().getCardsOfType(value)).toEqual(5)
    })
    expect(lock.greensDrawn).toEqual(0)
    expect(lock.chances).toEqual(1)
    expect(lock.lastChanceTime).toEqual(60)
  })

  it('pauseAutoResets(boolean) works correctly', () => {
    const lock = new Lock(configTestHardReset)
    lock.update(59)
    expect(lock.resets).toEqual(0)
    expect(lock.autoResetting).toEqual(true)
    lock.pauseAutoResets(true)
    expect(lock.resets).toEqual(0)
    expect(lock.autoResetting).toEqual(false)
    expect(lock.autoResetIntervalInMinutes).toEqual(60)
    expect(lock.nextAutoResetTime).toEqual(60)
    expect(lock.remainingAutoResets).toEqual(3)
    lock.update(60) // autoReset should not occur
    expect(lock.resets).toEqual(0)
    expect(lock.autoResetting).toEqual(false)
    expect(lock.autoResetIntervalInMinutes).toEqual(60)
    expect(lock.nextAutoResetTime).toEqual(60)
    expect(lock.remainingAutoResets).toEqual(3)
    lock.update(120) // autoReset still shouldn't occur
    expect(lock.resets).toEqual(0)
    expect(lock.autoResetting).toEqual(false)
    expect(lock.autoResetIntervalInMinutes).toEqual(60)
    expect(lock.nextAutoResetTime).toEqual(60)
    expect(lock.remainingAutoResets).toEqual(3)
    lock.update(153)
    expect(lock.resets).toEqual(0)
    expect(lock.autoResetting).toEqual(false)
    expect(lock.autoResetIntervalInMinutes).toEqual(60)
    expect(lock.nextAutoResetTime).toEqual(60)
    expect(lock.remainingAutoResets).toEqual(3)
    expect(lock.chances).toEqual(31)
    expect(lock.lastChanceTime).toEqual(150)
    lock.pauseAutoResets(false) // autoReset should now occur
    expect(lock.chances).toEqual(1)
    expect(lock.lastChanceTime).toEqual(153)
    expect(lock.resets).toEqual(1)
    expect(lock.autoResetting).toEqual(true)
    expect(lock.remainingAutoResets).toEqual(2)
    expect(lock.nextAutoResetTime).toEqual(213) // 153 + 60, next autoreset is based on unpause time
    // make sure the following reset is based of this one also
    lock.update(212)
    expect(lock.resets).toEqual(1)
    lock.update(213)
    expect(lock.resets).toEqual(2)
    expect(lock.autoResetting).toEqual(true)
    expect(lock.remainingAutoResets).toEqual(1)
    expect(lock.nextAutoResetTime).toEqual(273) // 213 + 60
  })

  it('autoReset terminates Freezes correctly', () => {
    const lock = new Lock(configTestHardReset)
    lock.update(59)
    expect(lock.resets).toEqual(0)
    expect(lock.autoResetting).toEqual(true)
    expect(lock.nextAutoResetTime).toEqual(60)
    // simulate a freeze
    lock.drawCard() // ignore draw and apply freeze instead
    const manager = new CardApplierManager()
    manager.apply(lock, CardType.FREEZE)
    expect(lock.freeze).toBeDefined()
    const endTime = (lock.freeze !== undefined) ? lock.freeze.endTime : Number.MAX_SAFE_INTEGER
    expect(endTime).toBeGreaterThanOrEqual(59 + 2 * lock.config.intervalMinutes)
    expect(endTime).toBeLessThanOrEqual(59 + 4 * lock.config.intervalMinutes)
    lock.update(60) // autoReset should occur
    expect(lock.freeze).toBeUndefined() // freeze removed
    expect(lock.resets).toEqual(1)
    expect(lock.chances).toEqual(1)
    expect(lock.lastChanceTime).toEqual(60)
    expect(lock.autoResetting).toEqual(true)
    expect(lock.remainingAutoResets).toEqual(2)
    expect(lock.nextAutoResetTime).toEqual(120)
  })
})
