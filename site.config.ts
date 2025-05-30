import { defineSiteConfig } from 'valaxy'

const url = 'https://hanasas.github.io/'

export default defineSiteConfig({
  url: url,
  favicon:'/favicon.ico',
  lang: 'en',
  languages:['en','zh-CN'],
  timezone: 'Asia/Shanghai',
  title: 'Hanasas\'',
  author: {
    name: 'Hanasas',
    avatar: '/avatar.png',
    status: {
      emoji: '',
    },
  },
  subtitle: '大切な人といつかまた巡り会えますように',
  description: 'ACGN/Vtuber热爱者 学艺不精的独立设计师/开发者',
  social: [
    {
      name: 'RSS',
      link: '/atom.xml',
      icon: 'i-ri-rss-line',
      color: 'orange',
    },
    {
      name: 'QQ',
      link: 'https://qm.qq.com/q/oJxzGdDksg',
      icon: 'i-ri-qq-line',
      color: '#12B7F5',
    },
    {
      name: 'GitHub',
      link: 'https://github.com/Hanasas',
      icon: 'i-ri-github-line',
      color: '#6e5494',
    },
    {
      name: '网易云音乐',
      link: 'https://music.163.com/#/user/home?id=1349530851',
      icon: 'i-ri-netease-cloud-music-line',
      color: '#C20C0C',
    },
    {
      name: '哔哩哔哩',
      link: 'https://space.bilibili.com/215505279',
      icon: 'i-ri-bilibili-line',
      color: '#FF8EB3',
    },
    {
      name: 'E-Mail',
      link: 'gouchengouceq@163.com',
      icon: 'i-ri-mail-line',
      color: '#8E71C1',
    },
  ],

  search: {
    enable: false,
  },

  sponsor: {
    enable: false,
    title: '我很可爱，请给我钱！',
    methods: [
    ],
  },
})
