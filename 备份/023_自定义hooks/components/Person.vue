<template>
  <div class="person">
    <h2>当前求和为：{{ sum }}，放大10倍后：{{ bigSum }}</h2>
    <button @click="add">点我sum+1</button>
    <hr>
    <img v-for="(dog,index) in dogList" :src="dog" :key="index">
    <br>
    <button @click="getDog">再来一只小狗</button>
  </div>
</template>

<script lang="ts" setup name="Person">
  import useSum from '../hooks/useSum'
  import useDog from '../hooks/useDog'

  //在 Vue 里，自定义 hook 通常就是一个函数，并且一般以 useXxx 命名。
  // useSum 和 useDog 就是自定义 hook，他们分别返回 sum 和 dogList，供组件使用。
  // useSum(自定义 hook) 返回 sum(响应式数据)、add(普通方法)和 bigSum(计算属性)，
  // useDog(自定义 hook) 返回 dogList(响应式数据) 和 getDog(普通方法)。
  const {sum,add,bigSum} = useSum()
  const {dogList,getDog} = useDog()
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
  img {
    height: 100px;
    margin-right: 10px;
  }
</style>