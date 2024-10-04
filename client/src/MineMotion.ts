type ExtractAnimateable<T extends {
  [K: string]: any
}> = {
  [K in keyof T]: number
}

export class MineMotion {
  constructor(){
    
  }

  animate<
    T extends {
      [K: string]: any
    }
  >(
    obj: T, 
    from: Partial<ExtractAnimateable<T>>, 
    to: Partial<ExtractAnimateable<T>>
  ){
    for(let k in from){
      let awa = obj[k];
      
    }
  }
}