export const RemoteEvent = {
  tutorial: "REM:tutorial",
  alterInvolvement: "REM:alter_involvement",
  gameStart: "REM:game_start",
  gameEnd: "REM:game_end"
} as const;

export type RemoteEventType = {
  tutorial: (event: {}) => void
  alterInvolvement: (event: {value: boolean}) => void,
  gameStart: (event: {}) => void,
  gameEnd: (event: {}) => void
}