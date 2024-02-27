<template>
  <div>{{ name }}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { props } from './props';

export default defineComponent({
  props
});
</script>
