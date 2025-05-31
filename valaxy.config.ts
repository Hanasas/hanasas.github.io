import type { UserThemeConfig } from 'valaxy-theme-yun'
import { defineValaxyConfig } from 'valaxy'

// add icons what you will need
const safelist = [
  'i-ri-home-line',
]

/**
 * User Config
 */
export default defineValaxyConfig<UserThemeConfig>({
  // site config see site.config.ts

  theme: 'yun',

  themeConfig: {
    banner: {
      enable: true,
      title: ['迷い','星','の','うた'],
    },

    bg_image: {
    enable: true,
    url: '/bg.png',
    dark: '/bg.png',
    opacity: 0.2
  },

  say: {
    enable: false,
    api: '',
    hitokoto: {
      enable: false,
      api: ''
    }
  },

    pages: [
      {
        name: '相册',
        url: '/albums/',
        icon: 'i-ri-image-line',
        color: 'dodgerblue',
      },
      // {
      //   name: '我的小伙伴们',
      //   url: '/links/',
      //   icon: 'i-ri-genderless-line',
      //   color: 'dodgerblue',
      // },
      // {
      //   name: '喜欢的女孩子',
      //   url: '/girls/',
      //   icon: 'i-ri-women-line',
      //   color: 'hotpink',
      // },
    ],

    footer: {
      since: 2020,
      beian: {
        enable: false,
        icp: '',
      },
    },
  },

  unocss: { safelist },
})
