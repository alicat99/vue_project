<template>
  <ul v-if="resultList.length">
    <panel-element-a v-for="(item, index) in resultList" :key="index" class="result-container">
      <router-link :to="{ name: 'Info', params: { id: item.name }}" class="result-url">
        {{ item.name }}
        
        <button
          v-if="item.problem"
          class="result-tag result-tag1"
        >
          문제
        </button>

        <button
          v-if="item.answer"
          class="result-tag result-tag2"
        >
          정답
        </button>
      </router-link>
    </panel-element-a>
  </ul>
</template>

<script setup>
import { defineModel } from 'vue';
import PanelElementA from './PanelElementA.vue';

const resultList = defineModel('resultList', {
  type: Array,
  required: true
});
</script>

<style scoped>
.result-container {
  display: flex;
  align-items: center;
  width: calc(100% - 20px);
  height: 30px;
  margin-top: 10px;
  padding: 10px;
}
ul {
  padding-left: 20px;
  padding-right: 20px;
}
.result-url {
  color: var(--p3);
  font-size: 15px;
  text-align: left;
  text-decoration-line: none;
  display: flex;
  align-items: center;
  flex-basis: 100%;
  flex-wrap: nowrap;
}
.result-tag {
  padding-top: 3px;
  padding-bottom: 3px;
  margin-left: 7px;
  flex-basis: 50px;
  flex-grow: 0;
  flex-shrink: 0;
  height: 25px;

  background-color: #a08797;
  border-radius: 15px;
  border: none;
  color: var(--b1);
}
.result-tag1 {
  background-color: var(--p1);
}
.result-tag2 {
  background-color: var(--p3);
}
</style>