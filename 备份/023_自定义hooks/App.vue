<template>
  <Person/>
</template>
<!-- 中间件（Middleware）：强调顺序执行和控制权传递。
                          中间件通常构成一个链条（Chain），前一个中间件处理完后，
                          必须显式地调用 next() 将控制权交给下一个中间件。
                          它非常适合处理请求/响应这种具有明确先后顺序的流程。
      Hooks（Hooks）：强调事件触发和回调执行。
                      Hooks 通常绑定在特定的生命周期或事件上（如 beforeSave、onError）。
                      当该事件发生时，框架会自动调用绑定的 Hook 函数。
                      Hooks 之间通常没有严格的先后依赖关系，也不存在“传递控制权给下一个 Hook”的概念。 -->
<script lang="ts" setup name="App">
  import Person from './components/Person.vue'
</script>
