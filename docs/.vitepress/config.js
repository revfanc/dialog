export default {
  base: '/dialog/',
  title: '@revfanc/dialog',
  description: 'A Vue.js dialog component',
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/' },
      { text: '配置', link: '/config/' },
      { text: 'GitHub', link: 'https://github.com/revfanc/dialog' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '基础用法', link: '/guide/basic-usage' },
            { text: '高级用法', link: '/guide/advanced-usage' }
          ]
        }
      ],
      '/config/': [
        {
          text: '配置',
          items: [
            { text: '配置参考', link: '/config/' },
            { text: '属性', link: '/config/props' },
            { text: '方法', link: '/config/methods' },
            { text: '事件', link: '/config/events' }
          ]
        }
      ]
    }
  },
  vite: {
    base: '/dialog/'
  }
}
