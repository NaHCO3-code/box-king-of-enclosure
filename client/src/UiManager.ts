import { BackgroundColor, FontSize_H1, GirdSize, Gray, ScreenInfo } from "./Constants";
import { KGrid } from "./Grid";
import { Vector2 } from "./lib/Vector";
import { Ease, MineMotion } from "./lib/MineMotion";
import { tutorial } from "./Tutorial";
import { Emit, ScreenEvent } from "./Event";
import { RemoteEvent } from "./RemoteEvent";


export class UiManager {
  grid: KGrid;
  coverEl: UiBox;
  titleTextEl: UiText;

  constructor() {
    this.grid = new KGrid(
      5,
      5,
      ui
    );

    this.coverEl = UiBox.create();
    this.coverEl.size.offset.x = 0;
    this.coverEl.size.offset.y = 0;
    this.coverEl.size.scale.x = 0;
    this.coverEl.size.scale.y = 1;
    this.coverEl.zIndex = 0;
    this.coverEl.parent = ui;

    this.titleTextEl = UiText.create();
    this.titleTextEl.textContent = "";
    this.titleTextEl.position.offset.y = ScreenInfo.height / 2 - (GirdSize * 2) - FontSize_H1*1.1;
    this.titleTextEl.size.offset.x = 0;
    this.titleTextEl.size.scale.x = 1;
    this.titleTextEl.textColor.r = 255;
    this.titleTextEl.textColor.g = 255;
    this.titleTextEl.textColor.b = 255;
    this.titleTextEl.textFontSize = FontSize_H1;
    this.titleTextEl.visible = false;
    this.titleTextEl.parent = ui;

    Emit.on(ScreenEvent.resize, () => {
      this.titleTextEl.position.offset.y = ScreenInfo.height / 2 - (GirdSize * 2) - FontSize_H1*1.1;
      this.titleTextEl.textFontSize = FontSize_H1;
    });

    Emit.on(RemoteEvent.tutorial, () => {
      this.tutorial();
    })
  }

  async fullCover(){
    this.coverEl.visible = true;
    MineMotion.fromTo(this.coverEl.backgroundColor, 500, {
      r: Gray.r, g: Gray.g, b: Gray.b
    }, {
      r: BackgroundColor.r, g: BackgroundColor.g, b: BackgroundColor.b
    })
    MineMotion.fromTo(this.coverEl, 500, {
      backgroundOpacity: 0.2,
    }, {
      backgroundOpacity: 1
    })
    await MineMotion.fromTo(this.coverEl.size.scale, 500, {
      x: 0.2
    }, {
      x: 1
    }, Ease.easeInOut).wait;
  }
  
  async halfCover(){
    this.coverEl.visible = true;
    MineMotion.fromTo(this.coverEl.backgroundColor, 500, {
      r: BackgroundColor.r, g: BackgroundColor.g, b: BackgroundColor.b
    }, {
      r: Gray.r, g: Gray.g, b: Gray.b
    })
    MineMotion.fromTo(this.coverEl, 500, {
      backgroundOpacity: 1,
    }, {
      backgroundOpacity: 0.2
    })
    await MineMotion.fromTo(this.coverEl.size.scale, 500, {
      x: 1
    }, {
      x: 0.2
    }, Ease.easeInOut).wait;
  }

  async tutorial(){
    this.titleTextEl.visible = true;
    await this.fullCover();
    await this.grid.show();
    await tutorial(this.grid, this.titleTextEl);
    this.halfCover();
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