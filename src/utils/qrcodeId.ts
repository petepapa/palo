export function getQrCodeBaseId(label: string): string {
  const cleanLabel = label.replace(/\*\*/g, '')
  const baseName = cleanLabel.split(':')[0].toLowerCase().replace(/\s+/g, '-')
  return `palo-qrcode-${baseName}`
}

export function getQrCodeModalId(label: string): string {
  return `${getQrCodeBaseId(label)}-modal`
}

export function getQrCodeFooterTriggerId(label: string): string {
  return `${getQrCodeBaseId(label)}-footer-trigger`
}

export function getQrCodeContactTriggerId(label: string): string {
  return `${getQrCodeBaseId(label)}-contact-trigger`
}


