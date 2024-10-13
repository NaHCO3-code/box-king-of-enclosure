import { Teams } from "@/Constants";
import { Rich } from "@/lib/Rich";
import { Player } from "./Player";
import { RemoteEvent } from "@/RemoteEvent";



export class KTeamManager {
  teams: Player[][];
  teamNum: number;

  constructor(){
    this.teams = new Array(Teams.length).fill([]);
    this.teamNum = 0;
  }

  clear(){
    Player.players.forEach(player => {
      player.team = null;
      player.entity.player.spectator = true;
      remoteChannel.sendClientEvent(player.entity, {
        type: RemoteEvent.gameEnd
      })
    })
    this.teams = new Array(Teams.length).fill([]);
    this.teamNum = 0;
  }

  alloc(){
    if(Player.players.length <= Teams.length * 2 - 2){
      this.teamNum = 2;
      Player.players.forEach(player => {
        if(!player.joinNextGame) return;
        if(Math.random() < 0.5){
          player.team = 1;
          this.teams[1].push(player);
        }else{
          player.team = 2;
          this.teams[2].push(player);
        }
        player.entity.player.spectator = false;
        remoteChannel.sendClientEvent(player.entity, {
          type: RemoteEvent.gameStart
        })
      })
    }else{
      this.teamNum = Teams.length - 1;
      Player.players.forEach(player => {
        if(!player.joinNextGame) return;
        player.team = Math.floor(Math.random() * (Teams.length - 1))+1;
        this.teams[player.team].push(player);
        player.entity.player.spectator = false;
        remoteChannel.sendClientEvent(player.entity, {
          type: RemoteEvent.gameStart
        })
      })
    }
  }
}