---
title: "Config Everything You Like"
description: "Explore Palo theme's powerful config.yaml configuration system - control your site's appearance, layout options, header and footer settings, branding, and feature toggles through simple parameter settings. No coding required"
publishDate: 2026-06-03
author:
  name: "Pete"
  image: "/branding/avatar.png"
  bio: "PetePa.com"
tags: ['Configuration', 'Palo Theme', 'Web Design', 'YAML']
coverImage: /posts/docs/config.png
coverImagePosition: head
breadcrumbs: true
customBreadcrumbLabels:
  "blog": "博客"
  "current": ""
joinLastBreadcrumb: false
source: "https://github.com/petepapa/palo"
liveDemo: "https://palo.petepa.com/"
divider: true
toc: true
views: 1842

---

### Introduction

Palo's `config.yaml` is a powerful configuration file that lets you customize every detail of your site without writing code. From brand colors to navigation styles, typography scales to border radius—all design decisions are centralized in one file.

Palo 的 `config.yaml` 是一个强大的配置文件，让你无需编写代码就能自定义网站的每个细节。从品牌颜色到导航样式，从排版比例到边框圆角，所有设计决策都集中在这一个文件中。

---

### What is config.yaml?

config.yaml is your website's design control center. Through simple parameter settings, you can quickly adjust the appearance and behavior of your site. All changes take effect in real-time during development, allowing you to see results immediately.

config.yaml 是你网站的设计控制中心。通过简单的参数设置，你可以快速调整网站的外观和行为，所有更改都会在开发过程中实时生效，让你可以立即看到效果。

---

### Core Features

#### Site Configuration

In the `site` section, you can set up basic site information and core feature toggles.

在 `site` 部分，你可以设置网站的基本信息和核心功能开关。

```yaml
site:
  name: Palo
  titleSeparator: '|'
  trailingSlash: false
  defaultTheme: auto
  darkModeToggle: true
  launcher: true
```

| Parameter | Description | 说明 |
|-----------|-------------|------|
| `name` | Site name displayed in header and titles | 网站名称，会显示在页头和页面标题中 |
| `titleSeparator` | Page title separator, e.g. "About | Palo" | 页面标题的分隔符，例如 "关于我们 | Palo" |
| `trailingSlash` | Controls if URLs end with a slash | 控制 URL 是否以斜杠结尾 |
| `defaultTheme` | Default theme: `auto`, `light`, or `dark` | 默认主题：`auto`（跟随系统）、`light`（浅色）或 `dark`（深色） |
| `darkModeToggle` | Show/hide dark mode toggle button | 是否显示深色模式切换按钮 |
| `launcher` | Enable Cmd+K / Ctrl+K quick launcher | 启用 Cmd+K / Ctrl+K 快捷启动器 |

---

#### Branding System

The `branding` section lets you define your site's visual identity, including colors and typography.

`branding` 部分让你定义网站的视觉识别，包括颜色和字体。

```yaml
branding:
  logoLight: 'branding/logo-light.svg'
  logoDark: 'branding/logo-dark.svg'
  logoSize: '40px'
  
  colors:
    primary: '#ff4b00'
    secondary: '#632a1b'
    neutral: '#75878a'
    outline: '#ffffff'
    info: '#177cb0'
    success: '#00bc12'
    warning: '#ffa631'
    error: '#f00056'
  
  font:
    name: 'League Spartan'
    path: '/fonts/League_Spartan/'
    weights:
      body: 300
      accent: 500
      heading: 600
    capHeightOffset: '-0.10em'
```

**Color Configuration / 颜色配置：**

| Parameter | Description | 说明 |
|-----------|-------------|------|
| `primary` | Primary brand color for buttons, links | 主品牌色，用于按钮、链接等主要交互元素 |
| `secondary` | Secondary brand color for accents | 辅助品牌色，用于次要强调 |
| `neutral` | Neutral color for text, borders, backgrounds | 中性色，用于文字、边框和背景 |
| `outline` | Accessibility focus outline color | 无障碍焦点轮廓色，确保键盘导航时焦点清晰可见 |
| `info` | Information state color | 信息提示颜色 |
| `success` | Success state color | 成功提示颜色 |
| `warning` | Warning state color | 警告提示颜色 |
| `error` | Error state color | 错误提示颜色 |

**Font Configuration / 字体配置：**

| Parameter | Description | 说明 |
|-----------|-------------|------|
| `name` | Font family name | 字体族名称 |
| `path` | Font file directory path | 字体文件目录路径 |
| `weights.body` | Body text font weight | 正文文字粗细 |
| `weights.accent` | Accent text weight (nav, buttons, labels) | 强调文字粗细（导航、按钮、标签等） |
| `weights.heading` | Heading text weight | 标题文字粗细 |
| `capHeightOffset` | Vertical alignment offset for checkbox/radio | 复选框/单选框与标签的垂直对齐微调 |

---

#### Navigation Settings

The `navigation` section lets you fine-tune the navigation experience.

`navigation` 部分让你精细调整导航体验。

**Fixed Header / 固定顶栏：**

```yaml
navigation:
  fixedHeader: true
  minHeight: '6rem'
  headerBackgroundOpacity: 0.45
  headerBackgroundBlur: 10px
  mobileMenuLabel: false
```

| Parameter | Description | 说明 |
|-----------|-------------|------|
| `fixedHeader` | Stays visible while scrolling | 是否启用固定顶栏，滚动时始终可见 |
| `minHeight` | Minimum header height | 导航栏最小高度 |
| `headerBackgroundOpacity` | Background opacity (0-1) | 背景透明度（0 为完全透明，1 为完全不透明） |
| `headerBackgroundBlur` | Background blur strength in px | 背景模糊程度（像素值） |
| `mobileMenuLabel` | Show Menu/Close text on mobile | 是否在汉堡菜单旁显示文字标签 |

**Menu Layout / 菜单布局：**

```yaml
navigation:
  desktopMenuAlignment: 'center'
  dropdownDesktopColorMode: 'inverse'
```

| Parameter | Options | Description | 说明 |
|-----------|---------|-------------|------|
| `desktopMenuAlignment` | `left`, `center`, `right` | Desktop menu alignment | 桌面端菜单对齐方式 |
| `dropdownDesktopColorMode` | `theme`, `inverse` | Dropdown color scheme | 桌面端下拉菜单配色 |

**Font Sizes / 文字大小：**

```yaml
navigation:
  desktopFontSize: 'lg'
  dropdownDesktopFontSize: 'md'
  mobileFontSize: 'xl'
  dropdownMobileFontSize: 'lg'
  mainMenuLineHeightScale: 1.25
  dropdownMenuLineHeightScale: 0.85
```

| Parameter | Description | 说明 |
|-----------|-------------|------|
| `desktopFontSize` | Desktop main navigation size | 桌面端主导航文字大小 |
| `dropdownDesktopFontSize` | Desktop dropdown menu size | 桌面端下拉菜单文字大小 |
| `mobileFontSize` | Mobile expanded menu size | 移动端展开菜单文字大小 |
| `dropdownMobileFontSize` | Mobile dropdown menu size | 移动端下拉菜单文字大小 |
| `mainMenuLineHeightScale` | Main nav line-height multiplier | 主导航行高缩放倍数 |
| `dropdownMenuLineHeightScale` | Dropdown line-height multiplier | 下拉菜单行高缩放倍数 |

**Active Style / 激活样式：**

```yaml
navigation:
  activeStyle: 'bold'
```

| Option | Description | 说明 |
|--------|-------------|------|
| `wavy` | Elegant wavy underline | 波浪下划线 |
| `underline` | Clean solid underline | 实线下划线 |
| `bold` | Bold weight with hover underline | 加粗字体，悬停显示下划线 |

---

#### Layout Settings

The `layout` section controls the overall page structure.

`layout` 部分控制页面整体结构。

```yaml
layout:
  containerMaxWidth: '1536px'
```

| Parameter | Description | 说明 |
|-----------|-------------|------|
| `containerMaxWidth` | Max content width (px, rem, %) | 内容区域最大宽度，支持像素、rem 或百分比单位 |

---

#### Typography System

The `typography` section lets you create harmonious text hierarchy.

`typography` 部分让你创建和谐的文字层次。

```yaml
typography:
  baseFontSize: '16px'
  lineHeightScale: 1.0
  uppercaseDisplayText: true
  mobileHeadingScale: 1.25
  desktopHeadingScale: 1.65
  headingLineHeightScale: 0.85
```

| Parameter | Description | 说明 |
|-----------|-------------|------|
| `baseFontSize` | Root font size (1rem = this value) | 基准字号，全站 1rem 等于此值 |
| `lineHeightScale` | Line height multiplier | 行高缩放倍数 |
| `uppercaseDisplayText` | Force headings/UI text to uppercase | 是否将标题和界面文字强制大写 |
| `mobileHeadingScale` | Mobile heading scale ratio | 移动端标题缩放比例 |
| `desktopHeadingScale` | Desktop heading scale ratio | 桌面端标题缩放比例 |
| `headingLineHeightScale` | Heading line height adjustment | 标题行高微调 |

The heading scale uses a geometric progression formula: `h1 = 1rem × scale⁵, h2 = 1rem × scale⁴, h3 = 1rem × scale³...`

标题会根据缩放比例自动计算大小，从 h1 到 h6 呈现完美的层次关系。公式：`h1 = 1rem × scale⁵, h2 = 1rem × scale⁴, h3 = 1rem × scale³...`

---

#### Border System

The `border` section lets you uniformly control all border widths.

`border` 部分让你统一控制所有边框粗细。

```yaml
border:
  global: '0.1rem'
  
  # Component-specific (empty = inherit global)
  button: ''
  form: '0.075rem'
  card: ''
  accordion: ''
  tabs: ''
  badge: '0.075rem'
  avatar: ''
  notification: ''
  pagination: '0.1rem'
  toggle: '0.1rem'
  media: '0'
  surface: '0.1rem'
  codeBlock: '0'
  divider: '0.075rem'
```

| Parameter | Description | 说明 |
|-----------|-------------|------|
| `global` | Site-wide default border width | 全站默认边框粗细 |
| `button` | Buttons and button-like links | 按钮和按钮型链接 |
| `form` | Inputs, selects, checkboxes | 输入框、选择框、复选框等 |
| `card` | Card components | 卡片 |
| `accordion` | Accordion panels | 折叠面板 |
| `tabs` | Tab components | 标签页 |
| `badge` | Badge components | 徽章 |
| `avatar` | Avatar images | 头像 |
| `notification` | Notification messages | 通知 |
| `pagination` | Pagination buttons | 分页按钮 |
| `toggle` | Toggle switches | 切换按钮 |
| `media` | Images | 图片 |
| `surface` | Dropdowns, panels, surfaces | 下拉菜单、面板等容器 |
| `codeBlock` | Code blocks | 代码块 |
| `divider` | Dividers | 分隔线 |

Leave component-specific values empty to inherit from the global default.

如果留空，组件会继承全局默认值。

---

#### Radius System

The `radius` section lets you uniformly control all border radius sizes.

`radius` 部分让你统一控制所有圆角大小。

```yaml
radius:
  global: '0.75rem'
  
  # Component-specific (empty = inherit global)
  button: ''
  form: ''
  card: '1.5rem'
  media: ''
  tabs: '1rem'
  badge: '0.25rem'
  notification: ''
  avatar: ''
  pagination: '0.5rem'
  toggle: '0.5rem'
  surface: ''
  codeBlock: '0.25rem'
```

| Parameter | Description | 说明 |
|-----------|-------------|------|
| `global` | Site-wide default radius | 全站默认圆角大小 |
| `button` | Buttons, button-like links | 按钮和按钮型链接 |
| `form` | Form elements | 表单元素 |
| `card` | Cards, feature blocks | 卡片、特征区块 |
| `media` | Images | 图片 |
| `tabs` | Tab components | 标签页 |
| `badge` | Badge components | 徽章 |
| `notification` | Notification messages | 通知 |
| `avatar` | Avatar images | 头像 |
| `pagination` | Pagination buttons | 分页按钮 |
| `toggle` | Toggle switches | 切换按钮 |
| `surface` | Dropdowns, panels, surfaces | 下拉菜单、面板等容器 |
| `codeBlock` | Code blocks | 代码块 |

Similarly, leave component-specific values empty to inherit from the global default.

同样，如果留空，组件会继承全局默认值。

---

### Practical Examples

#### Minimalist Portfolio / 极简主义作品集

```yaml
site:
  name: 'Alex Chen'
  defaultTheme: 'light'
  darkModeToggle: false

branding:
  colors:
    primary: '#1a1a1a'
    secondary: '#632a1b'
    neutral: '#75878a'

typography:
  uppercaseDisplayText: false
  desktopHeadingScale: 1.3
```

#### Creative Studio / 创意工作室

```yaml
site:
  name: 'Neon Studio'
  defaultTheme: 'dark'

branding:
  colors:
    primary: '#ff00ff'
    secondary: '#00ffff'

navigation:
  activeStyle: 'wavy'
  headerBackgroundBlur: 20px

radius:
  global: '0'
  card: '0'
```

#### Corporate Business / 企业商务

```yaml
site:
  name: 'TechCorp'
  launcher: false

branding:
  colors:
    primary: '#0052cc'
    success: '#00875a'
    warning: '#ffab00'
    error: '#de350b'

navigation:
  activeStyle: 'underline'
  desktopMenuAlignment: 'left'
```

---

### Pro Tips

1. **Start with defaults** - Begin with the sample config and make small, incremental changes
2. **Use the dev server** - Run development mode to see changes in real-time
3. **Test accessibility** - Ensure contrast ratios work well in both light and dark modes
4. **Leverage inheritance** - Leave values empty for components that should use global defaults
5. **Add comments** - Document your design decisions in the config file

1. **从默认值开始** - 先使用示例配置，然后进行小的、渐进式的调整
2. **使用开发服务器** - 运行开发模式实时查看更改效果
3. **测试可访问性** - 确保对比度在浅色和深色模式下都足够清晰
4. **利用继承** - 对应该使用全局默认值的组件留空即可
5. **添加注释** - 在配置文件中添加注释记录你的设计决策

---

### Accessibility First

The config.yaml system was designed with accessibility from day one:

config.yaml 系统从设计之初就考虑了无障碍：

- The `outline` color ensures keyboard focus is always visible
- 焦点轮廓色确保键盘导航时焦点始终清晰可见

- Semantic state colors provide consistent meaning for buttons, alerts, and form validation
- 语义化状态颜色提供一致的含义，帮助用户理解界面

- Dark mode support respects user system preferences
- 深色模式支持尊重用户的系统偏好

- Type scaling maintains readability across all viewport sizes
- 字体缩放确保在各种屏幕尺寸下都保持良好的可读性

---

### Conclusion

config.yaml makes website customization simple and delightful. By centralizing all design decisions in one file, your site becomes more maintainable, consistent, and accessible. Whether you're building a personal portfolio, a creative agency site, or a corporate business page, Palo's configuration system helps you quickly achieve your ideal design.

config.yaml 让网站定制变得简单而愉快。通过将所有设计决策集中在一个文件中，你的网站会更易于维护、更一致、更易访问。无论你是在搭建个人作品集、创意工作室网站还是企业展示页面，Palo 的配置系统都能帮你快速实现理想的设计效果。

Happy configuring!

开始配置吧！🎨
