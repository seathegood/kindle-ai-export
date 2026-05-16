import { assert, deromanize } from './utils'

interface PageNav {
  page?: number
  location?: number
  total: number
}

export function parsePageNav(text: string | null): PageNav | undefined {
  {
    const match = text?.match(/page\s+(\d+)\s+of\s+(\d+)/i)
    if (match) {
      const page = Number.parseInt(match?.[1]!)
      const total = Number.parseInt(match?.[2]!)
      if (Number.isNaN(page) || Number.isNaN(total)) return undefined
      return { page, total }
    }
  }

  {
    const match = text?.match(/location\s+(\d+)\s+of\s+(\d+)/i)
    if (match) {
      const location = Number.parseInt(match?.[1]!)
      const total = Number.parseInt(match?.[2]!)
      if (Number.isNaN(location) || Number.isNaN(total)) return undefined
      return { location, total }
    }
  }

  {
    const match = text?.match(/page\s+([cdilmvx]+)\s+of\s+(\d+)/i)
    if (match) {
      const location = deromanize(match?.[1]!)
      const total = Number.parseInt(match?.[2]!)
      if (Number.isNaN(location) || Number.isNaN(total)) return undefined
      return { location, total }
    }
  }
}

type MinimalTocItem = {
  title: string
  page?: number
  location?: number
  total: number
}

export function parseTocItems<T extends MinimalTocItem>(tocItems: T[]) {
  const norm = tocItems.map((item) => {
    if (item.page === undefined && item.location !== undefined) {
      return { ...item, page: item.location } as T
    }
    return item
  })

  const firstPageTocItem = norm.find((item) => item.page !== undefined)
  assert(firstPageTocItem, 'Unable to find first valid page in TOC')

  const afterLastPageTocItem = norm.find((item) => {
    if (item.page === undefined) return false
    if (item === firstPageTocItem) return false

    const percentage = item.page / item.total
    if (percentage < 0.9) return false

    if (/acknowledgements/i.test(item.title)) return true
    if (/^discover more$/i.test(item.title)) return true
    if (/^extras$/i.test(item.title)) return true
    if (/about the author/i.test(item.title)) return true
    if (/meet the author/i.test(item.title)) return true
    if (/^also by /i.test(item.title)) return true
    if (/^copyright$/i.test(item.title)) return true
    if (/ teaser$/i.test(item.title)) return true
    if (/ preview$/i.test(item.title)) return true
    if (/^excerpt from/i.test(item.title)) return true
    if (/^excerpt:/i.test(item.title)) return true
    if (/^cast of characters$/i.test(item.title)) return true
    if (/^timeline$/i.test(item.title)) return true
    if (/^other titles/i.test(item.title)) return true
    if (/^other books/i.test(item.title)) return true
    if (/^other works/i.test(item.title)) return true
    if (/^newsletter/i.test(item.title)) return true

    return false
  })

  return {
    firstPageTocItem,
    afterLastPageTocItem
  }
}

export function mapTargetToNearestLocationAnchor(
  anchors: Array<{ startPosition: number; page: number }>,
  currentPosition: number,
  target: number,
  direction: 'forward' | 'backward'
): number {
  const directional = anchors.filter((a) =>
    direction === 'forward'
      ? a.startPosition > currentPosition
      : a.startPosition < currentPosition
  )
  const candidates = directional.length ? directional : anchors
  if (!candidates.length) return target

  let best = candidates[0]!
  let bestDiff = Math.abs(best.startPosition - target)
  for (const anchor of candidates) {
    const diff = Math.abs(anchor.startPosition - target)
    if (diff < bestDiff) {
      best = anchor
      bestDiff = diff
    }
  }
  return best.startPosition
}
