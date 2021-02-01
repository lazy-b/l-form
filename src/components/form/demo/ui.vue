<template>
  <!-- 简单场景 - 自定义布局 -->
  <LForm ref="ui" v-model="form" :config="config" label-width="100px" @submit="submit"></LForm>
</template>

<script lang="ts">
import Vue from 'vue';
import LForm from '../index';

export default Vue.extend({
  name: 'UiDemo',

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
</script>
