import { ref ,onMounted,computed} from 'vue'

export default function () {
  // 数据
  let sum = ref(0)
  let bigSum = computed(()=>{
    return sum.value * 10
  })

  // 方法
  function add() {
    sum.value += 1
  }

  // onMounted（生命周期钩子函数）：当使用 useSum() 的组件挂载完成后，自动调用一次 add() 方法。
  onMounted(()=>{
    add()
  })

  // 给外部提供东西
  return {sum,add,bigSum}
}