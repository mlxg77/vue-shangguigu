// 创建一个路由器，并暴露出去

// 第一步：引入createRouter
import {createRouter,createWebHistory,createWebHashHistory} from 'vue-router'
// 引入一个一个可能要呈现组件
import Home from '../pages/Home.vue'
import News from '../pages/News.vue'
import About from '../pages/About.vue'

// 第二步：创建路由器
const router = createRouter({
    /*
    特性	              createWebHistory	    createWebHashHistory
    URL格式	            /about	              /#/about
    底层原理	          History API	          URL hash (#)
    需要服务器配置	    需要（处理刷新404）	    不需要
    浏览器前进/后退	    支持	                 支持
    */
  history:createWebHashHistory(), 
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
