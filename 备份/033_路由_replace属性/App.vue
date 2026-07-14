<template>
  <div class="app">
    <Header/>
    <!-- 导航区 -->
    <div class="navigate">
      <!--
      Vue Router 提供两种把新页面加进历史记录的方式：replace和push，
                                                  replace不会留下历史记录，push会留下历史记录 
      假设访问顺序：A → B → C ：push 模式，历史栈 = [A, B, C]，在 C 页面点后退 → 回到 B
      加了 replace（如从 B 跳 C 时用 replace）：历史栈 = [A, C]，在 C 页面点后退 → 直接回到 A（B 被"顶掉"了）
      -->
      */
      <RouterLink replace to="/home" active-class="active">首页</RouterLink>
      <RouterLink replace :to="{name:'xinwen'}" active-class="active">新闻</RouterLink>
      <RouterLink replace :to="{path:'/about'}" active-class="active">关于</RouterLink>
    </div>
    <!-- 展示区 -->
    <div class="main-content">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<script lang="ts" setup name="App">
  import {RouterView,RouterLink} from 'vue-router'
  import Header from './components/Header.vue'

</script>

<style>
    /* App */
  .navigate {
    display: flex;
    justify-content: space-around;
    margin: 0 100px;
  }
  .navigate a {
    display: block;
    text-align: center;
    width: 90px;
    height: 40px;
    line-height: 40px;
    border-radius: 10px;
    background-color: gray;
    text-decoration: none;
    color: white;
    font-size: 18px;
    letter-spacing: 5px;
  }
  .navigate a.active {
    background-color: #64967E;
    color: #ffc268;
    font-weight: 900;
    text-shadow: 0 0 1px black;
    font-family: 微软雅黑;
  }
  .main-content {
    margin: 0 auto;
    margin-top: 30px;
    border-radius: 10px;
    width: 90%;
    height: 400px;
    border: 1px solid;
  }
</style>
