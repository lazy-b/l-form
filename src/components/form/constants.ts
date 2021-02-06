import { CustomConfig, NormalizeConfig, ItemConfig, TypeMap } from './index.d';

/* 一些常量、默认配置等 */

export const DEFAULT_TAG = 'div'; // 什么都无法匹配到时，回退的标签

// 内置的组件映射
export const INNER_COMPONENT: TypeMap = {
  slot: { component: 'slot' },
  slotField: { component: 'slotField' },
};

// el-form-item 支持的 prop V2.15.0版本
export const FORM_ITEM_PROP_KEYS = [
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
];

// 特殊的内置 key
export const INNER_CONFIG_KEYS = ['key', 'props', 'label', 'modifiers', 'ifRender'];

// 默认的表单类名
export const CLASS_PREFEX = 'l-form';

// 一些默认的标签名
export const FORM_TAG = 'el-form';
export const FORM_ITEM_TAG = 'el-form-item';
export const FOOTER_BUTTON_TAG = 'el-button';
