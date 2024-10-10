<template>
  <ul v-if="resultList.length">
    <panel-element-a v-for="(item, index) in visibleList" :key="index" class="result-container">
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
import { ref, onMounted, onUnmounted, defineProps, watch } from 'vue';
import PanelElementA from './PanelElementA.vue';

const props = defineProps({
  resultList: {
    type: Array,
    required: true
  }
});

const visibleList = ref([]);
const chunkSize = 50; // 한 번에 로드할 아이템 수
let currentIndex = 0;

const loadMore = () => {
  if (currentIndex >= props.resultList.length) return;
  visibleList.value = visibleList.value.concat(
    props.resultList.slice(currentIndex, currentIndex + chunkSize)
  );
  currentIndex += chunkSize;
};

const onScroll = () => {
  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;
  const fullHeight = document.body.offsetHeight;

  if (scrollTop + windowHeight >= fullHeight - 100) { // 100px 여유
    loadMore();
  }
};

onMounted(() => {
  loadMore();
  window.addEventListener('scroll', onScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});

watch(
  () => props.resultList,
  (newList, oldList) => {
    visibleList.value = [];
    currentIndex = 0;
    loadMore();
  },
  { immediate: true, deep: true }
);
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