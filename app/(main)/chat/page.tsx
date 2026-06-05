'use client'

import { useState, useRef, useEffect } from 'react'
import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Mic, MicOff, Sparkles, Settings } from 'lucide-react'
import { ChatMessage } from '@/lib/types'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    content: '你好呀！今天想和我聊点什么呢？',
    role: 'assistant',
    timestamp: new Date(),
  },
]

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        '嗯嗯，我明白你的意思了！',
        '哇，听起来很有趣呢！',
        '我也这么觉得！你说得太对了~',
        '让我想想...其实我觉得每个人都有自己的想法，重要的是跟随自己的内心呢！',
        '你今天心情怎么样呀？有什么想和我分享的吗？',
        '嘻嘻，和你聊天真开心！',
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        role: 'assistant',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // Simulate voice recording
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false)
        setInputValue('（语音消息模拟）今天天气真好！')
      }, 2000)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-cute-cream via-background to-cute-pink/10">
      {/* Header */}
      <PageHeader
        title="和玩偶对话"
        subtitle="温暖小熊在线"
        rightElement={
          <Link href="/settings/character">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="w-5 h-5" />
            </Button>
          </Link>
        }
      />

      {/* Chat Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 px-4 py-4">
        <div className="max-w-lg mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3',
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}
            >
              {/* Avatar */}
              <div
                className={cn(
                  'w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0',
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-cute-sky to-cute-mint'
                    : 'bg-gradient-to-br from-primary to-cute-coral'
                )}
              >
                <span className="text-lg">
                  {message.role === 'user' ? '👤' : '🧸'}
                </span>
              </div>

              {/* Message Bubble */}
              <div
                className={cn(
                  'max-w-[75%] rounded-2xl px-4 py-3',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                    : 'bg-card shadow-sm rounded-tl-sm'
                )}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p
                  className={cn(
                    'text-[10px] mt-1',
                    message.role === 'user'
                      ? 'text-primary-foreground/70'
                      : 'text-muted-foreground'
                  )}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-cute-coral flex items-center justify-center">
                <span className="text-lg">🧸</span>
              </div>
              <div className="bg-card shadow-sm rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" />
                  <div
                    className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border bg-card/95 backdrop-blur-md px-4 py-3 safe-area-pb">
        <div className="max-w-lg mx-auto flex items-end gap-2">
          {/* Voice Button */}
          <Button
            variant="outline"
            size="icon"
            className={cn(
              'rounded-full flex-shrink-0 transition-all',
              isRecording && 'bg-destructive text-destructive-foreground border-destructive'
            )}
            onClick={toggleRecording}
          >
            {isRecording ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </Button>

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入消息..."
              className="w-full resize-none rounded-2xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring max-h-32"
              rows={1}
              style={{
                height: 'auto',
                minHeight: '44px',
              }}
            />
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            size="icon"
            className="rounded-full bg-gradient-to-br from-primary to-cute-coral flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>

        {/* Recording Indicator */}
        {isRecording && (
          <div className="max-w-lg mx-auto mt-2 flex items-center justify-center gap-2 text-destructive">
            <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            <span className="text-sm">正在录音...</span>
          </div>
        )}
      </div>
    </div>
  )
}
