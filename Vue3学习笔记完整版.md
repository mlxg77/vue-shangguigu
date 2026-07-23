# Vue 3 学习笔记（尚硅谷课程完整版）

> 本文档整理自尚硅谷 Vue 3 课程（001-050），涵盖从入门到进阶的完整知识体系，适合复习和小白学习参考。

---

## 第一部分：Vue 3 基础（001-006）

### 001 写一个 App 组件

从零创建最小 Vue 3 应用：根组件 `App.vue` + 入口文件 `main.ts`。

**Vue 单文件组件（SFC）三段式结构：**

| 区块 | 作用 |
|------|------|
| `<template>` | HTML 结构 |
| `<script lang="ts">` | 组件逻辑 |
| `<style>` | 样式 |

**入口文件 main.ts：**

```ts
import { createApp } from 'vue'
import App from './App.vue'
createApp(App).mount('#app')
```

> `createApp(App)` 创建应用实例，`.mount('#app')` 挂载到页面上。这行代码是整个课程的骨架。

---

### 002 一个简单的效果

引入子组件 `Person.vue`，用 Options API 写一个"修改名字"的效果。

```ts
// Person.vue — Options API 风格
export default {
  name: 'Person',
  data() {
    return { name: '张三', age: 18, tel: '13888888888' }
  },
  methods: {
    changeName() { this.name = 'zhang-san' },
    changeAge() { this.age += 1 }
  }
}
```

**关键点：** App.vue 通过 import 引入 Person 组件并注册，组件嵌套是 Vue 的基础模式。

---

### 003 setup 概述

Vue 3 新增 `setup` 函数——Composition API 的入口。

```ts
export default {
  name: 'Person',
  setup() {
    // 数据
    let name = '张三'
    let age = 18
    // 方法
    function changeName() { name = 'zhang-san' }
    function changeAge() { age += 1 }
    // 返回对象——模板中可直接使用
    return { name, age, changeName, changeAge }
  }
}
```

**setup 的特点：**
- 执行时机：在 beforeCreate 之前执行（组件创建阶段）
- `this` 是 `undefined`（不再指向组件实例）
- 返回对象中的属性和方法可以在模板中使用

---

### 004 setup 的返回值

setup 有两种返回形式：

```ts
// 形式一：返回对象（常用）
setup() {
  let name = '张三'
  return { name }
}

// 形式二：返回渲染函数（少用）
import { h } from 'vue'
setup() {
  return () => h('h1', '你好')
}
```

> 003-004 中 setup 里的数据不是响应式的——改了值页面不变。这个问题在 007 用 `ref` 解决。

---

### 005 setup 与 Options API 的关系

setup 和 Options API（data、methods、computed）可以共存，但有优先级规则：

| 规则 | 说明 |
|------|------|
| setup 先执行 | setup 在 beforeCreate 之前 |
| setup 优先 | data、methods、computed 能访问 setup 返回的东西 |
| setup 不能访问 Options | setup 中不能使用 this.data |
| 不推荐混用 | 官方推荐统一用 Composition API |

---

### 006 setup 语法糖

`<script setup>` 是 setup 函数的编译期语法糖，简化写法：

```html
<!-- 之前的写法 -->
<script lang="ts">
export default {
  name: 'Person',
  setup() {
    let name = '张三'
    return { name }
  }
}
</script>

<!-- 语法糖写法 -->
<script setup lang="ts" name="Person">
let name = '张三'
</script>
```

**语法糖做了什么：**
- 顶层变量自动暴露给模板（不需要 return）
- `name="Person"` 需要 `vite-plugin-vue-setup-extend` 插件
- 组件 import 后直接用（不需要注册）
- 后续课程全部使用语法糖写法

---

## 第二部分：响应式数据（007-012）

### 007 ref 创建：基本类型的响应式数据

解决 006 中"改了值页面不变"的问题。

```ts
import { ref } from 'vue'

let name = ref('张三')   // 返回 RefImpl 对象
let age = ref(18)

function changeName() {
  name.value = 'zhang-san'  // JS 中必须用 .value
}
```

**核心规则：**
- JS 中操作 ref 必须 `.value`
- 模板中自动解包，不需要 `.value`
- `ref()` 返回 RefImpl 对象，Vue 通过拦截 `.value` 的 get/set 实现响应式

---

### 008 reactive 创建：对象类型的响应式数据

`reactive` 把对象变成响应式（Proxy 代理）。

```ts
import { reactive } from 'vue'

let person = reactive({
  name: '张三',
  age: 18
})

function changeName() {
  person.name = '李四'  // 直接用，不需要 .value
}
```

**reactive 的特点：**
- 深层响应式：嵌套对象也会变成响应式
- 只能处理对象类型，不能处理基本类型
- 不需要 `.value`，直接操作属性

---

### 009 ref 创建：对象类型的响应式数据

`ref` 也能处理对象类型——内部自动调用 `reactive`。

```ts
let person = ref({ name: '张三', age: 18 })

function changeName() {
  person.value.name = '李四'  // 通过 .value 拿到对象，再改属性
}
```

> ref 包裹对象时，内部用 `reactive(person.value)` 处理，所以修改属性也能响应。

---

### 010 ref 对比 reactive

| 对比项 | ref | reactive |
|--------|-----|----------|
| 支持类型 | 基本类型 + 对象类型 | 仅对象类型 |
| 访问方式 | 需要 `.value` | 直接访问属性 |
| 重新赋值 | `xxx.value = 新对象` ✅ | `xxx = 新对象` ❌（丢失响应式） |
| 解构 | 失去响应式（需 toRefs） | 失去响应式（需 toRefs） |
| 推荐 | 基本类型用 ref | 对象类型可用 reactive |

> reactive 重新赋值会丢失响应式，因为新对象没有被 Proxy 代理。

---

### 011 toRefs 与 toRef

解决 reactive 解构后失去响应式的问题。

```ts
import { reactive, toRefs, toRef } from 'vue'

let person = reactive({ name: '张三', age: 18 })

// 解构后失去响应式
// let { name, age } = person  // ❌

// toRefs 解构——所有属性都变成 ref
let { name, age } = toRefs(person)  // ✅

// toRef 解构——单个属性变成 ref
let name2 = toRef(person, 'name')  // ✅
```

| API | 作用 | 返回 |
|-----|------|------|
| `toRefs(obj)` | 把对象所有属性转为 ref | 普通对象（值为 ref） |
| `toRef(obj, key)` | 把对象单个属性转为 ref | ref 对象 |

---

### 012 computed 计算属性

```ts
import { ref, computed } from 'vue'

let firstName = ref('张')
let lastName = ref('三')

// 只读计算属性
let fullName = computed(() => firstName.value + lastName.value)

// 可读可写计算属性
let fullName2 = computed({
  get() { return firstName.value + '-' + lastName.value },
  set(val) {
    [firstName.value, lastName.value] = val.split('-')
  }
})
```

**computed 的特点：**
- 有缓存：依赖没变时不重新计算
- 响应式：依赖变化时自动更新
- 模板中使用不需要 `.value`

---

## 第三部分：侦听器（013-018）

### 013-017 watch 五种情况

#### 情况一：监视 ref 基本类型（013）

```ts
let sum = ref(0)

const stopWatch = watch(sum, (newValue, oldValue) => {
  console.log('sum变化了', newValue, oldValue)
  if (newValue >= 10) stopWatch()  // 停止监视
})
```

#### 情况二：监视 ref 对象类型（014）

```ts
let person = ref({ name: '张三', age: 18 })

// 默认监视 .value 的替换，不监视属性变化
watch(person, (newVal, oldVal) => { ... })

// 开启深度监视——属性变化也触发
watch(person, (newVal, oldVal) => { ... }, { deep: true })
```

> `deep: true` 时，newValue 和 oldValue 是同一个对象（因为引用没变）。

#### 情况三：监视 reactive 对象类型（015）

```ts
let person = reactive({ name: '张三', age: 18 })

// reactive 默认开启深度监视，无法关闭
watch(person, (newVal, oldVal) => { ... })

// 注意：newValue 和 oldValue 是同一个对象
```

> reactive 的 watch **默认就是深层的**，且 `deep: false` 无效。

#### 情况四：监视对象的某个属性（016）

监视 ref/reactive 对象的某个属性，需要用**函数返回值**作为监视源：

```ts
let person = reactive({ name: '张三', age: 18 })

// 监视基本类型属性
watch(() => person.name, (newVal, oldVal) => { ... })

// 监视对象类型属性——需加 deep
watch(() => person.car, (newVal, oldVal) => { ... }, { deep: true })
```

> 当被监视的属性是对象时，函数返回的是对象的引用，需要 `deep: true` 才能监视内部变化。

#### 情况五：监视多个数据（017）

```ts
let name = ref('张三')
let age = ref(18)

watch([name, age], (newVal, oldVal) => {
  // newVal = [新name, 新age]
  // oldVal = [旧name, 旧age]
})
```

> 第一个参数传数组，回调中 newVal/oldVal 也是数组。

#### watch 配置项总结

| 配置 | 作用 | 默认 |
|------|------|------|
| `deep` | 深度监视对象内部变化 | false（reactive 默认 true） |
| `immediate` | 立即执行一次回调 | false |
| `flush` | 回调执行时机 | 'pre'（DOM 更新前） |

---

### 018 watchEffect

`watchEffect` 是 `watch` 的简化版——自动追踪依赖，不需要手动指定监视谁。

```ts
import { ref, watchEffect } from 'vue'

let num = ref(0)
let sum = ref(0)

watchEffect(() => {
  // 自动追踪：用到了 num 就监视 num
  console.log('num:', num.value, 'sum:', sum.value)
})
```

**watch vs watchEffect：**

| | watch | watchEffect |
|--|-------|-------------|
| 指定监视源 | 必须手动指定 | 自动追踪 |
| 获取旧值 | ✅ oldValue | ❌ 没有 oldValue |
| 立即执行 | 需 `immediate: true` | 默认立即执行一次 |
| 返回停止函数 | ✅ | ✅ |

---

## 第四部分：组件进阶（019-023）

### 019 标签的 ref 属性

用 `ref` 给标签或组件取名字，在 JS 中通过 `变量.value` 获取 DOM 或组件实例。

```html
<template>
  <h2 ref="title">标题</h2>
  <Person ref="personComp"/>
</template>

<script setup lang="ts">
import { ref } from 'vue'

let title = ref()        // 获取 DOM 元素
let personComp = ref()   // 获取组件实例

console.log(title.value)        // <h2>标题</h2>
console.log(personComp.value)   // Person 组件实例
</script>
```

**defineExpose——暴露组件内部数据：**

`<script setup>` 默认是封闭的，子组件需要主动暴露才能被父组件访问：

```ts
// 子组件
let a = ref(1)
let b = ref(2)
defineExpose({ a, b })  // 暴露给父组件
```

---

### 020 TypeScript 回顾

Vue 3 + TS 项目中常用的类型定义方式：

```ts
// 定义接口
export interface PersonInter {
  id: string
  name: string
  age: number
}

// 类型别名
export type Persons = Array<PersonInter>
// 或
export type Persons = PersonInter[]
```

**在组件中使用：**

```ts
import type { Persons } from '@/types'

let personList = reactive<Persons>([
  { id: '01', name: '张三', age: 18 }
])
```

---

### 021 props 的使用

父组件向子组件传递数据。

```html
<!-- 父组件 -->
<Person :list="personList" />
```

```ts
// 子组件 — 只接收
defineProps(['list'])

// 子组件 — 带类型接收
import type { Persons } from '@/types'
defineProps<{ list: Persons }>()

// 子组件 — 带类型 + 默认值
withDefaults(defineProps<{ list: Persons }>(), {
  list: () => [{ id: '00', name: '默认', age: 0 }]
})
```

---

### 022 生命周期

Vue 3 的四个阶段 + 六个钩子：

```
创建 → 挂载 → 更新 → 卸载
```

| 阶段 | 钩子函数 | 时机 |
|------|----------|------|
| 创建 | setup() | setup 执行时就是创建阶段 |
| 挂载前 | `onBeforeMount` | 组件挂载到 DOM 之前 |
| 挂载完毕 | `onMounted` | DOM 已就绪 |
| 更新前 | `onBeforeUpdate` | 数据变化、DOM 更新前 |
| 更新完毕 | `onUpdated` | DOM 更新完成 |
| 卸载前 | `onBeforeUnmount` | 组件即将销毁（清理定时器等） |
| 卸载完毕 | `onUnmounted` | 组件已销毁 |

**Vue 2 vs Vue 3 对比：**

| Vue 2 | Vue 3 |
|-------|-------|
| beforeCreate / created | setup() |
| beforeMount | onBeforeMount |
| mounted | onMounted |
| beforeUpdate | onBeforeUpdate |
| updated | onUpdated |
| beforeDestroy | onBeforeUnmount |
| destroyed | onUnmounted |

**常用场景：**
- `onMounted`：发请求、初始化第三方库
- `onBeforeUnmount`：清理定时器、取消订阅

---

### 023 自定义 hooks

把组件中的可复用逻辑抽成独立的 `useXxx` 函数——Vue 3 的代码复用方案。

```ts
// hooks/useSum.ts
import { ref, computed, onMounted } from 'vue'

export default function () {
  let sum = ref(0)
  let bigSum = computed(() => sum.value * 10)
  function add() { sum.value += 1 }
  onMounted(() => { add() })

  return { sum, add, bigSum }
}
```

```ts
// 组件中使用
import useSum from '../hooks/useSum'
const { sum, add, bigSum } = useSum()
```

**自定义 hook 的特点：**
- 命名以 `use` 开头
- 内部可以使用任何 Composition API
- 生命周期钩子写在 hook 里会绑定到调用组件
- 替代 Vue 2 的 mixin，来源清晰、不会命名冲突

---

## 第五部分：Vue Router（024-035）

### 024 路由基本切换效果

搭建 Vue Router 基础环境，实现页面切换。

**路由三件套：**

| 文件 | 作用 |
|------|------|
| `router/index.ts` | 创建路由器，配置路由规则 |
| `main.ts` | 挂载路由器：`app.use(router)` |
| `App.vue` | `<RouterLink>` 导航 + `<RouterView>` 展示 |

```ts
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import News from '../components/News.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/home', component: Home },
    { path: '/news', component: News }
  ]
})
export default router
```

```html
<!-- App.vue -->
<RouterLink to="/home" active-class="active">首页</RouterLink>
<RouterLink to="/news" active-class="active">新闻</RouterLink>
<RouterView />
```

> `<RouterLink>` 渲染成 `<a>` 标签，点击切换 URL（不刷新页面）。
> `<RouterView>` 是占位符，当前路由匹配到的组件在这里渲染。

---

### 025 路由两个注意点

1. **路由组件放 `pages/` 目录**：普通组件放 `components/`，路由组件放 `pages/`
2. **路由组件切换时会被销毁**：切走时触发 `onBeforeUnmount`/`onUnmounted`，切回来重新创建

---

### 026 路由器工作模式

| 模式 | API | URL 外观 | 特点 |
|------|-----|---------|------|
| history | `createWebHistory()` | `/home` | 美观，但需要后端配合（刷新 404） |
| hash | `createWebHashHistory()` | `/#/home` | 有 #，不需要后端配置 |

```ts
const router = createRouter({
  history: createWebHistory(),  // 或 createWebHashHistory()
  routes: [...]
})
```

---

### 027 to 的两种写法

```html
<!-- 字符串写法 -->
<RouterLink to="/home">首页</RouterLink>

<!-- 对象写法 -->
<RouterLink :to="{ path: '/home' }">首页</RouterLink>
```

对象写法可以配合命名路由传参数，更灵活。

---

### 028 命名路由

给路由规则加 `name` 属性，用名称跳转。

```ts
// router/index.ts
{ name: 'zhuye', path: '/home', component: Home }
```

```html
<!-- 用 name 跳转 -->
<RouterLink :to="{ name: 'zhuye' }">首页</RouterLink>
```

> 命名路由的好处：路径变了不影响跳转代码（只依赖 name）。

---

### 029 嵌套路由

在父路由中配置 `children`，实现路由嵌套。

```ts
{
  path: '/news',
  component: News,
  children: [
    { path: 'detail', component: Detail }  // 注意：子路由 path 不加 /
  ]
}
// 完整路径：/news/detail
```

**要点：**
- 子路由的 `path` **不加 `/`**（拼接为 `/news/detail`）
- 父组件中需要自己的 `<RouterView>` 来展示子路由组件
- 访问 `/news/detail` 时，News 和 Detail 同时渲染

```html
<!-- News.vue -->
<RouterLink to="/news/detail">详情</RouterLink>
<RouterView />  <!-- Detail 组件在这里渲染 -->
```

---

### 030 query 参数

通过 URL 查询参数传递数据：`/news/detail?id=001&title=xxx`

```html
<!-- 传递 query 参数 -->
<!-- 字符串写法 -->
<RouterLink :to="`/news/detail?id=${news.id}&title=${news.title}`">
<!-- 对象写法 -->
<RouterLink :to="{ path: '/news/detail', query: { id: news.id, title: news.title } }">
```

```ts
// 接收 query 参数
import { useRoute } from 'vue-router'
const route = useRoute()
console.log(route.query.id, route.query.title)
```

---

### 031 params 参数

通过 URL 路径参数传递数据：`/news/detail/001/xxx`

```ts
// 路由配置中用占位符
{ path: '/news/detail/:id/:title', component: Detail }
```

```html
<!-- 传递 params 参数 -->
<RouterLink :to="`/news/detail/${news.id}/${news.title}`">
<!-- 对象写法（必须用 name，不能用 path） -->
<RouterLink :to="{ name: 'xiangqing', params: { id: news.id, title: news.title } }">
```

```ts
// 接收 params 参数
const route = useRoute()
console.log(route.params.id, route.params.title)
```

**query vs params：**

| | query | params |
|--|-------|--------|
| URL | `/detail?id=1` | `/detail/1` |
| 路由配置 | 不需要改 | 需要 `:id` 占位符 |
| 对象写法 | 用 `path` 或 `name` | 只能用 `name` |
| 可选性 | 所有参数可选 | 可用 `?` 标记可选 |

---

### 032 props 配置

让路由参数自动变成组件的 props，组件更纯净（不依赖 useRoute）。

```ts
// 三种写法

// 写法一：布尔值——把 params 参数作为 props
{ path: '/detail/:id/:title', component: Detail, props: true }

// 写法二：对象——额外传递静态数据
{ path: '/detail', component: Detail, props: { a: 1, b: 'hello' } }

// 写法三：函数——把 query/params 都传给 props
{ path: '/detail', component: Detail, props: route => ({
  id: route.query.id,
  title: route.query.title
}) }
```

```ts
// Detail 组件中直接接收
defineProps(['id', 'title'])
```

---

### 033 replace 属性

控制路由跳转是否留下历史记录。

```html
<!-- push 模式（默认）：留下历史记录，可后退 -->
<RouterLink to="/home">首页</RouterLink>

<!-- replace 模式：不留历史记录，替换当前记录 -->
<RouterLink to="/home" replace>首页</RouterLink>
```

| 模式 | 行为 | 后退按钮 |
|------|------|----------|
| push（默认） | 压入历史栈 | ✅ 可以后退 |
| replace | 替换当前记录 | ❌ 不能后退 |

---

### 034 编程式路由导航

不用 `<RouterLink>`，用 JS 代码控制路由跳转。

```ts
import { useRouter } from 'vue-router'
const router = useRouter()

// push 跳转
router.push('/home')
router.push({ path: '/home' })
router.push({ name: 'zhuye' })

// replace 跳转
router.replace('/home')

// 前进/后退
router.back()     // 后退
router.forward()   // 前进
go(n)             // 正数前进，负数后退
```

> 编程式导航适合：按钮点击、定时跳转、条件跳转等场景。

---

### 035 重定向

访问某路径时自动跳转到另一个路径。

```ts
const router = createRouter({
  routes: [
    { path: '/', redirect: '/home' },  // 访问 / 自动跳到 /home
    { path: '/home', component: Home }
  ]
})
```

> 通常把 `/` 重定向到首页，避免用户访问根路径时看到空白。

---

## 第六部分：Pinia 状态管理（036-043）

### 036 准备一个效果

搭建一个"求和器 + 土味情话"效果，数据全在组件内部——暴露没有状态管理的问题。

```ts
// Count.vue
let sum = ref(1)   // 数据锁在组件内

// LoveTalk.vue
let talkList = reactive([...])  // 数据锁在组件内
```

**暴露的问题：**
- `sum` 和 `talkList` 锁在各自组件里，其他组件拿不到
- 组件销毁后数据丢失
- 兄弟组件无法直接通信

> 这些问题正是 Pinia 要解决的。

---

### 037 搭建 pinia 环境

```bash
npm install pinia
```

```ts
// main.ts
import { createPinia } from 'pinia'
const app = createApp(App)
app.use(createPinia())  // 安装 Pinia
app.mount('#app')
```

> 037 只做环境搭建，组件代码和 036 完全一样。

---

### 038 存储 + 读取数据

创建 store，把数据从组件搬到 store 的 state 中。

```ts
// store/count.ts
import { defineStore } from 'pinia'

export const useCountStore = defineStore('count', {
  state() {
    return {
      sum: 6,
      school: 'atguigu',
      address: '宏福科技园'
    }
  }
})
```

```ts
// 组件中读取
import { useCountStore } from '@/store/count'
const countStore = useCountStore()

<h2>当前求和为：{{ countStore.sum }}</h2>
```

---

### 039 修改数据（三种方式）

**方式一：直接修改**
```ts
countStore.sum += 1
countStore.sum += n.value
```

**方式二：$patch 批量修改**
```ts
countStore.$patch({
  sum: 100,
  school: '尚硅谷'
})
```

**方式三：actions（推荐）**
```ts
// store/count.ts
export const useCountStore = defineStore('count', {
  state() { return { sum: 6 } },
  actions: {
    increment(value: number) {
      if (this.sum < 10) {
        this.sum += value  // 用 this 访问 state
      }
    }
  }
})

// 组件中调用
countStore.increment(n.value)
```

> actions 中用 `this` 访问 state，可以把业务逻辑封装在 store 里。

---

### 040 storeToRefs

直接解构 store 会失去响应式，用 `storeToRefs` 解决。

```ts
import { storeToRefs } from 'pinia'

// ❌ 直接解构——失去响应式
const { sum, school } = countStore

// ✅ storeToRefs 解构——保持响应式
const { sum, school, address } = storeToRefs(countStore)
```

> `storeToRefs` 只转换 state 和 getters，不包括 actions。actions 直接从 store 解构即可。

---

### 041 getters

Pinia 的 getters 相当于 store 的计算属性。

```ts
export const useCountStore = defineStore('count', {
  state() { return { sum: 6, school: 'atguigu' } },
  getters: {
    // 箭头函数写法（用 state）
    bigSum: state => state.sum * 10,
    // 普通函数写法（用 this，可访问其他 getter）
    upperSchool(): string {
      return this.school.toUpperCase()
    }
  }
})
```

```ts
// 组件中使用
const { sum, bigSum, upperSchool } = storeToRefs(countStore)
```

**getters 特点：** 有缓存、响应式、只读。

---

### 042 $subscribe

监听 store 状态变化，常用于数据持久化。

```ts
talkStore.$subscribe((mutation, state) => {
  // mutation: 变更信息
  // state: 最新的 state
  localStorage.setItem('talkList', JSON.stringify(state.talkList))
})
```

配合 store 初始化时从 localStorage 读取：
```ts
state() {
  return {
    talkList: JSON.parse(localStorage.getItem('talkList') as string) || []
  }
}
```

> 实现**刷新页面数据不丢失**。

---

### 043 store 组合式写法

用 setup 函数风格写 store，替代 Options 风格。

```ts
// Options 式
export const useTalkStore = defineStore('talk', {
  state() { return { talkList: [] } },
  actions: { async getATalk() { this.talkList.unshift(obj) } }
})

// 组合式
export const useTalkStore = defineStore('talk', () => {
  const talkList = reactive([])           // ← state
  async function getATalk() {             // ← actions
    let { data: { content: title } } = await axios.get('...')
    talkList.unshift({ id: nanoid(), title })
  }
  return { talkList, getATalk }           // ← 暴露
})
```

**组合式 vs Options 式：**

| | Options 式 | 组合式 |
|--|-----------|--------|
| 第二个参数 | `{ state, getters, actions }` | `() => {}` 函数 |
| 数据 | `state()` 返回 | `ref()` / `reactive()` |
| 计算属性 | `getters: {}` | `computed()` |
| 方法 | `actions: {}` | 普通函数 |
| this | 有 | **没有**（直接用变量名） |

---

## 第七部分：组件通信（044）

Vue 3 共有 9 种组件通信方式，按方向分类：

### 1. props（父 → 子）

```html
<!-- 父组件 -->
<Child :car="car" :sendToy="getToy"/>

<!-- 子组件 -->
defineProps(['car', 'sendToy'])
<button @click="sendToy(toy)">把玩具给父亲</button>
```

> props 不仅能传数据，也能传函数（子调用函数间接传数据给父）。

### 2. 自定义事件（子 → 父）

```html
<!-- 父组件 -->
<Child @send-toy="saveToy"/>

<!-- 子组件 -->
const emit = defineEmits(['send-toy'])
emit('send-toy', toy)
```

### 3. mitt（任意组件间）

```ts
// utils/emitter.ts
import mitt from 'mitt'
const emitter = mitt()
export default emitter

// 发送方
emitter.emit('send-toy', toy)

// 接收方
emitter.on('send-toy', (value) => { toy.value = value })

// 组件卸载时解绑
onUnmounted(() => emitter.off('send-toy'))
```

> Vue 3 移除了 Vue 2 的 `$bus`，用第三方库 `mitt` 替代。

### 4. v-model（父 ↔ 子）

```html
<!-- 父组件 -->
<AtguiguInput v-model:ming="username" v-model:mima="password"/>

<!-- 子组件 -->
<input :value="ming" @input="emit('update:ming', $event.target.value)">
defineProps(['ming', 'mima'])
const emit = defineEmits(['update:ming', 'update:mima'])
```

> `v-model:ming="x"` 等价于 `:ming="x" @update:ming="x = $event"`。一个组件可用多个 v-model。

### 5. $attrs（祖 → 孙）

```html
<!-- 父组件 -->
<Child :a="a" :b="b" :updateA="updateA"/>

<!-- 子组件（中间层，不需要声明 props） -->
<GrandChild v-bind="$attrs"/>

<!-- 孙组件 -->
defineProps(['a', 'b', 'updateA'])
```

> `$attrs` 包含父传过来但子组件**没有用 props 接收**的所有属性。中间层透传。

### 6. $refs / $parent（父 ↔ 子直接访问）

```ts
// 父通过 $refs 访问子组件
let c1 = ref()
<Child1 ref="c1"/>
c1.value.toy = '小猪佩奇'  // 直接修改子组件数据

// 子通过 $parent 访问父组件
function minusHouse(parent) {
  parent.house -= 1
}

// 必须暴露！
defineExpose({ toy, book })
```

> `<script setup>` 默认封闭，必须用 `defineExpose` 暴露数据。

### 7. provide / inject（祖 → 后代）

```ts
// 祖先组件
import { provide } from 'vue'
provide('moneyContext', { money, updateMoney })
provide('car', car)

// 后代组件（不限层级，中间层不需要任何代码）
import { inject } from 'vue'
let { money, updateMoney } = inject('moneyContext', { money: 0, updateMoney: () => {} })
let car = inject('car', { brand: '未知', price: 0 })
```

> `inject` 第二个参数是默认值。与 `$attrs` 的区别：`provide/inject` 中间层完全不需要感知。

### 8. Pinia（任意组件间）

直接参考第六部分（036-043）。Pinia 是最推荐的任意组件通信方案。

### 9. 插槽

**默认插槽（父 → 子）：**

```html
<!-- 父组件决定子组件内部显示什么 -->
<Category title="游戏">
  <ul><li v-for="g in games">{{ g.name }}</li></ul>
</Category>

<!-- 子组件 -->
<slot>默认内容</slot>
```

**具名插槽（多位置）：**

```html
<!-- 子组件 -->
<slot name="s1">默认1</slot>
<slot name="s2">默认2</slot>

<!-- 父组件 -->
<Category>
  <template #s1><h2>标题</h2></template>
  <template #s2><ul>...</ul></template>
</Category>
```

> `v-slot:s1` 简写为 `#s1`。

**作用域插槽（子 → 父传数据）：**

```html
<!-- 子组件：把数据传给父组件 -->
<slot :youxi="games" x="哈哈"></slot>

<!-- 父组件：决定如何渲染 -->
<Game>
  <template #default="{ youxi }">
    <h3 v-for="g in youxi" :key="g.id">{{ g.name }}</h3>
  </template>
</Game>
```

> 作用域插槽的本质：**数据在子组件，渲染结构由父组件决定**。

### 9 种通信方式总结

| 方式 | 方向 | 关键 API |
|------|------|----------|
| props | 父→子 | `defineProps` |
| 自定义事件 | 子→父 | `defineEmits` + `@事件名` |
| mitt | 任意 | `emitter.emit` / `emitter.on` |
| v-model | 父↔子 | `v-model:名称` + `update:名称` |
| $attrs | 祖→孙 | `$attrs` + `v-bind` |
| $refs/$parent | 父↔子 | `$refs` / `$parent` + `defineExpose` |
| provide/inject | 祖→后代 | `provide` / `inject` |
| Pinia | 任意 | `defineStore` / `storeToRefs` |
| 插槽 | 父→子 / 子→父 | `<slot>` / `#名称` |

---

## 第八部分：Vue 3 进阶 API（045-048）

### 045 shallowRef 与 shallowReactive

只做**浅层响应式**，提升性能。

**shallowRef**——只对 `.value` 替换做出响应：

```ts
let person = shallowRef({ name: '张三', age: 18 })

person.value.name = '李四'                    // ❌ 不触发视图更新
person.value = { name: 'tony', age: 100 }     // ✅ 触发（整体替换）
```

**shallowReactive**——只对第一层属性响应：

```ts
let car = shallowReactive({
  brand: '奔驰',
  options: { color: '红色', engine: 'V8' }
})

car.brand = '宝马'            // ✅ 第一层，触发响应
car.options.color = '紫色'    // ❌ 第二层，不触发
```

**对比总结：**

| API | 响应层级 | 适合场景 |
|-----|---------|---------|
| `ref` | 深层 | 需要修改对象内部属性 |
| `shallowRef` | 仅 `.value` 替换 | 只整体替换对象 |
| `reactive` | 深层 | 需要修改深层属性 |
| `shallowReactive` | 仅第一层 | 只有第一层会变 |

---

### 046 readonly 与 shallowReadonly

将响应式数据变为**只读**。

```ts
// readonly——深层只读
let sum2 = readonly(sum1)
sum2.value += 1  // ❌ 警告：target is readonly

// shallowReadonly——第一层只读，深层可改
let car2 = shallowReadonly(car1)
car2.brand = '宝马'            // ❌ 第一层只读
car2.options.color = '绿色'    // ⚠️ 第二层可以改
```

| API | 只读层级 |
|-----|---------|
| `readonly` | 深层（所有层级） |
| `shallowReadonly` | 仅第一层 |

> 常用场景：`provide('data', readonly(data))`——传给后代但防止修改。

---

### 047 toRaw 与 markRaw

从响应式系统中"逃逸"。

**toRaw**——获取响应式对象的原始对象：
```ts
let person = reactive({ name: 'tony', age: 18 })
let rawPerson = toRaw(person)  // 原始对象，修改不触发更新
```

**markRaw**——标记对象永不被代理：
```ts
let car = markRaw({ brand: '奔驰', price: 100 })
let car2 = reactive(car)  // car2 就是原始对象，没有被代理
```

| | toRaw | markRaw |
|--|------|---------|
| 作用 | 从响应式对象取出原始 | 标记对象永不被代理 |
| 方向 | 响应式 → 原始 | 原始 → 永不响应 |
| 场景 | 深拷贝、性能优化 | 第三方库实例、大对象 |

---

### 048 customRef

自定义 ref 的依赖收集和触发逻辑，实现防抖等高级效果。

```ts
import { customRef } from 'vue'

// 自定义带防抖效果的 ref
export default function(initValue: string, delay: number) {
  let timer: number
  let msg = customRef((track, trigger) => {
    return {
      get() {
        track()            // 告诉 Vue：这个值需要被追踪
        return initValue
      },
      set(value) {
        clearTimeout(timer)
        timer = setTimeout(() => {
          initValue = value
          trigger()        // 通知 Vue：值变了，请更新视图
        }, delay)
      }
    }
  })
  return { msg }
}
```

```ts
// 组件中使用
let { msg } = useMsgRef('你好', 2000)  // 输入后延迟 2 秒才更新
```

| 函数 | 何时调用 | 作用 |
|------|---------|------|
| `get()` | 数据被读取时 | 调用 `track()`，返回值 |
| `set()` | 数据被修改时 | 更新值，调用 `trigger()` |

---

## 第九部分：内置组件（049-050）

### 049 Teleport

将组件的 DOM 内容"传送"到指定位置，脱离当前组件的 DOM 层级。

```html
<!-- Modal.vue -->
<teleport to="body">
  <div class="modal" v-show="isShow">
    <h2>弹窗标题</h2>
    <button @click="isShow = false">关闭</button>
  </div>
</teleport>
```

**为什么需要 Teleport？**

弹窗嵌套在父组件内时，父组件的 CSS（`filter`、`overflow: hidden`、`transform`）会影响弹窗样式。使用 `<teleport to="body">` 后，弹窗直接挂在 body 下，不受父组件 CSS 影响。

**特点：**
- `to` 属性指定目标选择器（`body`、`#app`、`.some-class`）
- DOM 位置改变，但组件逻辑（数据、事件）仍属于原组件

---

### 050 Suspense

在异步组件加载时显示 fallback 内容。

```html
<Suspense>
  <template v-slot:default>
    <Child/>
  </template>
  <template v-slot:fallback>
    <h2>加载中......</h2>
  </template>
</Suspense>
```

```ts
// Child.vue — 顶层 await 使组件变为异步组件
let { data: { content } } = await axios.get('https://api.uomg.com/api/...')
```

| 插槽 | 作用 |
|------|------|
| `default` | 正常渲染的内容（异步组件） |
| `fallback` | 加载期间显示的占位内容 |

**工作流程：**
```
1. App 渲染 → Suspense 开始
2. Child 是异步组件 → 显示 fallback（"加载中..."）
3. await 完成
4. Child 渲染完成 → 替换 fallback
```

> 如果不使用 `Suspense` 包裹含顶层 `await` 的组件，Vue 会报错。

---

## 课程总结

### 完整学习路线

| 章节 | 主题 | 核心内容 |
|------|------|----------|
| 001-006 | Vue 3 基础 | SFC 结构、setup、语法糖 |
| 007-012 | 响应式数据 | ref、reactive、toRefs、computed |
| 013-018 | 侦听器 | watch 五种情况、watchEffect |
| 019-023 | 组件进阶 | ref 属性、TS、props、生命周期、hooks |
| 024-035 | Vue Router | 路由基础、嵌套、参数、导航、重定向 |
| 036-043 | Pinia | state、actions、getters、$subscribe、组合式 |
| 044 | 组件通信 | 9 种通信方式 |
| 045-048 | 进阶 API | shallowRef、readonly、toRaw、customRef |
| 049-050 | 内置组件 | Teleport、Suspense |

### Vue 3 核心概念速查

| 概念 | API | 作用 |
|------|-----|------|
| 响应式（基本类型） | `ref` | 创建响应式数据 |
| 响应式（对象类型） | `reactive` | 创建响应式对象 |
| 计算属性 | `computed` | 依赖缓存计算 |
| 侦听器 | `watch` / `watchEffect` | 监听数据变化 |
| 生命周期 | `onMounted` 等 | 组件阶段钩子 |
| Props | `defineProps` | 接收父组件数据 |
| Emits | `defineEmits` | 声明自定义事件 |
| 暴露 | `defineExpose` | 暴露数据给父组件 |
| 状态管理 | `defineStore` | 创建 Pinia store |
| 路由 | `useRoute` / `useRouter` | 获取路由信息/编程导航 |
| 浅层响应 | `shallowRef` / `shallowReactive` | 性能优化 |
| 只读 | `readonly` | 保护数据不被修改 |
| 原始对象 | `toRaw` / `markRaw` | 脱离响应式 |
| 自定义 ref | `customRef` | 防抖等高级逻辑 |
| DOM 传送 | `<teleport>` | 弹窗脱离父组件 |
| 异步组件 | `<suspense>` | 加载占位 |
