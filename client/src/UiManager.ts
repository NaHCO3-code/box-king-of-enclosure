import { FontSize_H1, GirdSize, ScreenInfo } from "./Constants";
import { KGrid } from "./Grid";
import { Vector2 } from "./lib/Vector";
import { MineMotion } from "./lib/MineMotion";
import { tutorial } from "./Tutorial";


export class UiManager {
  grid: KGrid;
  coverEl: UiBox;
  titleTextEl: UiText;

  constructor() {
    this.grid = new KGrid(
      5,
      5,
      GirdSize,
      new Vector2(ScreenInfo.width/2, ScreenInfo.height/2 - (GirdSize * 5 / 4)),
      ui
    );
    // this.grid.hide();

    this.coverEl = UiBox.create();
    this.coverEl.size.scale.x = 1;
    this.coverEl.size.scale.y = 1;
    this.coverEl.backgroundColor.r = 0;
    this.coverEl.backgroundColor.g = 0;
    this.coverEl.backgroundColor.b = 0;
    this.coverEl.backgroundOpacity = 0;
    this.coverEl.visible = false;
    this.coverEl.zIndex = 0;
    this.coverEl.parent = ui;


    this.titleTextEl = UiText.create();
    this.titleTextEl.textContent = "";
    this.titleTextEl.position.offset.y = ScreenInfo.height / 2 - (GirdSize * 2) - FontSize_H1*1.1;
    this.titleTextEl.textColor.r = 255;
    this.titleTextEl.textColor.g = 255;
    this.titleTextEl.textColor.b = 255;
    this.titleTextEl.textFontSize = FontSize_H1;
    this.titleTextEl.visible = false;
    this.titleTextEl.parent = ui;
  }

  async showCover(){
    this.coverEl.visible = true;
    await MineMotion.fromTo(this.coverEl, 500, {
      backgroundOpacity: 0,
    }, {
      backgroundOpacity: 0.8
    }).wait;
  }
  
  async hideCover(){
    await MineMotion.fromTo(this.coverEl, 500, {
      backgroundOpacity: 0.8,
    }, {
      backgroundOpacity: 0
    }).wait;
    this.coverEl.visible = false;
  }

  async tutorial(){
    this.titleTextEl.visible = true;
    await this.showCover();
    await tutorial(this.grid, this.titleTextEl);
    this.hideCover();
    this.grid.hide();
    this.titleTextEl.visible = false;
  }

  static inst: UiManager;

  static getInstance(){
    if(!UiManager.inst){
      UiManager.inst = new UiManager();
    }
    return UiManager.inst;
  }
}