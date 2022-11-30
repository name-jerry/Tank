import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";
import axios from "axios";
import VueAxios from "vue-axios";
import store from "./stores/store";
import { useStore } from "@/stores/index.js";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const app = createApp(App);
//el-icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
//路由守卫
router.beforeEach(async (to, from) => {
  const login = useStore().login;
  if (!login && to.name != "home") {
    ElMessage("请登录");
    return { name: "home" };
  }
});
app.use(router).use(VueAxios, axios).use(store);
// 设置跨域请求提供凭证(cookie,http认证及客户端ssl证明等)
axios.defaults.withCredentials = true;
//设置请求时常
axios.defaults.timeout = 5000;
app.mount("#app");
