import { KEnclose } from "src/Model/Enclose";
import { Vector2 } from "src/lib/Vector";
import { KZone } from "./Zone";


export class SunnyZone extends KZone {
  level: number;

  constructor(
    position: Vector2,
    size: Vector2
  ) {
    super(position, size);
    this.level = Math.random() * 0.2 + 0.1;

    this.gameZone.onEnter(({ entity }) => {
      if (entity.isPlayer) {
        (entity as GamePlayerEntity).player.directMessage("you enter sunny zone.");
      }
    });
  }

  calcEffect(model: KEnclose): void {
    const mx = this.position.x + this.size.x;
    const my = this.position.y + this.size.y;
    for (let x = this.position.x; x < mx; ++x) {
      for (let y = this.position.y; y < my; ++y) {
        const v = model.edge[x][y];
        if (v !== 255) continue;
        if (Math.random() < this.level) {
          model.deltaMap[x][y] = 0;
        }
      }
    }
  }

  destory(): void {
    world.removeZone(this.gameZone);
  }

  static create(pos: Vector2, size: Vector2) {
    return new SunnyZone(pos, size);
  }
}
