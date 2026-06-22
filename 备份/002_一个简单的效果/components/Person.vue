<template>
  <div class="person">
    <h2>姓名：{{name}}</h2>
    <h2>年龄：{{age}}</h2>
    <button @click="changeName">修改名字</button>
    <button @click="changeAge">修改年龄</button>
    <button @click="showTel">查看联系方式</button>
  </div>
</template>

<script lang="ts">
  export default {
    // 给当前组件起名字，主要是为了方便调试
    name:'Person',
    // 组件的数据
    data(){
      return {
        name:'张三',
        age:18,
        tel:'13888888888'
      }
    },
    methods:{
      // 修改姓名
      changeName(){
        this.name = 'zhang-san'
      },
      // 修改年龄
      changeAge(){
        this.age += 1
      },
      // 展示联系方式
      showTel(){
        alert(this.tel)
      }
    }
  }
</script>

<style scoped>
  /* 类选择器 */
  .person {
    background-color: skyblue;
    box-shadow: 0 0 10px;
    border-radius: 10px;
    padding: 20px;
  }
  /* 按钮选择器*/
  button {
    margin: 0 5px;
  }
</style>