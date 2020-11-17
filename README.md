# Chastilock cardgame
This is an implementation of the same card game that's built in into the ChastiKey app.

## Installing
`yarn add chastilock-cardgame`

## Usage
```javascript
import ChastilockGame from 'chastilock-cardgame';

const options = {
  max: {
    red: 599 /* Same as CK */
  }
}

const game = new ChastilockGame(options);

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

Please note that hooks were not yet tested on Windows. But they should be platform independant.

### Running tests

`yarn test`

### Linting

`yarn lint`

### Linting & auto fixing

`yarn lint --fix`