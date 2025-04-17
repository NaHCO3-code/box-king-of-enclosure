import { PosX, PosY, Teams } from "@/Constants";
import { MAP_SIZE, MAP_ZINDEX } from "@/Constants";

export class KEnclose {
  /**
   * 地图
   */
  map: Uint8Array[] = [];

  /**
   * 该帧变化的方块
   */
  deltaMap: Uint8Array[] = [];
  
  /**
   * 边缘检测的结果
   */
  edge: Uint8Array[] = [];

  constructor(){
    this.map = new Array(MAP_SIZE.x);
    for(let i=0; i<MAP_SIZE.x; ++i){
      this.map[i] = new Uint8Array(MAP_SIZE.y);
    }
    this.deltaMap = new Array(MAP_SIZE.x);
    for(let i=0; i<MAP_SIZE.x; ++i){
      this.deltaMap[i] = new Uint8Array(MAP_SIZE.y);
    }
  }

  getstat(){
    let res: {[key: string]: number} = {};
    for(let i=1; i<Teams.length; ++i) {
      res[Teams[i].name] = 0;
      for(let y=0; y<MAP_SIZE.y; ++y){
        for(let x=0; x<MAP_SIZE.x; ++x){
          if(this.map[x][y] === i){
            res[Teams[i].name] += 1;
          }
        }
      }
    }
    return res;
  }

  init(){
    for(let arr of this.map){
      arr.fill(0);
    }
    for(let arr of this.deltaMap){
      arr.fill(255);
    }
    for(let i=0; i<MAP_SIZE.x; ++i){
      for(let j=0; j<MAP_SIZE.y; ++j){
        voxels.setVoxelId(i, MAP_ZINDEX, j, Teams[0].voxel);
      }
    }
  }

  clear(){
    this.init();
  }

  calcDomain(id: number){
    // 把地图复制一份
    let temp = this.map.map<Uint8Array>(arr => new Uint8Array(arr));
    // 如果地图中某一位置为该队伍颜色，则设置为1；否则为0
    for(let arr of temp){
      arr.forEach((v, i, arr) => {
        arr[i] = v === id ? 1 : 0;
      })
    }
    
    // 要搜索的方块
    let queue: [PosX, PosY][] = new Array(MAP_SIZE.x*MAP_SIZE.y);
    let head = 0;
    let tail = 0;
    // 把地图边缘的所有方块加入队列，并标记为访问过了，除非这个方块已经有颜色
    for(let i=0; i<MAP_SIZE.x; ++i){
      if(temp[i][0] == 0){
        queue[tail++] = [i, 0];
        temp[i][0] = 1;
      }
      if(temp[i][MAP_SIZE.y-1] == 0){
        queue[tail++] = [i, MAP_SIZE.y-1];
        temp[i][MAP_SIZE.y-1] = 1;
      }
    }
    for(let i=1; i<MAP_SIZE.y-1; ++i){
      if(temp[0][i] == 0){
        queue[tail++] = [0, i];
        temp[0][i] = 1;
      }
      if(temp[MAP_SIZE.x-1][i] == 0){
        queue[tail++] = [MAP_SIZE.x-1, i];
        temp[MAP_SIZE.x-1][i] = 1;
      }
    }
    // 洪水填充
    while(head < tail){
      const [x, y] = queue[head++];
      // 向四个方向搜索
      for(const [dx, dy] of [
        [0, 1], 
        [1, 0], 
        [0, -1], 
        [-1, 0]
      ]){
        const nx = x + dx;
        const ny = y + dy;
        // 如果越界，则跳过
        if(nx < 0 || nx >= MAP_SIZE.x || ny < 0 || ny >= MAP_SIZE.y) continue;
        // 如果非0，说明触碰到颜色或者已经搜索过了，跳过
        if(temp[nx][ny] !== 0) continue;
        // 否则，将此位置加入队列，并标记搜索过了
        queue[tail++] = [nx, ny];
        temp[nx][ny] = 1;
      }
    }
    
    temp.forEach((arr, x) => {
      arr.forEach((v, y) => {
        if(v === 0) this.deltaMap[x][y] = id;
      })
    })
  }

  /**
   * 计算地图上所有联通块的边缘
   * 返回值是一个二维数组。对于任意一个元素res[x][y]
   *  - 如果为0，则表示此位置非边界
   *  - 如果为x(x > 0)，则表示此位置为颜色为x的联通块的外边缘
   *  - 如果为255，则表示此位置为任意一个有颜色的联通块的内边缘。
   */
  calcEdge() {
    let res: Uint8Array[] = new Array(MAP_SIZE.x);
    // 初始状态，每个块都标记为254。
    for(let i=0; i<MAP_SIZE.x; ++i){
      res[i] = new Uint8Array(MAP_SIZE.y).fill(254);
    }

    let qx = new Uint8Array(MAP_SIZE.x*MAP_SIZE.y+1);
    let qy = new Uint8Array(MAP_SIZE.x*MAP_SIZE.y+1);
    let head = 0;
    let tail = 1;
    qx[0] = 0;
    qy[0] = 0;
    while(head < tail){
      const x = qx[head];
      const y = qy[head];
      head += 1;
      const v = this.map[x][y];
      // 如果基准块有颜色
      if(v !== 0){
        if(x === 0 || y === 0 || x === MAP_SIZE.x-1 || y === MAP_SIZE.y-1){
          // 如果这个块在边界上，则一定是内边界
          res[x][y] = 255;
        }else{
          // 如果四周存在一个块，使得它的颜色与基准块颜色不同，则此块为内边界
          res[x][y] = (this.map[x][y+1] !== v || this.map[x+1][y] !== v || this.map[x][y-1] !== v || this.map[x-1][y] !== v) ? 255 : 0;
        }
      }else{
        // 如果四周存在一个块有颜色，那么此块为外边界
        if(this.map[x]?.[y+1] ?? false){
          res[x][y] = this.map[x][y+1];
        }else if(this.map[x+1]?.[y] ?? false){
          res[x][y] = this.map[x+1][y];
        }else if(this.map[x]?.[y-1] ?? false){
          res[x][y] = this.map[x][y-1];
        }else if(this.map[x-1]?.[y] ?? false){
          res[x][y] = this.map[x-1][y];
        }
      }
      // 向四个方向搜索
      for(const [dx, dy] of [
        [0, 1], 
        [1, 0], 
        [0, -1], 
        [-1, 0]
      ]){
        const nx = x + dx;
        const ny = y + dy;
        // 如果越界，则跳过
        if(nx < 0 || nx >= MAP_SIZE.x || ny < 0 || ny >= MAP_SIZE.y) continue;
        if(res[nx][ny] === 254){
          res[nx][ny] = 0;
          qx[tail] = nx;
          qy[tail] = ny;
          tail += 1;
        }
      }
    }

    return res;
  }

  setVoxel(x: PosX, y: PosY, v: number){
    this.deltaMap[x][y] = v;
  }

  updateMap(){
    for(let i=0; i<MAP_SIZE.x; ++i){
      for(let j=0; j<MAP_SIZE.y; ++j){
        if(this.deltaMap[i][j] === 255) continue;
        voxels.setVoxelId(i, MAP_ZINDEX, j, Teams[this.deltaMap[i][j]].voxel);
        this.map[i][j] = this.deltaMap[i][j];
        this.deltaMap[i][j] = 255;
      }
    }
  }

  updateModel(teamNum: number){
    for(let i = 1; i <= teamNum; ++i)
      this.calcDomain(i);
    this.edge = this.calcEdge();
  }
}
