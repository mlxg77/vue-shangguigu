<template>
  <div class="person">
    <h1>中国</h1>
    <!-- ref="title2" 这个ref是Vue3中用于标记元素的属性（给 DOM 起名字），用于在Vue组件中获取元素的引用 -->
    <h2 ref="title2">北京</h2>
    <h3>尚硅谷</h3>
    <button @click="showLog">点我输出h2这个元素</button>
  </div>
</template>

<script lang="ts" setup name="Person">
  import {ref} from 'vue'

  // 创建一个title2，用于存储ref标记的内容
  let title2 = ref()
  
  let a = ref(0) // ref(0) 就是创建一个初始值为 0 的响应式变量，JS 中用 a.value 访问，模板中直接用 a。
  let b = ref(1) // ref(1) 就是创建一个初始值为 1 的响应式变量，JS 中用 b.value 访问，模板中直接用 b。
  let c = ref(2) // ref(2) 就是创建一个初始值为 2 的响应式变量，JS 中用 c.value 访问，模板中直接用 c。

  function showLog(){
    console.log(title2.value) // 输出h2这个元素：“北京”
  }

  // 将a、b、c暴露给父组件，用于在模板中使用
  defineExpose({a,b,c})
</script>

<style scoped>
  .person {
    background-color: skyblue;
    box-shadow: 0 0 10px;
    border-radius: 10px;
    padding: 20px;
  }
  button {
    margin: 0 5px;
  }
  li {
    font-size: 20px;
  }
</style>