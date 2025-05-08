import Component from "@/Component/Definition";
import { Player } from "./Model/Player";
import { KGameManager } from "./Controller/GameController";
import { KPlayerManager } from "./Manager/PlayerManager";

export class App extends Component {
  constructor() {
    super();
    world.onPlayerJoin(({ entity }) => {
      this.onPlyaerJoin(entity);
    });
    world.onPlayerLeave(({ entity }) => {
      this.onPlayerLeave(entity);
    });
    world.onPlayerPurchaseSuccess((event) => {
      this.onPurchase(event.userId, event.orderId, event.productId);
    });
  }

  onPlyaerJoin(entity: GamePlayerEntity) {
    KPlayerManager.instance.create(entity);
  }

  onPlayerLeave(entity: GamePlayerEntity) {
    KPlayerManager.instance.delete(entity);
  }

  onPurchase(userId: string, orderId: number, productId: number) {
    const player = KPlayerManager.instance.findPlayerByUserId(userId);
    if (!player) return;
    const goods: Record<number, () => void> = {
      383003838722692: () => {
        player.entity.player.scale = 1.5;
      },
      383009337455908: () => {
        player.entity.player.runSpeed = 1.5;
      },
      383009341650069: () => {
        player.entity.player.dialog({
          type: GameDialogType.TEXT,
          content: "https://github.com/NaHCO3-code/box-king-of-enclosure",
        });
      },
    };
    goods[productId]?.();
  }
}

const gameMgr = new KGameManager();
const app = new App();
