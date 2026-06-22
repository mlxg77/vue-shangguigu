<template>
  <div class="app">
    <h1>你好啊！</h1>
    <!-- <Person/>  等价于 <Person></Person> -->
    <Person/> 
  </div>
</template>

<script lang="ts">
  import Person from './components/Person.vue' // 引入组件

  export default {
    name:'App', //组件名
    components:{Person} //注册组件
  }
</script>

<style>
  .app {
    background-color: #ddd;
    box-shadow: 0 0 10px;
    border-radius: 10px;
    padding: 20px;
  }
</style>