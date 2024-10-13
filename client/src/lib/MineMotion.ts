export const Ease = {
  linear: (r: number) => r,
  sine: (r: number) => Math.sin(r*Math.PI/2),
  easeInOut: (r: number) => 6*r**5 - 15*r**4 + 10*r**3,
  easeIn: (r: number) => Math.sqrt(r),
  easeOut: (r: number) => r ** 3
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

  /**
   * 创建一个动画
   * @param obj 需要应用动画的对象
   * @param duration 动画时间（毫秒）
   * @param from 起始值列表，只允许数字，以{属性名: 数值}的形式传入
   * @param to 终止值列表
   * @param ease 缓动函数（从[0, 1) -> [0, 1)的一个函数
   * @returns 动画对象
   */
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