import { Emitter, GenEmitterType } from "./lib/Emitter";
import { KEventEmitterType, KEvents } from "./Constants";
import { RemoteEvent, RemoteEventType } from "./RemoteEvent";
import { Rich } from "./lib/Rich";

export const Emit = new Emitter<
  KEventEmitterType 
  & GenEmitterType<typeof RemoteEvent, RemoteEventType>
>();

remoteChannel.onServerEvent((e) => {
  const event = e.args as unknown as {type: string, [K: string]: any};
  for(let k in RemoteEvent){
    if(event.type === RemoteEvent[k as keyof typeof RemoteEvent]){
      Emit.emit(event.type, e);
    }
  }
});
