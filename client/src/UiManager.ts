import { BackgroundColor, Black, Blue, FontSize_H1, FontSize_H2, GirdSize, Gray, ScreenInfo, White } from "./Constants";
import { KGrid } from "./Grid";
import { Vector2 } from "./lib/Vector";
import { Ease, MineMotion } from "./lib/MineMotion";
import { tutorial } from "./Tutorial";
import { Emit, ScreenEvent } from "./Event";
import { RemoteEvent } from "@shares/RemoteEvent";
import { Rich } from "./lib/Rich";


/** @deprecated */
export class UiManager {
  grid: KGrid;
  coverEl: UiBox;
  titleTextEl: UiText;
  joinNextGameBtn: UiText;
  joinNextGame: boolean = false;
  toturialBtn: UiText;
  gaming: boolean = false;

  constructor() {
    this.grid = new KGrid(
      5,
      5,
      ui
    );

    this.coverEl = UiBox.create();
    this.coverEl.size.offset.x = 0;
    this.coverEl.size.offset.y = 0;
    this.coverEl.size.scale.x = 1;
    this.coverEl.size.scale.y = 1;
    this.coverEl.zIndex = 0;
    this.coverEl.parent = ui;

    this.titleTextEl = UiText.create();
    this.titleTextEl.textContent = "欢迎来到「圈地之王·风云不测」。\n点击左侧按钮加入游戏！";
    this.titleTextEl.position.offset.y = ScreenInfo.height / 2 - (GirdSize * 2) - FontSize_H1*1.1;
    this.titleTextEl.size.offset.x = 0;
    this.titleTextEl.size.scale.x = 1;
    // this.titleTextEl.textColor.r = 255;
    // this.titleTextEl.textColor.g = 255;
    // this.titleTextEl.textColor.b = 255;
    this.titleTextEl.textFontSize = FontSize_H1;
    this.titleTextEl.visible = true;
    this.titleTextEl.parent = ui;

    this.joinNextGameBtn = UiText.create();
    this.joinNextGameBtn.textContent = "⊚加入下一次游戏";
    this.joinNextGameBtn.textColor.copy(Black);
    this.joinNextGameBtn.size.offset.x = 0;
    this.joinNextGameBtn.size.offset.y = 50;
    this.joinNextGameBtn.size.scale.x = 0.2;
    this.joinNextGameBtn.position.offset.x = 20;
    this.joinNextGameBtn.position.offset.y = 20;
    this.joinNextGameBtn.backgroundColor.copy(Blue);
    this.joinNextGameBtn.backgroundOpacity = 1;
    this.joinNextGameBtn.parent = ui;
    this.joinNextGameBtn.events.add("pointerdown", () => {
      this.alterInvolvement();
    })
    
    this.toturialBtn = UiText.create();
    this.toturialBtn.textContent = "新手教程";
    this.toturialBtn.textColor.copy(Black);
    this.toturialBtn.size.offset.x = 0;
    this.toturialBtn.size.offset.y = 50;
    this.toturialBtn.size.scale.x = 0.2;
    this.toturialBtn.position.offset.x = 20;
    this.toturialBtn.position.offset.y = 90;
    this.toturialBtn.backgroundColor.copy(Blue);
    this.toturialBtn.backgroundOpacity = 1;
    this.toturialBtn.parent = ui;
    this.toturialBtn.events.add("pointerdown", () => {
      Emit.emit(RemoteEvent.tutorial, {});
    })

    Emit.on(ScreenEvent.resize, () => {
      this.titleTextEl.position.offset.y = ScreenInfo.height / 2 - (GirdSize * 2) - FontSize_H1*1.1;
      this.titleTextEl.textFontSize = FontSize_H1;

      this.joinNextGameBtn.textFontSize = FontSize_H2;
      this.toturialBtn.textFontSize = FontSize_H2;
    });

    Emit.on(RemoteEvent.tutorial, () => {
      this.tutorial();
    });

    Emit.on(RemoteEvent.gameStart, () => {
      this.joinNextGameBtn.visible = false;
      this.gaming = true;
      this.grid.hide();
      this.hideCover();
    })

    Emit.on(RemoteEvent.gameEnd, () => {
      if(!this.gaming) return;
      this.joinNextGameBtn.visible = true;
      this.fullCover();
      this.grid.show();
      if(this.joinNextGame) this.alterInvolvement();
    })


    Emit.on(RemoteEvent.gameinfo, (e) => {
      Rich.print(e.args.gameInfo)
      let maxScore = -1;
      let winTeam: string[] = [];
      for(let k of Object.keys(e.args.gameInfo)){
        if(e.args.gameInfo[k] > maxScore){
          maxScore = e.args.gameInfo[k];
          winTeam = [k];
        }else if(e.args.gameInfo[k] == maxScore){
          maxScore = e.args.gameInfo[k];
          winTeam.push(k);
        }
      }
      let i18n: Record<string, string> = {
        red: "红队",
        blue: "蓝队",
        yellow: "黄队",
        purple: "紫队"
      }
      this.titleTextEl.textContent = `本次获胜的队伍是：${winTeam.map((v) => i18n[v]).join("和")}，得分${maxScore}！`;
    });
  }

  async fullCover(){
    if(this.coverEl.visible) return;
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
  
  async hideCover(){
    if(!this.coverEl.visible) return;
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
      x: 0
    }, Ease.easeInOut).wait;
    this.coverEl.visible = false;
    this.titleTextEl.textContent = "";
  }

  async tutorial(){
    this.toturialBtn.visible = false;
    this.joinNextGameBtn.visible = false;
    await this.fullCover();
    await this.grid.show();
    await tutorial(this.grid, this.titleTextEl);
    this.toturialBtn.visible = true;
    this.joinNextGameBtn.visible = true;
    this.titleTextEl.textContent = "欢迎来到「圈地之王·风云不测」";
  }

  alterInvolvement(){
    remoteChannel.sendServerEvent({
      type: RemoteEvent.alterInvolvement,
      value: !this.joinNextGame
    })
    this.joinNextGameBtn.textContent = this.joinNextGame ? "⊚加入下一次游戏" : "⋄取消加入下一次游戏";
    this.toturialBtn.visible = this.joinNextGame;
    this.joinNextGame = !this.joinNextGame;
  }

  static _inst: UiManager;

  static getInstance(){
    if(!UiManager._inst){
      UiManager._inst = new UiManager();
    }
    return UiManager._inst;
  }
}