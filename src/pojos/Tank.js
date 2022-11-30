import { PaoWu } from "../tools/physics.js";
import Ball from "./Ball.js";
//坦克类
class Tank extends PaoWu {
  // 炮弹数组
  balls = [];
  width = 60;
  height = 50;
  tankImg;
  //瞄准线
  lineWidth = 5;
  lineHeight = 5;
  endImg;
  showLine = false;
  //瞄准线时间间隔
  interval;
  ballSpeed = 100;
  //轰炸点图标
  endImg;
  //射击数据
  lastSend;
  //射击冷却时间
  cd = 5000;
  msg = "";
  //高度缩放基数z/scaleHeight
  scaleHeight = 25;
  //炮弹着落时的事件
  onballend;
  oncreateball;
  // 初始坐标,形状
  constructor(x, y, tankImg, endImg) {
    super(x, y);
    this.tankImg = tankImg;
    this.endImg = endImg;
  }
  //绘制坦克,瞄准线,炮弹
  draw(ctx) {
    let now = new Date();
    ctx.save();
    ctx.translate(this.createX, this.createY);
    ctx.save();
    ctx.rotate(this.createXYAngle);
    ctx.drawImage(
      this.tankImg,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    ctx.restore();
    if (now - this.lastSend > this.cd) {
      this.msg = "";
    }
    if (this.msg) {
      ctx.fillStyle = "red";
      ctx.scale(2, 2);
      ctx.fillText(this.msg, -20, -10);
    }
    ctx.restore();
    if (this.showLine) this.drawLine(ctx);
    // 绘制自身发射的炮弹
    this.balls.forEach((ball, index, array) => {
      if (ball.currentX == ball.endX) {
        array.splice(index, 1);
        if (this.onballend) this.onballend(ball);
      }
      ball.draw(ctx);
    });
    return this;
  }
  updateLocation(x, y) {
    this.createX = x;
    this.createY = y;
    return this;
  }
  // 绘制瞄准线
  drawLine(ctx) {
    let scale;
    let sites = super.updateAim(this.aimX, this.aimY).getSites();
    sites.forEach(({ x, y, z }, index) => {
      scale = z / this.scaleHeight;
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = "red";
      if (index == sites.length - 1) {
        ctx.drawImage(this.endImg, -20, -30, 40, 40);
        if (this.endX != this.aimX) {
          ctx.scale(1.3, 1.3);
          ctx.fillText("超出射程", -20, -33);
        }
      } else {
        ctx.rotate(this.createXYAngle);
        ctx.scale(1 + scale, 1 + scale);
        ctx.fillRect(
          -this.lineWidth / 2,
          -this.lineHeight / 2,
          this.lineWidth,
          this.lineHeight
        );
      }
      ctx.restore();
    });
  }
  // 发射导弹
  createBall(ballImg) {
    if (!this.lastSend) {
      this.lastSend = new Date() - this.cd - 1;
    }
    let now = new Date();
    if (now - this.lastSend > this.cd) {
      let ball = new Ball(
        this.createX,
        this.createY,
        this.createV,
        this.aimX,
        this.aimY,
        ballImg,
        this.endImg
      );
      this.lastSend = now;
      this.balls.push(ball);
      if (this.oncreateball) this.oncreateball(ball);
    } else {
      this.msg = "装弹中";
    }
  }
}
export default Tank;
