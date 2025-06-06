<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  // 音频文件URL
  src: {
    type: String,
    required: true
  },
  // 音频标题
  title: {
    type: String,
    default: ''
  },
  // 是否自动播放
  autoplay: {
    type: Boolean,
    default: false
  },
  // 是否显示音量控制
  showVolume: {
    type: Boolean,
    default: true
  },
  // 主题颜色
  themeColor: {
    type: String,
    default: '#6e5494' // 默认主题色
  }
})

// 音频元素引用
const audioRef = ref<HTMLAudioElement | null>(null)
// 播放状态
const isPlaying = ref(false)
// 当前时间和总时间
const currentTime = ref('0:00')
const duration = ref('0:00')
// 进度条值
const progress = ref(0)
// 音量
const volume = ref(1)
// 加载状态
const isLoading = ref(true)

// 格式化时间为分:秒
const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

// 切换播放/暂停
const togglePlay = () => {
  if (!audioRef.value) return
  
  if (isPlaying.value) {
    audioRef.value.pause()
  } else {
    audioRef.value.play()
  }
  
  isPlaying.value = !isPlaying.value
}

// 更新进度
const updateProgress = () => {
  if (!audioRef.value) return
  
  const { currentTime: time, duration: total } = audioRef.value
  progress.value = (time / total) * 100
  currentTime.value = formatTime(time)
}

// 设置进度
const setProgress = (e: MouseEvent) => {
  if (!audioRef.value) return
  
  const progressBar = e.currentTarget as HTMLDivElement
  const clickPosition = e.offsetX
  const width = progressBar.clientWidth
  const percent = clickPosition / width
  
  audioRef.value.currentTime = percent * audioRef.value.duration
}

// 设置音量
const setVolume = (e: Event) => {
  if (!audioRef.value) return
  
  const vol = parseFloat((e.target as HTMLInputElement).value)
  audioRef.value.volume = vol
  volume.value = vol
}

// 监听音频加载完成
const handleLoadedMetadata = () => {
  if (!audioRef.value) return
  
  duration.value = formatTime(audioRef.value.duration)
  isLoading.value = false
  
  // 如果设置了自动播放且浏览器支持，则开始播放
  if (props.autoplay && audioRef.value.autoplay) {
    isPlaying.value = true
  }
}

// 监听播放结束
const handleEnded = () => {
  isPlaying.value = false
  progress.value = 0
  currentTime.value = '0:00'
  
  if (audioRef.value) {
    audioRef.value.currentTime = 0
  }
}

// 监听音频源变化
watch(() => props.src, () => {
  isLoading.value = true
  progress.value = 0
  currentTime.value = '0:00'
  
  // 重置音频状态
  if (audioRef.value) {
    audioRef.value.load()
  }
})

onMounted(() => {
  if (audioRef.value) {
    // 设置初始音量
    audioRef.value.volume = volume.value
  }
})
</script>

<template>
  <div class="audio-player" :style="{ '--theme-color': themeColor }">
    <div class="audio-title" v-if="title">{{ title }}</div>
    
    <div class="audio-controls">
      <button class="play-button" @click="togglePlay">
        <i v-if="isPlaying" class="i-ri-pause-fill"></i>
        <i v-else class="i-ri-play-fill"></i>
      </button>
      
      <div class="time">{{ currentTime }}</div>
      
      <div class="progress-container" @click="setProgress">
        <div class="progress-bar">
          <div class="progress-current" :style="{ width: `${progress}%` }"></div>
        </div>
      </div>
      
      <div class="time">{{ duration }}</div>
      
      <div class="volume-control" v-if="showVolume">
        <i class="i-ri-volume-up-line"></i>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          :value="volume" 
          @input="setVolume" 
          class="volume-slider"
        />
      </div>
    </div>
    
    <audio 
      ref="audioRef"
      :src="src"
      preload="metadata"
      @timeupdate="updateProgress"
      @loadedmetadata="handleLoadedMetadata"
      @ended="handleEnded"
    ></audio>
    
    <div v-if="isLoading" class="loading-message">
      <i class="i-ri-loader-4-line loading-icon"></i>
      加载中...
    </div>
  </div>
</template>

<style scoped>
.audio-player {
  width: 100%;
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 15px;
  margin: 15px 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  --theme-color: #6e5494;
}

.audio-title {
  font-weight: 500;
  margin-bottom: 10px;
  color: #333;
  font-size: 16px;
}

.audio-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.play-button {
  background: var(--theme-color);
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.play-button:hover {
  background: color-mix(in srgb, var(--theme-color), white 20%);
}

.time {
  font-size: 14px;
  color: #666;
  width: 35px;
  text-align: center;
}

.progress-container {
  flex-grow: 1;
  cursor: pointer;
  padding: 5px 0;
}

.progress-bar {
  height: 6px;
  background-color: #ddd;
  border-radius: 3px;
  position: relative;
  overflow: hidden;
}

.progress-current {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: var(--theme-color);
  transition: width 0.1s linear;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 5px;
}

.volume-slider {
  -webkit-appearance: none;
  width: 60px;
  height: 4px;
  background: #ddd;
  border-radius: 2px;
  outline: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--theme-color);
  cursor: pointer;
}

.loading-message {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 14px;
  padding: 5px 0;
  margin-top: 10px;
  gap: 5px;
}

.loading-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (prefers-color-scheme: dark) {
  .audio-player {
    background-color: #2a2a2a;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  }

  .audio-title {
    color: #e0e0e0;
  }

  .time {
    color: #b0b0b0;
  }

  .progress-bar {
    background-color: #555;
  }

  .volume-slider {
    background: #555;
  }

  .volume-slider::-webkit-slider-thumb {
    background: var(--theme-color);
  }

  .loading-message {
    color: #b0b0b0;
  }

  /* 确保所有图标在深色模式下具有正确的颜色 */
  i.i-ri-volume-up-line,
  i.i-ri-play-fill,
  i.i-ri-pause-fill,
  i.i-ri-loader-4-line {
    color: #e0e0e0;
  }

  /* 确保播放按钮在深色模式下仍然具有良好的对比度 */
  .play-button:hover {
    background: color-mix(in srgb, var(--theme-color), black 10%);
  }
}
</style>