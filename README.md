# LForm js 对象 配置表单

## 介绍

基于 Vue 2.X、Element-ui 2.X 的使用 js 对象 进行配置生成的表单，懒人专用表单 —— LazyForm  

该表单的特点如下：  
  1. 支持表单联动  
  2. 支持任意类型的输入项，只要该输入项实现了 v-model  
  3. 支持动态更新表单配置项  
  4. 支持灵活配置表单项布局  

作者本人使用 LForm 的原因：  
  1. **提供表单项的联动**，只需简单配置就能实现  
  2. 配置直接生成表单，**不用写一堆臃肿的模板**  
  3. **配置支持设置默认属性，使得能够统一表单项的默认设置**  
  4. 支持配置校验规则，**不用写一堆 if else 来手动校验**  
  5. 数据驱动视图，只需要修改配置对象，则会自动刷新UI  
  6. 支持在指定位置渲染 slot  
  7. 通过 v-model 直接拿到/设置 表单的值  
  8. 支持自定义表单项的布局  
  9. ...  

> 以下均假设已经全局安装了 [Element-ui](https://element.eleme.cn/#/zh-CN/component/quickstart)  
> 配置项中，除了 LForm 特有的配置外，其他未做说明的配置项均为对应 'element' 组件的配置  

## 使用

### 安装
#### NPM

```shell
npm i --save @lazyb/l-form
```

#### YARN

```shell
yarn add @lazyb/l-form
```

### 简单场景

在最简单的情况下，无需其他配置就可以使用  

```js
// main.js
import LForm from '@lazyb/l-form';

Vue.use(LForm);
```

```html
<l-form :config="config" label-width="100px" @submit="submit"></l-form>
```

```js
// 由于没有做其他配置，所以需要指明表单使用的组件 component  
// 其中 slot 是特殊的，代表这里需要渲染一个 具名slot， slot 名是配置项中的 key  
export default {
  name: 'SimpleDemo',

  data() {
    return {
      config: {
        formItems: [
          { component: 'el-input', label: '活动名称', key: 'name' },
          { component: 'el-switch', label: '即时配送', key: 'delivery' },
          { component: 'el-input', label: '备注', key: 'desc' },
        ],
      },
    };
  },

  methods: {
    submit() {
      this.$message.info(`提交：${JSON.stringify(this.form)}`);
    },
  },
};
```

### 简单场景 - 带表单校验

```html
  <l-form :config="config" label-width="100px" @submit="submit"></l-form>
```

```js
export default {
  name: 'RulesDemo',

  data() {
    return {
      config: {
        formItems: [
          {
            component: 'el-input',
            label: '活动名称',
            key: 'name',
            rules: [{ required: true, message: '活动名称不能为空', trigger: 'change' }],
          },
          { component: 'el-switch', label: '即时配送', key: 'delivery' },
          { component: 'el-input', label: '备注', key: 'desc' },
        ],
      },
    };
  },

  methods: {
    submit() {
      this.$message.info(`提交：${JSON.stringify(this.form)}`);
    },
  },
};
```

### 简单场景 - 自定义布局

```html
  <l-form :config="config" label-width="100px" @submit="submit"></l-form>
```

```js
export default Vue.extend({
  name: 'UiDemo',

  data() {
    return {
      config: {
        formItems: [
          {
            component: 'el-input',
            label: '活动名称',
            key: 'name',
            rules: [{ required: true, message: '活动名称不能为空', trigger: 'change' }],
          },
          {
            component: 'el-input',
            label: '活动名称2',
            key: 'name2',
            rules: [{ required: true, message: '活动名称不能为空', trigger: 'change' }],
          },
          { component: 'el-switch', label: '即时配送', key: 'delivery' },
          { component: 'el-switch', label: '即时配送2', key: 'delivery2' },
          { component: 'el-input', label: '备注', key: 'desc' },
        ],
        ui: [
          { name: 12, name2: 12 },
          { delivery: 12, delivery2: 12 },
        ],
      },
    };
  },

  methods: {
    submit() {
      this.$message.info(`提交：${JSON.stringify(this.form)}`);
    },
  },
});
```

### 简单场景 - 带表单联动

```html
  <l-form :config="config" label-width="100px" @submit="submit"></l-form>
```

```js
export default Vue.extend({
  name: 'LinkDemo',

  data() {
    return {
      config: {
        formItems: [
          {
            component: 'el-input',
            label: '活动名称',
            key: 'name',
            rules: [{ required: true, message: '活动名称不能为空', trigger: 'change' }],
          },
          { component: 'el-switch', label: '即时配送', key: 'delivery' },
          {
            component: 'el-input',
            label: '配送要求',
            key: 'info',
            ifRender(form: any) {
              return form.delivery;
            },
            rules: [{ required: true, message: '配送要求不能为空', trigger: 'change' }],
          },
          { component: 'el-input', label: '备注', key: 'desc' },
        ],
      },
    };
  },

  methods: {
    submit() {
      this.$message.info(`提交：${JSON.stringify(this.form)}`);
    },
  },
});
```

### 简单场景 - 插槽

```html
  <l-form :config="config" label-width="100px" @submit="submit">
    <h3 slot="slot-name">我是自定义的表单项</h3>
    <h3 slot="slotField-name">我是表单项的自定义输入元素</h3>
    <h3>我是默认插槽</h3>
    <h3 slot="footer">我是自定义提交按钮</h3>
  </l-form>
```

```js
export default Vue.extend({
  name: 'SlotDemo',

  data() {
    return {
      config: {
        form: {
          submitText: ['确定以及肯定', '狠心放弃'],
        },
        formItems: [
          {
            component: 'el-input',
            label: '活动名称',
            key: 'name',
            rules: [{ required: true, message: '活动名称不能为空', trigger: 'change' }],
          },
          { component: 'slot', key: 'slot-name' },
          { component: 'el-switch', label: '即时配送', key: 'delivery' },
          { component: 'slotField', label: '一个自定义输入元素的表单项', key: 'slotField-name' },
          {
            component: 'el-input',
            label: '配送要求',
            key: 'info',
            ifRender(form: any) {
              return form.delivery;
            },
            rules: [{ required: true, message: '配送要求不能为空', trigger: 'change' }],
          },
          { component: 'el-input', label: '备注', key: 'desc' },
        ],
      },
    };
  },

  methods: {
    submit() {
      this.$message.info(`提交：${JSON.stringify(this.form)}`);
    },
  },
});
```

## API

### Props

| 参数            | 说明               | 类型       | 默认值 |
| --------------- | ------------------ | ---------- | ------ |
| v-model (value) | 当前表单的值       | _object_   | -      |
| config    | 当前表单的配置参数 | _object_ | -      |
| [otherFormProps: string]    | el-form 的其他配置参数 | _any_ | -      |

> 表单赋值采用的合并操作，并不是替换操作，类似 Object.assign ，所以不会删除 val 中没有的键名的值  
> 例如表单值为: { a: 2, b: 1 }, val 值为 { a: 1 }，则赋值后的结果为 { a: 1, b: 1 }  
> 如果需要清空值，请使用 reset()  

### config

| 参数            | 说明               | 类型       | 默认值 |
| --------------- | ------------------ | ---------- | ------ |
| formItems    | 表单项的配置参数 | _itemConfig[]_ | -      |
| ui    | 表单项的布局配置参数 | _layoutConfig[]_ | -      |
| form    | 表单的配置参数 | _config_ | -      |

### formItems

| 参数        | 说明                                                                                                                                                                    | 类型              | 默认值 |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------ |
| type        | 表单项的类型，需要在 typeMap 中指明组件名称                                                                                                                                               | _string_          | -      |
| key         | 当前表单项绑定的属性名/slot的具名名称                                                                                                                                   | _string_          | -      |
| modifiers         | v-mode 的修饰符，支持 trim 和 number                                                                                                                                   | _[string]_          | -      |
| on          | 当前表单项绑定的事件（需要自行处理 this 指向）                                                                                                                          | _object: {event}_ | -      |
| nativeOn    | .native 绑定的事件（需要自行处理 this 指向）                                                                                                                                                      | _object: {event}_ | -      |
| component   | 表单项的标签名/表单项（直接引入）,优先级高于 type                                                                                                                                       | _VNode \| string_ | 'div'      |
| label       | 表单项展示的 label 名                                                                                         | _string_          | -      |
| [jsxPropName]      | 其他支持 [jsx](https://cn.vuejs.org/v2/guide/render-function.html#%E6%B7%B1%E5%85%A5%E6%95%B0%E6%8D%AE%E5%AF%B9%E8%B1%A1) 的一些属性 | _any_          | -      |
| props       | 表单项的配置参数，直接透传给对应表单项，也可以写成方法动态获取                                                                                                                                  | _object \| function_          | -      |
| ifRender    | 表单项的是否渲染计算方法，根据计算出的结果决定是否渲染表单项，表单联动的实现机制                                                                                        | _function_        | -      |
| [formItemProp] | 其他表单label需要的配置，可以理解为 el-form-item 需要的配置                                                                                                                                      | _any_        | -      |

> component 有两个特殊的值： slot 和 slotField。其中 slot 为完全使用 slot 生成表单项（需要自行实现 el-form-item），而 slotField 则仅使用 slot 生成输入组件  

> props 为当前表单项的实际输入组件的配置。例如：{ component: 'el-input' }，此时的 props 应该为 el-input 的配置  

> props 是个函数时：props(form: form的当前值, config: 表单项当时的配置值, context: 当前组件的父组件实例)   

> ifRender(form: form的当前值, config: 表单项当时的配置值, context: 当前组件的父组件实例)  

> props 取值顺序是：typeMap.props -> item.props  
> 后面对象的同名属性会覆盖前面的对象的同名属性，使用的 Object.assign 实现  

> type 为 slot 类型的表单项，其实是一个 slot 占位，slot 名与 key 或者 slot 属性的值相同  

### ui

> 布局使用 el-row 和 el-col 实现，也就是说行列的配置项分别对应 el-row 和 el-col 的配置。  
> 特别的，当列配置，也就是说 key 的属性值为数字时，表明只配置列的 span 。例如： { name: 12 } 等价于 { name: { span: 12 } }  
> 如果对应的 key 没有配置 ui 则表明该表单项单独占一行且铺满当前行  

| 参数        | 说明                                                                                                                                                                    | 类型              | 默认值 |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------ |
| [formKey: string]        | 以表单key作为标识，配置对应的布局数据，可以是数字或者一个对象                                                                                                                                               | _number \| object_          | -      |
| $$row         | 配置当前行的属性，也就是配置 el-row 的属性                                                                                                                                   | _object_          | -      |

### form

| 参数        | 说明                                                                                                                                                                    | 类型              | 默认值 |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------ |
| submitText        | [确定按钮文本,取消按钮文本] 用于自定义按钮文描，如果是更复杂的场景，请使用 footer 具名 slot                                                                                                                                               | _Array_          | ['确定', '取消']      |
| [ElFormPropName: string]        | el-form 的配置项                                                                                                                                               | _any_          | -      |

> form 可以在配置参数中配置，也可以直接配置在 LForm 组件上，写在配置参数里面的好处是可以 cv 复用  
  
### slots

| 参数        | 说明                                                                                                                                                                    | 类型              | 默认值 |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------ |
| default        | 默认 slot 在表单项下方，提交按钮上方，用于展示一些提交提示文描                                                                                                                                               | _          | -      |
| footer        | 表单提交按钮区域的具名slot，用于自定义提交按钮                                                                                                                                               | _          | -      |
| [itemSlotName: string]        | slot 表单项，用来自定义表单输入组件                                                                                                                                               | _          | -      |

> 表单项 slot 有 slot 和 slotField 之分，需要注意  


### Events

LForm 使用 v-model 进行值管理，所以会冒泡 input 事件  
其他表单项事件由各个表单项确定，监听事件需要自行定义在配置项中  

| 事件  | 说明               | 回调参数                       |
| ----- | ------------------ | ------------------------------ |
| input | 表单内容变化时触发 | _value: object (当前表单的值，不包含 ifRender 隐藏的项的值)_ |
| confirm | 用户点击确认按钮触发 | _value: object (原始表单的值，包含 ifRender 隐藏的项的值)_ |
| submit | 用户点击确认按钮且表单校验通过触发 | _value: object (当前表单的值，不包含 ifRender 隐藏的项的值)_ |

> 一般情况，都只需要去除了 ifRender 隐藏项的表单值，所以 v-model 和 submit 都冒泡的该值  
> 如果需要原始表单值，可以在 confirm 事件中拿到，或者通过 slot 直接拿 LForm 的 form 属性的值  

### 方法

通过 ref 可以获取到 Form 实例并调用实例方法  

| 方法名    | 说明                           | 参数                                              | 返回值           |
| --------- | ------------------------------ | ------------------------------------------------- | ---------------- |
| reset     | 重置表单值为指定的值           | val: Object                                       | -                |
| refreshUI | 强制重新计算配置项，进行UI刷新 | force: boolean （true：无论是否有更新，强制刷新） | -                |

> 一般情况下赋值只需要修改 v-model 绑定的值即可，除非需要修改隐藏项的值，才需要使用 reset  
> 理论上你永远都不需要使用 refreshUI 方法，如果你遇到了需要使用的场景，请联系我  

## Q&A

1. Q：为什么使用 v-model 来实现数据绑定？A：符合 vue 使用者的习惯，而且可以做到和表单项解耦。  
2. Q：表单项的值是复杂对象怎么办？A：其他和单值没区别。  
3. Q：如果没有使用 Element-ui 怎么办？A：可以只引入 el-form/el-form-item/el-row/el-col 四个组件，其他输入项使用其他组件库。但是还是建议使用 Element-ui，或者 fork 一份代码自行实现其他组件库的表单组件...  
4. ...  
