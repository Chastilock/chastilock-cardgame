# Chastilock cardgame
This is an implementation of the same card game that's built in into the ChastiKey app.

## Installing
`yarn add chastilock-cardgame`

## Usage
```javascript
import ChastilockGame from 'chastilock-cardgame';

const options = {
  max: {
    red: 600
  }
}

const game = new ChastilockGame(options);

```