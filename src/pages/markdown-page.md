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

#### Alternate Syntax

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
<h2>Heading level 2</h2>
```

#### Heading Best Practices

Markdown applications don't agree on how to handle a missing space between the number signs (#) and the heading name. For compatibility, always put a space between the number signs and the heading name.

Markdown 应用程序对于如何处理井号（#）和标题名称之间缺少空格的问题意见不一。为了兼容性，请始终在井号和标题名称之间留一个空格。

| ✅ Do this | ❌ Don't do this |
|-----------|----------------|
| # Here's a Heading | #Here's a Heading |

You should also put blank lines before and after a heading for compatibility.

为了兼容性，你还应该在标题前后留空行。

| ✅ Do this | ❌ Don't do this |
|-----------|----------------|
| Try to put a blank line before...<br><br># Heading<br><br>...and after a heading. | Without blank lines, this might not look right.<br># Heading<br>Don't do this! |

### Paragraphs

To create paragraphs, use a blank line to separate one or more lines of text.

要创建段落，请使用空行分隔一行或多行文本。

I really like using Markdown.

I think I'll use it to format all of my documents from now on.

```markdown
I really like using Markdown.

I think I'll use it to format all of my documents from now on.
```

```html
<p>I really like using Markdown.</p>
<p>I think I'll use it to format all of my documents from now on.</p>
```

#### Paragraph Best Practices

Unless the paragraph is in a list, don't indent paragraphs with spaces or tabs.

除非段落位于列表中，否则不要使用空格或制表符缩进段落。

**Note:** If you need to indent paragraphs in the output, see the section on how to indent (tab).

**注意：** 如果你需要在输出中缩进段落，请参阅关于如何缩进（制表符）的部分。

| ✅ Do this | ❌ Don't do this |
|-----------|----------------|
| Don't put tabs or spaces in front of your paragraphs.<br><br>Keep lines left-aligned like this. | This can result in unexpected<br>formatting problems.<br><br>Don't add tabs or spaces in front of paragraphs. |

### Line Breaks

To create a line break or new line (`<br>`), end a line with two or more spaces, and then type return.

要创建换行符或新行（`<br>`），请在一行末尾添加两个或多个空格，然后按回车。

This is the first line.  
And this is the second line.

```markdown
This is the first line.  
And this is the second line.
```

```html
<p>This is the first line.<br><br>And this is the second line.</p>
```

#### Line Break Best Practices

You can use two or more spaces (commonly referred to as "trailing whitespace") for line breaks in nearly every Markdown application, but it's controversial. It's hard to see trailing whitespace in an editor, and many people accidentally or intentionally put two spaces after every sentence. For this reason, you may want to use something other than trailing whitespace for line breaks. If your Markdown application supports HTML, you can use the `<br>` HTML tag.

你可以在几乎所有的 Markdown 应用程序中使用两个或多个空格（通常称为"尾随空白"）来换行，但这是有争议的。在编辑器中很难看到尾随空白，而且许多人会在每个句子后意外或故意放置两个空格。因此，你可能希望使用尾随空白以外的方式来换行。如果你的 Markdown 应用程序支持 HTML，你可以使用 `<br>` HTML 标签。

For compatibility, use trailing white space or the `<br>` HTML tag at the end of the line.

为了兼容性，请在一行末尾使用尾随空白或 `<br>` HTML 标签。

There are two other options I don't recommend using. CommonMark and a few other lightweight markup languages let you type a backslash (`\`) at the end of the line, but not all Markdown applications support this, so it isn't a great option from a compatibility perspective. And at least a couple lightweight markup languages don't require anything at the end of the line — just type return and they'll create a line break.

还有另外两个我不推荐使用的选项。CommonMark 和其他一些轻量级标记语言允许你在一行末尾输入反斜杠（`\`），但并非所有 Markdown 应用程序都支持此功能，因此从兼容性角度来看，这不是一个好的选择。而且至少有几个轻量级标记语言不需要在一行末尾添加任何内容——只需按回车，它们就会创建一个换行符。

| ✅ Do this | ❌ Don't do this |
|-----------|----------------|
| First line with two spaces after.  <br>And the next line.<br><br>First line with the HTML tag after.<br><br>And the next line. | First line with a backslash after.\<br>And the next line.<br><br>First line with nothing after.<br>And the next line. |

### Emphasis

You can add emphasis by making text bold or italic.

你可以通过将文本加粗或斜体来添加强调。

#### Bold

To bold text, add two asterisks or underscores before and after a word or phrase. To bold the middle of a word for emphasis, add two asterisks without spaces around the letters.

要加粗文本，请在单词或短语前后添加两个星号或下划线。要强调单词的中间部分，请在字母周围添加两个星号，不要留空格。

I just love **bold text**.

I just love __bold text__.

Love**is**bold

```markdown
I just love **bold text**.
I just love __bold text__.
Love**is**bold
```

```html
I just love <strong>bold text</strong>.
I just love <strong>bold text</strong>.
Love<strong>is</strong>bold
```

##### Bold Best Practices

Markdown applications don't agree on how to handle underscores in the middle of a word. For compatibility, use asterisks to bold the middle of a word for emphasis.

Markdown 应用程序对于如何处理单词中间的下划线意见不一。为了兼容性，请使用星号来加粗单词中间的部分以进行强调。

| ✅ Do this | ❌ Don't do this |
|-----------|----------------|
| Love**is**bold | Love__is__bold |

#### Italic

To italicize text, add one asterisk or underscore before and after a word or phrase. To italicize the middle of a word for emphasis, add one asterisk without spaces around the letters.

要斜体化文本，请在单词或短语前后添加一个星号或下划线。要斜体化单词的中间部分以进行强调，请在字母周围添加一个星号，不要留空格。

Italicized text is the *cat's meow*.

Italicized text is the _cat's meow_.

A*cat*meow

```markdown
Italicized text is the *cat's meow*.
Italicized text is the _cat's meow_.
A*cat*meow
```

```html
Italicized text is the <em>cat's meow</em>.
Italicized text is the <em>cat's meow</em>.
A<em>cat</em>meow
```

##### Italic Best Practices

Markdown applications don't agree on how to handle underscores in the middle of a word. For compatibility, use asterisks to italicize the middle of a word for emphasis.

Markdown 应用程序对于如何处理单词中间的下划线意见不一。为了兼容性，请使用星号来斜体化单词中间的部分以进行强调。

| ✅ Do this | ❌ Don't do this |
|-----------|----------------|
| A*cat*meow | A_cat_meow |

#### Bold and Italic

To emphasize text with bold and italics at the same time, add three asterisks or underscores before and after a word or phrase. To bold and italicize the middle of a word for emphasis, add three asterisks without spaces around the letters.

要同时以粗体和斜体强调文本，请在单词或短语前后添加三个星号或下划线。要同时加粗和斜体化单词的中间部分以进行强调，请在字母周围添加三个星号，不要留空格。

This text is ***really important***.

This text is ___really important___.

This text is __*really important*__.

This text is **_really important_**.

This is really***very***important text.

```markdown
This text is ***really important***.
This text is ___really important___.
This text is __*really important*__.
This text is **_really important_**.
This is really***very***important text.
```

```html
This text is <em><strong>really important</strong></em>.
This text is <em><strong>really important</strong></em>.
This text is <em><strong>really important</strong></em>.
This text is <em><strong>really important</strong></em>.
This is really<em><strong>very</strong></em>important text.
```

**Note:** The order of the `em` and `strong` tags might be reversed depending on the Markdown processor you're using.

**注意：** `em` 和 `strong` 标签的顺序可能会根据你使用的 Markdown 处理器而颠倒。

##### Bold and Italic Best Practices

Markdown applications don't agree on how to handle underscores in the middle of a word. For compatibility, use asterisks to bold and italicize the middle of a word for emphasis.

Markdown 应用程序对于如何处理单词中间的下划线意见不一。为了兼容性，请使用星号来同时加粗和斜体化单词中间的部分以进行强调。

| ✅ Do this | ❌ Don't do this |
|-----------|----------------|
| This is really***very***important text. | This is really___very___important text. |

### Blockquotes

To create a blockquote, add a `>` in front of a paragraph.

要创建块引用，请在段落前添加 `>`。

> Dorothy followed her through many of the beautiful rooms in her castle.

```markdown
> Dorothy followed her through many of the beautiful rooms in her castle.
```

```html
<blockquote>
  <p>Dorothy followed her through many of the beautiful rooms in her castle.</p>
</blockquote>
```

#### Blockquotes with Multiple Paragraphs

Blockquotes can contain multiple paragraphs. Add a `>` on the blank lines between the paragraphs.

块引用可以包含多个段落。在段落之间的空行上添加 `>`。

> Dorothy followed her through many of the beautiful rooms in her castle.
>
> The Witch bade her clean the pots and kettles and sweep the floor and keep the fire fed with wood.

```markdown
> Dorothy followed her through many of the beautiful rooms in her castle.
>
> The Witch bade her clean the pots and kettles and sweep the floor and keep the fire fed with wood.
```

```html
<blockquote>
  <p>Dorothy followed her through many of the beautiful rooms in her castle.</p>
  <p>The Witch bade her clean the pots and kettles and sweep the floor and keep the fire fed with wood.</p>
</blockquote>
```

#### Nested Blockquotes

Blockquotes can be nested. Add a `>>` in front of the paragraph you want to nest.

块引用可以嵌套。在你要嵌套的段落前添加 `>>`。

> Dorothy followed her through many of the beautiful rooms in her castle.
>
>> The Witch bade her clean the pots and kettles and sweep the floor and keep the fire fed with wood.

```markdown
> Dorothy followed her through many of the beautiful rooms in her castle.
>
>> The Witch bade her clean the pots and kettles and sweep the floor and keep the fire fed with wood.
```

```html
<blockquote>
  <p>Dorothy followed her through many of the beautiful rooms in her castle.</p>
  <blockquote>
    <p>The Witch bade her clean the pots and kettles and sweep the floor and keep the fire fed with wood.</p>
  </blockquote>
</blockquote>
```

#### Blockquotes with Other Elements

Blockquotes can contain other Markdown formatted elements. Not all elements can be used — you'll need to experiment to see which ones work.

块引用可以包含其他 Markdown 格式的元素。并非所有元素都可以使用——你需要尝试看看哪些有效。

> #### The quarterly results look great!
>
> - Revenue was off the chart.
> - Profits were higher than ever.
>
> *Everything* is going according to **plan**.

```markdown
> #### The quarterly results look great!
>
> - Revenue was off the chart.
> - Profits were higher than ever.
>
> *Everything* is going according to **plan**.
```

```html
<blockquote>
  <h4>The quarterly results look great!</h4>
  <ul>
    <li>Revenue was off the chart.</li>
    <li>Profits were higher than ever.</li>
  </ul>
  <p><em>Everything</em> is going according to <strong>plan</strong>.</p>
</blockquote>
```

#### Blockquotes Best Practices

For compatibility, put blank lines before and after blockquotes.

为了兼容性，请在块引用前后留空行。

| ✅ Do this | ❌ Don't do this |
|-----------|----------------|
| Try to put a blank line before...<br><br>> This is a blockquote<br><br>...and after a blockquote. | Without blank lines, this might not look right.<br>> This is a blockquote<br>Don't do this! |

### Lists

You can organize items into ordered and unordered lists.

你可以将项目组织成有序列表和无序列表。

#### Ordered Lists

To create an ordered list, add line items with numbers followed by periods. The numbers don't have to be in numerical order, but the list should start with the number one.

要创建有序列表，请添加带有数字后跟句点的列表项。数字不必按数字顺序排列，但列表应以数字 1 开头。

1. First item
2. Second item
3. Third item
4. Fourth item

1. First item
1. Second item
1. Third item
1. Fourth item

1. First item
8. Second item
3. Third item
5. Fourth item

1. First item
2. Second item
3. Third item
   1. Indented item
   2. Indented item
4. Fourth item

```markdown
1. First item
2. Second item
3. Third item
4. Fourth item
```

```markdown
1. First item
1. Second item
1. Third item
1. Fourth item
```

```markdown
1. First item
8. Second item
3. Third item
5. Fourth item
```

```markdown
1. First item
2. Second item
3. Third item
   1. Indented item
   2. Indented item
4. Fourth item
```

```html
<ol>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
  <li>Fourth item</li>
</ol>
```

##### Ordered List Best Practices

CommonMark and a few other lightweight markup languages let you use a parenthesis (`)`) as a delimiter (e.g., `1) First item`), but not all Markdown applications support this, so it isn't a great option from a compatibility perspective. For compatibility, use periods only.

CommonMark 和其他一些轻量级标记语言允许你使用括号（`)`）作为分隔符（例如 `1) First item`），但并非所有 Markdown 应用程序都支持此功能，因此从兼容性角度来看，这不是一个好的选择。为了兼容性，请仅使用句点。

| ✅ Do this | ❌ Don't do this |
|-----------|----------------|
| 1. First item<br>2. Second item | 1) First item<br>2) Second item |

#### Unordered Lists

To create an unordered list, add dashes (`-`), asterisks (`*`), or plus signs (`+`) in front of line items. Indent one or more items to create a nested list.

要创建无序列表，请在列表项前添加破折号（`-`）、星号（`*`）或加号（`+`）。缩进一个或多个项目以创建嵌套列表。

- First item
- Second item
- Third item
- Fourth item

* First item
* Second item
* Third item
* Fourth item

+ First item
+ Second item
+ Third item
+ Fourth item

- First item
- Second item
- Third item
  - Indented item
  - Indented item
- Fourth item

```markdown
- First item
- Second item
- Third item
- Fourth item
```

```markdown
* First item
* Second item
* Third item
* Fourth item
```

```markdown
+ First item
+ Second item
+ Third item
+ Fourth item
```

```markdown
- First item
- Second item
- Third item
  - Indented item
  - Indented item
- Fourth item
```

```html
<ul>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
  <li>Fourth item</li>
</ul>
```

##### Starting Unordered List Items With Numbers

If you need to start an unordered list item with a number followed by a period, you can use a backslash (`\`) to escape the period.

如果你需要用数字后跟句点开始一个无序列表项，你可以使用反斜杠（`\`）来转义句点。

- 1968\. A great year!
- I think 1969 was second best.

```markdown
- 1968\. A great year!
- I think 1969 was second best.
```

```html
<ul>
  <li>1968. A great year!</li>
  <li>I think 1969 was second best.</li>
</ul>
```

##### Unordered List Best Practices

Markdown applications don't agree on how to handle different delimiters in the same list. For compatibility, don't mix and match delimiters in the same list — pick one and stick with it.

Markdown 应用程序对于如何处理同一列表中的不同分隔符意见不一。为了兼容性，不要在同一列表中混合和匹配分隔符——选择一个并坚持使用它。

| ✅ Do this | ❌ Don't do this |
|-----------|----------------|
| - First item<br>- Second item<br>- Third item<br>- Fourth item | + First item<br>* Second item<br>- Third item<br>+ Fourth item |

#### Adding Elements in Lists

To add another element in a list while preserving the continuity of the list, indent the element four spaces or one tab, as shown in the following examples.

要在列表中添加另一个元素同时保持列表的连续性，请将该元素缩进四个空格或一个制表符，如以下示例所示。

**Tip:** If things don't appear the way you expect, double check that you've indented the elements in the list four spaces or one tab.

**提示：** 如果事情没有按照你期望的方式显示，请仔细检查你是否已将列表中的元素缩进四个空格或一个制表符。

##### Paragraphs

* This is the first list item.
* Here's the second list item.

    I need to add another paragraph below the second list item.

* And here's the third list item.

```markdown
* This is the first list item.
* Here's the second list item.

    I need to add another paragraph below the second list item.

* And here's the third list item.
```

##### Blockquotes

* This is the first list item.
* Here's the second list item.

    > A blockquote would look great below the second list item.

* And here's the third list item.

```markdown
* This is the first list item.
* Here's the second list item.

    > A blockquote would look great below the second list item.

* And here's the third list item.
```

##### Code Blocks

Code blocks are normally indented four spaces or one tab. When they're in a list, indent them eight spaces or two tabs.

代码块通常缩进四个空格或一个制表符。当它们在列表中时，请将它们缩进八个空格或两个制表符。

1. Open the file.
2. Find the following code block on line 21:

        <html>
          <head>
            <title>Test</title>
          </head>

3. Update the title to match the name of your website.

```markdown
1. Open the file.
2. Find the following code block on line 21:

        <html>
          <head>
            <title>Test</title>
          </head>

3. Update the title to match the name of your website.
```

##### Images

1. Open the file containing the Linux mascot.
2. Marvel at its beauty.

    ![Tux, the Linux mascot](https://mdg.imgix.net/assets/images/tux.png)

3. Close the file.

```markdown
1. Open the file containing the Linux mascot.
2. Marvel at its beauty.

    ![Tux, the Linux mascot](https://mdg.imgix.net/assets/images/tux.png)

3. Close the file.
```

##### Lists

You can nest an unordered list in an ordered list, or vice versa.

你可以在有序列表中嵌套无序列表，反之亦然。

1. First item
2. Second item
3. Third item
   - Indented item
   - Indented item
4. Fourth item

```markdown
1. First item
2. Second item
3. Third item
   - Indented item
   - Indented item
4. Fourth item
```

### Code

To denote a word or phrase as code, enclose it in backticks (`` ` ``).

要将单词或短语表示为代码，请将其括在反引号（`` ` ``）中。

At the command prompt, type `nano`.

```markdown
At the command prompt, type `nano`.
```

```html
At the command prompt, type <code>nano</code>.
```

### Escaping Backticks

If the word or phrase you want to denote as code includes one or more backticks, you can escape it by enclosing the word or phrase in double backticks (`` ```` ``).

如果你要表示为代码的单词或短语包含一个或多个反引号，你可以通过将单词或短语括在双反引号（`` ```` ``）中来转义它。

`` Use `code` in your Markdown file. ``

```markdown
`` Use `code` in your Markdown file. ``
```

```html
<code>Use `code` in your Markdown file.</code>
```

### Code Blocks

To create code blocks, indent every line of the block by at least four spaces or one tab.

要创建代码块，请将块的每一行缩进至少四个空格或一个制表符。

    <html>
      <head>
      </head>
    </html>

```markdown
    <html>
      <head>
      </head>
    </html>
```

```html
<pre><code>&lt;html&gt;
  &lt;head&gt;
  &lt;/head&gt;
&lt;/html&gt;
</code></pre>
```

### Fenced Code Blocks

The basic Markdown syntax allows you to create code blocks by indenting lines by four spaces or one tab. If you find that inconvenient, try using fenced code blocks. Depending on your Markdown processor or editor, you'll use three backticks (```` ``` ````) or three tildes (```` ~~~ ````) on the lines before and after the code block. The best part? You don't have to indent any lines!

基本的 Markdown 语法允许你通过将行缩进四个空格或一个制表符来创建代码块。如果你觉得不方便，尝试使用围栏代码块。根据你的 Markdown 处理器或编辑器，你将在代码块前后的行上使用三个反引号（```` ``` ````）或三个波浪号（```` ~~~ ````）。最好的部分？你不必缩进任何行！

```
{
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
```

```markdown
```
{
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
```
```

### Syntax Highlighting

Many Markdown processors support syntax highlighting for fenced code blocks. This feature allows you to add color highlighting for whatever language your code was written in. To add syntax highlighting, specify a language next to the backticks before the fenced code block.

许多 Markdown 处理器支持围栏代码块的语法高亮。此功能允许你为代码编写的任何语言添加颜色高亮。要添加语法高亮，请在围栏代码块前的反引号旁边指定一种语言。

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
```

```markdown
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
```
```

## Links

To create a link, enclose the link text in brackets (e.g., `[Duck Duck Go]`) and then follow it immediately with the URL in parentheses (e.g., `(https://duckduckgo.com)`).

要创建链接，请将链接文本括在方括号中（例如 `[Duck Duck Go]`），然后立即紧跟在括号中的 URL 后面（例如 `(https://duckduckgo.com)`）。

My favorite search engine is [Duck Duck Go](https://duckduckgo.com).

```markdown
My favorite search engine is [Duck Duck Go](https://duckduckgo.com).
```

```html
My favorite search engine is <a href="https://duckduckgo.com">Duck Duck Go</a>.
```

### Adding Titles

You can optionally add a title for a link. This will appear as a tooltip when the user hovers over the link. To add a title, enclose it in parentheses after the URL.

你可以选择为链接添加标题。当用户将鼠标悬停在链接上时，这将显示为工具提示。要添加标题，请将其括在 URL 后面的括号中。

My favorite search engine is [Duck Duck Go](https://duckduckgo.com "The best search engine for privacy").

```markdown
My favorite search engine is [Duck Duck Go](https://duckduckgo.com "The best search engine for privacy").
```

```html
My favorite search engine is <a href="https://duckduckgo.com" title="The best search engine for privacy">Duck Duck Go</a>.
```

### URLs and Email Addresses

To quickly turn a URL or email address into a link, enclose it in angle brackets.

要快速将 URL 或电子邮件地址转换为链接，请将其括在尖括号中。

<https://www.markdownguide.org>
<fake@example.com>

```markdown
<https://www.markdownguide.org>
<fake@example.com>
```

```html
<a href="https://www.markdownguide.org">https://www.markdownguide.org</a>
<a href="mailto:fake@example.com">fake@example.com</a>
```

### Formatting Links

To emphasize links, add asterisks before and after the brackets and parentheses. To denote links as code, add backticks in between the brackets.

要强调链接，请在方括号和括号前后添加星号。要将链接表示为代码，请在方括号之间添加反引号。

I love supporting the **[EFF](https://eff.org)**.
This is the *[Markdown Guide](https://www.markdownguide.org)*.
See the section on [`code`](#code).

```markdown
I love supporting the **[EFF](https://eff.org)**.
This is the *[Markdown Guide](https://www.markdownguide.org)*.
See the section on [`code`](#code).
```

```html
I love supporting the <strong><a href="https://eff.org">EFF</a></strong>.
This is the <em><a href="https://www.markdownguide.org">Markdown Guide</a></em>.
See the section on <a href="#code"><code>code</code></a>.
```

### Reference-style Links

Reference-style links are a special kind of link that make URLs easier to display and read in Markdown. Reference-style links are constructed in two parts: the part you keep inline with your text and the part you store somewhere else in the file to keep the text easy to read.

引用式链接是一种特殊类型的链接，它使 URL 在 Markdown 中更易于显示和阅读。引用式链接由两部分构成：与文本保持内联的部分，以及你存储在文件其他地方以保持文本易于阅读的部分。

#### Formatting the First Part of the Link

The first part of a reference-style link is formatted with two sets of brackets. The first set of brackets surrounds the text that should appear linked. The second set of brackets displays a label used to point to the link you're storing elsewhere in your document.

引用式链接的第一部分使用两组方括号格式化。第一组方括号包围应显示为链接的文本。第二组方括号显示一个标签，用于指向你存储在文档其他地方的链接。

Although not required, you can include a space between the first and second set of brackets. The label in the second set of brackets is not case sensitive and can include letters, numbers, spaces, or punctuation.

虽然不是必需的，但你可以在第一组和第二组方括号之间包含一个空格。第二组方括号中的标签不区分大小写，可以包含字母、数字、空格或标点符号。

This means the following example formats are roughly equivalent for the first part of the link:

这意味着以下示例格式对于链接的第一部分大致等效：

- `[hobbit-hole][1]`
- `[hobbit-hole] [1]`

#### Formatting the Second Part of the Link

The second part of a reference-style link is formatted with the following attributes:

引用式链接的第二部分使用以下属性格式化：

1. The label, in brackets, followed immediately by a colon and at least one space (e.g., `[label]: `).
2. The URL for the link, which you can optionally enclose in angle brackets.
3. The optional title for the link, which you can enclose in double quotes, single quotes, or parentheses.

1. 标签，用方括号括起来，后面紧跟冒号和至少一个空格（例如 `[label]: `）。
2. 链接的 URL，你可以选择将其括在尖括号中。
3. 链接的可选标题，你可以将其括在双引号、单引号或括号中。

This means the following example formats are all roughly equivalent:

这意味着以下示例格式都大致等效：

- `[1]: https://en.wikipedia.org/wiki/Hobbit#Lifestyle`
- `[1]: https://en.wikipedia.org/wiki/Hobbit#Lifestyle "Hobbit lifestyles"`
- `[1]: https://en.wikipedia.org/wiki/Hobbit#Lifestyle 'Hobbit lifestyles'`
- `[1]: https://en.wikipedia.org/wiki/Hobbit#Lifestyle (Hobbit lifestyles)`
- `[1]: <https://en.wikipedia.org/wiki/Hobbit#Lifestyle> "Hobbit lifestyles"`
- `[1]: <https://en.wikipedia.org/wiki/Hobbit#Lifestyle> 'Hobbit lifestyles'`
- `[1]: <https://en.wikipedia.org/wiki/Hobbit#Lifestyle> (Hobbit lifestyles)`

You can place this second part of the link anywhere in your Markdown document. Some people place them immediately after the paragraph in which they appear while other people place them at the end of the document (like endnotes or footnotes).

你可以将链接的第二部分放在 Markdown 文档的任何位置。有些人将它们紧挨着它们出现的段落放置，而其他人将它们放在文档末尾（像尾注或脚注）。

#### An Example Putting the Parts Together

Say you add a URL as a standard URL link to a paragraph and it looks like this in Markdown:

假设你将 URL 作为标准 URL 链接添加到段落中，它在 Markdown 中看起来像这样：

```markdown
In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends
of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to
eat: it was a [hobbit-hole](https://en.wikipedia.org/wiki/Hobbit#Lifestyle "Hobbit lifestyles"), and that means comfort.
```

Though it may point to interesting additional information, the URL as displayed really doesn't add much to the existing raw text other than making it longer. To fix that, you could format the URL like this instead:

虽然它可能指向有趣的附加信息，但显示的 URL 确实不会为现有原始文本添加太多内容，除了使其更长。要解决这个问题，你可以像这样格式化 URL：

```markdown
In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends
of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to
eat: it was a [hobbit-hole][1], and that means comfort.

[1]: https://en.wikipedia.org/wiki/Hobbit#Lifestyle "Hobbit lifestyles"
```

In both instances above, the rendered output would be identical:

在上面的两个实例中，渲染输出将是相同的：

> In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat: it was a hobbit-hole, and that means comfort.

and the HTML for the link would be:

并且链接的 HTML 将是：

```html
<a href="https://en.wikipedia.org/wiki/Hobbit#Lifestyle" title="Hobbit lifestyles">hobbit-hole</a>
```

### Link Best Practices

Markdown applications don't agree on how to handle spaces in the middle of a URL. For compatibility, try to URL encode any spaces with `%20`.

Markdown 应用程序对于如何处理 URL 中间的空格意见不一。为了兼容性，请尝试使用 `%20` 对任何空格进行 URL 编码。

Alternatively, if your Markdown application supports HTML, you could use the `a` HTML tag.

或者，如果你的 Markdown 应用程序支持 HTML，你可以使用 `a` HTML 标签。

| ✅ Do this | ❌ Don't do this |
|-----------|----------------|
| [link](https://www.example.com/my%20great%20page) | [link](https://www.example.com/my great page) |
| `<a href="https://www.example.com/my great page">link</a>` | |

Another thing to watch out for is that you need to use parentheses if you want a link to have a title. For compatibility, enclose the URL in angle brackets.

需要注意的另一件事是，如果你希望链接有标题，你需要使用括号。为了兼容性，请将 URL 括在尖括号中。

## Images

To add an image, add an exclamation mark (`!`), followed by alt text in brackets, and the path or URL to the image asset in parentheses. You can optionally add a title in quotation marks after the path or URL.

要添加图像，请添加感叹号（`!`），后面跟方括号中的替代文本，以及圆括号中图像资源的路径或 URL。你可以选择在路径或 URL 之后用引号添加标题。

![The San Juan Mountains are beautiful!](https://mdg.imgix.net/assets/images/san-juan-mountains.jpg "San Juan Mountains")

```markdown
![The San Juan Mountains are beautiful!](https://mdg.imgix.net/assets/images/san-juan-mountains.jpg "San Juan Mountains")
```

```html
<img src="https://mdg.imgix.net/assets/images/san-juan-mountains.jpg" alt="The San Juan Mountains are beautiful!" title="San Juan Mountains">
```

### Linking Images

To add a link to an image, enclose the Markdown for the image in brackets, and then add the link in parentheses.

要向图像添加链接，请将图像的 Markdown 括在方括号中，然后在圆括号中添加链接。

[![An old rock in the desert](https://mdg.imgix.net/assets/images/shiprock.jpg "Shiprock, New Mexico by Beau Rogers")](https://www.flickr.com/photos/beaurogers/31833779864/in/photolist-Qv3rFw-34mt9F-a9Cmfy-5Ha3ZX-6UJ82V-7KdAVi-9dM3pA-6zW24A-4kYAy8-4MkTzK-7H1m92-9qz9cB-7UcJ1E-8y9f7P-87D5qG-7D6Gv8-6k3j8B-9mF6b2-8y5g4j-7j3zP9-7y4X7H-9qGmYq-5WjX5G-9nLxQe-6jQ156-9mF5QV-9mF43P-9mF5Hk-9mEUX4-9mF3Sf-9mEUKc-9mETU5-9mF24T-9mESZk-9mF1sA-9mERxW-9mF0Xh-9mEQpG-9mEZk8-9mEWXz-9mF6nU-9mEYns-9mEU9V-9mEXrT-9mEV9P-9mEWmE-9mEUfs-9mEY7V-9mEVnE-9mEW9L-9mEXnE-9mEY1M-9mEZ4Y-9mEU4M-9mEVnL-9mEW6U-9mEX9A-9mEYfL-9mEZrT-9mEUv4-9mEV7A-9mEWjL-9mEXxM-9mEYr4-9mEZsA-9mEUa4-9mEVfL-9mEWrM-9mEX9Q-9mEYe4-9mEZ8A-9mEUn4-9mEVtL-9mEWbM-9mEXjQ-9mEYp4-9mEZiA-9mEU94-9mEVvL-9mEWnM-9mEXfQ-9mEYn4-9mEZgA-9mEUb4-9mEVnL-9mEWkM-9mEXiQ-9mEYo4-9mEZhA-9mEUc4-9mEVpL-9mEWmM-9mEXkQ-9mEYq4-9mEZjA)

```markdown
[![An old rock in the desert](https://mdg.imgix.net/assets/images/shiprock.jpg "Shiprock, New Mexico by Beau Rogers")](https://www.flickr.com/photos/beaurogers/31833779864/in/photolist-Qv3rFw-34mt9F-a9Cmfy-5Ha3ZX-6UJ82V-7KdAVi-9dM3pA-6zW24A-4kYAy8-4MkTzK-7H1m92-9qz9cB-7UcJ1E-8y9f7P-87D5qG-7D6Gv8-6k3j8B-9mF6b2-8y5g4j-7j3zP9-7y4X7H-9qGmYq-5WjX5G-9nLxQe-6jQ156-9mF5QV-9mF43P-9mF5Hk-9mEUX4-9mF3Sf-9mEUKc-9mETU5-9mF24T-9mESZk-9mF1sA-9mERxW-9mF0Xh-9mEQpG-9mEZk8-9mEWXz-9mF6nU-9mEYns-9mEU9V-9mEXrT-9mEV9P-9mEWmE-9mEUfs-9mEY7V-9mEVnE-9mEW9L-9mEXnE-9mEY1M-9mEZ4Y-9mEU4M-9mEVnL-9mEW6U-9mEX9A-9mEYfL-9mEZrT-9mEUv4-9mEV7A-9mEWjL-9mEXxM-9mEYr4-9mEZsA-9mEUa4-9mEVfL-9mEWrM-9mEX9Q-9mEYe4-9mEZ8A-9mEUn4-9mEVtL-9mEWbM-9mEXjQ-9mEYp4-9mEZiA-9mEU94-9mEVvL-9mEWnM-9mEXfQ-9mEYn4-9mEZgA-9mEUb4-9mEVnL-9mEWkM-9mEXiQ-9mEYo4-9mEZhA-9mEUc4-9mEVpL-9mEWmM-9mEXkQ-9mEYq4-9mEZjA)
```

## Tables

To add a table, use three or more hyphens (`---`) to create each column's header, and use pipes (`|`) to separate each column. For compatibility, you should also add a pipe on either end of the row.

要添加表格，请使用三个或更多连字符（`---`）来创建每列的标题，并使用管道符（`|`）来分隔每列。为了兼容性，你还应该在行的两端添加一个管道符。

| Syntax | Description |
| ----------- | ----------- |
| Header | Title |
| Paragraph | Text |

```markdown
| Syntax | Description |
| ----------- | ----------- |
| Header | Title |
| Paragraph | Text |
```

### Alignment

You can align text in the columns to the left, right, or center by adding a colon (`:`) to the left, right, or on both side of the hyphens within the header row.

你可以通过在标题行的连字符左侧、右侧或两侧添加冒号（`:`）来将列中的文本左对齐、右对齐或居中对齐。

| Syntax | Description | Test Text |
| :--- | :----: | ---: |
| Header | Title | Here's this |
| Paragraph | Text | And more |

```markdown
| Syntax | Description | Test Text |
| :--- | :----: | ---: |
| Header | Title | Here's this |
| Paragraph | Text | And more |
```

### Formatting Text in Tables

You can format the text within tables. For example, you can add links, code (words or phrases in backticks only, not code blocks), and emphasis.

你可以格式化表格中的文本。例如，你可以添加链接、代码（仅限反引号中的单词或短语，而不是代码块）和强调。

| Name | Description |
| ----------- | ----------- |
| Help | View the help documentation at [help.markdownguide.org](https://help.markdownguide.org) |
| Status | `Complete` |
| Priority | **High** |

```markdown
| Name | Description |
| ----------- | ----------- |
| Help | View the help documentation at [help.markdownguide.org](https://help.markdownguide.org) |
| Status | `Complete` |
| Priority | **High** |
```

## Escaping Characters

To display a literal character that would otherwise be used to format text in a Markdown document, add a backslash (`\`) in front of the character.

要显示原本会用于格式化 Markdown 文档中文本的字面字符，请在该字符前添加反斜杠（`\`）。

\* Without the backslash, this would be a bullet in an unordered list.

```markdown
\* Without the backslash, this would be a bullet in an unordered list.
```

### Characters You Can Escape

You can escape the following characters with a backslash:

你可以使用反斜杠转义以下字符：

| Character | Name |
|-----------|------|
| `\` | backslash |
| `` ` `` | backtick |
| `*` | asterisk |
| `_` | underscore |
| `{ }` | curly braces |
| `[ ]` | brackets |
| `( )` | parentheses |
| `#` | pound sign |
| `+` | plus sign |
| `-` | minus sign (hyphen) |
| `.` | dot |
| `!` | exclamation mark |
| `|` | pipe |

## HTML

Many Markdown applications allow you to use HTML tags in Markdown-formatted text. This is helpful if you prefer certain HTML tags to Markdown syntax. For example, some people find it easier to use HTML tags for images. Using HTML is also helpful when you need to change the attributes of an element, like specifying the color of text or the width of an image.

许多 Markdown 应用程序允许你在 Markdown 格式的文本中使用 HTML 标签。如果你更喜欢某些 HTML 标签而不是 Markdown 语法，这很有帮助。例如，有些人发现使用 HTML 标签处理图像更容易。当你需要更改元素的属性时，例如指定文本颜色或图像宽度，使用 HTML 也很有帮助。

To use HTML, place the tags in the text of your Markdown-formatted file.

要使用 HTML，请将标签放在 Markdown 格式文件的文本中。

This **word** is bold. This <em>word</em> is italic.

```markdown
This **word** is bold. This <em>word</em> is italic.
```

```html
This <strong>word</strong> is bold. This <em>word</em> is italic.
```

### HTML Best Practices

For security reasons, not all Markdown applications support HTML in Markdown documents. When in doubt, check your Markdown application's documentation. But if your Markdown application does support HTML, there are some best practices to keep in mind.

出于安全原因，并非所有 Markdown 应用程序都支持 Markdown 文档中的 HTML。如有疑问，请检查 Markdown 应用程序的文档。但如果你的 Markdown 应用程序确实支持 HTML，则需要记住一些最佳实践。

For compatibility, use trailing white space or the `<br>` HTML tag at the end of the line.

为了兼容性，请在一行末尾使用尾随空白或 `<br>` HTML 标签。

You should also put blank lines before and after block-level elements (like `<p>`, `<table>`, `<pre>`, etc.) for compatibility.

为了兼容性，你还应该在块级元素（如 `<p>`、`<table>`、`<pre>` 等）前后留空行。

Don't use tabs or spaces for indentation when using HTML in Markdown — it can interfere with the formatting.

在 Markdown 中使用 HTML 时，不要使用制表符或空格进行缩进——这可能会干扰格式。

| ✅ Do this | ❌ Don't do this |
|-----------|----------------|
| This is a regular paragraph.<br><br><table><br>  <tr><br>    <td>Foo</td><br>  </tr><br></table><br><br>This is another regular paragraph. | This is a regular paragraph.<br><table><br>  <tr><br>    <td>Foo</td><br>  </tr><br></table><br>This is another regular paragraph. |

You shouldn't use block-level HTML elements (like `<p>`, `<table>`, etc.) inside list items or blockquotes unless you really know what you're doing — you'll probably mess up the formatting.

除非你真的知道自己在做什么，否则不应在列表项或块引用中使用块级 HTML 元素（如 `<p>`、`<table>` 等）——你可能会搞乱格式。

---

This is the complete Markdown basic syntax guide!

