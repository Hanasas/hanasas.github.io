<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as d3 from 'd3'
// 由于直接引入可能有问题，我们会在onMounted中动态加载

const props = defineProps({
  words: {
    type: Array,
    default: () => [
      { text: 'Valaxy', size: 40 },
      { text: 'Vue', size: 35 },
      { text: '博客', size: 30 },
      { text: 'Markdown', size: 25 },
      { text: '前端', size: 30 },
      { text: 'TypeScript', size: 20 },
      { text: '设计', size: 18 },
      { text: '开发', size: 24 },
      { text: '技术', size: 22 },
      { text: '分享', size: 26 },
    ]
  },
  width: {
    type: Number,
    default: 500
  },
  height: {
    type: Number,
    default: 300
  },
  padding: {
    type: Number,
    default: 5
  },
  rotate: {
    type: Function,
    default: () => (Math.random() > 0.5 ? 0 : 90)
  },
  fontFamily: {
    type: String,
    default: 'sans-serif'
  },
  colorScheme: {
    type: Array,
    default: () => d3.schemeCategory10
  }
})

const wordCloud = ref<HTMLDivElement>()
const loaded = ref(false)

async function loadD3Cloud() {
  // 动态导入d3-cloud
  const d3CloudModule = await import('d3-cloud')
  return d3CloudModule.default
}

async function drawWordCloud() {
  if (!wordCloud.value || !loaded.value) return

  const d3Cloud = await loadD3Cloud()
  
  // 清空容器
  d3.select(wordCloud.value).selectAll("*").remove()

  // 创建SVG
  const svg = d3.select(wordCloud.value)
    .append("svg")
    .attr("width", props.width)
    .attr("height", props.height)
    .append("g")
    .attr("transform", `translate(${props.width / 2},${props.height / 2})`)

  // 创建布局
  const layout = d3Cloud()
    .size([props.width, props.height])
    .words(props.words.map(d => ({ 
      text: d.text, 
      size: d.size || 20,
      color: d.color
    })))
    .padding(props.padding)
    .rotate(props.rotate)
    .font(props.fontFamily)
    .fontSize(d => d.size)
    .on("end", draw)

  // 布局绘制
  layout.start()

  // 绘制词云
  function draw(words) {
    svg.selectAll("text")
      .data(words)
      .enter().append("text")
      .style("font-size", d => `${d.size}px`)
      .style("font-family", props.fontFamily)
      .style("fill", (d, i) => d.color || props.colorScheme[i % props.colorScheme.length])
      .attr("text-anchor", "middle")
      .attr("transform", d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
      .text(d => d.text)
      .on("mouseover", function() {
        d3.select(this).style("cursor", "pointer").style("font-size", d => `${d.size + 2}px`)
      })
      .on("mouseout", function() {
        d3.select(this).style("font-size", d => `${d.size}px`)
      })
  }
}

// 安装依赖后处理
onMounted(async () => {
  // 检查是否已安装d3和d3-cloud
  try {
    await loadD3Cloud()
    loaded.value = true
    drawWordCloud()
  } catch (err) {
    console.error("请安装必要的依赖：npm install d3 d3-cloud")
  }
})

watch(() => props.words, drawWordCloud, { deep: true })
</script>

<template>
  <div class="word-cloud-container">
    <div ref="wordCloud" class="word-cloud"></div>
    <div v-if="!loaded" class="loading-message">
      加载词云组件中...请确保已安装d3和d3-cloud依赖
    </div>
  </div>
</template>

<style scoped>
.word-cloud-container {
  width: 100%;
  margin: 0 auto;
  position: relative;
}
.word-cloud {
  width: 100%;
  height: 100%;
}
.loading-message {
  text-align: center;
  padding: 20px;
  color: #666;
}
</style>