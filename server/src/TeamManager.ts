import { Rich } from "./lib/Rich";
import { Player } from "./Player";


export const Teams: {name: string, voxel: number}[] = [
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
    this.teams = [];
    this.teamNum = 0;
    for(let i=0; i<Teams.length; ++i) this.teams.push([]);
  }

  clear(){
    Player.players.forEach(player => {
      player.team = null;
    })
    this.teams = [];
    this.teamNum = 0;
    for(let i=0; i<Teams.length; ++i) this.teams.push([]);
  }

  alloc(){
    if(Player.players.length <= Teams.length * 2){
      this.teamNum = 2;
      Player.players.forEach(player => {
        if(Math.random() < 0.5){
          player.team = 0;
          this.teams[0].push(player);
          console.log("red");
        }else{
          player.team = 1;
          this.teams[1].push(player);
          console.log("blue");
        }
      })
    }else{
      this.teamNum = Teams.length;
      Player.players.forEach(player => {
        player.team = Math.floor(Math.random() * Teams.length);
        this.teams[player.team].push(player);
      })
    }
  }
}