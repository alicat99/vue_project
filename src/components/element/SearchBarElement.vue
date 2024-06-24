<template>
    <div class="input-container">
      <div class="input-item">
        <input v-model="inputValue" autocomplete="off" @keydown.enter="submit">
        <button @click="submit" class="submit">검색</button>
      </div>
    </div>
</template>

<script setup>
  import { ref, defineEmits, defineExpose } from 'vue';
  
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
  border-radius: 10px;
  height: 30px;
  background-color: white;
  box-shadow: 0px 3px 7px var(--b4);
  padding: 0px;
  display: flex;
}
input {
  border: none;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  height: 100%;
  width: 50vw;
  background-color: transparent;
  flex-grow: 1;
  padding-left: 5px;
}
.submit {
  border: none;
  height: 100%;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  background-color: var(--p1);
  color: var(--b1);
  flex-shrink: 0;
}
</style>
