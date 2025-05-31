<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface GalleryImage {
  src: string
  alt?: string
  title?: string
  description?: string
}

const props = defineProps({
  // 画廊图片数组
  images: {
    type: Array as () => GalleryImage[],
    default: () => [], // 添加默认值为空数组
    required: false    // 改为非必需
  },
  // 列数配置，可针对不同屏幕尺寸设置
  columns: {
    type: Object,
    default: () => ({
      default: 3,  // 默认列数
      sm: 2,       // 小屏幕列数
      xs: 1        // 超小屏幕列数
    })
  },
  // 图片间距
  gap: {
    type: Number,
    default: 10
  }
})

// 是否有图片可显示
const hasImages = computed(() => props.images && props.images.length > 0)

// 当前查看的大图索引
const currentImageIndex = ref(-1)
// 是否显示大图预览
const showLightbox = computed(() => hasImages.value && currentImageIndex.value >= 0)
// 当前显示的大图信息
const currentImage = computed(() => showLightbox.value ? props.images[currentImageIndex.value] : null)

// 打开大图预览
function openLightbox(index: number) {
  currentImageIndex.value = index
  document.body.classList.add('overflow-hidden')
}

// 关闭大图预览
function closeLightbox() {
  currentImageIndex.value = -1
  document.body.classList.remove('overflow-hidden')
}

// 查看前一张图片
function prevImage() {
  if (currentImageIndex.value > 0)
    currentImageIndex.value--
  else
    currentImageIndex.value = props.images.length - 1
}

// 查看后一张图片
function nextImage() {
  if (currentImageIndex.value < props.images.length - 1)
    currentImageIndex.value++
  else
    currentImageIndex.value = 0
}

// 键盘导航
function handleKeyboard(event: KeyboardEvent) {
  if (!showLightbox.value) return
  
  switch (event.key) {
    case 'ArrowLeft':
      prevImage()
      break
    case 'ArrowRight':
      nextImage()
      break
    case 'Escape':
      closeLightbox()
      break
  }
}

// 添加键盘事件监听
onMounted(() => {
  window.addEventListener('keydown', handleKeyboard)
})

// 移除键盘事件监听
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyboard)
  // 确保body恢复正常
  document.body.classList.remove('overflow-hidden')
})
</script>

<template>
  <div class="yun-gallery">
    <!-- 无图片提示 -->
    <div v-if="!hasImages" class="no-images">
      <p>暂无图片</p>
    </div>
    
    <!-- 图片网格 -->
    <div v-else class="gallery-grid">
      <div
        v-for="(image, index) in images"
        :key="index"
        class="gallery-item"
        @click="openLightbox(index)"
      >
        <div class="img-wrapper">
          <img
            :src="image.src"
            :alt="image.alt || ''"
            loading="lazy"
            class="gallery-image"
          />
          <div v-if="image.title" class="img-overlay">
            <div class="img-title">{{ image.title }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 大图预览 -->
    <div v-if="showLightbox" class="lightbox" @click="closeLightbox">
      <div class="lightbox-content" @click.stop>
        <button class="nav-button prev" @click.stop="prevImage">&lt;</button>
        <img
          :src="currentImage?.src"
          :alt="currentImage?.alt || ''"
          class="lightbox-image"
        />
        <button class="nav-button next" @click.stop="nextImage">&gt;</button>
        <button class="close-button" @click.stop="closeLightbox">×</button>
        
        <div v-if="currentImage?.title || currentImage?.description" class="lightbox-info">
          <h3 v-if="currentImage?.title" class="lightbox-title">{{ currentImage.title }}</h3>
          <p v-if="currentImage?.description" class="lightbox-description">{{ currentImage.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.yun-gallery {
  width: 100%;
  
  .no-images {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    background-color: var(--va-c-bg-soft, #f9f9f9);
    border-radius: 8px;
    color: var(--va-c-text-2);
    font-size: 16px;
  }

  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(v-bind('columns.default'), 1fr);
    gap: v-bind('gap + "px"');
    
    @media (max-width: 768px) {
      grid-template-columns: repeat(v-bind('columns.sm'), 1fr);
    }
    
    @media (max-width: 480px) {
      grid-template-columns: repeat(v-bind('columns.xs'), 1fr);
    }
  }
  
  gallery-item {
    cursor: pointer;
    transition: transform 0.3s;
    overflow: hidden; // 这是关键，确保内容不超出边界
    border-radius: 8px; // 项目本身需要圆角
    
    &:hover {
      transform: translateY(-5px);
    }

    .img-wrapper {
      position: relative;
      overflow: hidden; // 双重保证内容不会溢出
      width: 100%;
      aspect-ratio: 16/9;
      border-radius: 8px; // 包装器也需要圆角
      background-color: transparent; // 确保没有背景色
      
      .gallery-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s;
        // 移除图片自身的圆角，让容器控制圆角
        border-radius: 0; 
      }
      
      .img-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
        padding: 10px;
        opacity: 0;
        transition: opacity 0.3s;
        border-bottom-left-radius: 8px; // 确保覆盖层底部也有圆角
        border-bottom-right-radius: 8px;
        
        .img-title {
          color: white;
          font-size: 14px;
          text-align: center;
        }
      }
      
      &:hover {
        .gallery-image {
          transform: scale(1.1);
        }
        
        .img-overlay {
          opacity: 1;
        }
      }
    }
  }
  
  .lightbox {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.9);
    
    .lightbox-content {
      position: relative;
      max-width: 90vw;
      max-height: 90vh;
      
      .lightbox-image {
        display: block;
        max-width: 100%;
        max-height: 80vh;
        object-fit: contain;
      }
      
      .nav-button {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        font-size: 20px;
        cursor: pointer;
        transition: background 0.3s;
        
        &:hover {
          background: rgba(255, 255, 255, 0.4);
        }
        
        &.prev {
          left: 10px;
        }
        
        &.next {
          right: 10px;
        }
      }
      
      .close-button {
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 30px;
        cursor: pointer;
      }
      
      .lightbox-info {
        padding: 10px;
        color: white;
        background-color: rgba(0, 0, 0, 0.5);
        
        .lightbox-title {
          margin: 0 0 5px;
          font-size: 16px;
        }
        
        .lightbox-description {
          margin: 0;
          font-size: 14px;
        }
      }
    }
  }
}
</style>