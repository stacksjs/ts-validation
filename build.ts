import { execSync } from 'node:child_process'
import fs, { existsSync, rmSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

// Clean dist directory
if (existsSync('./dist')) {
  rmSync('./dist', { recursive: true })
}

console.log('Building JavaScript files...')

// Build JavaScript files using Bun's bundler
const jsResult = await Bun.build({
  entrypoints: ['src/index.ts'],
  outdir: './dist',
  target: 'bun',
  format: 'esm',
  minify: false,
  sourcemap: 'external',
})

if (!jsResult.success) {
  console.error('JavaScript build failed:', jsResult.logs)
  process.exit(1)
}

console.log('Generating TypeScript declaration files...')

// Generate declaration files using TypeScript compiler
try {
  execSync('bunx tsc --declaration --emitDeclarationOnly --outDir dist --project tsconfig.json', {
    stdio: 'inherit',
    cwd: process.cwd(),
  })

  const srcIndexDts = path.join(process.cwd(), 'dist', 'src', 'index.d.ts')
  const distIndexDts = path.join(process.cwd(), 'dist', 'index.d.ts')

  if (fs.existsSync(srcIndexDts)) {
    let content = fs.readFileSync(srcIndexDts, 'utf8')

    // Fix relative paths to point to src/ subdirectory
    content = content.replace(/from '\.\//g, 'from \'./src/')

    fs.writeFileSync(distIndexDts, content)
    console.log('✅ Copied and fixed main declaration file to dist root')
  }

  console.log('✅ Build completed successfully!')
}
catch (error) {
  console.error('❌ Failed to generate declaration files:', error)
  process.exit(1)
}
