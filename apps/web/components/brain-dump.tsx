"use client"

import { useState, useRef, useCallback } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface BrainDumpProps {
  onCompress?: (text: string) => Promise<string>
  className?: string
}

export function BrainDump({ onCompress, className }: BrainDumpProps) {
  const [text, setText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const placeholderText = "Brain dump everything on your mind... e.g., 'I need to finish the proposal, walk the dog, call mom, review budget'"

  // Optimized auto-grow textarea with useCallback to prevent re-renders
  const updateTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = "auto"
    const newHeight = Math.min(Math.max(textarea.scrollHeight, 200), 600)
    textarea.style.height = `${newHeight}px`
  }, [])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    // Defer height update to avoid layout thrashing
    requestAnimationFrame(updateTextareaHeight)
  }

  const handleCompress = async () => {
    if (!text.trim() || !onCompress) return

    setIsLoading(true)
    setError(null)

    try {
      const compressedText = await onCompress(text)
      setText(compressedText)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to compress text. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const isDisabled = !text.trim() || isLoading

  return (
    <div
      className={cn("w-full max-w-4xl mx-auto opacity-0 animate-in fade-in duration-300", className)}
    >
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          placeholder={placeholderText}
          className={cn(
            "w-full resize-none rounded-2xl border border-zinc-200 dark:border-zinc-700",
            "bg-white dark:bg-zinc-900 text-lg text-zinc-900 dark:text-zinc-100",
            "placeholder:text-zinc-500 dark:placeholder:text-zinc-400",
            "p-6 pr-16 transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            "dark:bg-zinc-900 dark:border-zinc-700",
            "h-[200px] min-h-[200px] max-h-[600px]",
            "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-300 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-600 [&::-webkit-scrollbar-thumb]:rounded-full"
          )}
          disabled={isLoading}
        />
        
        {/* Character count */}
        <div className="absolute bottom-4 right-4 text-sm text-zinc-500 dark:text-zinc-400">
          {text.length} characters
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-3 p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      {/* Compress button */}
      <div className="mt-6 flex justify-center">
        <Button
          onClick={handleCompress}
          disabled={isDisabled}
          size="lg"
          className={cn(
            "px-8 py-3 text-base font-medium rounded-xl",
            "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700",
            "text-white shadow-lg transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600",
            "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Compressing...
            </>
          ) : (
            "Lets Plan Your Day"
          )}
        </Button>
      </div>
    </div>
  )
}