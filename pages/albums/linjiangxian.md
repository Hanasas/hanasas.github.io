---
title: 日常
date: 2020-04-18 16:27:24
updated: 2020-04-18 16:27:24
layout: post
galleryImages:
  - src: "/bg.png"
    alt: "图片描述1"
    title: ""
    description: "这是第一张图片的详细描述"
  - src: "/bg.png"
    alt: "图片描述2"
    title: ""
  - src: "/bg.png"
    alt: "图片描述3"
    title: "图片标题3"
    description: "这是第三张图片的描述"
galleryColumns:
  default: 2   # 默认大屏幕显示4列
  sm: 1        # 小屏幕显示3列
  xs: 1        # 超小屏幕显示2列
galleryGap: 15  # 可选：设置图片间距为15px
---

<YunGallery 
  :images="frontmatter.galleryImages" 
  :columns="frontmatter.galleryColumns"
  :gap="frontmatter.galleryGap"
/>