import { KEnclose } from "./Enclose";
import { MAP_HEIGHT, MAP_SIZE, MIN_ZONE_SIZE } from "./Constants";
import { Vector2 } from "./lib/Vector";
import { Rich } from "./lib/Rich";
import { Teams } from "./TeamManager";

export class KZoneMgr{
  /**
   * 区域
   */
  zones: KZone[] = [];

  zoneRate = [
    {
      create: RainZone.create,
      rate: 1
    },
    {
      create: SunnyZone.create,
      rate: 1
    }
  ];

  zoneRateSum: number = this.zoneRate.reduce((acc, cur) => acc + cur.rate, 0);

  private initZones(pos: Vector2, size: Vector2, depth: number){
    if(size.x <= MIN_ZONE_SIZE || size.y <= MIN_ZONE_SIZE){
      return;
    }
    if(depth <= 0){
      const r = Math.floor(Math.random()*this.zoneRateSum)+1;
      let s = 0;
      for(const {create, rate} of this.zoneRate){
        s += rate;
        if(r <= s){
          let z = create(pos, size);
          if(!z) return;
          this.zones.push(z);
          return;
        }
      }
      return;
    }
    const p = new Vector2(Math.floor(Math.random()*size.x), Math.floor(Math.random()*size.y));
    this.initZones(pos, p, depth - 1);
    this.initZones(
      new Vector2(pos.x + p.x + 1, pos.y + p.y + 1), 
      new Vector2(size.x - p.x - 1, size.y - p.y - 1), 
      depth - 1
    );
    this.initZones(pos.clone().addX(p.x), new Vector2(size.x - p.x, p.y), depth - 1);
    this.initZones(pos.clone().addY(p.y), new Vector2(p.x, size.y - p.y), depth - 1);
  }

  init(){
    this.clear();
    this.zoneRateSum = this.zoneRate.reduce((acc, cur) => acc + cur.rate, 0);
    this.initZones(new Vector2(0, 0), new Vector2(MAP_SIZE.x, MAP_SIZE.y), 1);
  }

  clear(){
    this.zones.forEach(z => {
      z.destory();
    });
    this.zones = [];
  }

  calcEffect(model: KEnclose){
    for(const z of this.zones){
      z.calcEffect(model);
    }
  }
}

export abstract class KZone {
  gameZone: GameZone;
  constructor(
    public position: Vector2, 
    public size: Vector2
  ){
    this.gameZone = world.addZone({
      selector: 'player',
      bounds: {
        lo: new GameVector3(this.position.x, 0, this.position.y),
        hi: new GameVector3(this.position.x + this.size.x, MAP_HEIGHT, this.position.y + this.size.y)
      } as GameBounds3
    })
  }

  abstract destory(): void;

  abstract calcEffect(model: KEnclose): void;
}

export class RainZone extends KZone {
  level: number;

  constructor(
    position: Vector2, 
    size: Vector2
  ){
    super(position, size);
    this.gameZone.rainEnabled = true;
    this.level = Math.random()*0.2 + 0.1;

    this.gameZone.onEnter(({entity}) => {
      if(entity.isPlayer){
        (entity as GamePlayerEntity).player.directMessage("you enter rain zone.")
      }
    })
  }

  calcEffect(model: KEnclose): void {
    const mx = this.position.x + this.size.x;
    const my = this.position.y + this.size.y;
    for(let x = this.position.x; x < mx; ++x){
      for(let y = this.position.y; y < my; ++y){
        const v = model.edge[x][y];
        if(v === 255 || v === 0) continue;
        if(Math.random() < this.level){
          model.deltaMap[x][y] = v;
        }
      }
    }
  }

  destory(): void {
    this.gameZone.rainEnabled = false;
    ;(async () => {
      await sleep(1000);
      this.gameZone.remove();
    })();
  }

  static create(pos: Vector2, size: Vector2){
    return new RainZone(pos, size);
  }
}

export class SunnyZone extends KZone {
  level: number;

  constructor(
    position: Vector2, 
    size: Vector2
  ){
    super(position, size);
    this.level = Math.random()*0.2 + 0.1;

    this.gameZone.onEnter(({entity}) => {
      if(entity.isPlayer){
        (entity as GamePlayerEntity).player.directMessage("you enter sunny zone.")
      }
    })
  }

  calcEffect(model: KEnclose): void {
    const mx = this.position.x + this.size.x;
    const my = this.position.y + this.size.y;
    for(let x = this.position.x; x < mx; ++x){
      for(let y = this.position.y; y < my; ++y){
        const v = model.edge[x][y];
        if(v !== 255) continue;
        if(Math.random() < this.level){
          model.deltaMap[x][y] = 0;
        }
      }
    }
  }

  destory(): void {
    world.removeZone(this.gameZone);
  }

  static create(pos: Vector2, size: Vector2){
    return new SunnyZone(pos, size);
  }
}