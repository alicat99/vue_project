<template>
    <div class="input-container">
      <div class="input-item">
        <input-element-a
          class="input-input"
          v-model="inputValue"
          autocomplete="off"
          @enter="submit"
          style="
            border-top-right-radius: 0px;
            border-bottom-right-radius: 0px;
            box-shadow: none;
          "
        />
        <button-element-a
          @click="submit"
          class="input-button"
          style="
            border-top-left-radius: 0px;
            border-bottom-left-radius: 0px;
            box-shadow: none;
          "
        >
          검색
        </button-element-a>
      </div>
    </div>
</template>

<script setup>
  import { ref, defineEmits, defineExpose } from 'vue';
  import InputElementA from './InputElementA.vue';
  import ButtonElementA from './ButtonElementA.vue';
  
  const emit = defineEmits(['submit']);

  const inputValue = ref('');
  
  async function submit() {
    if (inputValue.value.length == 0) return;
    
    emit("submit", inputValue.value);
  }

  function setValue(newValue) {
    inputValue.value = newValue;
  }

  defineExpose({
    setValue
  })
</script>

<style scoped>
.input-container {
  height: 100px;
  display: flex;
  align-items: center;
}

.input-item {
  margin: 0 auto;
  height: 30px;
  padding: 0px;
  display: flex;

  border-radius: 10px;
  background-color: white;
  box-shadow: 0px 3px 7px var(--b4);
}

.input-input {
  height: 100%;
  width: 50vw;
}

.input-button {
  height: 110%;
  flex-shrink: 0;
}
</style>
