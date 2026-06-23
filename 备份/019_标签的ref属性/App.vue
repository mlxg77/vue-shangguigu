<template>
  <h2 ref="title2">你好</h2>
  <button @click="showLog">测试</button>
  <Person ref="ren"/>
</template>

<script lang="ts" setup name="App">
  import Person from './components/Person.vue'
  import {ref} from 'vue'

  let title2 = ref()
  let ren = ref()

  function showLog(){
    // ref 放在普通标签上，拿到 DOM；ref 放在组件上，拿到组件实例。
    console.log(title2.value) // 输出h2这个元素：“你好”
    console.log(ren.value) // 输出Person这个组件的实例，会打印子组件暴露的数据：a、b、c 三个 ref 对象
  }
</script>
