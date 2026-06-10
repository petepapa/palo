import type { ImageMetadata } from 'astro'
import typeDefault from '@assets/images/projects/default.png'
import typeVideo from '@assets/images/projects/video.png'
import typeShot from '@assets/images/projects/shot.png'
import typeAlbum from '@assets/images/projects/album.png'
import typePoster from '@assets/images/projects/poster.png'

// Type-specific default cover images
const typeDefaultImages: Record<string, ImageMetadata> = {
  default: typeDefault,
  video: typeVideo,
  shot: typeShot,
  album: typeAlbum,
  poster: typePoster,
}

export type ProjectTypeId = keyof typeof typeDefaultImages

/**
 * Get the type-specific default cover image
 * Falls back to default.png if the type doesn't have a corresponding image
 */
export function getProjectTypeDefaultImage(type: string): ImageMetadata {
  return typeDefaultImages[type] ?? typeDefault
}
