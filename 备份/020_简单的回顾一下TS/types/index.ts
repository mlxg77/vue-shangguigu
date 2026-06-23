// 定义一个接口，用于限制person对象的具体属性
export interface PersonInter {
  id:string,
  name:string,
  age:number
}

// 一个自定义类型
// export type Persons = Array<PersonInter>
// Persons 是一个数组，数组里的每一项都必须符合
export type Persons = PersonInter[]