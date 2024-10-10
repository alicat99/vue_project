<template>
  <button @click="onClick" :class="{clicked: isClicked}">
    <slot></slot>
  </button>
</template>

<script setup>
import { defineEmits, defineProps, ref } from 'vue';

const isClicked = ref(false);

const emit = defineEmits([
  'click',
]);

const props = defineProps({
  usePause: { type: Boolean, required: false, default: false },
});

const onClick = (event) => {
  if (!props.usePause) {
    emit('click', event);
    return;
  }

  if (isClicked.value) {
    return;
  }

  isClicked.value = true;
  setTimeout(() => {
    isClicked.value = false;
  }, 3000);

  emit('click', event);
}
</script>

<style scoped>
button {
  border: none;
  border-radius: 10px;
  box-shadow: 0px 3px 7px var(--b4);
  background-color: var(--p1);
  color: var(--b1);
}

.clicked {
  background-color: gray;
}
</style>