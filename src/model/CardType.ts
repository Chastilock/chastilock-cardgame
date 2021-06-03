enum CardType {
  GREEN = 'GREEN',
  RED = 'RED',
  STICKY = 'STICKY',
  YELLOW_PLUS1 = 'YELLOW+1',
  YELLOW_PLUS2 = 'YELLOW+2',
  YELLOW_PLUS3 = 'YELLOW+3',
  YELLOW_MINUS1 = 'YELLOW-1',
  YELLOW_MINUS2 = 'YELLOW-2',
  FREEZE = 'FREEZE',
  DOUBLE = 'DOUBLE',
  RESET = 'RESET',
  GO_AGAIN = 'GO_AGAIN'
}

export const isYellowCard = (type: CardType): boolean =>
  type.toString().startsWith('YELLOW')

export const ALL_YELLOWS: CardType[] = [
  CardType.YELLOW_PLUS1,
  CardType.YELLOW_PLUS2,
  CardType.YELLOW_PLUS3,
  CardType.YELLOW_MINUS1,
  CardType.YELLOW_MINUS2
]

export const ALL_CARDS: CardType[] = [
  CardType.GREEN,
  CardType.RED,
  CardType.STICKY,
  ...ALL_YELLOWS,
  CardType.FREEZE,
  CardType.DOUBLE,
  CardType.RESET
]

/**
 * Cards to be reset by a RESET card
 */
export const RESETABLE_CARDS: CardType[] = [
  CardType.GREEN,
  CardType.RED,
  ...ALL_YELLOWS
]

/**
 * Cards to be doubled by a DOUBLE card
 */
export const DOUBLEABLE_CARDS: CardType[] = [
  CardType.RED,
  ...ALL_YELLOWS
]
export default CardType
