import { describe, expect, test } from 'bun:test'
import { file as fileBuilder, v } from '../src'
import type { FileLike } from '../src'

function f(overrides: Partial<FileLike> = {}): FileLike {
  return {
    originalName: 'photo.jpg',
    mimetype: 'image/jpeg',
    size: 1024,
    buffer: new Uint8Array([0xff, 0xd8, 0xff]),
    ...overrides,
  }
}

describe('v.file()', () => {
  test('is exposed on the v / schema instance', () => {
    expect(typeof v.file).toBe('function')
    const inst = v.file()
    expect(inst.name).toBe('file')
  })

  test('factory export matches v.file()', () => {
    const a = v.file()
    const b = fileBuilder()
    expect(a.name).toBe(b.name)
  })

  test('passes for a well-formed file value', () => {
    const result = v.file().validate(f())
    expect(result.valid).toBe(true)
  })

  test('rejects non-object values', () => {
    expect(v.file().validate('not a file' as any).valid).toBe(false)
    expect(v.file().validate(123 as any).valid).toBe(false)
  })

  test('rejects empty object without size/mimetype/buffer signals', () => {
    expect(v.file().validate({} as any).valid).toBe(false)
  })

  test('optional() lets undefined and null through', () => {
    expect(v.file().validate(undefined as any).valid).toBe(true)
    expect(v.file().validate(null as any).valid).toBe(true)
  })

  test('required() rejects undefined', () => {
    expect(v.file().required().validate(undefined as any).valid).toBe(false)
  })

  describe('.image()', () => {
    test.each([
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'image/avif',
    ])('passes for %s', (mimetype) => {
      expect(v.file().image().validate(f({ mimetype })).valid).toBe(true)
    })

    test('rejects non-image mimetypes', () => {
      expect(v.file().image().validate(f({ mimetype: 'application/pdf' })).valid).toBe(false)
      expect(v.file().image().validate(f({ mimetype: 'text/plain' })).valid).toBe(false)
    })

    test('is case-insensitive', () => {
      expect(v.file().image().validate(f({ mimetype: 'IMAGE/JPEG' })).valid).toBe(true)
    })
  })

  describe('.mimeTypes()', () => {
    test('passes when mimetype is in the allow-list', () => {
      const rule = v.file().mimeTypes(['image/png', 'image/jpeg'])
      expect(rule.validate(f({ mimetype: 'image/png' })).valid).toBe(true)
      expect(rule.validate(f({ mimetype: 'image/jpeg' })).valid).toBe(true)
    })

    test('rejects when mimetype is not in the allow-list', () => {
      const rule = v.file().mimeTypes(['image/png'])
      expect(rule.validate(f({ mimetype: 'image/jpeg' })).valid).toBe(false)
    })
  })

  describe('.maxBytes() / .minBytes()', () => {
    test('maxBytes enforces upper bound (inclusive)', () => {
      const cap = v.file().maxBytes(2048)
      expect(cap.validate(f({ size: 2048 })).valid).toBe(true)
      expect(cap.validate(f({ size: 2049 })).valid).toBe(false)
    })

    test('minBytes enforces lower bound (inclusive)', () => {
      const floor = v.file().minBytes(100)
      expect(floor.validate(f({ size: 100 })).valid).toBe(true)
      expect(floor.validate(f({ size: 99 })).valid).toBe(false)
    })

    test('chained min + max forms a closed interval', () => {
      const range = v.file().minBytes(10).maxBytes(20)
      expect(range.validate(f({ size: 15 })).valid).toBe(true)
      expect(range.validate(f({ size: 5 })).valid).toBe(false)
      expect(range.validate(f({ size: 25 })).valid).toBe(false)
    })
  })

  describe('.extensions()', () => {
    test('matches by extension derived from originalName', () => {
      const rule = v.file().extensions(['jpg', 'jpeg'])
      expect(rule.validate(f({ originalName: 'profile.jpg' })).valid).toBe(true)
      expect(rule.validate(f({ originalName: 'profile.png' })).valid).toBe(false)
    })

    test('accepts leading dots and uppercase', () => {
      const rule = v.file().extensions(['.JPG', 'PNG'])
      expect(rule.validate(f({ originalName: 'photo.jpg' })).valid).toBe(true)
      expect(rule.validate(f({ originalName: 'photo.png' })).valid).toBe(true)
    })

    test('rejects files with no extension in originalName', () => {
      const rule = v.file().extensions(['jpg'])
      expect(rule.validate(f({ originalName: 'no-extension' })).valid).toBe(false)
    })
  })

  describe('.custom()', () => {
    test('runs the custom predicate', () => {
      const rule = v.file().custom(file => (file.mimetype ?? '').startsWith('image/'), 'must be an image')
      expect(rule.validate(f({ mimetype: 'image/png' })).valid).toBe(true)
      expect(rule.validate(f({ mimetype: 'text/plain' })).valid).toBe(false)
    })
  })

  describe('avatar-upload composition (the example from #1856)', () => {
    test('schema.file().required().image().maxBytes(2 * 1024 * 1024)', () => {
      const schema = v.file().required().image().maxBytes(2 * 1024 * 1024)
      expect(schema.validate(f({ mimetype: 'image/png', size: 1_000_000 })).valid).toBe(true)
      expect(schema.validate(f({ mimetype: 'image/png', size: 3_000_000 })).valid).toBe(false)
      expect(schema.validate(f({ mimetype: 'application/pdf', size: 1_000 })).valid).toBe(false)
      expect(schema.validate(undefined as any).valid).toBe(false)
    })
  })
})
