# 项目修改审计记录

## 2026-05-17: 标题行高修复

### 3. 标题行高松紧度参数未生效问题

**问题**：config.yaml 中的 `lineHeightScale` 和 `headingLineHeightScale` 参数没有正确工作，根本原因是 accessible-astro-components 库中的 [Heading.astro](file:///Users/petelee/工作/palo/node_modules/accessible-astro-components/src/components/heading/Heading.astro#L49-L77) 使用了特殊的设计：

```css
:where(.h1) {
  font-size: var(--font-size-6);
  line-height: var(--font-size-7);  /* 用另一个 font-size 变量作为行高！*/
}
```

这导致库的 line-height 完全绕过了 `--heading-line-height-scale` 设置。

**修改文件**：
- [DefaultLayout.astro](file:///Users/petelee/工作/palo/src/layouts/DefaultLayout.astro#L413-L414) - 添加缺失的 `--line-height-scale` 变量
- [DefaultLayout.astro](file:///Users/petelee/工作/palo/src/layouts/DefaultLayout.astro#L514-L526) - 给行高变量添加 `!important`
- [_font.scss](file:///Users/petelee/工作/palo/src/assets/scss/base/_font.scss#L96-L140) - 覆盖库的 line-height 设置

**修改内容**：

#### DefaultLayout.astro
添加了缺失的 `--line-height-scale` 变量定义：
```astro
--line-height-scale: ${typography.lineHeightScale};
--heading-line-height-scale: ${typography.headingLineHeightScale};
```

给所有行高变量添加了 `!important`，并给大标题行高额外乘以 `headingLineHeightScale`：
```astro
--text-5xl--line-height: calc(1 * var(--line-height-scale) * var(--heading-line-height-scale)) !important;
--text-6xl--line-height: calc(1 * var(--line-height-scale) * var(--heading-line-height-scale)) !important;
...
```

#### _font.scss
在 @layer overrides 中为每个标题层级添加了明确的 line-height 覆盖：
```scss
@layer overrides {
  h1.heading.h1, h1, .heading.h1 {
    --heading-line-height: 1.05 !important;
    font-size: var(--font-size-5) !important;
    line-height: calc(var(--heading-line-height, 1.05) * var(--line-height-scale, 1) * var(--heading-line-height-scale, 1)) !important;
  }
  // ... h2 到 h6 类似
}
```

**计算示例**：
- 当 `headingLineHeightScale: 0.85` 时，h1 的行高为：`1.05 × 1.0 × 0.85 = 0.8925`（非常紧凑）

---

## 2026-05-16: 按钮圆角配置接入与标题字体修复

### 1. 按钮圆角配置接入

**问题**：按钮组件使用硬编码的圆角值，未接入 config.yaml 配置系统

**修改文件**：
- [_button.scss](file:///Users/petelee/工作/palo/src/assets/scss/components/_button.scss)

**修改内容**：
```scss
// 修改前
--button-radius: 0.25rem;

// 修改后
--button-radius: var(--radius-button, 0.25rem);
```

---

### 2. 标题字体大小被库覆盖问题

**问题**：accessible-astro-components 库在页面加载时会覆盖我们的 `--font-size-*` 自定义属性

**修改文件**：
- [DefaultLayout.astro](file:///Users/petelee/工作/palo/src/layouts/DefaultLayout.astro#L502-L512)
- [_font.scss](file:///Users/petelee/工作/palo/src/assets/scss/base/_font.scss)

**修改内容**：

#### DefaultLayout.astro
给所有 `--font-size-*` 变量添加了 `!important` 标记，防止被库覆盖：
```astro
--font-size--2: clamp(...) !important;
--font-size--1: clamp(...) !important;
--font-size-0: clamp(...) !important;
--font-size-1: clamp(...) !important;
--font-size-2: clamp(...) !important;
--font-size-3: clamp(...) !important;
--font-size-4: clamp(...) !important;
--font-size-5: clamp(...) !important;
--font-size-6: clamp(...) !important;
--font-size-7: clamp(...) !important;
--font-size-8: clamp(...) !important;
```

#### _font.scss
添加了 @layer overrides 确保标题样式优先级：
```scss
@layer overrides {
  h1.heading.h1, h1, .heading.h1 {
    font-size: var(--font-size-5) !important;
  }
}
```

---

## 配置参数说明

**config.yaml 相关配置**：
- [config.yaml](file:///Users/petelee/工作/palo/src/config.yaml) 中的 `typography.mobileHeadingScale: 1.25` (移动端字体缩放比例)
- [config.yaml](file:///Users/petelee/工作/palo/src/config.yaml) 中的 `typography.desktopHeadingScale: 1.65` (桌面端字体缩放比例)
- [config.yaml](file:///Users/petelee/工作/palo/src/config.yaml) 中的 `typography.lineHeightScale: 1.0` (全局行高倍数)
- [config.yaml](file:///Users/petelee/工作/palo/src/config.yaml) 中的 `typography.headingLineHeightScale: 0.85` (标题行高微调)

**字体大小计算公式**：
- 标题层级与指数的对应关系：h1 → scale^5, h2 → scale^4 … 以此类推
- 使用 CSS clamp() 实现流体字体

