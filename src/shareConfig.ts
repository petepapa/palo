export interface ShareChannel {
  name: string
  icon: string
  actionType: 'link' | 'modal'
  buildUrl?: (ctx: { url: string; title: string; description: string }) => string
  modalId?: string
  srText?: string
}

export const shareConfig: ShareChannel[] = [
  {
    name: 'X (Twitter)',
    icon: 'ph:twitter-logo',
    actionType: 'link',
    srText: 'Share on X (Twitter), opens in a new tab',
    buildUrl: ({ url, title, description }) => {
      const encodedUrl = encodeURIComponent(url)
      const text = title
        ? encodeURIComponent(`${title}${description ? ` - ${description}` : ''}`)
        : ''
      return text
        ? `https://x.com/share?url=${encodedUrl}&text=${text}`
        : `https://x.com/share?url=${encodedUrl}`
    },
  },
  {
    name: 'Facebook',
    icon: 'ph:facebook-logo',
    actionType: 'link',
    srText: 'Share on Facebook, opens in a new tab',
    buildUrl: ({ url }) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: 'Instagram',
    icon: 'ph:instagram-logo',
    actionType: 'link',
    srText: 'Share on Instagram, opens in a new tab',
    buildUrl: ({ url }) =>
      `https://www.instagram.com/?url=${encodeURIComponent(url)}`,
  },
  {
    name: 'LinkedIn',
    icon: 'ph:linkedin-logo',
    actionType: 'link',
    srText: 'Share on LinkedIn, opens in a new tab',
    buildUrl: ({ url }) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    name: 'Weibo',
    icon: 'fa6-brands:weibo',
    actionType: 'link',
    srText: 'Share on Weibo, opens in a new tab',
    buildUrl: ({ url, title }) =>
      `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  },
  {
    name: 'WeChat',
    icon: 'fa6-brands:weixin',
    actionType: 'modal',
    srText: 'Share on WeChat',
    modalId: 'palo-wechat-share-modal',
  },
  {
    name: 'Email',
    icon: 'ph:envelope',
    actionType: 'link',
    srText: 'Share via Email, opens in a new tab',
    buildUrl: ({ url, title, description }) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description || ''}\n\n${url}`)}`,
  },
]
