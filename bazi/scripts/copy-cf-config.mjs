import { copyFileSync, existsSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const distDir = join(process.cwd(), 'dist')
const files = ['_redirects', '_headers']

for (const file of files) {
  const src = join(process.cwd(), file)
  if (existsSync(src)) {
    copyFileSync(src, join(distDir, file))
    console.log(`  ✓ ${file} copied to dist/`)
  } else {
    console.log(`  - ${file} not found, skipping`)
  }
}
