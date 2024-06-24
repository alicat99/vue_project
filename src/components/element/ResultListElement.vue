<template>
  <ul v-if="resultList.length">
    <router-link :to="{ name: 'Info', params: { id: item.name }}" v-for="(item, index) in resultList" :key="index" class="result-container">
      <div class="result-url">
        {{ item.name }}
      </div>
      <span v-if="item.problem" class="result-tag result-tag1">문제</span>
      <span v-if="item.answer" class="result-tag result-tag2">정답</span>
    </router-link>
  </ul>
</template>

<script setup>
  import { defineProps, defineEmits, computed } from 'vue';

  const props = defineProps({
    resultList: {
      type: Array,
      required: true
    }
  });

  const emit = defineEmits(['update:resultList']);

  const resultList = computed({
    get: () => props.resultList,
    set: (value) => emit('update:resultList', value)
  });
</script>

<style scoped>
.result-container {
  box-shadow: 0px 3px 5px var(--b4);
  background-color: #ffffff;
  border-radius: 10px;
  width: calc(100% - 20px);
  height: 30px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  padding: 10px;
  text-decoration-line: none;
}
ul {
  padding-left: 20px;
  padding-right: 20px;
}
.result-url {
  color: var(--p3);
  font-size: 15px;
  text-align: left;
}
.result-tag {
  background-color: #a08797;
  border-radius: 15px;
  padding-top: 3px;
  padding-bottom: 3px;
  margin-left: 7px;
  flex-basis: 50px;
  flex-grow: 0;
  flex-shrink: 0;
  color: var(--b1);
}
.result-tag1 {
  background-color: var(--p1);
}
.result-tag2 {
  background-color: var(--p3);
}
</style>