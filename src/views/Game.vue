<template>
  <div class="container">
    <canvas @contextmenu.prevent="" @mousedown="mouseDown"></canvas>
    <!-- 左上对方信息 -->
    <div class="topLeft"></div>
    <!-- 右上生存人数和kda-->
    <div class="topRight">
      <div>
        <span>{{ killed }}</span
        ><span>击杀</span>
      </div>
      <div>
        <span>{{ assisted }}</span
        ><span>救助</span>
      </div>
      <div>
        <span>{{ alive }}</span
        ><span>存活</span>
      </div>
    </div>
    <!-- 下界面 -->
    <!-- 中下状态栏 -->
    <div class="bottomCenter"></div>
    <!-- 右下地图 -->
    <div class="bottomRight"></div>
  </div>
</template>
<style scoped lang="scss">
$light: rgb(255, 214, 148);
$shadow: rgb(146, 122, 82);
canvas {
  position: absolute;
  top: 0;
  left: 0;
  cursor: none;
}
.container {
  height: 100vh;
  width: 100vw;
  font-size: 1rem;
  background: url(../assets/images/shamo.png);
}
div:not(.container) {
  display: inline-block;
  cursor: none;
}
.topLeft {
  position: absolute;
  top: 0;
  left: 0;
}
.topRight {
  position: absolute;
  top: 0;
  right: 0;
  font: bold 2rem/2rem KaiTi;
  color: white;
  div {
    background-color: var(--c-border-hover);
    margin: 0.5rem;
    span {
      margin-right: 0.2rem;
    }
  }
}
.bottomCenter {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%);
}
.bottomRight {
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>

<script setup>
import Mouse from "@/pojos/Mouse.js";
import Tank from "@/pojos/Tank.js";
import { useStore } from "@/stores/index.js";
import { getImgSrc, setCanvasSize, random } from "@/tools/common.js";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const store = useStore();
// 右上数据
let killed = ref(0);
let assisted = ref(0);
let alive = ref(30);
let canvas;
/** @type {CanvasRenderingContext2D} */
let ctx;
let offsetCanvas;
/** @type {CanvasRenderingContext2D} */
let offsetCtx;
let tankList = [];
let tankImg = new Image();
tankImg.src = getImgSrc("tank.jpg");
let ball = new Image();
ball.src = getImgSrc("ball.jpg");
let aimImg = new Image();
aimImg.src = getImgSrc("end.png");
let mouseImg = new Image();
mouseImg.src = getImgSrc("aim.ico");
let mouse = new Mouse(mouseImg);
let bricksImg = new Image();
bricksImg.src = getImgSrc("bricks.png");
bricksImg.onload = () => {
  if (ctx) {
    offsetCtx.drawImage(bricksImg, 0, 0, 30, 30);
    bricks = ctx.createPattern(offsetCanvas, "repeat");
  }
};
let bricks;
window.onmousemove = mouseMove;
window.onkeydown = onKeyDown;
window.onresize = onResize;
onMounted(() => {
  //设置砖图片
  offsetCanvas = document.createElement("canvas");
  canvas = document.getElementsByTagName("canvas")[0];
  setCanvasSize(canvas, window.innerWidth, window.innerHeight);
  //障碍物赋值
  offsetCtx = offsetCanvas.getContext("2d");
  ctx = canvas.getContext("2d");
  offsetCanvas.width = 30;
  offsetCanvas.height = 30;
  offsetCtx.drawImage(bricksImg, 0, 0, 30, 30);
  bricks = ctx.createPattern(offsetCanvas, "repeat");
  //初始化坦克
  let t1 = new Tank(innerWidth - 100, innerHeight - 100, tankImg, aimImg);
  t1.createV = t1.getMinVByMaxXY(5000, 5000);

  let t2 = new Tank(100, innerHeight - 100, tankImg, aimImg);
  t2.createV = t2.getMinVByMaxXY(5000, 5000);
  tankList.push(t1);
  tankList.push(t2);
  animation();
});
//坦克
function createTankList() {
  for (let i = 0; i < alive.value; i++) {
    let x = random(0, innerWidth);
    let y = random(0, innerHeight);
  }
}
function updateTank(t, x, y) {
  t.updateLocation(x, y);
  t.createV = t.getMinVByMaxXY(5000, 5000);
}
//键鼠窗口调节
function onResize() {
  setCanvasSize(canvas, window.innerWidth, window.innerHeight);
  updateTank(tankList[0], 100, innerHeight - 100);
  updateTank(tankList[1], innerWidth - 100, innerHeight - 100);
}
function mouseMove(event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
  tankList.forEach((t) => {
    t.updateAim(mouse.x, mouse.y);
  });
}
function mouseDown(event) {
  if (event.button == 2) {
    tankList.forEach((t) => (t.showLine = false));
  } else if (tankList[0].showLine) {
    tankList.forEach((t) => {
      t.createBall(ball, ctx);
      tankList.forEach((t) => (t.showLine = false));
    });
  }
}
function onKeyDown(e) {
  if (e.key == "q" || e.key == "Q") {
    e.preventDefault();
    tankList.forEach((t) => (t.showLine = true));
  }
}
//动画
function animation() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  ctx.save();
  ctx.fillStyle = bricks;
  ctx.font = " bold 80px/80px Georgia";
  let t1 = "按Q准备射击";
  let t2 = "鼠标左键发射";
  let w1 = ctx.measureText(t1).width;
  let w2 = ctx.measureText(t2).width;
  ctx.fillText("按Q准备射击", (innerWidth - w1) / 2, 100);
  ctx.fillText("鼠标左键发射", (innerWidth - w2) / 2, 200);
  ctx.restore();
  mouse.draw(ctx);
  tankList.forEach((t) => {
    t.updateAim(mouse.x, mouse.y);
    t.draw(ctx);
  });

  window.requestAnimationFrame(animation);
}
</script>
