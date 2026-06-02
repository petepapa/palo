export const defaultProjectType = 'default'

export const projectTypes = [
  {
    id: 'default',
    label: 'Default',
    ratioLabel: '8:5',
    aspectRatio: '8 / 5',
    description: 'Balanced landscape thumbnails for general portfolio work.',
  },
  {
    id: 'video',
    label: 'Video',
    ratioLabel: '16:9',
    aspectRatio: '16 / 9',
    description: 'Wide thumbnails for video, motion, and cinematic work.',
  },
  {
    id: 'shot',
    label: 'Shot',
    ratioLabel: '9:16',
    aspectRatio: '9 / 16',
    description: 'Vertical thumbnails for mobile-first shots and short-form work.',
  },
  {
    id: 'album',
    label: 'Album',
    ratioLabel: '1:1',
    aspectRatio: '1 / 1',
    description: 'Square thumbnails for album art, identity, and centered compositions.',
  },
  {
    id: 'poster',
    label: 'Poster',
    ratioLabel: '5:7',
    aspectRatio: '5 / 7',
    description: 'Portrait thumbnails for posters, editorial graphics, and flyers.',
  },
] as const

export type ProjectType = (typeof projectTypes)[number]['id']

export const projectTypeIds = projectTypes.map((type) => type.id) as [ProjectType, ...ProjectType[]]

export const projectTypeById = Object.fromEntries(
  projectTypes.map((type) => [type.id, type]),
) as Record<ProjectType, (typeof projectTypes)[number]>

export function getProjectTypeDefinition(type: string | undefined) {
  return projectTypeById[(type ?? defaultProjectType) as ProjectType] ?? projectTypeById[defaultProjectType]
}
