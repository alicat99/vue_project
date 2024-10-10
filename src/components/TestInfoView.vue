<template>
  <div class="container">
    <div class="title font-title">{{ testName }}</div>

    <ul class="file-container">
      <div v-for="(item, index) in fileList" :key="index">
        <button-element-a
          class="file-button"
          @click="openUrl(item.url, item.name)"
        >
          {{ item.name }}
        </button-element-a>
      </div>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getTestInfo } from './BackendRequest';
import ButtonElementA from './element/ButtonElementA.vue';

const route = useRoute();

const testName = ref('');
const fileList = ref([]);

function openUrl(url, name) {
  window.open(url, '_blank');
}

onMounted(async () => {
  if (route.params && route.params.id) {
    const id = route.params.id;
    const info = await getTestInfo(id);
    
    testName.value = info.name;

    fileList.value = info.files;
  }
})
</script>

<style scoped>
.title {
  margin-top: 30px;
  margin-bottom: 30px;

  font-size: 20px;
  color: var(--p3);
}

.file-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 10px;
}

.file-button {
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-top: 20px;
}
</style>
