import type { FileLike, FileValidatorType, ValidationNames } from '../types'
import { BaseValidator } from './base'

const IMAGE_MIMETYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
])

function extensionOf(file: FileLike): string | null {
  if (!file.originalName) return null
  const idx = file.originalName.lastIndexOf('.')
  if (idx <= 0 || idx === file.originalName.length - 1) return null
  return file.originalName.slice(idx + 1).toLowerCase()
}

/**
 * Validator for `UploadedFile`-shaped values — typically what
 * `request.file('avatar')` returns. Composable like every other
 * `v.<x>()` builder; chain `.image()`, `.mimeTypes()`, `.maxBytes()`,
 * etc. to add rules.
 *
 * @example
 * ```ts
 * schema.file().required().image().maxBytes(2 * 1024 * 1024)
 * ```
 */
export class FileValidator extends BaseValidator<FileLike> implements FileValidatorType {
  public name: ValidationNames = 'file'

  constructor() {
    super()
    this.addRule({
      name: 'file',
      test: (value: FileLike) => {
        if (value === null || value === undefined) return false
        if (typeof value !== 'object') return false
        // Minimum signal of "file-like": either a buffer or a size+mimetype pair.
        const hasBuffer = (value as FileLike).buffer !== undefined
        const hasMeta = typeof (value as FileLike).size === 'number' && typeof (value as FileLike).mimetype === 'string'
        return hasBuffer || hasMeta
      },
      message: 'Must be an uploaded file',
    })
  }

  mimeTypes(types: string[]): this {
    const allowed = new Set(types.map(t => t.toLowerCase()))
    return this.addRule({
      name: 'mimeTypes',
      test: (value: FileLike) => !!value.mimetype && allowed.has(value.mimetype.toLowerCase()),
      message: 'File must be one of: {types}',
      params: { types: types.join(', ') },
    })
  }

  image(): this {
    return this.addRule({
      name: 'image',
      test: (value: FileLike) => !!value.mimetype && IMAGE_MIMETYPES.has(value.mimetype.toLowerCase()),
      message: 'File must be a JPEG, PNG, WebP, GIF, SVG, or AVIF image',
    })
  }

  maxBytes(max: number): this {
    return this.addRule({
      name: 'maxBytes',
      test: (value: FileLike) => typeof value.size === 'number' && value.size <= max,
      message: 'File must be at most {max} bytes',
      params: { max },
    })
  }

  minBytes(min: number): this {
    return this.addRule({
      name: 'minBytes',
      test: (value: FileLike) => typeof value.size === 'number' && value.size >= min,
      message: 'File must be at least {min} bytes',
      params: { min },
    })
  }

  extensions(exts: string[]): this {
    const allowed = new Set(exts.map(e => e.toLowerCase().replace(/^\./, '')))
    return this.addRule({
      name: 'extensions',
      test: (value: FileLike) => {
        const ext = extensionOf(value)
        return ext !== null && allowed.has(ext)
      },
      message: 'File extension must be one of: {extensions}',
      params: { extensions: exts.join(', ') },
    })
  }

  custom(fn: (value: FileLike) => boolean, message: string): this {
    return this.addRule({
      name: 'custom',
      test: fn,
      message,
    })
  }
}

/** Factory for chaining: `v.file().required().image().maxBytes(2_000_000)`. */
export function file(): FileValidator {
  return new FileValidator()
}
