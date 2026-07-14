import {createApp} from 'vue'
import App from './App.vue'
// 第一步：引入pinia
import {createPinia} from 'pinia'

const app = createApp(App)// 创建Vue应用实例
// 第二步：创建pinia
// 其中Pinia 是 Vue 官方推荐的状态管理库
// Pinia的优势在于组件间共享数据不再靠父子透传
const pinia = createPinia()
// 第三步：安装pinia
app.use(pinia)
app.mount('#app')