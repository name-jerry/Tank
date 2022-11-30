//鼠标类
class Mouse {
  x = innerWidth / 2;
  y = innerHeight / 2;
  img;
  size = 1;
  constructor(img) {
    this.img = img;
  }
  update(x, y) {
    this.x = x;
    this.y = y;
  }
  //绘制鼠标箭头
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.size, this.size);
    ctx.drawImage(this.img, -15, -15, 30, 30);
    ctx.restore();
  }
}
export default Mouse;
