import { beforeAll, expect, test } from 'bun:test'
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dir, '..')
const env = Object.fromEntries(['PATH', 'HOME', 'TMPDIR', 'LANG', 'SystemRoot'].flatMap(name => process.env[name] ? [[name, process.env[name]!]] : []))

beforeAll(async () => {
  const child = Bun.spawn([process.execPath, 'run', 'build'], { cwd: root, env, stdout: 'pipe', stderr: 'pipe' })
  const [code, out, error] = await Promise.all([child.exited, new Response(child.stdout).text(), new Response(child.stderr).text()])
  expect(code, out + error).toBe(0)
}, 60_000)

test.each(['require-first', 'import-first'])('the published Bun entry supports one shared provider (%s)', async (order) => {
  const directory = await mkdtemp(join(tmpdir(), 'ts-validation-package-'))
  try {
    const packageRoot = join(directory, 'node_modules/@stacksjs/ts-validation')
    await mkdir(packageRoot, { recursive: true })
    await writeFile(join(packageRoot, 'package.json'), await readFile(join(root, 'package.json')))
    await cp(join(root, 'dist'), join(packageRoot, 'dist'), { recursive: true })
    await writeFile(join(directory, 'consumer.ts'), `
import assert from 'node:assert/strict'
${order === 'require-first' ? "const required = require('@stacksjs/ts-validation'); const imported = await import('@stacksjs/ts-validation')" : "const imported = await import('@stacksjs/ts-validation'); const required = require('@stacksjs/ts-validation')"}
assert.equal(required.v, imported.v)
assert.equal(required.getCustomMessages, imported.getCustomMessages)
assert.equal(required.getCustomMessages(), imported.getCustomMessages())
assert.equal(required.v.string().min(3).validate('a').valid, false)
assert.equal(imported.v.string().min(3).validate('Ava').valid, true)
`)
    const child = Bun.spawn([process.execPath, '--no-env-file', 'consumer.ts'], { cwd: directory, env, stdout: 'pipe', stderr: 'pipe', timeout: 10_000 })
    const [code, out, error] = await Promise.all([child.exited, new Response(child.stdout).text(), new Response(child.stderr).text()])
    expect(code, out + error).toBe(0)
  }
  finally { await rm(directory, { recursive: true, force: true }) }
}, 15_000)
