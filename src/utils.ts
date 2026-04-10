import fs from 'node:fs/promises'
import path from 'node:path'

import hashObjectImpl from 'hash-object'
import { getEnv } from 'kindle-api-ky'

export {
  assert,
  getEnv,
  normalizeAuthors,
  parseJsonpResponse
} from 'kindle-api-ky'

const DEFAULT_REPORTS_DIR = '_reports'
const LEGACY_REPORTS_DIR = 'out'

const numerals = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }

export function deromanize(romanNumeral: string): number {
  const roman = romanNumeral.toUpperCase().split('')
  let num = 0
  let val = 0

  while (roman.length) {
    val = numerals[roman.shift()! as keyof typeof numerals]
    num += val * (val < numerals[roman[0] as keyof typeof numerals] ? -1 : 1)
  }

  return num
}

export async function fileExists(
  filePath: string,
  mode: number = fs.constants.F_OK | fs.constants.R_OK
): Promise<boolean> {
  try {
    await fs.access(filePath, mode)
    return true
  } catch {
    return false
  }
}

export function getReportsRootDir(): string {
  const reportsRoot = getEnv('REPORTS_DIR')?.trim()
  return reportsRoot || DEFAULT_REPORTS_DIR
}

export function getBookOutputDir(asin: string, rootDir = getReportsRootDir()) {
  return path.join(rootDir, asin)
}

export async function resolveBookOutputDir(asin: string): Promise<{
  outDir: string
  usingLegacyDir: boolean
}> {
  const preferredOutDir = getBookOutputDir(asin)
  const legacyOutDir = getBookOutputDir(asin, LEGACY_REPORTS_DIR)

  if (preferredOutDir !== legacyOutDir && (await fileExists(legacyOutDir))) {
    return { outDir: legacyOutDir, usingLegacyDir: true }
  }

  return { outDir: preferredOutDir, usingLegacyDir: false }
}

export function hashObject(obj: Record<string, any>): string {
  return hashObjectImpl(obj, {
    algorithm: 'sha1',
    encoding: 'hex'
  })
}
