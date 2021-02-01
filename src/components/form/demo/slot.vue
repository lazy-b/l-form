<template>
  <!-- 简单场景 - 插槽 -->
  <LForm ref="rules" v-model="form" :config="config" label-width="100px" @submit="submit">
    <h3 slot="slot-name">我是自定义的表单项</h3>
    <h3 slot="slotField-name">我是表单项的自定义输入元素</h3>
    <h3>我是默认插槽</h3>
    <h3 slot="footer">我是自定义提交按钮</h3>
  </LForm>
</template>

<script lang="ts">
import Vue from 'vue';
import LForm from '../index';

export default Vue.extend({
  name: 'SlotDemo',

  components: { LForm },

  data() {
    return {
      form: {},

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
</script>
