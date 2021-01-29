// {
//   // 与 `v-bind:class` 的 API 相同，
//   // 接受一个字符串、对象或字符串和对象组成的数组
//   'class': {
//     foo: true,
//     bar: false
//   },
//   // 与 `v-bind:style` 的 API 相同，
//   // 接受一个字符串、对象，或对象组成的数组
//   style: {
//     color: 'red',
//     fontSize: '14px'
//   },
//   // 普通的 HTML attribute
//   attrs: {
//     id: 'foo'
//   },
//   // 组件 prop
//   props: {
//     myProp: 'bar'
//   },
//   // DOM property
//   domProps: {
//     innerHTML: 'baz'
//   },
//   // 事件监听器在 `on` 内，
//   // 但不再支持如 `v-on:keyup.enter` 这样的修饰器。
//   // 需要在处理函数中手动检查 keyCode。
//   on: {
//     click: this.clickHandler
//   },
//   // 仅用于组件，用于监听原生事件，而不是组件内部使用
//   // `vm.$emit` 触发的事件。
//   nativeOn: {
//     click: this.nativeClickHandler
//   },
//   // 自定义指令。注意，你无法对 `binding` 中的 `oldValue`
//   // 赋值，因为 Vue 已经自动为你进行了同步。
//   directives: [
//     {
//       name: 'my-custom-directive',
//       value: '2',
//       expression: '1 + 1',
//       arg: 'foo',
//       modifiers: {
//         bar: true
//       }
//     }
//   ],
//   // 作用域插槽的格式为
//   // { name: props => VNode | Array<VNode> }
//   scopedSlots: {
//     default: props => createElement('span', props.text)
//   },
//   // 如果组件是其它组件的子组件，需为插槽指定名称
//   slot: 'name-of-slot',
//   // 其它特殊顶层 property
//   key: 'myKey',
//   ref: 'myRef',
//   // 如果你在渲染函数中给多个元素都应用了相同的 ref 名，
//   // 那么 `$refs.myRef` 会变成一个数组。
//   refInFor: true
// }
// https://cn.vuejs.org/v2/guide/render-function.html#%E6%B7%B1%E5%85%A5%E6%95%B0%E6%8D%AE%E5%AF%B9%E8%B1%A1

// 表单项的配置（计算后的结果）
export interface ItemConfig {
  itemKey: string;
  key: string;
  modifiers: string[]; // v-mode 的修饰符
  label: string; // 表单项的展示 label 名
  component: string | Vue; // 表单项的实际组件
  $$ifRender: boolean; // 动态计算的表单项显示和隐藏值
  ifRender: Function; // 动态计算的表单项显示和隐藏，实现表单项联动
  jsx: {
    [jsxPropName: string]: any;
  };
  formItem: object; // 表单项 label 的配置
}

// 基础通用配置
interface BaseConfig {
  modifiers?: string[]; // v-mode 的修饰符，支持 trim 和 number
  component?: string | Vue; // 实际的表单项
  props?: object | Function;
  on?: Record<string, any>; // 表单项绑定的事件
  nativeOn?: Record<string, any>; // 表单项绑定的原生事件（.native 绑定的事件）
  ifRender?: Function; // 动态计算的表单项显示和隐藏，实现表单项联动
  [jsxPropName: string]: any; // 其他 jsx 支持的属性
  labelWidth?: string; // 表单域标签的的宽度，例如 '50px'。支持 auto。
  [formItemProp: string]: any; // 其他表单label 需要的配置
}

// 表单项的配置（用户配置）
export interface CustomConfig extends BaseConfig {
  itemKey?: string; // 表单项绑定项的 key 没有则取下方的属性 key
  key: string; // 表单项绑定值的属性名
  label?: string; // 表单项的展示 label 名
  type?: string; // 表单项的类型，由 typeMap 定义映射
}

// 规范化之后的配置
interface NormalizeConfig {
  itemKey: string;
  key: string;
  modifiers?: string[]; // v-mode 的修饰符
  label: string; // 表单项的展示 label 名
  component: string | Vue; // 表单项的实际组件
  ifRender: Function; // 动态计算的表单项显示和隐藏，实现表单项联动
  getProps: Function; // 动态计算的表单项的 props
  getDefProps: Function; // 动态计算的表单项的默认 props
  jsx: {
    [jsxPropName: string]: any;
  };
  formItem: object; // 表单项 label 的配置
}

// 表单项的默认配置映射
interface TypeMap {
  [propName: string]: BaseConfig;
}

export interface LazyForm extends Vue {
  typeMap: TypeMap; // 全局的表单项类型映射
  // setTypeMap: Function; // 自定义全局的表单项类型映射
  // defaultType: string; // 不写定义表单项类型时默认的类型
}

export interface FormConfig {
  form?: object;
  formItems?: CustomConfig[];
  ui?: CustomUiConfig[];
}

// 用户布局配置
export interface CustomUiConfig {
  $$row?: object; // 当前列的配置
  [formKey: string]: number | object; // 每个 key 对应的列配置
}

// 规范化后的布局配置
export interface NormalizeUiConfig {
  row: object;
  cols: { span: number; $$key: string }[];
}

// 最终的布局配置
export interface UiConfg {
  row: object;
  cols: { span: number; $$key: string; $$field: ItemConfig }[];
}
