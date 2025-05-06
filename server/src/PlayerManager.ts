import { Player } from "./Controller/Player";

export class PlayerManager {
  protected static _instance: PlayerManager | null = null;
  static get instance(): PlayerManager {
    if(!this._instance){
      this._instance = new PlayerManager();
    }
    return this._instance;
  }
  
  players: Map<string, Player> = new Map();

  findPlayerByUserId(userId: string){
    return this.players.get(userId);
  }

  create(entity: GamePlayerEntity){
    this.players.set(entity.player.userId, new Player(entity));
  }

  delete(entity: GamePlayerEntity){
    this.players.delete(entity.player.userId);
  }
}