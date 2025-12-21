import { Capacity } from "@/types/capacity"

export type Item = {
  id: string
  label: string
  emotional?: boolean
}

const BASE: Record<Capacity, number> = {
  low: 1,
  medium: 3,
  high: 5,
}

export function compressItems(
  capacity: Capacity,
  items: Item[],
  override: number
): Item[] {
  const base = BASE[capacity]
  const min = base
  const max = base + 1

  const limit = Math.min(
    max,
    Math.max(min, base + override)
  )

  return items.slice(0, limit)
}
