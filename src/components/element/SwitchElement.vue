<template>
  <panel-element-b class="riro-switch" v-on:click="riroSwitchClick">
    <div class="riro-switch-container">
      <div
        class="riro-switch-item"
        :style="{
          'color': !riroSwitch ? 'white' : 'var(--b4)'
        }"
      >
        리로스쿨에서 보기<br>
        <span class="description">(PC)</span>
      </div>
      <div
        class="riro-switch-item"
        :style="{
          'color': riroSwitch ? 'white' : 'var(--b4)'
        }"
      >
        숭실US에서 보기<br>
        <span class="description">(모바일 📱)</span>
      </div>
    </div>

    <div
      class="riro-switch-selector"
      :class="{
        'riro-switch-selector-enable': riroSwitch,
        'riro-switch-selector-disable': !riroSwitch,
      }"
    >
    </div>
  </panel-element-b>
</template>

<script setup>
import { defineModel, defineEmits } from 'vue';
import PanelElementB from './PanelElementB.vue';

const emit = defineEmits([
  'click',
]);

const riroSwitch = defineModel({ type: Boolean });

function riroSwitchClick() {
  riroSwitch.value = !riroSwitch.value;
  emit('click');
}
</script>

<style scoped>
.riro-switch {
  width: max-content;
  height: auto;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  padding: 10px;
}

.riro-switch-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.riro-switch-item{
  width: 130px;
  transition: color 0.5s ease;

  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* 인터넷익스플로러 */
  user-select: none;
}

.riro-switch-selector {
  width: 140px; 
  height: calc(100% - 10px);
  border-radius: 10px;
  position: absolute; 
  top: 50%;
  left: 5px;
  z-index: -1;
  transition: all 0.5s ease;
}

.riro-switch-selector-disable {
  transform: translate3d(0, -50%, 0);
  background-color: var(--riro);
}

.riro-switch-selector-enable {
  transform: translate3d(calc(100% - 10px), -50%, 0);
  background-color: var(--p2);
}

.description {
  font-size: 15px;
}
</style>