// 创建一个路由器，并暴露出去

// 第一步：引入createRouter
import {createRouter,createWebHistory} from 'vue-router'
// 引入一个一个可能要呈现组件
import Home from '../components/Home.vue'
import News from '../components/News.vue'
import About from '../components/About.vue'

// 第二步：创建路由器
const router = createRouter({
  // createWebHistory：创建一个 HTML5 历史模式的路由
  // 让路由跳转时把记录写入浏览器历史栈，这样用户点击浏览器的"返回"按钮就能回到上一个浏览的页面。
  history:createWebHistory(), 
  routes:[ //一个一个的路由规则
    {
      path:'/home',
      component:Home
    },
    {
      path:'/news',
      component:News
    },
    {
      path:'/about',
      component:About
    },
  ]
})

// 暴露出去router
export default router
