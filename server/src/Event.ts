import { Emitter, GenEmitterType } from "./lib/Emitter";
import { KEventEmitterType, KEvents } from "./Constants";
import { RemoteEventType } from "./RemoteEventType";
import { Rich } from "./lib/Rich";
import { RemoteEvent } from "@shares/RemoteEvent";

export const Event = new Emitter<
  KEventEmitterType 
  & GenEmitterType<typeof RemoteEvent, RemoteEventType>
>();

remoteChannel.onServerEvent((e) => {
  const event = e.args as unknown as {type: string, [K: string]: any};
  for(let k in RemoteEvent){
    if(event.type === RemoteEvent[k as keyof typeof RemoteEvent]){
      Event.emit(event.type, e);
    }
  }
});
