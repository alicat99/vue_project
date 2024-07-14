<template>
  <div>
    <button @click="toggleContent">{{ showText }}</button>
    <div v-if="isOpen">
      <p>{{ content }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { defineProps } from 'vue';

// 부모 컴포넌트로부터 props를 받아옵니다.
const props = defineProps({
  showText: {
    type: String,
    default: '더보기'
  },
  content: {
    type: String,
    default: '여기에 더보기 내용을 작성하세요.'
  }
});

const isOpen = ref(false);

const toggleContent = () => {
  isOpen.value = !isOpen.value;
};
</script>

<style scoped>
/* 스타일을 여기에 추가하세요 */
button {
  border: 1px solid gray;
  border-radius: 10px;
  background-color: transparent;
}

div {
  transition: all 0.3s ease;
  font-size: small;
  color: gray;
}
</style>
