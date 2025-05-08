import { Vector2 } from "src/lib/Vector";
import { KZone } from "./Zone";
import { KEnclose } from "src/Model/Enclose";

export class SnowZone extends KZone {
  constructor(
    position: Vector2,
    size: Vector2
  ) {
    super(position, size);
    this.gameZone.snowEnabled = true;

    this.gameZone.onEnter(({ entity }) => {
      if (entity.isPlayer) {
        (entity as GamePlayerEntity).player.directMessage("您已进入：雪区");
      }
    });
  }

  useEffect(model: KEnclose): void {
    const mx = this.position.x + this.size.x;
    const my = this.position.y + this.size.y;
    for (let x = this.position.x; x < mx; ++x) {
      for (let y = this.position.y; y < my; ++y) {
        model.deltaMap[x][y] = 255;
      }
    }
  }

  destory(): void {
    this.gameZone.snowEnabled = false;
    ; (async () => {
      await sleep(1000);
      this.gameZone.remove();
    })();
  }

  static create(pos: Vector2, size: Vector2) {
    return new SnowZone(pos, size);
  }
}
