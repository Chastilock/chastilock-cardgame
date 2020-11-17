# Chastilock cardgame
This is an implementation of the same card game that's built in into the ChastiKey app.

## Installing
`yarn add chastilock-cardgame`

## Usage
```typescript
import { ChastilockGame, Lock, LockConfig, CardMapping } from 'chastilock-cardgame'

const options = {
  max: {
    green: 100, /* Same as CK */
    red: 599, /* Same as CK */
    sticky: 100, /* Same as CK */
    yellow: 1495, /* Same as CK */
    freeze: 100, /* Same as CK */
    double: 100, /* Same as CK */
    reset: 100, /* Same as CK */
  }
}

// Create the initial card mapping. This would be the amount of cards. This should be persisted somewhere.
const cards: CardMapping = new CardMapping()
cards.setCardsOfType(CardType.RED, 1)
cards.setCardsOfType(CardType.GREEN, 10)
cards.setCardsOfType(CardType.YELLOW_PLUS1, 5)
cards.setCardsOfType(CardType.RESET, 2)
cards.setCardsOfType(CardType.DOUBLE, 3)

// Configuration (settings) of this lock
const lockConfig: LockConfig = {
  intervalMinutes: 30000, // draw interval
  greensRequired: 10, // amount of green cards to find to unlock
  initial: new CardMapping(initial), // initial card values. Mostly required to perform a reset.
  autoResets: {
    enabled: false // whether or not auto resets are enabled. Used for estimations.
  }
}

// the cards here passed are the current cards. This allows for easier persistance of a lock.
const lock = new Lock(lockConfig, cards)

// Create the game instance
const game = new ChastilockGame(options, lock)

```

## Developing

### Prerequisites

- Node.js (recommended version: 14.10.0)
- Yarn

### Installing dependencies

`yarn`

### Setting up git hooks
It is recommended to set up git hooks, so the code will be validated against the guidelines (linting & testing) before the commit is done.
In order to set up git hooks, simply run:

`yarn setuphooks`

Please note that hooks were not yet tested on Windows. But they should be platform independent.

### Running tests

`yarn test`

### Linting

`yarn lint`

### Linting & auto fixing

`yarn lint --fix`