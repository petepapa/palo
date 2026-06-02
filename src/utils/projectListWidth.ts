export type ProjectListWidth = 'container' | 'full'

const projectListWidthClassMap: Record<ProjectListWidth, string> = {
  container: 'project-list-width--container',
  full: 'project-list-width--full',
}

export function getProjectListWidthClass(width: ProjectListWidth = 'container') {
  return projectListWidthClassMap[width]
}
