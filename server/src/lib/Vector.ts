export class Vector2{
  x: number
  y: number

  constructor(x: number, y: number){
    this.x = x;
    this.y = y;
  }

  clone(){
    return new Vector2(this.x, this.y);
  }

  add(v: Vector2){
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  reduce(v: Vector2){
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  stretch(n: number){
    this.x *= n;
    this.y *= n;
    return this;
  }

  distance(v: Vector2){
    return Math.sqrt((this.x - v.x)**2 + (this.y - v.y)**2);
  }

  normalize(){
    const len = this.length;
    this.x /= len;
    this.y /= len;
    return this;
  }

  mul(n: number){
    this.x *= n;
    this.y *= n;
    return this;
  }

  set(x: number, y: number){
    this.x = x;
    this.y = y;
    return this;
  }

  addX(n: number){
    this.x += n;
    return this;
  }

  addY(n: number){
    this.y += n;
    return this;
  }

  get length(){
    return Math.sqrt(this.x**2 + this.y**2);
  }


  static add(u: Vector2, v: Vector2){
    return new Vector2(u.x + v.x, u.y + v.y);
  }

  static distance(u: Vector2, v: Vector2){
    return Math.sqrt((u.x - v.x)**2 + (u.y - v.y)**2);
  }

  static distance2(u: Vector2, v: Vector2){
    return (u.x - v.x)**2 + (u.y - v.y)**2;
  }

  static reduce(u: Vector2, v: Vector2){
    return new Vector2(u.x - v.x, u.y - v.y);
  }

  static stretch(v: Vector2, n: number){
    return new Vector2(v.x * n, v.y * n);
  }

  static mul(v: Vector2, n: number){
    return new Vector2(v.x * n, v.y * n);
  }

  static addX(v: Vector2, n: number){
    return new Vector2(v.x + n, v.y);
  }

  static addY(v: Vector2, n: number){
    return new Vector2(v.x, v.y + n);
  }
}