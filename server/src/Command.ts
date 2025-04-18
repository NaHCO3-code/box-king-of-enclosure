/**
 * @deprecated
 * @todo 重构
 */

import Component from "@/Component/Definition";
import { KGameUpdater } from "./Controller/GameUpdater";
import { Rich } from "./lib/Rich";

const ADMINS = ["x4o97kjqdeo823q"]

/**
 * @deprecated
 */
export class KCommand extends Component {
  constructor(public gameMgr: KGameUpdater) {
    super();
    world.onChat(event => this.onChat(event));
  }

  cmdParserTable: {[k: string]: (args: string[], caller: GamePlayerEntity) => any} = {
    team: this.teamCmdParser.bind(this)
  }

  onChat(event: GameChatEvent) {
    const entity = event.entity as GamePlayerEntity;
    const message = event.message;

    if(!message.startsWith("/")) return;
    if(!ADMINS.includes(entity.player.boxId)){
      this.error([], entity, "No permission");
      return;
    }

    const args = message.split(" ");
    const cmd = args[0].slice(1);
    if(!this.cmdParserTable[cmd]) this.error(args, entity, "Invalid command");
    this.cmdParserTable[cmd](args.slice(1), entity);
  }

  teamCmdParser(args: string[], caller: GamePlayerEntity){
    switch(args[0]){
      case "alloc": {
        this.gameMgr.teamMgr.clear();
        this.gameMgr.teamMgr.alloc();
        break;
      }
      case "clear": {
        this.gameMgr.teamMgr.clear();
        break;
      }
    }
  }

  entityParser(str: string, caller: GamePlayerEntity){
    if(str === "$0") return caller;
  }

  error(args: string[], caller: GamePlayerEntity, err: string){
    caller.player.directMessage(`Error! ${err}`);
  }
}