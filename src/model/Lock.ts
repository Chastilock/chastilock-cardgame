import CardMapping from './CardMapping'
import CardType, { ALL_YELLOWS, ALL_CARDS } from './CardType'
import Config from './Config'
import LockConfig from './LockConfig'
import Freeze, { FreezeType } from './Freeze'

const DEBUG: boolean = false

class Lock {
  public cards: CardMapping
  public config: LockConfig

  public elapsedMinutes: number = 0 // minutes since the start of the lock
  public nextDraw = 0 // set by appliers to be the time between the current draw and the next draw
  // eventually could refactor to eliminate nextDraw

  // public nextDrawTime = 0 // the time when a draw is possible in minutes since the start of the lock

  public chances = 1 // the number of chances accumulated
  public lastChanceTime = 0 // the time when the last chance was added
  public lastDrawTime = 0 // the time when the last draw was made
  // the number of greens drawn
  public greensDrawn = 0
  // the number of minutes before a green is allowed to be drawn
  public minutesBeforeGreenAllowed: number

  // auto-reset variables
  public autoResetting: boolean = false
  // the specified time between auto-resets, should never change once set by constructor
  readonly autoResetIntervalInMinutes: number = Number.MAX_SAFE_INTEGER
  public nextAutoResetTime: number = Number.MAX_SAFE_INTEGER // the time of the next auto-reset (minutes from lock start time)
  public remainingAutoResets: number = 0
  // public autoResetsPaused : boolean = false // KH can pause autoresets, ? can use autoresetting instead?

  // freeze variables - 0 to 1 freeze. Should it be an array of freezes?
  public freeze?: Freeze

  // variables for statistics needed by simulator (and also by Kiera eventually)
  public draws = 0
  public resets = 0

  constructor (config: LockConfig, cards?: CardMapping) {
    this.config = config

    if (cards !== undefined) {
      this.cards = cards
    } else {
      this.cards = this.createCards()
    }

    // code to determine when greens may first be drawn
    // currently CK avoids drawing green on first draw and possibly
    // for longer based on minimum red cards.
    // https://discord.com/channels/473856867768991744/491277623322738712/828043778379481149
    // http://chastikey.com/help/doku.php?id=minimum_lock_durations
    const minReds = config.initial.min.getRed()
    if (minReds > 1 && minReds !== config.initial.max.getRed()) {
      this.minutesBeforeGreenAllowed = minReds * config.intervalMinutes
    } else {
      this.minutesBeforeGreenAllowed = config.intervalMinutes
    }

    // code to configure autoresets
    this.autoResetting = config.autoResets.enabled
    if (this.autoResetting) {
      this.autoResetIntervalInMinutes =
        (config.autoResets.frequencyHours === undefined) ? Number.MAX_SAFE_INTEGER
          : config.autoResets.frequencyHours * 60
      this.remainingAutoResets = (config.autoResets.maximumResets === undefined) ? 0 : config.autoResets.maximumResets
      // schedule first auto-reset
      this.nextAutoResetTime = this.autoResetIntervalInMinutes
    }
  }

  /**
   * Sets up the lock after first initialization. Performs the random logic
   * to define how many cards of what type are being used.
   *
   * May also be called when resetting.
   * @returns the initial CardMapping
   */
  public createCards (): CardMapping {
    const cardMapping = new CardMapping()

    const getCardAmount = (min: number, max: number): number =>
      Math.floor(Math.random() * (max - min + 1)) + min

    ALL_CARDS.forEach(cardType =>
      cardMapping.setCardsOfType(
        cardType,
        getCardAmount(
          this.getConfig().initial.min.getCardsOfType(cardType),
          this.getConfig().initial.max.getCardsOfType(cardType)
        )
      )
    )

    return cardMapping
  }

  /**
   * Draws a card.  Also enforces rules about drawing a Green card
   */
  public drawCard (): CardType {
    let card = this.getCards().drawRandomType()
    // draw again if 3 things are true
    // Note: There is a possible issue here with indefinite postponement if the deck is made up of
    // predominantly green cards, as in 100 greens and 1 red.   Many draws might be required to find
    // the one legal red card.  This could be fixed by adding a method to CardMapping that would draw
    // a non-green card on the first attempt in the while loop
    while (card === CardType.GREEN && // card is green
      this.elapsedMinutes < this.minutesBeforeGreenAllowed && // too early for green
        this.getCards().getGreen() !== this.getCards().getTotalCards()) { // there are still non-green cards to draw
      // TODO: Remove this
      if (DEBUG) {
        console.log('Green drawn and rejected')
      }
      card = this.getCards().drawRandomType()
    }
    // TODO: Later - should drawing affect last draw time, since the user might draw and not apply?
    // perhaps should be moved to manager or applier
    this.lastDrawTime = this.elapsedMinutes
    return card
  }

  /**
   * Sets draw time to current interval.
   */
  public doRegularCooldown (): void {
    // only called from Red and Sticky Appliers
    this.nextDraw = this.getConfig().intervalMinutes
    this.lastDrawTime = this.elapsedMinutes
    this.chances--
    if (!this.config.cumulative) { // non-cumulative
      this.lastChanceTime = this.elapsedMinutes
      // can't get another chance until an interval after picking Red or Sticky
    }
  }

  /**
   * Completely resets the lock to it's initial state.
   *
   * Also known as keyholder-reset.
   */
  public resetHard (): void {
    this.cards = this.createCards()
    this.greensDrawn = 0
    this.resets++
    this.chances = 1 // any additional accumulated chances are lost
    this.freeze = undefined // any existing freezes end
    this.lastChanceTime = this.elapsedMinutes
  }

  /**
   * Resets the number of green, red and yellow cards.
   *
   * Also known as reset-card reset.
   */
  public resetSoft (): void {
    // We'll only be using the red, green and yellow cards out of this.
    const completelyNewCards = this.createCards()

    this.greensDrawn = 0

    const relevantCardTypes = [CardType.GREEN, CardType.RED, ...ALL_YELLOWS]
    relevantCardTypes.forEach(cardType =>
      this.getCards().setCardsOfType(cardType, completelyNewCards.getCardsOfType(cardType)))

    this.resets++
    this.chances = 1 // any additional accumulated chances are lost
    this.lastChanceTime = this.elapsedMinutes
    this.lastDrawTime = this.elapsedMinutes
  }

  /**
   * Limits the lock to the configured maximum of cards
   * @param config the config to respect
   */
  public limit (config: Config): void {
    this.getCards().map.forEach((value, key) => {
      const maxCards = config.max[key]

      if (maxCards !== 0 && maxCards !== undefined) {
        // apply the limit
        if (value > maxCards) {
          this.getCards().setCardsOfType(key, maxCards)
        }
      }
      if (value < 0) {
        this.getCards().setCardsOfType(key, 0)
      }
    })
  }

  public isFinished (): boolean {
    if (this.getConfig().multipleGreensRequired) {
      return this.greensDrawn !== 0 && this.getCards().getGreen() === 0
    } else {
      return this.greensDrawn >= 1
    }
  }

  public getNextDraw (): number {
    /*
    if (this.chances > 0) {
      return this.elapsedMinutes // now
    } else {
      return this.lastChanceTime + this.config.intervalMinutes
    }
    */
    return this.nextDraw
  }

  public getConfig (): LockConfig {
    return this.config
  }

  public getCards (): CardMapping {
    return this.cards
  }

  /*
the purpose of this method is to simulate a update request to the server from the app.
Use case is intended as follows:
This assumes that keyholder updates will have already be reflected in the cards on server
1) check for auto-resets
2) if reset occurred set chances to 1 and last_chance_time to time of reset
3) if chances are 0 and curr_time - last_chance_time < draw interval
       end use case with no change to chances or nextD
4) else check to see if lock is currently frozen
       if so, end use case with no change.  Note: assumes that if any chances were earned before the
       freeze, they were given when the keyholder froze the lock or
       on the update done immediately before the lockee drew the freeze card
5) if freeze has ended, then award chance if it's a card freeze, and set last_chance_time to end of freeze
6) update any accumulated chances as follows
    if non-cumulative and no chance already, then give one if an interval has elapsed from last_chance and last_pick
    else if cumulative, calculate elapsed time from time last chance given/last freeze ended and divide by chance interval to get
            number of additional chances to be given
*/
  public update (currentTime: number): void {
    this.elapsedMinutes = currentTime
    this.checkForAutoResets() // autoresets occur even if keyholder frozen
    this.checkForFreezeExpiration()
    // no need to update chances if freeze is still ongoing,
    // since chances don't accrue while frozen, but if no freeze, then update chances, etc.
    if (this.freeze === undefined) {
      // give chances based on time elapse since lastChanceTime
      // if running frequently on server, the check for multiple chances shouldn't be necessary, but
      // should still be there in case of outages, etc.
      if (this.config.cumulative) {
        const minutesSinceLastChanceGiven = this.elapsedMinutes - this.lastChanceTime
        if (minutesSinceLastChanceGiven >= this.config.intervalMinutes) {
          const newChances = Math.floor(minutesSinceLastChanceGiven / this.config.intervalMinutes)
          this.chances += newChances
          this.lastChanceTime += newChances * this.config.intervalMinutes
        }
      } else { // non-cumulative
        if (this.chances < 1 && // no more than one chance ever
          this.elapsedMinutes - this.lastChanceTime >= this.config.intervalMinutes && // and interval elapsed since last chance given
            this.elapsedMinutes - this.lastDrawTime >= this.config.intervalMinutes) { // and interval elapsed since last pick
          this.chances = 1
          this.lastChanceTime = this.elapsedMinutes
        }
      }
    }
  }

  // TODO: I believe that in the current CK game, an autoreset is not actually done until the
  // lockee app is running and does an update request, since keyholders see the message:
  // "Auto reset pending Waiting for user to open app"
  // As a result it's possible that the app might have been opened during a period in which multiple
  // resets should have occurred.  I'm not sure how this works, but this code assumes that there is
  // at most one reset pending.
  private checkForAutoResets (): void {
    if (this.autoResetting) {
      if (DEBUG) {
        console.log('Next autoreset at interval', this.nextAutoResetTime)
      }
      if (this.elapsedMinutes >= this.nextAutoResetTime) {
        this.resetHard()

        this.remainingAutoResets--
        if (DEBUG) {
          console.log('Auto-reset occurred')
          // prettyPrint(deck)
        }
        if (this.remainingAutoResets > 0) {
          // schedule next autoreset
          this.nextAutoResetTime += this.autoResetIntervalInMinutes
        } else { // no more auto-resets
          this.nextAutoResetTime = Number.MAX_SAFE_INTEGER
          this.autoResetting = false
        }
      }
    }
  }

  // this assumes that a lock can't have more than 1 freezes since it's been updated.  That's not true.  A lock could have had
  // a card freeze as well as multiple keyholder freezes since the last update request from the app.  Does it matter, or is only the last
  // freeze relevant?  I think it does matter, but I think it can be handled with update code in the method that would
  // be called when keyholders freeze/unfreeze the lock
  public checkForFreezeExpiration (): void {
    if (this.freeze !== undefined) { // freeze exists
      if (this.freeze.endTime !== undefined &&
                    this.freeze.endTime <= this.elapsedMinutes) { // freeze has expired
        this.lastChanceTime = this.freeze.endTime
        if (this.freeze.source === FreezeType.CARD) { // theoretically must be a card freeze since a keyholder freeze wouldn't have an end time yet
          this.chances++ // one chance added at end of card freeze, but not at end of keyholder freeze
          // this is added even if the card freeze is ended early by the keyholder
          // no need for special non-cumulative code here since if it's a card freeze, then
          // the chances on a noncumulative lock had to be zero after the freeze was applied
        }
        this.freeze = undefined // expired so remove it
      }
    }
  }

  public doKeyHolderFreeze (): void {
    // not yet implemented
  }

  public endKeyHolderFreeze (): void {
    // not yet implemented
  }

  public doKeyHolderReset (): void {
    // not yet implemented
    // keyholder resets everything including autoreset count and nextautoReset time
  }

  public pauseAutoResets (paused: boolean): void { // keyholders can pause and unpause autoresets
    this.autoResetting = !paused
    if (!paused) {
      // trigger reset if one should have already occurred and then schedule all remaining resets based on this reset
      if (this.elapsedMinutes >= this.nextAutoResetTime) {
        this.resetHard()
        this.remainingAutoResets--
        if (this.remainingAutoResets > 0) {
          // remaining autoresets are scheduled from the delayed autoreset in CK game
          this.nextAutoResetTime = this.elapsedMinutes + this.autoResetIntervalInMinutes
        } else {
          this.autoResetting = false
        }
      }
    }
  }
}

export default Lock
