<script setup>
import Mouse from "@/pojos/Mouse.js";
import Tank from "@/pojos/Tank.js";
import { useStore } from "@/stores/index.js";
import { getImgSrc, setCanvasSize } from "@/tools/common.js";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const store = useStore();
let loading = false;
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
let video;
let play = ref(false);
let btn = ref();
let addCssAnimation = ref(false);
onMounted(() => {
  video = document.createElement("Video");
  video.src = new URL(`../assets/videos/lieheng.mp4`, import.meta.url).href;
  video.controls = true;
  video.muted = true;
  video.onended = () => {
    store.login = true;
    video.load();
    play.value = false;
    loading = false;
    router.push("game");
  };
  //设置砖图片
  offsetCanvas = document.createElement("canvas");
  canvas = document.getElementsByTagName("canvas")[0];
  setCanvasSize(canvas, window.innerWidth, window.innerHeight);
  offsetCtx = offsetCanvas.getContext("2d");
  ctx = canvas.getContext("2d");
  offsetCanvas.width = 30;
  offsetCanvas.height = 30;
  offsetCtx.drawImage(bricksImg, 0, 0, 30, 30);
  bricks = ctx.createPattern(offsetCanvas, "repeat");
  let t1 = new Tank(innerWidth - 100, innerHeight - 100, tankImg, aimImg);
  t1.createV = t1.getMinVByMaxXY(5000, 5000);
  t1.onballend = () => {
    if (loading) {
      addCssAnimation.value = true;
    }
  };
  btn.value.addEventListener("animationend", () => {
    video.play();
    video.muted = true;
    play.value = true;
  });
  t1.oncreateball = (ball) => {
    let l = btn.value.offsetLeft;
    let t = btn.value.offsetTop;
    let w = btn.value.offsetWidth;
    let h = btn.value.offsetHeight;
    let x = ball.aimX + 50;
    let y = ball.aimY + 24;
    if (x >= l && x <= l + w && y >= t && y <= t + h) {
      loading = true;
    }
  };
  let t2 = new Tank(100, innerHeight - 100, tankImg, aimImg);
  t2.createV = t2.getMinVByMaxXY(5000, 5000);
  tankList.push(t1);
  tankList.push(t2);
  animation();
});
window.onresize = () => {
  setCanvasSize(canvas, window.innerWidth, window.innerHeight);
  updateTank(tankList[0], 100, innerHeight - 100);
  updateTank(tankList[1], innerWidth - 100, innerHeight - 100);
};
function updateTank(t, x, y) {
  t.updateLocation(x, y);
  t.createV = t.getMinVByMaxXY(5000, 5000);
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
window.onmousemove = mouseMove;
window.onkeydown = (e) => {
  if (e.key == "q" || e.key == "Q") {
    e.preventDefault();
    tankList.forEach((t) => (t.showLine = true));
  }
};
function animation() {
  if (play.value) {
    ctx.drawImage(video, 0, 0, canvas.clientWidth, canvas.clientHeight);
  } else {
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
  }

  window.requestAnimationFrame(animation);
}
</script>
<template>
  <div class="container">
    <canvas @contextmenu.prevent="" @mousedown="mouseDown"></canvas>
    <button
      ref="btn"
      class="btn"
      :class="{ animation: addCssAnimation }"
      v-if="!play"
      @mousedown="mouseDown"
    >
      向我发射子弹
    </button>
  </div>
</template>
<style scoped lang="scss">
$light: rgb(255, 214, 148);
$shadow: rgb(146, 122, 82);
.btn {
  position: absolute;
  width: 100px;
  height: 50px;
  border-radius: 1rem;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: transparent;
  border: 2px solid var(--c-border);
  box-shadow: -5px -5px 10px $light, 5px 5px 10px rgb(170, 141, 95);
  cursor: none;
  color: #61677c;
  font-weight: bold;
  font-weight: 600;
  &:hover {
    box-shadow: -2px -2px 5px $light, 2px 2px 5px rgb(170, 141, 95);
    border: 2px solid var(--c-border-hover);
  }
  &:active {
    box-shadow: inset 1px 1px 2px $shadow, inset -1px -1px 2px $light;
  }
  &:focus-visible {
    outline: none;
  }
}
.animation {
  width: 100vw;
  height: 100vh;
  border-radius: 0rem;
  outline: 200vw solid black;
  animation: sacle 1s ease;
}
@keyframes sacle {
  0% {
    border-radius: 1rem;
  }
  100% {
    border-radius: 1rem;
    width: 100px;
    height: 50px;
  }
}
canvas {
  cursor: none;
}
.container {
  background: url(../assets/images/shamo.png);
}
</style>
