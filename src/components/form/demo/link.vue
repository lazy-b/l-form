<template>
  <!-- 简单场景 - 表单联动 -->
  <LForm ref="rules" v-model="form" :config="config" label-width="100px" @submit="submit"></LForm>
</template>

<script lang="ts">
import Vue from 'vue';
import LForm from '../index';

export default Vue.extend({
  name: 'LinkDemo',

  components: { LForm },

  data() {
    return {
      form: {},

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
</script>
