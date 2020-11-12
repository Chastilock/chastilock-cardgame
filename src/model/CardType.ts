enum CardType {
  RED = 'RED',
  STICKY = 'STICKY',
  YELLOW_PLUS1 = 'YELLOW+1',
  YELLOW_PLUS2 = 'YELLOW+2',
  YELLOW_PLUS3 = 'YELLOW+3',
  YELLOW_MINUS1 = 'YELLOW-1',
  YELLOW_MINUS2 = 'YELLOW-2',
  YELLOW_MINUS3 = 'YELLOW-3',
  FREEZE = 'FREEZE',
  DOUBLE = 'DOUBLE',
  RESET = 'RESET'
}

export const isYellowCard = (type: CardType): boolean =>
  type.toString().startsWith('YELLOW');


export default CardType;