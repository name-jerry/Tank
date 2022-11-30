import { createPinia } from 'pinia'
// 引入持久化插件
//npm i pinia-plugin-persist -S
import piniaPluginPersist from 'pinia-plugin-persist'
const store = createPinia()
// 使用该插件
store.use(piniaPluginPersist)

//导出插件
export default store
