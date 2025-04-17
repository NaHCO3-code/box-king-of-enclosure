import { Emit, ScreenEvent } from "./Event";

export let ScreenInfo = {width: 0, height: 0};

export let GirdSize = 0;

export let FontSize_H1 = 0;
export let FontSize_H2 = 0;

export const BackgroundColor = Vec3.create({r: 255, g: 255, b: 255});
export const Gray = Vec3.create({r: 64, g: 64, b: 64});
export const Black = Vec3.create({r: 0, g: 0, b: 0});
export const White = Vec3.create({r: 255, g: 255, b: 255});
export const Blue = Vec3.create({r:0,g:166,b:244});
export const TextColor = Vec3.create({r: 0, g: 0, b: 0});

setInterval(() => {
  let newScreenInfo = navigator.getDeviceInfo().screen;
  if(
    newScreenInfo.width != ScreenInfo.width 
    || newScreenInfo.height != ScreenInfo.height
  ){
    ScreenInfo = newScreenInfo;
    GirdSize = Math.min(100, Math.min(ScreenInfo.width / 10, ScreenInfo.height / 10));
    FontSize_H1 = Math.max(10, Math.min(25, GirdSize / 2));
    FontSize_H2 = FontSize_H1*0.8;
    Emit.emit(ScreenEvent.resize);
  }
}, 1000);