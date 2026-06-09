'use client'

import { useState, useRef, useEffect } from 'react'
import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sparkles, Play, Trash2 } from 'lucide-react'
import { ChatMessage } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useDevice, isDeviceUsable } from '@/lib/hooks/use-device'
import { DeviceStatusBanner } from '@/components/common/device-status-banner'
import { toast } from 'sonner'

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    content: '你好呀！今天想和我聊点什么呢？',
    role: 'assistant',
    timestamp: new Date(),
    kind: 'text',
  },
]

export default function ChatPage() {
  const { device, loaded } = useDevice()
  const usable = isDeviceUsable(device)
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [isTyping] = useState(false)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleClearMessages = () => {
    setMessages(initialMessages)
    setPlayingId(null)
    toast.success('已清除聊天记录')
  }

  const playVoice = (msg: ChatMessage) => {
    setPlayingId(msg.id)
    setTimeout(() => setPlayingId(null), (msg.duration || 2) * 300)
  }

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="flex flex-col h-[100dvh] pb-[72px] bg-gradient-to-br from-cute-cream via-background to-cute-pink/10">
      <PageHeader title="和玩偶对话" />

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
                  {formatTime(message.timestamp)}
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

      {/* 底部操作区 */}
      <div className="border-t border-border bg-card/95 backdrop-blur-md px-4 py-3">
        <div className="max-w-lg mx-auto">
          <Button
            variant="outline"
            onClick={handleClearMessages}
            disabled={messages.length <= 1}
            className="w-full rounded-2xl h-11 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-5 h-5 mr-2" />
            清除聊天记录
          </Button>
        </div>
      </div>
    </div>
  )
}
