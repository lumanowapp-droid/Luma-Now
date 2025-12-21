"use client"

import { useEffect, useRef, useState } from "react"
import { Capacity } from "@/types/capacity"
import { compressItems, Item } from "@/lib/compression"
import { supabase } from "@/lib/supabase"

export default function Page() {
  const [capacity, setCapacity] = useState<Capacity | null>(null)
  const [override, setOverride] = useState(0)
  const [emotionalId, setEmotionalId] = useState<string | null>(null)

  const [input, setInput] = useState("")
  const [items, setItems] = useState<Item[]>([])

  const sessionIdRef = useRef<string | null>(null)

  /* ---------- LOAD LAST SESSION ---------- */
  useEffect(() => {
    ;(async () => {
      const { data } = await supabase
        .from("luma_sessions")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .single()

      if (!data) return

      sessionIdRef.current = data.id
      setItems(data.items || [])
      setCapacity(data.capacity ?? null)
      setOverride(data.override ?? 0)
      setEmotionalId(data.emotional_id ?? null)
    })()
  }, [])

  /* ---------- SAVE ON CHANGE ---------- */
  useEffect(() => {
    if (!items.length) return

    const payload = {
      items,
      capacity,
      override,
      emotional_id: emotionalId,
      updated_at: new Date().toISOString(),
    }

    ;(async () => {
      if (sessionIdRef.current) {
        await supabase
          .from("luma_sessions")
          .update(payload)
          .eq("id", sessionIdRef.current)
      } else {
        const { data } = await supabase
          .from("luma_sessions")
          .insert(payload)
          .select("id")
          .single()

        sessionIdRef.current = data?.id ?? null
      }
    })()
  }, [items, capacity, override, emotionalId])

  /* ---------- COMPRESSION ---------- */
  let visibleItems = capacity
    ? compressItems(capacity, items, override)
    : []

  // Emotional item must always be visible
  if (emotionalId && capacity) {
    const emotional = items.find(i => i.id === emotionalId)
    if (emotional && !visibleItems.some(i => i.id === emotional.id)) {
      visibleItems = [
        emotional,
        ...visibleItems.slice(0, visibleItems.length - 1),
      ]
    }
  }

  const canShowMore =
    capacity !== null &&
    override < 1 &&
    visibleItems.length < items.length

  const canShowLess =
    override > 0 &&
    (!emotionalId || visibleItems.length > 1)

  /* ---------- ACTIONS ---------- */
  function addItems() {
    const newItems = input
      .split("\n")
      .map(s => s.trim())
      .filter(Boolean)
      .map((label, idx) => ({
        id: `${Date.now()}-${idx}`,
        label,
      }))

    setItems(newItems)
  }

  function handleShowLess() {
    if (emotionalId && override <= 0) return
    setOverride(o => Math.max(o - 1, 0))
  }

  function handleShowMore() {
    setOverride(o => Math.min(o + 1, 1))
  }

  /* ---------- INPUT + CAPACITY ---------- */
  if (!capacity) {
    return (
      <main className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Dump everything
        </h1>

        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={`Meet mom
Finish project
See doctor
Buy groceries
Call dad

One item per line`}
          className="w-full mb-4 rounded-2xl border border-gray-200 p-4 text-sm resize-none h-32"
        />

        <button
          onClick={addItems}
          disabled={!input.trim()}
          className="w-full mb-8 rounded-2xl bg-blue-600 text-white py-3 disabled:opacity-50 hover:bg-blue-700 transition"
        >
          Continue
        </button>

        <h2 className="text-lg font-medium mb-4 text-center">
          How much do you have today?
        </h2>

        <div className="space-y-4">
          {(["low", "medium", "high"] as Capacity[]).map(c => (
            <button
              key={c}
              onClick={() => {
                setCapacity(c)
                setOverride(0)
                setEmotionalId(null)
              }}
              disabled={items.length === 0}
              className="w-full rounded-2xl border border-gray-200 p-5 text-left hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-lg font-medium">
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </div>
            </button>
          ))}
        </div>
      </main>
    )
  }

  /* ---------- TODAY VIEW ---------- */
  return (
    <main className="w-full max-w-md bg-white rounded-2xl p-10 shadow-lg">
      <h1 className="text-xl font-medium mb-8 text-center">
        Today
      </h1>

      <div className="space-y-6">
        {visibleItems.map(item => (
          <div
            key={item.id}
            className={`rounded-2xl p-6 ${
              item.id === emotionalId ? "bg-blue-50" : "bg-gray-50"
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="text-base font-normal">
                {item.label}
              </div>

              <button
                onClick={() =>
                  setEmotionalId(item.id === emotionalId ? null : item.id)
                }
                className="text-xs text-gray-600 hover:text-gray-800"
              >
                {item.id === emotionalId ? "Undo" : "This matters"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {(canShowLess || canShowMore) && (
        <div className="mt-6 flex justify-between text-sm text-gray-600">
          {canShowLess ? (
            <button onClick={handleShowLess}>
              Show less
            </button>
          ) : <div />}

          {canShowMore && (
            <button onClick={handleShowMore}>
              Show one more
            </button>
          )}
        </div>
      )}

      <button
        onClick={() => {
          setCapacity(null)
          setOverride(0)
          setEmotionalId(null)
          setInput("")
          setItems([])
          sessionIdRef.current = null
        }}
        className="mt-8 text-sm text-gray-600 hover:text-gray-800"
      >
        Start over
      </button>
    </main>
  )
}
