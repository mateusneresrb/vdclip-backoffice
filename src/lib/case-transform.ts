// ── Compile-time types ──────────────────────────────────────────────

type CamelCase<S extends string> = S extends `${infer Head}_${infer Tail}`
  ? `${Head}${Capitalize<CamelCase<Tail>>}`
  : S

type SnakeCase<S extends string> = S extends `${infer Head}${infer Tail}`
  ? Head extends Uppercase<Head>
    ? Head extends Lowercase<Head>
      ? `${Head}${SnakeCase<Tail>}`
      : `_${Lowercase<Head>}${SnakeCase<Tail>}`
    : `${Head}${SnakeCase<Tail>}`
  : S

export type CamelizeKeys<T> = T extends Date
  ? T
  : T extends (infer U)[]
    ? CamelizeKeys<U>[]
    : T extends object
      ? {
          [K in keyof T as K extends string ? CamelCase<K> : K]: CamelizeKeys<
            T[K]
          >
        }
      : T

export type SnakeizeKeys<T> = T extends Date
  ? T
  : T extends (infer U)[]
    ? SnakeizeKeys<U>[]
    : T extends object
      ? {
          [K in keyof T as K extends string ? SnakeCase<K> : K]: SnakeizeKeys<
            T[K]
          >
        }
      : T

// ── Runtime helpers ─────────────────────────────────────────────────

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())
}

function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !(value instanceof Date) && !Array.isArray(value)
}

export function camelizeKeys<T>(obj: T): CamelizeKeys<T> {
  if (Array.isArray(obj)) {
    return obj.map(camelizeKeys) as CamelizeKeys<T>
  }

  if (isPlainObject(obj)) {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj)) {
      result[toCamelCase(key)] = camelizeKeys(value)
    }
    return result as CamelizeKeys<T>
  }

  return obj as CamelizeKeys<T>
}

export function snakeizeKeys<T>(obj: T): SnakeizeKeys<T> {
  if (Array.isArray(obj)) {
    return obj.map(snakeizeKeys) as SnakeizeKeys<T>
  }

  if (isPlainObject(obj)) {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj)) {
      result[toSnakeCase(key)] = snakeizeKeys(value)
    }
    return result as SnakeizeKeys<T>
  }

  return obj as SnakeizeKeys<T>
}
