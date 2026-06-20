// ═══════════════════════════════════════════════════════════════
// Palo Contact Form — Declarative Configuration
// Palo 联系表单 — 声明式配置
//
// Edit this file to change every label, hint, and choice
// on the Contact page without touching any Astro component.
// 修改此文件即可改变 Contact 页面的所有标签、提示和选项，
// 无需改动任何 Astro 组件。
// ═══════════════════════════════════════════════════════════════

// ── Primitives / 基础类型 ────────────────────────────────────

/** A single radio / checkbox choice. 单个单选或复选项。 */
export interface FormOption {
  /** Machine-readable value sent to the API. 发送给后端 API 的值（机器可读）。 */
  value: string
  /** Human-readable text shown on the page. 页面上显示给用户的文案。 */
  label: string
}

/** A group of related choices rendered as a bordered fieldset. 一组相关选项，渲染为带边框的 fieldset。 */
export interface FieldsetSchema {
  /**
   * Toggle the whole section on or off.
   * true  → section visible  显示该区域
   * false → section hidden   隐藏该区域
   */
  enable: boolean
  /** Heading displayed inside the fieldset border. fieldset 边框内的标题。 */
  legend: string
  /** List of choices inside this fieldset. 该区域内的选项列表。 */
  options: FormOption[]
}

// ── Master config interface / 主配置接口 ─────────────────────

export interface ContactFormConfig {
  /** Static text fields (Name, Email, Message). 静态文本字段（姓名、邮箱、留言）。 */
  fields: {
    name: {
      /** Placeholder-style label inside the input. 输入框内的浮动标签。 */
      label: string
      /** Error shown when the field is empty after submit. 提交后字段为空时的错误提示。 */
      emptyMsg: string
    }
    email: {
      label: string
      /** Error shown when the field is empty. 字段为空时的错误提示。 */
      emptyMsg: string
      /** Error shown when the value doesn't match email format. 格式不正确时的错误提示。 */
      invalidMsg: string
    }
    message: {
      label: string
      /** Error shown when the textarea is empty. 文本区为空时的错误提示。 */
      emptyMsg: string
      /** Placeholder text inside the textarea (visible when focused). 文本区内的占位提示（聚焦时可见）。 */
      placeholder: string
    }
  }
  /** Optional Radio / Checkbox groups that can be toggled or customised. 可开关、可自定义的单选/复选组。 */
  dynamicSections: {
    /** "Who are you?" Radio group. “你是谁” 单选组。 */
    identity: FieldsetSchema
    /** "What's on your mind?" Checkbox group. “你想聊什么” 复选组。 */
    collaboration: FieldsetSchema
  }
}

// ── Default export — change anything below freely / 默认导出 — 以下内容可自由修改 ──

export const contactFormConfig: ContactFormConfig = {
  // ═══════════════════════════════════════════════════════════
  // Text fields / 文本输入字段
  // ═══════════════════════════════════════════════════════════
  fields: {
    name: {
      label: 'YOUR NAME',
      emptyMsg: 'Please enter your name',
    },
    email: {
      label: 'EMAIL ADDRESS',
      emptyMsg: 'Please enter your email address',
      invalidMsg: 'Please enter a valid email address',
    },
    message: {
      label: 'YOUR PROJECT OR IDEA',
      emptyMsg: 'Please tell me about your project or idea',
      placeholder: 'Tell me about your product goals, budget scope, or timeline...',
    },
  },

  // ═══════════════════════════════════════════════════════════
  // Dynamic choice groups / 动态选择组
  //
  // - Set enable: false to hide a section entirely.
  //   设 enable: false 可完全隐藏某个区域。
  // - Add / remove / reorder entries in the options array.
  //   在 options 数组中增删或重排选项即可。
  // ═══════════════════════════════════════════════════════════
  dynamicSections: {
    // ── "Who are you?" Radio (single choice) / 你是谁（单选） ──
    identity: {
      enable: true,
      legend: 'WHO ARE YOU?',
      options: [
        { value: 'creator', label: 'Content Creator' },
        { value: 'designer', label: 'Designer / Artist' },
        { value: 'musician', label: 'Musician / Band Leader' },
        { value: 'dev', label: 'Passionate Dev' },
        { value: 'kindred', label: 'Just a kindred spirit' },
      ],
    },

    // ── "What's on your mind?" Checkbox (multi choice) / 你想聊什么（多选） ──
    collaboration: {
      enable: true,
      legend: "WHAT'S ON YOUR MIND?",
      options: [
        { value: 'visual', label: 'Visual Identity & Branding' },
        { value: 'web', label: 'Interactive Web Experiences' },
        { value: 'motion', label: 'Motion Typography & Video' },
        { value: 'audiovisual', label: 'Audio-Visual / Music Project' },
        { value: 'chat', label: 'Coffee & Late-night chat' },
      ],
    },
  },
}
