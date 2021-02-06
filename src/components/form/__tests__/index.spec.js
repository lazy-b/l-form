import { createLocalVue, mount } from '@vue/test-utils';
import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import SimpleForm from '../demo/simple';
import RulesForm from '../demo/rules';
import InlineForm from '../demo/inline';
import UiForm from '../demo/ui';
import LinkForm from '../demo/link';
import TextForm from '../demo/text';
import SlotForm from '../demo/slot';
import DemoContainer from '../demo';

const localVue = createLocalVue();
localVue.use(ElementUI);

test('DemoContainer', () => {
  const wrapper = mount(DemoContainer, { localVue });
  expect(wrapper).toMatchSnapshot();
});
test('SimpleForm', () => {
  const wrapper = mount(SimpleForm, { localVue });
  expect(wrapper).toMatchSnapshot();
});
test('InlineForm', () => {
  const wrapper = mount(InlineForm, { localVue });
  expect(wrapper).toMatchSnapshot();
});
test('RulesForm', () => {
  const wrapper = mount(RulesForm, { localVue });
  expect(wrapper).toMatchSnapshot();
});
test('UiForm', () => {
  const wrapper = mount(UiForm, { localVue });
  expect(wrapper).toMatchSnapshot();
});
test('LinkForm', () => {
  const wrapper = mount(LinkForm, { localVue });
  expect(wrapper).toMatchSnapshot();
});
test('TextForm', () => {
  const wrapper = mount(TextForm, { localVue });
  expect(wrapper).toMatchSnapshot();
});
test('SlotForm', () => {
  const wrapper = mount(SlotForm, { localVue });
  expect(wrapper).toMatchSnapshot();
});
