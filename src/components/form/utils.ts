import { CustomConfig, NormalizeConfig, ItemConfig, TypeMap } from './index.d';
import { pick } from 'lodash';
// 内置的组件映射
export const INNER_COMPONENT: TypeMap = {
  slot: { component: 'slot' },
  slotField: { component: 'slotField' },
};

const DEFAULT_TAG = 'div'; // 什么都无法匹配到时，回退的标签

/**
 *判断是否是函数
 * @param target 被判断的目标
 */
const isFn = (target: any): boolean => target instanceof Function;

/**
 * 判断指定对象上是否存在指定属性名
 * @param obj 被判断对象
 * @param key 被判断属性名
 */
export const has = (obj: {}, key: string): boolean => Object.prototype.hasOwnProperty.call(obj, key);

// 以防万一用户没配置 key
const getKey = (config: CustomConfig) => config.key || JSON.stringify(config);
const getTrue = () => true;
const getPropsFn = (data: object) => () => data;

const DELETE_KEYS = ['key', 'props', 'itemKey', 'label', 'modifiers', 'ifRender', 'labelWidth', 'required'];

function normalizeItemConfig(config: CustomConfig, typeMap: TypeMap): NormalizeConfig {
  const conf = { ...config };
  const itemConf = {} as NormalizeConfig;
  itemConf.key = getKey(config);
  itemConf.itemKey = conf.itemKey || itemConf.key;
  itemConf.modifiers = conf.modifiers || [];
  itemConf.ifRender = conf.ifRender || getTrue;

  const formItem = pick(conf, [
    'required',
    'rules',
    'error',
    'show-message',
    'showMessage',
    'label-width',
    'labelWidth',
    'inline-message',
    'inlineMessage',
    'size',
  ]);

  itemConf.formItem = {
    ...formItem,
    prop: itemConf.key,
    label: conf.label || '',
  };

  const def = conf.type && typeMap[conf.type];
  itemConf.getProps = (isFn(conf.props) ? conf.props : getPropsFn(conf.props || {})) as Function;

  if (def) {
    itemConf.component = conf.component || def.component || DEFAULT_TAG;
    itemConf.getDefProps = (isFn(def.props) ? def.props : getPropsFn(def.props || {})) as Function;
    Object.assign(conf, def);
  } else {
    itemConf.component = conf.component || DEFAULT_TAG;
    itemConf.getDefProps = getPropsFn({});
  }

  DELETE_KEYS.forEach((k) => delete conf[k]);
  itemConf.jsx = conf;

  return itemConf;
}

function normConfigs(configs: CustomConfig[], typeMap: TypeMap) {
  return (configs || []).map((conf) => normalizeItemConfig(conf, typeMap));
}

// 计算表单项配置
// props 取值顺序是：typeMap.props -> item.props -> typeMap.getProps() -> item.getProps()
// 后面对象的同名属性会覆盖前面的对象的同名属性，使用的Object.assign实现
function computeFormItem(config: NormalizeConfig, form: {}, context: Vue): ItemConfig {
  // 返回结构体
  const item = {} as ItemConfig;
  Object.assign(item, config);

  const props = { ...config.getDefProps(form, config), ...config.getProps(form, config, context) };
  item.$$ifRender = config.ifRender(form, config, context);
  item.jsx.props = props;

  // form-item 配置
  return item;
}

function computeItems(configs: NormalizeConfig[], form: {}, context: Vue) {
  return (configs || []).map((conf) => computeFormItem(conf, form, context));
}

export { normConfigs, computeItems };
