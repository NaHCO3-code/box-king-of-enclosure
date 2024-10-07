export const Ease = {
  linear: (rate: number) => rate,
  sine: (rate: number) => Math.sin(rate*Math.PI/2),
} as const;

export class MineMotion<T extends Object>{
  private id: symbol;
  private rate: number;
  private vars: (keyof T)[];
  private resolve: (() => void) | null = null;
  readonly wait: Promise<void>;

  constructor(
    public obj: T,
    public duration: number,
    public from: Partial<T>,
    public to: Partial<T>,
    public ease: (rate: number) => number
  ){
    this.id = Symbol();
    this.rate = 0;
    this.vars = [];
    this.wait = new Promise(resolve => this.resolve = resolve);
    for(const key in this.from){
      if(typeof this.from[key] !== typeof this.to[key]){
        continue;
      }
      if(typeof this.to[key] !== "number"){
        continue;
      }
      this.vars.push(key);
    }
  }

  protected update(dt: number){
    this.rate += dt;
    const rate = this.rate / this.duration;
    if(rate >= 1){
      MineMotion.remove(this.id);
      this.resolve?.();
      for(const key in this.to){
        (this.obj as any)[key] = this.to[key];
      }
      return;
    }
    for(const key of this.vars){
      const from = this.from[key] as number;
      const delta = ((this.to[key] as number) - from) * this.ease(rate);
      (this.obj as any)[key] = from + delta;
    }
  }

  resume(){
    MineMotion.add(this, this.id);
  }

  pause(){
    MineMotion.remove(this.id);
  }

  private static motions: Map<symbol, any> = new Map();

  private static add(m: MineMotion<any>, id: symbol){
    this.motions.set(id, m);
  }

  private static remove(id: symbol){
    this.motions.delete(id);
  }

  static fromTo<T extends Object>(
    obj: T, 
    duration: number, 
    from: Partial<T>,
    to: Partial<T>,
    ease: (rate: number) => number = Ease.linear
  ){
    const m =  new MineMotion(obj, duration, from, to, ease);
    MineMotion.add(m, m.id);
    return m;
  }

  static update(dt: number){
    for(const [id, m] of this.motions){
      m.update(dt);
    }
  }
}

;(function(){
  setInterval(() => {
    MineMotion.update(8);
  }, 8);
})();