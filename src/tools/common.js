function random(start, end) {
  return Math.floor((Math.random() * (end - start) + start) * 100) / 100;
}
function setCanvasSize(canvas, width, height) {
  let dpr = window.devicePixelRatio;
  if (dpr) {
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    var ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.scale(dpr, dpr);
  } else {
    canvas.width = width;
    canvas.height = height;
  }
}
//二维向量
class Vector {
  x;
  y;
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
  }
  getLength() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  // 向量相加的结果,加数向量首尾相接的后,一个向量尾部到另一个向量头部的为新向量,即,比如a头部接b头部,新向量为a尾部指向b头部
  add(a) {
    return new Vector(this.x + a.x, this.y + a.y);
  }
  // 向量相减的结果,两个向量由同一点出发,新向量为减数头部指向被减数头部,即b头部指向a头部
  subtract(a) {
    return new Vector(this.x - a.x, this.y - a.y);
  }
  //二维中向量a旋转radian弧度后形成的向量,x正轴向y正轴旋转的弧度
  rotate(radian) {
    let newX = this.x * Math.cos(radian) - this.y * Math.sin(radian);
    let newY = this.x * Math.sin(radian) + this.y * Math.cos(radian);
    return new Vector(newX, newY);
  }
  //点积
  dot(a) {
    let dot = this.x * a.x + this.y * a.y;
    return dot;
  }
  //单位化
  normalize() {
    let l = this.getLength();
    return l ? new Vector(this.x / d, this.y / d) : new Vector(0, 0);
  }
  //法向量
  perpendicular() {
    return new Vector(this.y, -this.x);
  }
}
function getImgSrc(val) {
  return new URL(`../assets/images/${val}`, import.meta.url).href;
}
export { random, setCanvasSize, getImgSrc, Vector };
