export type RemoteEventType = {
  tutorial: (event: {}) => void
  alterInvolvement: (event: {value: boolean}) => void,
  gameStart: (event: {}) => void,
  gameEnd: (event: {}) => void,
  gameinfo: (event: {args: {gameInfo: {[key: string]: number}}}) => void,
}