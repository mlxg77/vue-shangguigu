// 引入createApp用于创建应用
import {createApp} from 'vue'
// 引入App根组件
import App from './App.vue'
// 创建应用实例并挂载到#app元素上
// createApp(App)：创建一个 Vue 应用实例，并把 App 组件作为根组件。
// .mount('#app')：把这个 Vue 应用挂载到页面中 id="app" 的 DOM 容器里。
createApp(App).mount('#app')