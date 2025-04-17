import { KEnclose } from "@/Model/Enclose";
import { Vector2 } from "@/lib/Vector";
import { KZone } from "./Zone";


export class RainZone extends KZone {
  level: number;

  constructor(
    position: Vector2,
    size: Vector2
  ) {
    super(position, size);
    this.gameZone.rainEnabled = true;
    this.level = Math.random() * 0.005;

    this.gameZone.onEnter(({ entity }) => {
      if (entity.isPlayer) {
        (entity as GamePlayerEntity).player.directMessage("您已进入：雨区");
      }
    });
  }

  calcEffect(model: KEnclose): void {
    const mx = this.position.x + this.size.x;
    const my = this.position.y + this.size.y;
    for (let x = this.position.x; x < mx; ++x) {
      for (let y = this.position.y; y < my; ++y) {
        const v = model.edge[x][y];
        if (v === 255 || v === 0) continue;
        if (Math.random() < this.level) {
          model.deltaMap[x][y] = v;
        }
      }
    }
  }

  destory(): void {
    this.gameZone.rainEnabled = false;
    ; (async () => {
      await sleep(1000);
      this.gameZone.remove();
    })();
  }

  static create(pos: Vector2, size: Vector2) {
    return new RainZone(pos, size);
  }
}
