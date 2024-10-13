import { Emitter, GenEmitterType } from "./lib/Emitter";
import { Rich } from "./lib/Rich";
import { RemoteEvent, RemoteEventType } from "./RemoteEvent";
import { tutorial } from "./Tutorial";

export const ScreenEvent = {
  resize: "SCR:resize",
} as const;

export type ScreenEventType = {
  resize: () => void
}

export const Emit = new Emitter<
  GenEmitterType<typeof ScreenEvent, ScreenEventType>
  & GenEmitterType<typeof RemoteEvent, RemoteEventType>
>();

remoteChannel.onClientEvent((e) => {
  const event = e as unknown as {type: string, [K: string]: any};
  for(let k in RemoteEvent){
    if(event?.type === RemoteEvent[k as keyof typeof RemoteEvent]){
      Emit.emit(event?.type, event);
    }
  }
});
