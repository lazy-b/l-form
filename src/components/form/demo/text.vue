<template>
  <!-- 简单场景 - 自定义提交按钮文本 -->
  <LForm ref="rules" v-model="form" :config="config" label-width="100px" @submit="submit"></LForm>
</template>

<script lang="ts">
import Vue from 'vue';
import LForm from '../index';

export default Vue.extend({
  name: 'TextDemo',

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
</script>
