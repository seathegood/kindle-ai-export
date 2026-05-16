import { describe, expect, it } from 'vitest'

import type { TocItem } from './types'
import {
  mapTargetToNearestLocationAnchor,
  parsePageNav,
  parseTocItems
} from './playwright-utils'

describe('parsePageNav', () => {
  it('parses page footer', () => {
    expect(parsePageNav('Page 12 of 300')).toEqual({ page: 12, total: 300 })
  })

  it('parses location footer', () => {
    expect(parsePageNav('Location 456 of 9000')).toEqual({
      location: 456,
      total: 9000
    })
  })
})

describe('parseTocItems', () => {
  it('finds start and post-content sections', () => {
    const tocItems: TocItem[] = [
      { title: 'Title Page', location: 10, total: 300 },
      { title: 'Chapter 1', page: 12, total: 300 },
      { title: 'About the Author', page: 295, total: 300 }
    ]
    const parsed = parseTocItems(tocItems)
    expect(parsed.firstPageTocItem?.title).toBe('Title Page')
    expect(parsed.afterLastPageTocItem?.title).toBe('About the Author')
  })
})

describe('mapTargetToNearestLocationAnchor', () => {
  it('maps to closest forward anchor from current position', () => {
    const anchors = [
      { startPosition: 100, page: 1 },
      { startPosition: 400, page: 20 },
      { startPosition: 850, page: 45 }
    ]
    expect(mapTargetToNearestLocationAnchor(anchors, 120, 420, 'forward')).toBe(
      400
    )
  })
})
