<template>
  <div class="container">
    <div class="title font-title">{{ testName }}</div>

    <switch-element v-model="riroSwitch" @click="onSwitchClick"/>

    <ul class="file-container">
      <div v-for="(item, index) in fileList" :key="index">
        <button-element-a
          class="file-button"
          style="transition: all 0.5s ease;"
          :style="{
            'background-color': riroSwitch ? 'var(--p2)' : 'white',
            'box-shadow': riroSwitch ? '0px 3px 7px var(--b4)' : '0px 3px 7px var(--riro)',
            'color': riroSwitch ? 'var(--b1)' : 'var(--riro)',
          }"
          @click="openUrl(item.url, item.name)"
        >
          {{ item.name }}
        </button-element-a>
      </div>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getTestInfo } from './BackendRequest';
import SwitchElement from './element/SwitchElement.vue';
import ButtonElementA from './element/ButtonElementA.vue';

const route = useRoute();
const router = useRouter();
const $cookies = inject('$cookies');

const testName = ref('');
const fileList = ref([]);

const riroSwitch = ref(false);

function openUrl(url, name) {

  if (!riroSwitch.value) {
    window.open(url, '_blank');
    return;
  }

  const routeData = router.resolve({name: 'RiroBoard', params: {'url': window.btoa(url)}, query: {'name': name}});
  window.open(routeData.href, '_blank');
}

function onSwitchClick() {
  $cookies.set('riroSwitch', riroSwitch.value, '365d');
}

onMounted(async () => {
  if (route.params && route.params.id) {
    const id = route.params.id;
    const info = await getTestInfo(id);
    
    testName.value = info.name;

    fileList.value = info.files;
  }

  riroSwitch.value = $cookies.get('riroSwitch') == "true" ?? false;
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
