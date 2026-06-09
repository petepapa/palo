---
title: Mastering Navigation Configuration
description: A comprehensive guide to configuring the main navigation menu, including menu items, social links, and customization options
publishDate: 2026-06-09
author:
  name: "Pete"
  image: "/branding/avater.png"
  bio: "PetePa.com"
tags: ['Documentation', 'Configuration', 'Navigation']
coverImage: /posts/docs/cover04.jpg
coverImagePosition: head
showBreadcrumbs: true
customBreadcrumbLabels:
  "blog": "博客"
  "current": ""
joinLastBreadcrumb: false
source: "https://github.com/petepapa/palo"
liveDemo: "https://palo.petepa.com/"
showDivider: true
showTableOfContents: true
views: 800

---

### Introduction

The navigation menu is one of the most important elements of any website. It provides the primary way for users to discover and access different sections of your site. Palo makes it easy to customize your navigation through a simple configuration file.

Navigation 菜单是任何网站最重要的元素之一。它为用户提供了发现和访问网站不同部分的主要方式。Palo 通过简单的配置文件使自定义导航变得容易。

This guide will walk you through everything you need to know about configuring your site's navigation, from basic menu items to social links.

本指南将引导您了解配置网站导航所需的一切，从基本菜单项到社交链接。

---

### What is Navigation Configuration?

In Palo, all navigation settings are centralized in a single file: `src/navigation.ts`. This file exports two main arrays:

在 Palo 中，所有导航设置都集中在一个文件中：`src/navigation.ts`。该文件导出两个主要数组：

1. **`navigationItems`** - Main menu items displayed in the header
2. **`socialItems`** - Social media links shown in the launcher and utility menu

---

### Core Configuration Parameters

#### Navigation Items

The `navigationItems` array defines the main menu structure. Each item can be a simple link or a dropdown menu.

**Basic Link Structure**:

```typescript
{
  label: 'Menu Label',
  href: '/page-url',
}
```

**Dropdown Menu Structure**:

```typescript
{
  label: 'Dropdown Title',
  type: 'dropdown',
  items: [
    { label: 'Item 1', href: '/item-1' },
    { label: 'Item 2', href: '/item-2' },
  ],
}
```

**External Link with Icon**:

```typescript
{
  label: 'Go to GitHub, opens in new tab',
  href: 'https://github.com/your-repo',
  icon: 'ph:github-logo',
  external: true,
  excludeFromLauncher: true,
}
```

**Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `label` | `string` | Display text for the menu item |
| `href` | `string` | URL (internal path or external link) |
| `type` | `'dropdown'` | Creates a dropdown menu (optional) |
| `items` | `array` | Child items for dropdown menus |
| `icon` | `string` | Icon name from Phosphor Icons library |
| `external` | `boolean` | Opens link in new tab |
| `excludeFromLauncher` | `boolean` | Hide from launcher menu |

---

#### Social Items

The `socialItems` array defines links shown in the launcher and utility menu areas.

**Structure**:

```typescript
{
  label: 'Platform Name',
  href: 'https://platform-url',
  icon: 'ph:icon-name',
}
```

---

### Practical Examples

#### Example 1: Adding a Simple Menu Item

Add a new link to the main navigation:

```typescript
{
  label: 'About Us',
  href: '/about',
},
```

#### Example 2: Creating a Dropdown Menu

Create a dropdown with multiple related pages:

```typescript
{
  label: 'Products',
  type: 'dropdown',
  items: [
    { label: 'All Products', href: '/products' },
    { label: 'Featured', href: '/products/featured' },
    { label: 'New Arrivals', href: '/products/new' },
  ],
},
```

#### Example 3: Adding External Links with Icons

Add social media or external platform links:

```typescript
{
  label: 'Visit our YouTube channel',
  href: 'https://youtube.com/@your-channel',
  icon: 'ph:youtube-logo',
  external: true,
  excludeFromLauncher: true,
},
```

#### Example 4: Configuring Social Links

Customize which social platforms appear in the launcher:

```typescript
export const socialItems: SocialItem[] = [
  {
    label: 'GitHub',
    href: 'https://github.com/your-username',
    icon: 'ph:github-logo',
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@your-channel',
    icon: 'ph:youtube-logo',
  },
]
```

---

### Available Icons

Palo uses Phosphor Icons. You can find all available icons and learn how to use them in our [Phosphor Icons Guide](/blog/20260609-phosphor-icons-guide).

**Common Icons**:

| Icon | Icon Name | Use Case |
|------|-----------|----------|
| GitHub | `ph:github-logo` | GitHub profile/repo |
| YouTube | `ph:youtube-logo` | YouTube channel |
| Twitter/X | `ph:x-logo` | Twitter profile |
| Bluesky | `ph:chat-dots` | Bluesky profile |
| LinkedIn | `ph:linkedin-logo` | LinkedIn profile |
| Email | `ph:envelope` | Contact email |
| Open Collective | `ph:hands-praying` | Open Collective |

---

### AI-Assisted Navigation Setup

Don't want to deal with code directly? You can let AI help you configure the navigation!

**How it works**:

Simply tell the AI what you want, and it will modify the `src/navigation.ts` file for you. For example:

> "Add a Products dropdown menu with links to /products, /products/featured, and /products/new"

> "Change the GitHub link to point to https://github.com/myusername"

> "Add a YouTube link to my channel at youtube.com/@mychannel"

The AI can help you with:
- Adding, removing, or modifying menu items
- Creating dropdown menus
- Changing link destinations
- Adding social media links
- Reorganizing menu structure
- Updating icons

**Just describe what you need in plain language, and let AI handle the technical implementation!**

---

### Tips and Best Practices

1. **Keep Navigation Simple**: Don't overwhelm users with too many items. Group related content into dropdowns.
2. **Use Clear Labels**: Make menu item labels descriptive and easy to understand.
3. **Organize Logically**: Place most important items first, and group related items together.
4. **Consistent URL Structure**: Use clear, consistent URL patterns for internal links.
5. **External Link Indicators**: Use `external: true` to automatically open external links in new tabs.

1. **保持导航简洁**：不要用太多项目让用户不知所措。将相关内容分组到下拉菜单中。
2. **使用清晰的标签**：使菜单项标签描述清晰、易于理解。
3. **逻辑组织**：将最重要的项目放在首位，并将相关项目分组在一起。
4. **一致的 URL 结构**：对内部链接使用清晰、一致的 URL 模式。
5. **外部链接指示器**：使用 `external: true` 自动在新标签页中打开外部链接。

---

### Conclusion

Configuring your site's navigation is straightforward with Palo. Whether you prefer to edit the configuration file directly or work with AI to make changes, the process is designed to be simple and intuitive.

By organizing your content logically and keeping your navigation clean, you'll help users find what they're looking for quickly and easily.

请记住，通过逻辑地组织内容并保持导航简洁，您将帮助用户快速轻松地找到他们需要的内容。
