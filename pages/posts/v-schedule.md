---
title: Victoria日程表自动翻译脚本 
date: 2024-06-07
updated: 2024-06-07
categories: Vtuber
tags:
  - Vtuber
  - script
top: 1
cover: /vschedule/victoria.jpg
excerpt: "vivi, wish you all the best"
excerptAlign: center  # center left right justify
---

> 隶属于 vtuber 团体 nijisanji 的 Victoria Brightshield 已于2024年10月24日毕业，由是本项目失去应用场景

[此项目](https://github.com/Hanasas/auto_Vivi_schedule)是一个用于在字幕组日常工作中将英语日程表便捷翻译制图的python脚本，效果如下所示

<div style="display: flex; gap: 10px;">
  <img src="/vschedule/input.png" width="49%">
  <img src="/vschedule/output.png" width="49%">
</div>

## Requirements

[python3](https://www.python.org/downloads/) needed

Pillow needed

```
pip install Pillow
```

## examples

cmd input

```
python3 GUItest.py
```

add input.png to the program

<img src="/vschedule/input.png">

feedin the blanks

<img src="/vschedule/blanks.png">

and find the `output.png` in project root directory

<img src="/vschedule/output.png">

## TODO

double streams in one day

words to long to mask

add comments so that one can use this to work with other livers' schedule
