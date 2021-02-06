import Vue from 'vue';
import { CustomConfig, NormalizeConfig, ItemConfig, CustomUiConfig, NormalizeUiConfig, UiConfg } from './index.d';
import { cloneDeep, pick } from 'lodash-es';
import { computeItems, normConfigs, getType } from './utils';
import { INNER_COMPONENT, CLASS_PREFEX, FORM_TAG, FORM_ITEM_TAG, FOOTER_BUTTON_TAG } from './constants';

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

    // 支持外部显式传入 parent
    parent: {},
  },

  data() {
    return {
      form: {} as { [prop: string]: any },

      formItems: [] as NormalizeConfig[], // 规范化后的配置项
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
    // fields 的映射，方便快速定位
    fieldsMap() {
      const { fields } = this;
      const map = {} as any;

      fields.forEach((f, i) => {
        map[f.key] = { ...f, $$index: i };
      });

      return map;
    },

    // 最终渲染使用的配置
    layouts() {
      const { uiConfigs, fieldsMap } = this as any;

      const layouts = uiConfigs
        .map((nc: NormalizeUiConfig) => {
          const uiConfig = { row: nc.row } as UiConfg;
          uiConfig.cols = nc.cols
            .map((c) => {
              const field = fieldsMap[c.$$key] as ItemConfig;
              if (field) {
                return { ...c, $$field: field };
              }
              return false;
            })
            .filter(Boolean) as any;

          if (uiConfig.cols.length) {
            return uiConfig;
          }
          return false;
        })
        .filter(Boolean);

      return layouts;
    },

    // 布局
    uiConfigs() {
      const {
        config: { ui },
        formItems,
      } = this as any;
      // const DEFAULT_ROW = {};
      const uiMap = ((ui as CustomUiConfig[]) || []).reduce((acc: any, curr: object, i: number) => {
        Object.keys(curr).forEach((k) => {
          acc[k] = { index: i, row: curr };
        });
        return acc;
      }, {});

      const hasMap = {} as any;

      const simpleConfigs = formItems
        .map((conf: any) => {
          const k = conf.key;
          if (hasMap[k]) {
            return;
          }

          const uiConf = { [k]: 24, $$row: {} } as CustomUiConfig;
          const taget = uiMap[k];
          if (taget) {
            uiConf[k] = taget.row[k];
            uiConf.$$row = taget.row.$$row || uiConf.$$row;
            hasMap[k] = true;

            Object.keys(taget.row).forEach((tk: any) => {
              if (tk !== k && tk !== '$$row') {
                uiConf[tk] = taget.row[tk];
                hasMap[tk] = true;
              }
            });
          }

          return uiConf;
        })
        .filter(Boolean);

      const uiConfig = simpleConfigs.map((conf: CustomConfig) => {
        const ui = { row: conf.$$row, cols: [] } as NormalizeUiConfig;

        Object.keys(conf)
          .filter((k) => k !== '$$row')
          .forEach((k) => {
            const v = conf[k];
            if (getType(v) === 'Object') {
              ui.cols.push({ ...v, $$key: k });
            } else {
              ui.cols.push({ span: v, $$key: k });
            }
          });

        return ui;
      });

      return uiConfig;
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
        this.refreshUI(false);
      },
      immediate: true,
      deep: true,
    },
    // value 改变了就给 form 赋值，只更新
    value: {
      handler(val) {
        // 防止死循环
        if (this.valueChangeCount > 0) {
          this.valueChangeCount--;
          return;
        }

        if (Object.keys(val || {}).length < 1) {
          return;
        }

        const value = cloneDeep(val || {});
        const { form } = this;
        // 直接替换，触发对新属性的双向绑定
        this.form = { ...form, ...value };
      },
      immediate: true,
      deep: true,
    },
    // form 改变了，可能触发了联动规则，重新计算各项的 $$ifRender
    form: {
      handler() {
        this.refreshUI(false);
      },
      deep: true,
    },
    // formValue 改变了 则派发一次 input 事件 并计数，
    // 防止和 value 的watch 形成死循环
    formValue: {
      handler(val) {
        this.$emit('input', val);
        this.valueChangeCount++;
      },
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
            this.$emit('submit', this.formValue);
          }
        });
    },

    $$cancel() {
      this.$emit('cancel');
      const rawForm = this.$refs.rawForm as any;

      rawForm && rawForm.clearValidate();
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

    // 渲染 inline 模式下的表单项区域
    $$renderInlineMain() {
      const { $$renderItem, fields } = this;
      const inlineMain = fields.map($$renderItem);
      return inlineMain;
    },

    // 渲染表单项区域
    $$renderMain() {
      const { layouts, $$renderItem } = this;
      const main = layouts.map((ui: UiConfg) => {
        const cols = ui.cols.map((col) => {
          const colProp = { ...col } as any;
          const $$key = col.$$key;
          const field = col.$$field;
          delete colProp.$$key;
          delete colProp.$$field;

          return (
            <el-col {...{ props: colProp }} key={$$key}>
              {$$renderItem(field)}
            </el-col>
          );
        });

        return <el-row {...{ props: ui.row }}>{cols}</el-row>;
      });

      return main;
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
      const formItemKey = 'form_item_' + key;

      switch (component) {
        case 'slot':
          item = this.$slots[slot || key];
          break;
        case 'slotField':
          children = this.$slots[slot || key];
          item = (
            <FORM_ITEM_TAG key={formItemKey} props={formItem}>
              {children}
            </FORM_ITEM_TAG>
          );
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
          item = (
            <FORM_ITEM_TAG key={formItemKey} props={formItem}>
              {getInner(modelKey)}
            </FORM_ITEM_TAG>
          );
          break;
      }

      return item;
    },

    $$renderFooter() {
      const {
        config: { form = {} },
        $$confirm,
        $$cancel,
      } = this;
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
      return (this.parent as Vue) || (this.$vnode && this.$vnode.context);
    },
  },

  render(_c) {
    const {
      $$renderInlineMain,
      $$renderMain,
      form,
      $attrs = {},
      $slots,
      $$renderFooter,
      config: { form: formConfig },
    } = this as any;

    const inline = $attrs.inline || $attrs.inline === '' || (formConfig || {}).inline;
    const main = inline ? $$renderInlineMain() : $$renderMain();

    const children = [...main];
    if ($slots.default) {
      children.push($slots.default);
    }

    if ($slots.footer) {
      children.push($slots.footer);
    } else {
      children.push($$renderFooter());
    }

    // jsx 插件 将 model 识别为了 v-model 会报错，所以使用 _c 方法
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
      children
    );
  },
});

(LForm as any).typeMap = {};
(LForm as any).setTypeMap = ($$typeMap = {}) => {
  Object.assign((LForm as any).typeMap, $$typeMap);
};
(LForm as any).install = function install(Vue: any, options = {}) {
  if ((LForm as any).installed) return;
  (LForm as any).installed = true;

  const { name, typeMap } = options as any;

  if (typeMap) {
    (LForm as any).setTypeMap(typeMap);
  }

  Vue.component(name || (LForm as any).name, LForm);
};

export default LForm;
