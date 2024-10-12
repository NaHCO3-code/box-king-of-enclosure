import { FontSize_H1, GirdSize, ScreenInfo } from "./Constants";
import { KGrid } from "./Grid";
import { MineMotion } from "./lib/MineMotion";

async function text(textEl: UiText, text: string) {
  await MineMotion.fromTo(textEl.textColor, 500, {
    r: 255, g: 255, b: 255 
  }, {
    r: 0, g: 0, b: 0
  }).wait
  textEl.textContent = text;
  textEl.size.offset.x = ScreenInfo.width;
  textEl.size.offset.y = FontSize_H1*2;
  await MineMotion.fromTo(textEl.textColor, 500, {
    r: 0, g: 0, b: 0 
  }, {
    r: 255, g: 255, b: 255
  }).wait
}

export async function tutorial(grid: KGrid, textEl: UiText){
  await grid.show();
  await text(textEl, "下面开始新手教程。");
  await grid.forceClear();
  await sleep(2000);

  await text(textEl, "游戏开始时，你会被随机分配到一个队伍。\n每个队伍有不同的颜色。");
  await sleep(4000);
  await text(textEl, "当你在地图上走动，脚下的方块就会变成相应的颜色。");
  await sleep(2000);
  grid.updateInfo[0][1] = 1;
  await grid.update();
  grid.updateInfo[1][0] = 1;
  await grid.update();
  grid.updateInfo[2][0] = 1;
  await grid.update();
  grid.updateInfo[3][1] = 1;
  await grid.update();
  grid.updateInfo[4][2] = 1;
  await grid.update();
  grid.updateInfo[3][3] = 1;
  await grid.update();
  grid.updateInfo[2][3] = 1;
  await grid.update();
  grid.updateInfo[1][4] = 1;
  await grid.update();
  grid.updateInfo[0][3] = 1;
  await grid.update();
  grid.updateInfo[0][2] = 1;
  await grid.update();
  await sleep(1000);
  await text(textEl, "当这些颜色围成一圈，\n圈内所有方块就会变成这种颜色。");
  await sleep(2000);
  grid.updateInfo[1][1] = 1;
  grid.updateInfo[1][2] = 1;
  grid.updateInfo[1][3] = 1;
  grid.updateInfo[2][1] = 1;
  grid.updateInfo[2][2] = 1;
  grid.updateInfo[3][2] = 1;
  await grid.update();
  await sleep(3000);

  await text(textEl, "游戏中的某些区域会有不同的「天气」：");
  await sleep(3000);
  await text(textEl, "如果是「晴天」，颜色会逐渐消失。");
  await sleep(2000);
  grid.updateInfo[0][1] = 0;
  await grid.update();
  grid.updateInfo[2][0] = 0;
  grid.updateInfo[4][2] = 0;
  grid.updateInfo[1][4] = 0;
  await grid.update();
  grid.updateInfo[3][1] = 0;
  grid.updateInfo[3][3] = 0;
  await grid.update();
  grid.updateInfo[0][3] = 0;
  grid.updateInfo[1][0] = 0;
  await grid.update();
  await sleep(3000);
  await text(textEl, "如果是「雨天」，颜色会逐渐向外扩散。");
  await sleep(2000);
  grid.updateInfo[0][1] = 1;
  grid.updateInfo[4][2] = 1;
  await grid.update();
  grid.updateInfo[0][3] = 1;
  await grid.update();
  grid.updateInfo[3][3] = 1;
  grid.updateInfo[3][1] = 1;
  grid.updateInfo[0][2] = 1;
  await grid.update();
  await sleep(3000);
  await text(textEl, "如果是「雪天」，区域内方块将不会有任何改变。");
  grid.updateInfo.forEach((_, i, a) => a[i].forEach((_, j, b) => b[j] = grid.gridInfo[i][j]));
  grid.update();
  await sleep(5000);
  await text(textEl, "✔完成！");
  await sleep(2000);
}