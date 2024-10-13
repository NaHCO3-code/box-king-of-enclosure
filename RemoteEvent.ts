export const RemoteEvent = {
  tutorial: "REM:tutorial"
} as const;

export type RemoteEventType = {
  tutorial: (event: {type: string}) => void
}