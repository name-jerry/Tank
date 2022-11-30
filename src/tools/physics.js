//抛物线运动的物体,创建时初始本体坐标,速度
const PaoWu = class {
  // 初始属性
  createXYAngle; //xy面角度
  createZAngle; //z轴角度
  totalTime = 0; //预计总时长
  aimX; //目标位置
  aimY;
  endX; //实际落点坐标 一般等于鼠标坐标,超出射程时取最大射程
  endY;
  scale = 10;
  createX;
  createY;
  createZ = 0;
  createV;
  g = 9.8; //重力加速度
  maxS; //最大射程
  diffS; //与目标实际距离

  //瞬时属性
  currentX;
  currentY;
  currentZ = 0;
  //抛物线的时间间隔,在updateAim中根据总时长动态变化
  sitesInterval = 0.5;

  constructor(createX, createV, v, aimX, aimY) {
    //创建初始属性,z为高度目前只支持初始高度0
    this.createX = createX;
    this.createY = createV;
    this.aimX = aimX || createX;
    this.aimY = aimY || createV;
    this.createV = v || this.getMinVByMaxXY(innerWidth / 2, innerHeight / 2);
    this.updateAim();
    // 瞬时属性
    this.currentX = createX;
  }
  // 根据目标坐标,更新初始属性aim,end,createXYAngle, createZAngle,maxS,diffS,totalTime;
  // 链式调用
  updateAim(aimX = this.aimX, aimY = this.aimY) {
    this.aimX = aimX;
    this.aimY = aimY;
    //初始射击createXYAngle角度
    const diffX = this.aimX - this.createX;
    const diffY = this.aimY - this.createY;
    this.createXYAngle = Math.atan2(diffY, diffX);
    //判断是否超出最大射击距离
    //根据基本不定式已知最大路程的射击角度为PI/4
    this.maxS = Math.pow(this.createV, 2) / this.g;
    //实际距离
    this.diffS = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
    //超出射程时初始化角度Math.PI / 4,返回false
    if (this.maxS < this.diffS) {
      this.createZAngle = Math.PI / 4;
      this.totalTime =
        (2 * this.createV * Math.sin(this.createZAngle)) / this.g;
      this.endX = this.maxS * Math.cos(this.createXYAngle) + this.createX;
      this.endY = this.maxS * Math.sin(this.createXYAngle) + this.createY;
      // console.log("超出射程");
    } else {
      const e = (this.diffS * this.g) / (2 * Math.pow(this.createV, 2));
      this.createZAngle = (1 - Math.sqrt(1 - 4 * Math.pow(e, 2))) / (2 * e);
      this.totalTime =
        (2 * this.createV * Math.sin(this.createZAngle)) / this.g;
      this.endX = this.aimX;
      this.endY = this.aimY;
    }
    //根据总时长设置位置间隔
    let c = this.totalTime / this.sitesInterval;
    if (c < 5 && this.totalTime > 2) {
      this.sitesInterval -= 0.1;
    } else if (c > 20) {
      this.sitesInterval += 0.1;
    }
    return this;
  }
  //需先运行getCreateZAngle
  //获取位置信息返回{x,y,z}
  //瞬时高度,抛物线的对称性
  //更新瞬时属性x,y,z
  getCurrentSite(intervalTime) {
    let time;
    let diffTime = this.totalTime / 2 - intervalTime;
    //xy计算
    //xy面速度,无速度变化,位置=总路程长/时长
    //高度计算
    //时长未过半
    if (this.totalTime / 2 >= diffTime && diffTime >= 0) {
      // console.log("未过半");
      this.currentX =
        ((this.endX - this.createX) * intervalTime) / this.totalTime +
        this.createX;
      this.currentY =
        ((this.endY - this.createY) * intervalTime) / this.totalTime +
        this.createY;
      time = intervalTime;
      //时长过半,未过完
    } else if (-this.totalTime / 2 < diffTime && diffTime < 0) {
      // console.log("过半");
      this.currentX =
        ((this.endX - this.createX) * intervalTime) / this.totalTime +
        this.createX;
      this.currentY =
        ((this.endY - this.createY) * intervalTime) / this.totalTime +
        this.createY;
      time = this.totalTime / 2 + diffTime;
      //时长过完
    } else if (intervalTime >= this.totalTime) {
      // console.log("太久了");
      this.currentX = this.endX;
      this.currentY = this.endY;
      time = 0;
    }
    this.currentZ =
      Math.sin(this.createZAngle) * this.createV * time -
      (this.g * Math.pow(time, 2)) / 2 +
      this.createZ;
    return { x: this.currentX, y: this.currentY, z: this.currentZ };
  }
  //根固定时间间隔(sitesInterval)生成位置数组,数据最大不超过20个
  getSites(sitesInterval = this.sitesInterval) {
    this.sitesInterval = sitesInterval;
    let sites = [];
    for (let i = 0; i < this.totalTime; i += this.sitesInterval) {
      sites.push(this.getCurrentSite(i));
      if ((i += this.sitesInterval >= this.totalTime)) {
        sites.push(this.getCurrentSite(this.totalTime));
      }
    }
    return sites;
  }
  //根据距离获取最新初速度,无副作用
  getMinVByMaxXY(maxX, maxY) {
    let v = Math.sqrt(
      Math.sqrt(Math.pow(maxX, 2) + Math.pow(maxY, 2)) * this.g
    );

    return v;
  }
};

export { PaoWu };
