import { random } from "../tools/math.js";
class FireGranule {
  createX;
  createY;
  green;
  radius;
  createV; //向量
  createLifeTime;
  currentX;
  currentY;
  currentLifeTime;
  alpha;
  scale;
  constructor({ createX, createY, radius, createV, createLifeTime }) {
    this.createX = createX;
    this.createY = createY;
    this.radius = radius;
    this.createV = createV;
    this.createLifeTime = createLifeTime;
    this.currentX = createX;
    this.currentY = createY;
    this.currentLifeTime = createLifeTime;
    this.green = random(0, 155);
    this.alpha = 1;
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
    radiaGradient.addColorStop(0.5, `rgba(255,${this.green},0,${this.alpha})`);
    radiaGradient.addColorStop(1, `rgba(255,${this.green},0,0)`);
    ctx.fillStyle = radiaGradient;
    ctx.arc(this.currentX, this.currentY, this.radius, 0, Math.PI * 2);
    ctx.fill();
    this.update();
  }
  update() {
    this.currentX += this.createV.x;
    this.currentY += this.createV.y;
    this.currentLifeTime--;
    this.radius++;
    this.alpha =
      Math.round((this.currentLifeTime / this.createLifeTime) * 100) / 100;
  }
  isExists() {
    return this.currentLifeTime <= 0 || this.currentAlpha <= 0 ? false : true;
  }
}
class Fire {
  x;
  y;
  size = 2;
  fireGranuleList = [];
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.createFireGranuleList();
  }
  draw(ctx) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    this.fireGranuleList.forEach((granule, index, array) => {
      if (granule.isExists()) {
        granule.draw(ctx);
      } else {
        array[index] = this.createFireGranule();
      }
    });

    ctx.restore();
  }
  createFireGranule() {
    let granuleInfo = {
      createX: this.x + random(5, -5),
      createY: this.y + random(5, -5),
      radius: random(2, 3.5),
      createV: { x: random(1, -1), y: random(0, -this.size * 2) },
      createLifeTime: random(0, this.size * 5),
    };
    let granule = new FireGranule(granuleInfo);
    return granule;
  }
  createFireGranuleList() {
    for (let i = 0; i < this.size * 50; i++) {
      let granule = this.createFireGranule();
      this.fireGranuleList.push(granule);
    }
  }
}

export default Fire;
