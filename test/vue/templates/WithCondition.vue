<template>
  <div>
    {{ condition }}
    <div v-if="condition">Yes!</div>
    <div v-else>No!</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    condition: Boolean
  }
});
</script>
