import { KEnclose } from "@/Model/Enclose";
import { MAP_HEIGHT } from "@/Constants";
import { Vector2 } from "@/lib/Vector";
import { Rich } from "@/lib/Rich";
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

