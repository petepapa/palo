import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'

const root = process.cwd()
const configPath = path.join(root, 'src', 'config.yaml')
const outputDirectory = path.join(root, '.palo')
const outputPath = path.join(outputDirectory, 'contact-config.mjs')

const config = yaml.load(fs.readFileSync(configPath, 'utf-8'))
const contact = config && typeof config === 'object' && !Array.isArray(config)
  && config.contact && typeof config.contact === 'object' && !Array.isArray(config.contact)
  ? config.contact
  : {}
const site = config && typeof config === 'object' && !Array.isArray(config)
  && config.site && typeof config.site === 'object' && !Array.isArray(config.site)
  ? config.site
  : {}

function stringSetting(value) {
  return typeof value === 'string' ? value.trim() : ''
}

// Deliberately exclude resendApiKey: production secrets stay in platform env vars.
const contactDeliveryConfig = {
  brandName: stringSetting(site.name),
  to: stringSetting(contact.receiveEmail),
  fromDomain: stringSetting(contact.resendDomain),
  fromLocalPart: stringSetting(contact.resendFromLocalPart),
  from: stringSetting(contact.resendFromEmail),
}

fs.mkdirSync(outputDirectory, { recursive: true })
fs.writeFileSync(
  outputPath,
  `// Generated from src/config.yaml. Do not edit.\nexport const contactDeliveryConfig = Object.freeze(${JSON.stringify(contactDeliveryConfig, null, 2)})\n`,
)
