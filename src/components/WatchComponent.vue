<template>
    <div class="clock-container">
      <h4 class="q-mb-none q-ml-sm">Control de operación</h4>
      <q-card flat bordered class="q-pa-none q-ma-sm text-center clock-box">
        <q-card-section>
          <div class="text-white">{{ date }}</div>
          <div class="clock-text">{{ time }}</div>
        </q-card-section>
      </q-card>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'

const time = ref('')
let timer: NodeJS.Timeout | null = null
const date = ref<string>('')

onMounted(() => {
  timer = setInterval(updateClock, 1000)
  date.value = getCurrentDate()
})

onUnmounted(() => {
  if (timer !== null) {
    clearInterval(timer)
  }
})

function getCurrentTime() {
  const now = new Date()
  return now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function getCurrentDate() {
  const now = new Date()
  return now.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function updateClock() {
  time.value = getCurrentTime()
}
</script>
<style scoped>
.clock-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ccc;
}

.clock-box {
  background: rgba(0,0,0,.4);
}

.clock-text {
  font-size: 3rem;
  font-weight: bold;
  color: #fff;
  font-family: 'Arial', sans-serif;
}
</style>
