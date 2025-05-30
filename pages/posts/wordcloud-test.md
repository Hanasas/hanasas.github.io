---
title: 词云测试
date: 2024-06-10
---

# 我的技术栈词云

<WordCloud :words="[
  { text: 'JavaScript', size: 40, color: '#f1e05a' },
  { text: 'TypeScript', size: 35, color: '#3178c6' },
  { text: 'Vue', size: 30, color: '#42b883' },
  { text: 'React', size: 28, color: '#61dafb' },
  { text: 'Node.js', size: 32, color: '#339933' },
  { text: 'HTML', size: 25, color: '#e34c26' },
  { text: 'CSS', size: 25, color: '#563d7c' },
  { text: 'Git', size: 22, color: '#f34f29' },
  { text: 'Python', size: 20, color: '#3572A5' },
  { text: 'Docker', size: 18, color: '#2496ED' }
]" :width="600" :height="400" />

# 我的兴趣词云

<WordCloud :words="[
  { text: '摄影', size: 40 },
  { text: '旅行', size: 36 },
  { text: '阅读', size: 32 },
  { text: '音乐', size: 30 },
  { text: '电影', size: 28 },
  { text: '写作', size: 25 },
  { text: '编程', size: 35 },
  { text: '动漫', size: 22 },
  { text: '游戏', size: 26 }
]" />