import { Player } from "../Model/Player";

export class KPlayerManager {
  protected static _instance: KPlayerManager | null = null;
  static get instance(): KPlayerManager {
    if (!this._instance) {
      this._instance = new KPlayerManager();
    }
    return this._instance;
  }

  players: Map<string, Player> = new Map();

  findPlayerByUserId(userId: string) {
    return this.players.get(userId);
  }

  create(entity: GamePlayerEntity) {
    this.players.set(entity.player.userId, new Player(entity));
  }

  delete(entity: GamePlayerEntity) {
    this.players.delete(entity.player.userId);
  }
}
