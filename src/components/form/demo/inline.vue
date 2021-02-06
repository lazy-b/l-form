<template>
  <!-- 简单场景 - inline 表单 -->
  <LForm ref="inline" inline :config="config" label-width="100px" @submit="submit"></LForm>
</template>

<script lang="ts">
import Vue from 'vue';
import LForm from '../index';

export default Vue.extend({
  name: 'InlineDemo',

  components: { LForm },

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
    submit(form: object) {
      this.$message.info(`提交：${JSON.stringify(form)}`);
    },
  },
});
</script>
