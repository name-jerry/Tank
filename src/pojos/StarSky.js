import { random } from "../tools/math.js";
class Star {
  createX;
  createY;
  speed = {};
  currentX;
  currentY;
  radian;
  radius = 2;
  img;
  canvas;
  constructor(createX, createY, originX, originY, absSpeed, canvas) {
    this.createX = createX;
    this.createY = createY;
    this.currentX = createX;
    this.currentY = createY;
    this.radian = Math.atan2(createY - originY, createX - originX);
    this.speed.x = Math.cos(this.radian) * absSpeed;
    this.speed.y = Math.sin(this.radian) * absSpeed;
    this.canvas = canvas;
    this.color = `rgba(${random(230, 255)},${random(235, 255)},${random(
      180,
      255
    )},${random(1, 1)})`;
  }
  update() {
    this.currentX += this.speed.x;
    this.currentY += this.speed.y;
    this.radius += 0.03;
  }
  draw(ctx) {
    ctx.beginPath();
    let radiaGradient = ctx.createRadialGradient(
      this.currentX,
      this.currentY,
      0,
      this.currentX,
      this.currentY,
      this.radius
    );
    radiaGradient.addColorStop(0.5, "white");
    radiaGradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = this.color;
    ctx.arc(this.currentX, this.currentY, this.radius, 0, Math.PI * 2);
    ctx.fill();
    this.update();
  }
  isExists() {
    return this.currentX < 0 ||
      this.currentY < 0 ||
      this.currentY > this.canvas.width ||
      this.createY > this.canvas.height
      ? false
      : true;
  }
}
class StarSky {
  canvas;
  numberOfStar = 300;
  starList = [];
  constructor(canvas) {
    this.canvas = canvas;
    this.createStarList();
  }
  draw(ctx) {
    ctx.save();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.starList.forEach((star, index, array) => {
      if (star.isExists()) {
        star.draw(ctx);
      } else {
        array[index] = this.createStar();
      }
    });
    ctx.restore();
  }
  createStar() {
    let { width, height } = this.canvas;
    let star = new Star(
      random(width / 2 - 50, width / 2 + 50),
      random(height / 2 - 50, height / 2 + 50),
      width / 2,
      height / 2,
      10,
      this.canvas
    );
    return star;
  }
  createStarList() {
    for (let i = 0; i < this.numberOfStar; i++) {
      let star = this.createStar();
      this.starList.push(star);
    }
  }
}
export default StarSky;
