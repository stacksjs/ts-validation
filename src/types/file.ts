import type { Validator } from './base'

/**
 * Structural shape accepted by `v.file()`. Matches `UploadedFile` from
 * `@stacksjs/bun-router` (and the `UploadedFileLike` interface from
 * `@stacksjs/storage`) — defined here so ts-validation stays
 * zero-dependency.
 */
export interface FileLike {
  /** Display name of the file, e.g. "photo.jpg". */
  originalName?: string
  /** Filesystem-safe name (often the server-side hashed name). */
  filename?: string
  /** Size in bytes. */
  size?: number
  /** MIME type as reported by the client. */
  mimetype?: string
  /** Raw bytes. Optional so the validator works on metadata-only stubs in tests. */
  buffer?: ArrayBuffer | Uint8Array
}

export interface FileValidatorType extends Validator<FileLike> {
  /** Restrict to one of the listed MIME types (exact match). */
  mimeTypes: (types: string[]) => FileValidatorType
  /** Restrict to common image MIME types (jpeg/png/webp/gif/svg/avif). */
  image: () => FileValidatorType
  /** Reject files larger than the given byte count. */
  maxBytes: (max: number) => FileValidatorType
  /** Reject files smaller than the given byte count. */
  minBytes: (min: number) => FileValidatorType
  /**
   * Restrict to one of the listed file extensions (derived from
   * `originalName`; case-insensitive). Bypasses any `originalName` that
   * doesn't include an extension.
   */
  extensions: (exts: string[]) => FileValidatorType
  /** Custom predicate over the full file value. */
  custom: (fn: (file: FileLike) => boolean, message: string) => FileValidatorType
}
