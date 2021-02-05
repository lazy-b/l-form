<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card header="简单场景">
          <SimpleForm />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card header="简单场景 - 带表单校验">
          <RulesForm />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="mt-20">
      <el-col :span="12">
        <el-card header="简单场景 - 自定义布局">
          <UiForm />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card header="简单场景 - 带表单联动">
          <LinkForm />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="mt-20">
      <el-col :span="12">
        <el-card header="简单场景 - 自定义提交按钮文本">
          <TextForm />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card header="简单场景 - 插槽">
          <SlotForm />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import SimpleForm from './simple.vue';
import RulesForm from './rules.vue';
import UiForm from './ui.vue';
import LinkForm from './link.vue';
import TextForm from './text.vue';
import SlotForm from './slot.vue';

export default Vue.extend({
  name: 'Demo',

  components: { SimpleForm, RulesForm, UiForm, LinkForm, TextForm, SlotForm },
});
</script>

<style scoped>
.mt-20 {
  margin-top: 20px;
}
</style>
