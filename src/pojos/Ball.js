import { PaoWu } from "../tools/physics.js";
//炮弹类
class Ball extends PaoWu {
  width = 20;
  height = 20;
  //落点图标
  endImg;
  // 发射时间
  createTime;
  //高度缩放基数z/scaleHeight/10
  scaleHeight = 40;
  //轰炸点坐标闪烁效果
  cosX = 0;
  //是否显示着陆时间
  showCd = false;
  // 初始坐标,形状
  constructor(x, y, v, aimX, aimY, img, endImg) {
    super(x, y, v, aimX, aimY);
    this.img = img;
    this.endImg = endImg;
    this.createTime = new Date();
  }
  //绘制炮弹
  draw(ctx) {
    let now = new Date();
    let diffTime = (now - this.createTime) / 1000;
    let { x, y, z } = super.getCurrentSite(diffTime);
    let scale = z / this.scaleHeight;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(this.createXYAngle);
    ctx.scale(1 + scale, 1 + scale);
    ctx.drawImage(
      this.img,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    ctx.restore();
    //轰炸点
    ctx.save();
    //闪烁功能
    let cd = this.totalTime - diffTime;
    this.cosX += cd > 3 ? 0.05 : 0.15;
    ctx.globalAlpha = (1 + Math.cos(this.cosX)) / 2;
    ctx.fillStyle = "red";
    ctx.translate(this.endX, this.endY);
    ctx.drawImage(this.endImg, -20, -30, 40, 40);
    //倒计时功能
    if (this.showCd) {
      ctx.scale(2, 2);
      ctx.fillText(Math.round(this.totalTime - diffTime), -3, 15);
    }
    ctx.restore();
  }
}
export default Ball;
