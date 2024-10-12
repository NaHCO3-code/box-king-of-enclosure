import { Ease, MineMotion } from "./MineMotion";
import { Rich } from "./lib/Rich";
import { Vector2 } from "./lib/Vector";

export const Imgs = [
  "picture/block_white.png",
  "picture/block_blue.png",
  "picture/block_red.png"
]

export class KGrid{
  gridInfo: Uint8Array[];
  updateInfo: Uint8Array[];
  blocks: UiImage[][];
  lock: boolean = false;
  isShown: boolean = true;

  constructor(
    public gridWidth: number,
    public gridHeight: number,
    public gridSize: number,
    public position: Vector2, // 顶点位置
    public screen: UiNode = ui,
    public animateSpeed: number = 500
  ){
    this.gridInfo = new Array(gridWidth);
    this.updateInfo = new Array(gridWidth);
    for(let i = 0; i < gridWidth; i++){
      this.gridInfo[i] = new Uint8Array(gridHeight);
      this.gridInfo[i].fill(0);
      this.updateInfo[i] = new Uint8Array(gridHeight);
      this.updateInfo[i].fill(255);
    }

    const dx = new Vector2(-gridSize / 2, gridSize / 4);
    const dy = new Vector2(gridSize / 2, gridSize / 4);
    let currentPos = position.clone();
    this.blocks = new Array(gridWidth);
    for(let y = 0; y < gridHeight; y++){
      this.blocks[y] = new Array(gridHeight);
      const t = currentPos.clone();
      for(let x = 0; x < gridWidth; x++){
        const block = UiImage.create();
        block.parent = screen;
        block.image = "picture/block_white.png"
        block.anchor.x = 0.5;
        block.anchor.y = 0.5;
        block.size.offset.x = gridSize;
        block.size.offset.y = gridSize;
        block.position.offset.x = currentPos.x;
        block.position.offset.y = currentPos.y;
        block.backgroundOpacity = 0;
        this.blocks[y][x] = block;
        currentPos.add(dx);
      }
      currentPos = t;
      currentPos.add(dy);
    }
  }

  async update(){
    if(this.lock) throw new Error("Grid is locked 1");
    this.lock = true;
    let _last = null;
    for(let y = 0; y < this.gridHeight; y++){
      for(let x = 0; x < this.gridWidth; x++){
        if(this.updateInfo[y][x] === 255) continue;
        _last = this.updateCell(x, y);
        await sleep(this.animateSpeed/this.gridWidth/this.gridHeight);
      }
    }
    await _last;
    this.lock = false;
  }

  async forceClear(){
    if(this.lock) throw new Error("Grid is locked 2");
    this.lock = true;
    for(let i = 0; i < this.gridWidth; i++){
      this.updateInfo[i].fill(0);
    }
    this.lock = false;
    await this.update();
  }

  async show(){
    if(this.isShown) return;
    if(this.lock) throw new Error("Grid is locked 3");
    this.lock = true;
    let _last: null | Promise<void> = null;
    for(let y = 0; y < this.gridHeight; y++){
      for(let x = 0; x < this.gridWidth; x++){
        this.blocks[y][x].visible = true;
        _last = easeIn(this.blocks[y][x], this.gridSize/2, this.animateSpeed)
      }
    }
    await _last;
    this.lock = false;
  }

  async hide(){
    if(!this.isShown) return;
    if(this.lock) throw new Error("Grid is locked 4");
    this.lock = true;
    let _last = null;
    for(let y = 0; y < this.gridHeight; y++){
      for(let x = 0; x < this.gridWidth; x++){
        _last = easeOut(this.blocks[y][x], this.gridSize/2, this.animateSpeed)
        .then(() => {
          this.blocks[y][x].visible = false;
        });
      }
    }
    await _last;
    this.lock = false;
  }

  align(){
    const dx = new Vector2(-this.gridSize / 2, this.gridSize / 4);
    const dy = new Vector2(this.gridSize / 2, this.gridSize / 4);
    let currentPos = this.position.clone();
    for(let y = 0; y < this.gridHeight; y++){
      const t = currentPos.clone();
      for(let x = 0; x < this.gridWidth; x++){
        const block = this.blocks[y][x];
        block.position.offset.x = currentPos.x;
        block.position.offset.y = currentPos.y;
        block.backgroundOpacity = 0;
        currentPos.add(dx);
      }
      currentPos = t;
      currentPos.add(dy);
    }
  }

  private async updateCell(x: number, y: number){
    const block = this.blocks[y][x];
    await easeOut(block, this.gridSize/2, this.animateSpeed);
    block.image = Imgs[this.updateInfo[y][x]];
    await easeIn(block, this.gridSize/2, this.animateSpeed);
    this.gridInfo[y][x] = this.updateInfo[y][x];
    this.updateInfo[y][x] = 255;
  }
}

async function easeIn(el: UiImage, float: number, t: number){
  MineMotion.fromTo(el, t, {
    imageOpacity: 0
  }, {
    imageOpacity: 1
  }, Ease.sine);
  await MineMotion.fromTo(el.position.offset, t, {
    y: el.position.offset.y
  }, {
    y: el.position.offset.y - float
  }, Ease.sine).wait;
}

async function easeOut(el: UiImage, float: number, t: number){
  MineMotion.fromTo(el, t, {
    imageOpacity: 1
  }, {
    imageOpacity: 0
  }, Ease.sine);
  await MineMotion.fromTo(el.position.offset, t, {
    y: el.position.offset.y
  }, {
    y: el.position.offset.y + float
  }, Ease.sine).wait;
}