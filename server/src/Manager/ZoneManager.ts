import { MIN_ZONE_SIZE, MAP_SIZE } from "@/Constants";
import { Vector2 } from "@/lib/Vector";
import { KZone } from "@/Zone/Zone";
import { SunnyZone } from "@/Zone/SunnyZone";
import { RainZone } from "@/Zone/RainZone";
import { SnowZone } from "@/Zone/SnowZone";

/**
 * 区域管理器
 */
export class KZoneManager {
  /**
   * 区域
   */
  zones: KZone[] = [];

  /**
   * 区域生成比例
   */
  zoneRate = [
    {
      create: RainZone.create,
      rate: 1,
    },
    {
      create: SunnyZone.create,
      rate: 1,
    },
    {
      create: SnowZone.create,
      rate: 1,
    },
  ];

  /**
   * 区域生成比例之和，用于计算生成概率
   */
  zoneRateSum: number = this.zoneRate.reduce((acc, cur) => acc + cur.rate, 0);

  /**
   * 递归随机初始化游戏区域
   * @param pos 左上角坐标
   * @param size 大小
   * @param depth 递归深度
   */
  private initZones(pos: Vector2, size: Vector2, depth: number) {
    if (size.x <= MIN_ZONE_SIZE || size.y <= MIN_ZONE_SIZE) {
      return;
    }
    if (depth <= 0) {
      const r = Math.floor(Math.random() * this.zoneRateSum) + 1;
      let s = 0;
      for (const { create, rate } of this.zoneRate) {
        s += rate;
        if (r <= s) {
          let z = create(pos, size);
          if (!z) return;
          this.zones.push(z);
          return;
        }
      }
      return;
    }
    const p = new Vector2(
      Math.floor(Math.random() * size.x),
      Math.floor(Math.random() * size.y)
    );
    this.initZones(pos, p, depth - 1);
    this.initZones(
      new Vector2(pos.x + p.x + 1, pos.y + p.y + 1),
      new Vector2(size.x - p.x - 1, size.y - p.y - 1),
      depth - 1
    );
    this.initZones(
      pos.clone().addX(p.x),
      new Vector2(size.x - p.x, p.y),
      depth - 1
    );
    this.initZones(
      pos.clone().addY(p.y),
      new Vector2(p.x, size.y - p.y),
      depth - 1
    );
  }

  /**
   * 初始化区域
   */
  init() {
    this.clear();
    this.zoneRateSum = this.zoneRate.reduce((acc, cur) => acc + cur.rate, 0);
    this.initZones(new Vector2(0, 0), new Vector2(MAP_SIZE.x, MAP_SIZE.y), 3);
  }

  /**
   * 清除区域
   */
  clear() {
    this.zones.forEach((z) => {
      z.destory();
    });
    this.zones = [];
  }
}
