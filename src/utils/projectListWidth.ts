export type ProjectListWidth = 'container' | 'full'

/**
 * `full` must be used on a list that is a direct child of `<section>` (not inside `.container`).
 * See FeaturedProjects.astro and portfolio pages for the layout pattern.
 */
const projectListWidthClassMap: Record<ProjectListWidth, string> = {
  container: 'project-list-width--container',
  full: 'project-list-width--full',
}

export function getProjectListWidthClass(width: ProjectListWidth = 'container') {
  return projectListWidthClassMap[width]
}
