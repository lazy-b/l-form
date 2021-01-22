import Vue from 'vue';
import { CustomConfig, NormalizeConfig, ItemConfig } from './index.d';
import { cloneDeep, pick } from 'lodash';
import { computeItems, normConfigs, INNER_COMPONENT, has } from './utils';

const CLASS_PREFEX = 'l-form';
const FORM_TAG = 'el-form';
const FORM_ITEM_TAG = 'el-form-item';
const FOOTER_BUTTON_TAG = 'el-button';

const { stringify } = JSON;

// config.formItems 改变 -> 重新计算 formItems -> 更新 fields
// 重新渲染，并重新渲染 formValue -> 如果 值改变则派发input
// value 改变 -> 改变 form -> 改变 formValue 以及重新渲染 -> 如果值改变则派发 input
const LForm = Vue.extend({
  name: 'LForm',

  props: {
    // 表单值
    value: {
      type: Object,
      default() {
        return {};
      },
    },

    // 表单配置项
    config: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  data() {
    return {
      form: {} as { [prop: string]: any },

      formItems: [] as NormalizeConfig[], // 计算后的配置项
      fields: [] as ItemConfig[], // 根据 form 的值动态计算出来的配置项

      valueChangeCount: 0,

      rawForm: null as any, // form表单引用
    };
  },

  computed: {
    // 暴露给外界的表单值
    formValue() {
      const { fields, form } = this as any;
      const $$keys = fields.map((item: any) => item.key).filter(Boolean);
      const target = pick(form, $$keys);

      return target;
    },
  },

  watch: {
    // config.formItems 配置发生了改变则重新计算 formItems
    'config.formItems': {
      handler(val: CustomConfig[]) {
        const confs = cloneDeep(val || []);
        const typeMap = { ...INNER_COMPONENT, ...(LForm as any).typeMap };
        const formItems = normConfigs(confs, cloneDeep(typeMap));

        this.formItems = formItems;
        this.$$initForm();
        this.refreshUI(false);
      },
      immediate: true,
      deep: true,
    },
    // value 改变了就给 form 赋值，只更新
    value: {
      handler(val) {
        const value = cloneDeep(val || {});
        const { form } = this;
        // 直接替换，触发对新属性的双向绑定
        this.form = { ...form, ...value };

        // 计数器加 1 ，取消当前赋值导致的更新事件派发
        this.valueChangeCount++;
      },
      immediate: true,
      deep: true,
    },
    // form 改变了，可能触发了联动规则，重新计算各项的 $$ifRender
    form: {
      handler() {
        this.refreshUI(false);
      },
      immediate: true,
      deep: true,
    },
    // formValue 改变了 则派发一次 input 事件 并计数，
    // 防止和 value 的watch 形成死循环
    formValue: {
      handler(val, oldValue) {
        // 由于 valueChangeCount 标记的作用
        // 主动对 value 赋值将不会派发循环的 input 事件
        if (this.valueChangeCount > 0) {
          this.valueChangeCount--;
          return;
        }

        const same = stringify(val) === stringify(oldValue);
        if (same) return;

        this.$emit('input', val);
      },
      // immediate: true,
      deep: true,
    },
  },

  created() {
    this.$$setParentComponents();
  },

  mounted() {
    this.$nextTick(() => {
      this.rawForm = this.$refs.rawForm;
    });
  },

  methods: {
    /** --------------- 说明 -------------  */
    // // 添加对外暴露校验方法
    // // noTips 校验未通过的时候不弹提示 toast
    // validate(noTips) {
    //   return new Promise((resolve, reject) => {
    //     this.$$validateFields((err, value) => {
    //       if (!err) {
    //         resolve(value);
    //       } else {
    //         reject(err);
    //       }
    //     }, noTips);
    //   });
    // },

    // // 校验表单
    // $$validateFields(cb = noop, noTips) {
    //   this.validator.validate(this.value, (errors) => {
    //     if (!noTips && errors && errors.length > 0) {
    //       LForm.showError(errors);
    //     }
    //     cb(errors, { ...this.value });
    //   });
    // },

    // 重置表单
    reset(val = {}) {
      this.form = { ...val };
    },

    // 提供给外部强制刷新列表的方法
    refreshUI(force = true) {
      this.$$updateFields(force);
    },

    // 点击确定
    $$confirm() {
      this.$emit('confirm', this.form);
      const rawForm = this.$refs.rawForm as any;

      rawForm &&
        rawForm.validate((valid: any) => {
          if (valid) {
            this.$emit('submit', this.form);
          }
        });
    },

    $$cancel() {
      this.$emit('cancel');
      const rawForm = this.$refs.rawForm as any;

      rawForm && rawForm.clearValidate();
    },

    // 根据配置项，初始化表单的双向绑定属性名
    $$initForm() {
      const keys = this.formItems.map((item: any) => item.key).filter(Boolean);
      const { form } = this;
      keys.forEach((k) => {
        if (!has(form, k)) {
          this.$set(form, k, null);
        }
      });
    },

    // 更新表单项的配置列表
    $$updateFields(force: boolean) {
      const { formItems, form } = this;
      const context = this.$$getParent() as any;
      let fields = computeItems(cloneDeep(formItems), cloneDeep(form), context);
      // 过滤不符合条件的项
      fields = fields.filter((item) => item.$$ifRender);
      if (!force && stringify(this.fields) === stringify(fields)) {
        return;
      }
      this.fields = fields;
    },

    /**
     * 渲染表单的一个元素
     * @param field 当前元素的配置信息
     * @param defProps 其他需要所有元素继承的属性
     */
    $$renderItem(field: ItemConfig) {
      const { component, key, jsx, formItem, modifiers } = field;
      let item = null;
      const Tag = component as any;
      const { slot } = jsx;
      let children;
      let modelKey;
      let getInner;

      switch (component) {
        case 'slot':
          item = this.$slots[slot || key];
          break;
        case 'slotField':
          children = this.$slots[slot || key];
          item = <FORM_ITEM_TAG props={formItem}>{children}</FORM_ITEM_TAG>;
          break;

        default:
          modelKey = ['vModel'].concat(modifiers).join('_');

          // 为了利用 babel 处理 modifiers
          getInner = (modelKey: string) => {
            let inner = <Tag {...jsx} vModel={this.form[key]} />;
            switch (modelKey) {
              case 'vModel_trim':
                inner = <Tag {...jsx} vModel_trim={this.form[key]} />;
                break;
              case 'vModel_number':
                inner = <Tag {...jsx} vModel_number={this.form[key]} />;
                break;
              case 'vModel_number_trim':
                inner = <Tag {...jsx} vModel_number={this.form[key]} />;
                break;
              case 'vModel_trim_number':
                inner = <Tag {...jsx} vModel_trim_number={this.form[key]} />;
                break;
              // no-default
              default:
                break;
            }

            return inner;
          };
          item = <FORM_ITEM_TAG props={formItem}>{getInner(modelKey)}</FORM_ITEM_TAG>;
          break;
      }

      return item;
    },

    $$renderFooter() {
      const { config: form = {}, $$confirm, $$cancel } = this;
      const submitText = form.submitText || [];
      const confirmText = submitText[0] || '确定';
      const cancelText = submitText[1] || '取消';
      return (
        <FORM_ITEM_TAG class={`${CLASS_PREFEX}_footer`}>
          <FOOTER_BUTTON_TAG
            type='primary'
            on={{
              click: $$confirm,
            }}
          >
            {confirmText}
          </FOOTER_BUTTON_TAG>
          <FOOTER_BUTTON_TAG
            on={{
              click: $$cancel,
            }}
          >
            {cancelText}
          </FOOTER_BUTTON_TAG>
        </FORM_ITEM_TAG>
      );
    },

    // 将父组件注册的局部组件也注册进来，方便用户使用自定义组件
    $$setParentComponents(): void {
      // 使得自定义组件能够在父组件注册
      this.$options.components = this.$options.components || {};
      const currentComponents = this.$options.components;
      const parent = this.$$getParent();
      if (!parent) {
        return;
      }

      const parentComponents = parent.$options.components;
      parentComponents &&
        Object.keys(parentComponents).forEach((key) => {
          if (!(key in currentComponents)) {
            currentComponents[key] = parentComponents[key];
          }
        });
    },
    // 得到当前组件配置文件所在的组件
    $$getParent() {
      return this.$vnode && this.$vnode.context;
    },
  },

  render(_c) {
    const {
      fields,
      $$renderItem,
      form,
      $attrs = {},
      $slots,
      $$renderFooter,
      config: { form: formConfig },
    } = this as any;
    const items = fields.map((field: any) => $$renderItem(field));

    // jsx 插件 将 model 识别为了 v-model 会报错
    // return (
    //   <FORM_TAG
    //     // model={form}
    //     {...{ model: form }}
    //   >
    //     {items}
    //   </FORM_TAG>
    // );

    return _c(
      FORM_TAG,
      {
        props: {
          model: form,
          ...$attrs,
          ...(formConfig || {}),
        },
        ref: 'rawForm',
      },
      [...items, _c('div', $slots.default), $slots.footer ? _c('div', $slots.footer) : $$renderFooter()]
    );
  },
});

export default LForm;
