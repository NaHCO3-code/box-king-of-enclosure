import { KGrid } from "./Grid";
import { Ease, MineMotion } from "./MineMotion"
import { Rich } from "./lib/Rich";
import { Vector2 } from "./lib/Vector";

const ScreenInfo = navigator.getDeviceInfo().screen;

const grid = new KGrid(
  5,
  5,
  100,
  new Vector2(ScreenInfo.width/2, ScreenInfo.height/2 - 62.5),
  ui
);

;(async function () {
  await grid.hide();
  await grid.show();
  await grid.forceClear();
})();