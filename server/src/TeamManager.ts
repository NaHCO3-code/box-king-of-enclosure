import { Rich } from "./lib/Rich";
import { Player } from "./Player";


export const Teams: {name: string, voxel: number}[] = [
  {
    name: "DEFAULT",
    voxel: 95,
  },
  {
    name: "red",
    voxel: 105,
  },
  {
    name: "blue",
    voxel: 91
  }
] as const;

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
    })
    this.teams = new Array(Teams.length).fill([]);
    this.teamNum = 0;
  }

  alloc(){
    if(Player.players.length <= Teams.length * 2 - 2){
      this.teamNum = 2;
      Player.players.forEach(player => {
        if(Math.random() < 0.5){
          player.team = 1;
          this.teams[1].push(player);
          console.log("red");
        }else{
          player.team = 2;
          this.teams[2].push(player);
          console.log("blue");
        }
      })
    }else{
      this.teamNum = Teams.length - 1;
      Player.players.forEach(player => {
        player.team = Math.floor(Math.random() * (Teams.length - 1))+1;
        this.teams[player.team].push(player);
      })
    }
  }
}