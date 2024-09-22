export interface Listener{
  index: symbol;
  cancel(): void;
}

export interface IEmitter<T extends Record<string, (...args: any[]) => void>>{
  on<K extends keyof T>(evnet: K, callback: T[K]): Listener;
  emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): void;
  cancel(index: symbol): void;
}

export class Emitter<
  T extends Record<string, (...args: any[]) => void>
> implements IEmitter<T>{
  private listeners: Map<
    keyof T, 
    Map<symbol, (...args: any[]) => void>
  > = new Map();

  on<K extends keyof T>(evnet: K, callback: T[K]): Listener {
    const index = Symbol();
    let evs = this.listeners.get(evnet);
    if(!evs){
      this.listeners.set(evnet, new Map());
      evs = this.listeners.get(evnet);
    }
    evs?.set(index, callback);
    return {
      index: index,
      cancel: () => {
        this.listeners.get(evnet)?.delete(index);
      }
    }
  }

  emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): void {
    const evs = this.listeners.get(event);
    evs?.forEach(cb => cb(...args));
  }

  cancel(index: symbol): void {
    this.listeners.forEach(evs => evs.delete(index));
  }

  async wait<K extends keyof T>(event: K){
    return new Promise<Parameters<T[K]>>(res => {
      const listener = this.on(event, ((ev) => {
        res(ev);
        listener.cancel();
      }) as T[K])
    })
  }
}

type GetKeysWith<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

export type GenEmitterType<
  NameType extends Record<string, string>, 
  EventType extends Record<keyof NameType, (...args: any) => any>
> = {
  [K in NameType[keyof NameType]]: EventType[GetKeysWith<NameType, K>]
}