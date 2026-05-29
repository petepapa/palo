---
layout: ../layouts/MarkdownLayout.astro
title: Markdown Page
description: A clean content page powered by standard Markdown.
narrow: true

pageHeader:
  fullscreen: true
  contentColor: '#fff'
  backgroundImage: ''
  backgroundVideo: ''
  backgroundColor: 'red'
  backgroundFixed: false
  backgroundOverlayOpacity: 0.45
  topNavigationTheme: 'dark'
  paddingBlock: 3xl
  showDivider: true
  contentVerticalAlign: bottom
  textAlign: left
---

### Overview

Nearly all Markdown applications support the basic syntax outlined in the original Markdown design document. There are minor variations and discrepancies between Markdown processors — those are noted inline wherever possible.

几乎所有的 Markdown 应用程序都支持原始 Markdown 设计文档中概述的基本语法。不同的 Markdown 处理器之间存在细微的差异和不一致之处——这些差异和不一致之处会在文中尽可能予以注明。

### Headings

To create a heading, add number signs (#) in front of a word or phrase. The number of number signs you use should correspond to the heading level. For example, to create a heading level three (`<h3>`), use three number signs (e.g., ### My Header).

要创建标题，请在单词或短语前添加井号（#）。井号的数量应与标题级别相对应。例如，要创建三级标题（`<h3>`），请使用三个井号（例如：### 我的标题）。

# Heading level 1
## Heading level 2
### Heading level 3
#### Heading level 4
##### Heading level 5
###### Heading level 6

```markdown
# Heading level 1
## Heading level 2
### Heading level 3
#### Heading level 4
##### Heading level 5
###### Heading level 6
```

```html
<h1>Heading level 1</h1>
<h2>Heading level 2</h2>
<h3>Heading level 3</h3>
<h4>Heading level 4</h4>
<h5>Heading level 5</h5>
<h6>Heading level 6</h6>
```

### Alternate Syntax

Alternatively, on the line below the text, add any number of == characters for heading level 1 or -- characters for heading level 2.

或者，在文本下方的行中，输入任意数量的 == 字符以设置一级标题，或输入任意数量的 -- 字符以设置二级标题。

```markdown
Heading level 1
===============	
Heading level 2
---------------
```

```html
<h1>Heading level 1</h1>
<h2>Heading level 1</h2>
```

