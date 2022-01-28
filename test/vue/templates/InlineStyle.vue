<template>
  <div>
    <button class="global_style">Green</button>
    <button class="sfc_style">Red</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({});
</script>

<style>
.sfc_style {
  color: red;
}
</style>
