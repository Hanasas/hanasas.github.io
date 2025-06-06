<template>
  <div class="yun-ad-board">
    <AudioPlayer 
      src="http://music.163.com/song/media/outer/url?id=2071935587.mp3" 
      title="如果我们的语言是威士忌 - 格子斐斐 GOFI" 
      themeColor="#8E71C1"
    />
  </div>
</template>

<script>
import AudioPlayer from './audioPlayer.vue';

export default {
  name: 'YunAdBoard',
  components: {
    AudioPlayer
  }
}
</script>

<style scoped>
.yun-ad-board {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  margin: 16px 0;
  background-color: var(--el-color-primary-light-9, #f5f5f5);
}

@media (prefers-color-scheme: dark) {
  .yun-ad-board {
    background-color: var(--el-color-primary-light-1, #2a2a2a);
  }
}
</style>