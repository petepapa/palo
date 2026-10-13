export interface MockBlogPost {
  id: number
  userId: number
  title: string
  body: string
}

export const mockBlogPosts: MockBlogPost[] = [
  {
    id: 1,
    userId: 1,
    title: 'Designing accessible navigation patterns for modern content websites',
    body: 'Clear landmarks, consistent labels, and predictable keyboard behavior make navigation feel effortless for everyone, especially on content-heavy sites.',
  },
  {
    id: 2,
    userId: 1,
    title: 'How color contrast decisions improve readability beyond compliance',
    body: 'Strong contrast helps reduce fatigue, improves scanning, and makes interfaces more resilient across lighting conditions and device quality.',
  },
  {
    id: 3,
    userId: 2,
    title: 'Building reusable content cards with semantic HTML and focus states',
    body: 'Reusable cards work best when structure, headings, links, and interaction states are designed together instead of layered on afterward.',
  },
  {
    id: 4,
    userId: 2,
    title: 'Practical heading hierarchy tips for blogs portfolios and landing pages',
    body: 'A steady heading outline helps screen reader users, improves scanability, and gives authors a reliable structure for growing content.',
  },
  {
    id: 5,
    userId: 3,
    title: 'What to test before shipping reduced motion friendly animations',
    body: 'Animations should support understanding, never block interaction, and always provide a calmer path for people who request less motion.',
  },
  {
    id: 6,
    userId: 3,
    title: 'Creating dependable form feedback with labels hints and error summaries',
    body: 'Helpful validation combines clear labels, inline guidance, and summary messaging so people can recover quickly without confusion.',
  },
  {
    id: 7,
    userId: 4,
    title: 'Why static sites still benefit from thoughtful performance budgets',
    body: 'A static stack removes many runtime costs, but image weight, font choices, and component sprawl can still erode the experience.',
  },
  {
    id: 8,
    userId: 4,
    title: 'Content design techniques that make technical documentation easier to scan',
    body: 'Short sections, descriptive headings, and concrete examples let readers find the right answer without digging through dense paragraphs.',
  },
  {
    id: 9,
    userId: 5,
    title: 'Using design tokens to keep typography systems flexible and consistent',
    body: 'Tokenized typography makes it easier to retune rhythm and scale across templates without rewriting every component by hand.',
  },
]
