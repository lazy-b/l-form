<template>
  <div id="app">
    <Form />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Form from '@/components/form/demo/index.vue';

export default Vue.extend({
  name: 'App',
  components: {
    Form,
  },
});
</script>
