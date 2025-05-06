import Component from "@/Component/Definition";
import { Player } from "./Controller/Player";
import { KGameManager } from "./Controller/GameManager";
import { PlayerManager } from "./PlayerManager";

export class App extends Component {
  constructor(){
    super();
    world.onPlayerJoin(({entity}) => {this.onPlyaerJoin(entity)});
    world.onPlayerLeave(({entity}) => {this.onPlayerLeave(entity)});
  }
  
  onPlyaerJoin(entity: GamePlayerEntity){
    PlayerManager.instance.create(entity);
  }

  onPlayerLeave(entity: GamePlayerEntity){
    PlayerManager.instance.delete(entity);
  }
}

const gameMgr = new KGameManager();
const app = new App();

world.onPlayerPurchaseSuccess(({userId, orderId, productId}) => {
  const player = PlayerManager.instance.findPlayerByUserId(userId);
  if(!player) return;
  if(productId === 383003838722692){
    player.entity.player.scale = 1.5;
  }else if(productId === 383009337455908){
    player.entity.player.runSpeed = 1.5;
  }else if(productId === 383009341650069){
    player.entity.player.dialog({
      type: GameDialogType.TEXT,
      content: "https://github.com/NaHCO3-code/box-king-of-enclosure"
    })
  }
})
