import { MAP_HEIGHT } from "./Interfaces";
import { Vector2 } from "./lib/Vector";

export abstract class KZone {
  gameZone: GameZone;
  constructor(
    public position: Vector2, 
    public size: Vector2
  ){
    this.gameZone = world.addZone({
      bounds: {
        lo: new GameVector3(this.position.x, 0, this.position.y),
        hi: new GameVector3(this.position.x + this.size.x, MAP_HEIGHT, this.position.y + this.size.y)
      } as GameBounds3
    })
  }
}

export class RainZone extends KZone {
  constructor(
    position: Vector2, 
    size: Vector2
  ){
    super(position, size);
    this.gameZone.rainEnabled = true;
  }

  static create(pos: Vector2, size: Vector2){
    return new RainZone(pos, size);
  }
}