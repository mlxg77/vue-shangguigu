<template>
  <div class="person">
    <ul>
      <li v-for="p in list" :key="p.id">
        {{p.name}} -- {{p.age}}
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup name="Person">
  import {type Persons} from '../types'

  // 只接收list
  // defineProps(['list'])

  // 接收list + 限制类型
  // defineProps<{list:Persons}>()

  //  接收list + 限制类型 + 限制必要性 + 指定默认值
  /* 这个组件需要展示一个人员列表 list。
   * 如果父组件传了 list，就用父组件传的；
   * 如果没传，就默认显示：
   * 康师傅·王麻子·特仑苏，19岁。*/
  // props 是 properties 的缩写，英文原意是：属性。父组件通过属性的方式，把数据传给子组件，所以从子组件角度看，它是在接收父组件传来的属性数据。
  // defineProps：用来接收父组件传过来的 props 数据的，这里代码中接收的是一个人员列表 list，类型为 Persons。
  // withDefaults：用来指定 props 的默认值的。
  withDefaults(defineProps<{list?:Persons}>(),{
    list:()=> [{id:'ausydgyu01',name:'康师傅·王麻子·特仑苏',age:19}]
  })


  // 接收list，同时将props保存起来
  /* let x = defineProps(['list'])
  console.log(x.list) */

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