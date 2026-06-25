<template>
  <!-- 根据 isShow 的值，决定页面上要不要显示 Person 组件。 -->
  <Person v-if="isShow"/>
</template>

<script lang="ts" setup name="App">
  import Person from './components/Person.vue'
  import {ref,onMounted} from 'vue'
  
  // 声明一个响应式数据 isShow，默认值为 true，表示页面上显示 Person 组件。
  let isShow = ref(true)
  /**
   * App 是父组件
   * Person 是子组件
   * Vue 在首次渲染时，会先把父组件开始创建，然后发现父组件模板里有子组件，
   * 于是 Vue 要先把 Person 这个子组件也创建并挂载到页面上，
   * 只有当子组件 Person 已经挂载完成后，父组件 App 的整个模板才算真正挂载完成。
   */
  // 挂载完毕
  onMounted(()=>{
    console.log('父---挂载完毕')
  })

</script>
