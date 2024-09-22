import { Vector2 } from "./lib/Vector";
import { PosX, PosY, TeamId } from "./Interfaces";
import { Teams } from "./TeamManager";
import { Rich } from "./lib/Rich";

const MAP_SIZE = new Vector2(255, 255);
const FREE_VOXEL = 95; // dark_gray
const MAP_ZINDEX = 8;

export class KEnclose {
  /**
   * 地图
   */
  map: Uint8Array[] = [];

  /**
   * 等待更新的方块
   */
  voxelsToUpdate: [PosX, PosY, TeamId][] = [];

  constructor(){
    for(let i=0; i<MAP_SIZE.x; ++i){
      this.map.push(new Uint8Array(MAP_SIZE.y));
    }
  }

  init(){
    for(let arr of this.map){
      arr.fill(0);
    }
    for(let i=0; i<MAP_SIZE.x; ++i){
      for(let j=0; j<MAP_SIZE.y; ++j){
        voxels.setVoxelId(i, MAP_ZINDEX, j, FREE_VOXEL);
      }
    }
  }

  calcDomain(team: number){
    // 把地图复制一份
    let temp = this.cloneMap();
    // 如果地图中某一位置为该队伍颜色，则设置为1；否则为0
    for(let arr of temp){
      arr.forEach((v, i, arr) => {
        arr[i] = v === team ? 1 : 0;
      })
    }
    
    // 要搜索的方块
    let queue: [PosX, PosY][] = [];
    // 把地图边缘的所有方块加入队列，并标记为访问过了，除非这个方块已经有颜色
    for(let i=0; i<MAP_SIZE.x; ++i){
      if(temp[i][0] == 0){
        queue.push([i, 0]);
        temp[i][0] = 1;
      }
      if(temp[i][MAP_SIZE.y-1] == 0){
        queue.push([i, MAP_SIZE.y-1]);
        temp[i][MAP_SIZE.y-1] = 1;
      }
    }
    for(let i=1; i<MAP_SIZE.y-1; ++i){
      if(temp[0][i] == 0){
        queue.push([0, i]);
        temp[0][i] = 1;
      }
      if(temp[MAP_SIZE.x-1][i] == 0){
        queue.push([MAP_SIZE.x-1, i]);
        temp[MAP_SIZE.x-1][i] = 1;
      }
    }
    // 洪水填充
    while(queue.length > 0){
      const [x, y] = queue.shift()!;
      // 向四个方向搜索
      for(const [dx, dy] of [[0, 1], [1, 0], [0, -1], [-1, 0]]){
        const nx = x + dx;
        const ny = y + dy;
        // 如果越界，则跳过
        if(nx < 0 || nx >= MAP_SIZE.x || ny < 0 || ny>= MAP_SIZE.y) continue;
        // 如果非0，说明触碰到颜色或者已经搜索过了，跳过
        if(temp[nx][ny] !== 0) continue;
        // 否则，将此位置加入队列，并标记搜索过了
        queue.push([nx, ny]);
        temp[nx][ny] = 1;
      }
    }

    let x = 0;
    for(let arr of temp){
      arr.forEach((v, y) => {
        if(v === 0) this.voxelsToUpdate.push([x, y, team-1]);
      })
      x += 1;
    }
  }

  updateVoxels(){
    for(let [x, y, teamId] of this.voxelsToUpdate){
      voxels.setVoxelId(x, MAP_ZINDEX, y, Teams[teamId].voxel);
      this.map[x][y] = teamId + 1;
    }
    this.voxelsToUpdate = [];
  }

  cloneMap(){
    return this.map.map<Uint8Array>(arr => new Uint8Array(arr));
  }
}