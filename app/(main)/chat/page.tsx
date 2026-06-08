'use client'

import { useState, useRef, useEffect } from 'react'
import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Mic, Keyboard, Sparkles, Settings, Play } from 'lucide-react'
import { ChatMessage } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useDevice, isDeviceUsable } from '@/lib/hooks/use-device'
import { DeviceStatusBanner } from '@/components/common/device-status-banner'
import Link from 'next/link'

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    content: '你好呀！今天想和我聊点什么呢？',
    role: 'assistant',
    timestamp: new Date(),
    kind: 'text',
  },
]

const textResponses = [
  '嗯嗯，我明白你的意思了！',
  '哇，听起来很有趣呢！',
  '我也这么觉得！你说得太对了~',
  '让我想想...其实我觉得每个人都有自己的想法，重要的是跟随自己的内心呢！',
  '你今天心情怎么样呀？有什么想和我分享的吗？',
  '嘻嘻，和你聊天真开心！',
]

export default function ChatPage() {
  const { device, loaded } = useDevice()
  const usable = isDeviceUsable(device)
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  // 输入模式：文字 / 语音
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text')
  const [isRecording, setIsRecording] = useState(false)
  const [recordSeconds, setRecordSeconds] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const recordTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  // 用 ref 跟踪录音状态与时长，避免事件回调闭包拿到旧值导致"按住说话失效"
  const recordingRef = useRef(false)
  const secondsRef = useRef(0)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  useEffect(() => {
    return () => {
      if (recordTimer.current) clearInterval(recordTimer.current)
    }
  }, [])

  const replyFromAssistant = () => {
    setIsTyping(true)
    setTimeout(() => {
      const randomResponse =
        textResponses[Math.floor(Math.random() * textResponses.length)]
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: randomResponse,
          role: 'assistant',
          timestamp: new Date(),
          kind: 'text',
        },
      ])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  const handleSend = () => {
    if (!inputValue.trim()) return
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        content: inputValue.trim(),
        role: 'user',
        timestamp: new Date(),
        kind: 'text',
      },
    ])
    setInputValue('')
    replyFromAssistant()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const startRecording = () => {
    // 防止重复触发
    if (recordingRef.current) return
    recordingRef.current = true
    secondsRef.current = 0
    setIsRecording(true)
    setRecordSeconds(0)
    if (recordTimer.current) clearInterval(recordTimer.current)
    recordTimer.current = setInterval(() => {
      secondsRef.current = Math.min(60, secondsRef.current + 1)
      setRecordSeconds(secondsRef.current)
      if (secondsRef.current >= 60) {
        finishRecording(true)
      }
    }, 1000)
  }

  const finishRecording = (send: boolean) => {
    if (!recordingRef.current) return
    recordingRef.current = false
    if (recordTimer.current) {
      clearInterval(recordTimer.current)
      recordTimer.current = null
    }
    const duration = Math.max(1, secondsRef.current)
    setIsRecording(false)
    setRecordSeconds(0)
    secondsRef.current = 0
    if (!send) return
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        content: '语音消息',
        role: 'user',
        timestamp: new Date(),
        kind: 'voice',
        duration,
      },
    ])
    replyFromAssistant()
  }

  const playVoice = (msg: ChatMessage) => {
    setPlayingId(msg.id)
    setTimeout(() => setPlayingId(null), (msg.duration || 2) * 300)
  }

  // 仅在客户端挂载后渲染时间，避免服务端/客户端时间不一致导致的 hydration 报错
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="flex flex-col h-[100dvh] pb-[72px] bg-gradient-to-br from-cute-cream via-background to-cute-pink/10">
      <PageHeader
        title="和玩偶对话"
        rightAction={
          <Link href="/settings/character">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="w-5 h-5" />
            </Button>
          </Link>
        }
      />

      {/* 设备异常时的提示横幅 */}
      {loaded && !usable && (
        <div className="px-4 pt-3">
          <div className="max-w-lg mx-auto">
            <DeviceStatusBanner device={device} feature="和玩偶对话" />
          </div>
        </div>
      )}

      {/* 消息列表 */}
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
              <div
                className={cn(
                  'w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0',
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-cute-sky to-cute-mint'
                    : 'bg-gradient-to-br from-primary to-cute-coral'
                )}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </div>

              <div
                className={cn(
                  'max-w-[75%] rounded-2xl px-4 py-3',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                    : 'bg-card shadow-sm rounded-tl-sm'
                )}
              >
                {message.kind === 'voice' ? (
                  <button
                    onClick={() => playVoice(message)}
                    className="flex items-center gap-2"
                    style={{ minWidth: `${Math.min(160, 50 + (message.duration || 2) * 10)}px` }}
                  >
                    <Play
                      className={cn('w-4 h-4', playingId === message.id && 'animate-pulse')}
                    />
                    <span className="flex-1 flex items-center gap-0.5">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <span
                          key={i}
                          className={cn(
                            'inline-block w-0.5 rounded-full',
                            message.role === 'user'
                              ? 'bg-primary-foreground/70'
                              : 'bg-muted-foreground/50'
                          )}
                          style={{ height: `${6 + ((i * 5) % 12)}px` }}
                        />
                      ))}
                    </span>
                    <span className="text-sm tabular-nums">
                      {playingId === message.id ? '播放中' : `${message.duration}″`}
                    </span>
                  </button>
                ) : (
                  <p className="text-sm leading-relaxed">{message.content}</p>
                )}
                <p
                  className={cn(
                    'text-[10px] mt-1',
                    message.role === 'user'
                      ? 'text-primary-foreground/70'
                      : 'text-muted-foreground'
                  )}
                >
                  {mounted ? formatTime(message.timestamp) : ''}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-cute-coral flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
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

      {/* 输入区 */}
      <div className="border-t border-border bg-card/95 backdrop-blur-md px-4 py-3">
        {loaded && !usable ? (
          <div className="max-w-lg mx-auto text-center text-sm text-muted-foreground py-2">
            玩偶{device ? '当前不在线' : '未连接'}，请先连接后再聊天
          </div>
        ) : (
          <>
            <div className="max-w-lg mx-auto flex items-end gap-2">
              {/* 文字 / 语音 模式切换 */}
              <Button
                variant="outline"
                size="icon"
                className="rounded-full flex-shrink-0"
                onClick={() => {
                  setInputMode((m) => (m === 'text' ? 'voice' : 'text'))
                  setIsRecording(false)
                }}
                aria-label={inputMode === 'text' ? '切换到语音输入' : '切换到键盘输入'}
              >
                {inputMode === 'text' ? (
                  <Mic className="w-5 h-5" />
                ) : (
                  <Keyboard className="w-5 h-5" />
                )}
              </Button>

              {inputMode === 'text' ? (
                <>
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="输入消息..."
                      className="w-full resize-none rounded-2xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring max-h-32"
                      rows={1}
                      style={{ minHeight: '44px' }}
                    />
                  </div>
                  <Button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isTyping}
                    size="icon"
                    className="rounded-full bg-gradient-to-br from-primary to-cute-coral flex-shrink-0"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </>
              ) : (
                /* 按住说话 */
                <button
                  onPointerDown={(e) => {
                    e.preventDefault()
                    startRecording()
                    try {
                      e.currentTarget.setPointerCapture(e.pointerId)
                    } catch {}
                  }}
                  onPointerUp={(e) => {
                    e.preventDefault()
                    finishRecording(true)
                  }}
                  onPointerCancel={() => finishRecording(false)}
                  className={cn(
                    'flex-1 h-11 rounded-2xl border border-input text-sm font-medium select-none touch-none transition-colors',
                    isRecording
                      ? 'bg-destructive text-destructive-foreground'
                      : 'bg-background text-foreground active:bg-muted'
                  )}
                >
                  {isRecording ? `松开发送 · ${recordSeconds}″` : '按住 说话'}
                </button>
              )}
            </div>

            {isRecording && (
              <div className="max-w-lg mx-auto mt-2 flex items-center justify-center gap-2 text-destructive">
                <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                <span className="text-sm">正在录音... 松开发送</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
