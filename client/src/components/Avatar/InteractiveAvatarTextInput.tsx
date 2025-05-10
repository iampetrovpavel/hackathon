import React, { FormEvent, useRef } from 'react'
import { Button } from '../ui/button'
import { Send } from 'lucide-react'

interface InteractiveAvatarTextInputProps {
  disabled?: boolean
  input: string
  loading?: boolean
  placeholder?: string
  setInput: (value: string) => void
  onSubmit: (value: string) => void
}

export default function InteractiveAvatarTextInput({
  disabled = false,
  input,
  loading = false,
  placeholder = 'Type your message...',
  setInput,
  onSubmit,
}: InteractiveAvatarTextInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading || disabled) return
    
    onSubmit(input)
    setInput('')
    inputRef.current?.focus()
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2">
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        disabled={disabled || loading}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
      <Button
        type="submit"
        disabled={!input.trim() || loading || disabled}
        className="bg-blue-600 hover:bg-blue-700 text-white h-10 w-10 p-0"
      >
        {loading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  )
}