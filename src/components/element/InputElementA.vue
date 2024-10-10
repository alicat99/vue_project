<template>
  <input
    :autocomplete="autocomplete"
    v-model="value"
    @keydown.enter="onEnter"
    :placeholder="placeholder"
    :type="type"
  />
</template>

<script setup>
import { defineProps, defineModel, defineEmits } from 'vue';

const props = defineProps({
  autocomplete: { type: String, required: false, default: 'off' },
  placeholder: { type: String, required: false, default: '' },
  type: { type: String, required: false, default: 'text' },
});

const value = defineModel({ type: String });

const emit = defineEmits([
  'enter',
]);

const onEnter = (event) => {
  emit('enter', event)
}
</script>

<style scoped>
input {
  border: none;
  border-radius: 10px;
  background-color: white;
  flex-grow: 1;
  padding: 1px 5px;
  box-shadow: 0px 3px 7px var(--b4);
}
</style>
