import { Teams } from "@/Constants";
import { Player } from "../Model/Player";
import { RemoteEvent } from "@shares/RemoteEvent";
import { KPlayerManager } from "@/Manager/PlayerManager";

/**
 * 队伍管理
 */
export class KTeamManager {
  /**
   * 各个队伍人员
   */
  teams: Player[][];

  /**
   * 队伍数量
   */
  teamCount: number;

  constructor() {
    this.teams = new Array(Teams.length).fill([]);
    this.teamCount = 0;
  }

  /**
   * 清除队伍状态
   */
  clear() {
    KPlayerManager.instance.players.forEach((player) => {
      player.team = null;
      player.entity.player.spectator = true;
      remoteChannel.sendClientEvent(player.entity, {
        type: RemoteEvent.gameEnd,
      });
    });
    this.teams = new Array(Teams.length).fill([]);
    this.teamCount = 0;
  }

  /**
   * 分配队伍
   */
  alloc() {
    if (KPlayerManager.instance.players.size <= Teams.length * 2 - 2) {
      this.teamCount = 2;
      KPlayerManager.instance.players.forEach((player) => {
        if (!player.joinNextGame) return;
        if (Math.random() < 0.5) {
          player.team = 1;
          this.teams[1].push(player);
        } else {
          player.team = 2;
          this.teams[2].push(player);
        }
        player.entity.player.spectator = false;
        remoteChannel.sendClientEvent(player.entity, {
          type: RemoteEvent.gameStart,
        });
      });
    } else {
      this.teamCount = Teams.length - 1;
      KPlayerManager.instance.players.forEach((player) => {
        if (!player.joinNextGame) return;
        player.team = Math.floor(Math.random() * (Teams.length - 1)) + 1;
        this.teams[player.team].push(player);
        player.entity.player.spectator = false;
        remoteChannel.sendClientEvent(player.entity, {
          type: RemoteEvent.gameStart,
        });
      });
    }
  }
}
