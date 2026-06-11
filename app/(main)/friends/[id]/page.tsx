"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { PageHeader } from "@/components/common/page-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  MessageCircle,
  Plane,
  Volume2,
  Gift,
  Calendar,
  Mic,
  Square,
  Play,
  Users,
} from "lucide-react"
import { useFriends, friendTypeLabels } from "@/lib/hooks/use-friends"
import type { FriendType } from "@/lib/types"
import Link from "next/link"
import { toast } from "sonner"

const giftOptions = [
  { id: "flower", name: "鲜花", color: "from-cute-pink to-cute-coral" },
  { id: "cake", name: "蛋糕", color: "from-cute-orange to-cute-pink" },
  { id: "star", name: "星星", color: "from-cute-orange to-cute-mint" },
  { id: "heart", name: "爱心", color: "from-secondary to-cute-coral" },
]

const friendTypeOptions: { value: FriendType; label: string; desc: string }[] = [
  { value: "lover", label: "情侣", desc: "最亲密的另一半" },
  { value: "friend", label: "朋友", desc: "一起玩耍的伙伴" },
  { value: "family", label: "亲人", desc: "像家人一样温暖" },
]

interface InteractionItem {
  id: string
  type: "voice" | "gift" | "reply"
  text: string
  fromMe: boolean
  duration?: number
}

export default function FriendDetailPage() {
  const params = useParams()
  const id = String(params.id)
  const { friends, loaded, updateFriend } = useFriends()
  const friend = friends.find((f) => f.id === id) || friends[0]

  const [voiceOpen, setVoiceOpen] = useState(false)
  const [giftOpen, setGiftOpen] = useState(false)
  const [typeOpen, setTypeOpen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordSeconds, setRecordSeconds] = useState(0)
  const [selectedGift, setSelectedGift] = useState<string | null>(null)
  const [interactions, setInteractions] = useState<InteractionItem[]>([])
  const [playingId, setPlayingId] = useState<string | null>(null)
  const recordTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (recordTimer.current) clearInterval(recordTimer.current)
    }
  }, [])

  if (!loaded || !friend) {
    return (
      <div className="flex flex-col min-h-screen bg-background pb-20">
        <PageHeader title="好友详情" showBack />
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          加载中...
        </div>
      </div>
    )
  }

  const intimacy = friend.intimacy

  // 模拟接收方的回应
  const simulateReply = (text: string, duration?: number) => {
    setTimeout(() => {
      const reply: InteractionItem = {
        id: `reply-${Date.now()}`,
        type: duration ? "voice" : "reply",
        text,
        fromMe: false,
        duration,
      }
      setInteractions((prev) => [...prev, reply])
      updateFriend(friend.id, { intimacy: Math.min(100, friend.intimacy + 1) })
      toast(`${friend.name} 回应了你`, { icon: "💬" })
    }, 1500)
  }

  const startRecording = () => {
    setIsRecording(true)
    setRecordSeconds(0)
    recordTimer.current = setInterval(() => {
      setRecordSeconds((s) => {
        if (s >= 60) {
          if (recordTimer.current) clearInterval(recordTimer.current)
          return s
        }
        return s + 1
      })
    }, 1000)
  }

  const sendVoice = () => {
    if (recordTimer.current) clearInterval(recordTimer.current)
    const duration = Math.max(1, recordSeconds)
    setIsRecording(false)
    setVoiceOpen(false)
    setRecordSeconds(0)
    setInteractions((prev) => [
      ...prev,
      {
        id: `voice-${Date.now()}`,
        type: "voice",
        text: "语音消息",
        fromMe: true,
        duration,
      },
    ])
    updateFriend(friend.id, { intimacy: Math.min(100, intimacy + 1) })
    toast.success(`已向 ${friend.name} 发送语音消息`)
    simulateReply(`${friend.name} 给你回了一条语音`, Math.floor(Math.random() * 5) + 2)
  }

  const sendGift = () => {
    if (!selectedGift) {
      toast.error("请先选择一个礼物")
      return
    }
    const gift = giftOptions.find((g) => g.id === selectedGift)
    setGiftOpen(false)
    setSelectedGift(null)
    setInteractions((prev) => [
      ...prev,
      {
        id: `gift-${Date.now()}`,
        type: "gift",
        text: `送出${gift?.name}`,
        fromMe: true,
      },
    ])
    updateFriend(friend.id, { intimacy: Math.min(100, intimacy + 3) })
    toast.success(`已赠送 ${gift?.name} 给 ${friend.name}，亲密度+3`)
    simulateReply(`${friend.name} 收下了你的${gift?.name}，开心地说谢谢！`)
  }

  const playVoice = (item: InteractionItem) => {
    setPlayingId(item.id)
    setTimeout(() => setPlayingId(null), (item.duration || 2) * 300)
  }

  const changeType = (type: FriendType) => {
    updateFriend(friend.id, {
      friendType: type,
      isCp: type === "lover",
    })
    setTypeOpen(false)
    toast.success(`已将 ${friend.name} 设为${friendTypeLabels[type]}好友`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <PageHeader title="好友详情" showBack />

      <div className="flex-1 p-4 space-y-4">
        {/* 好友信息卡片 */}
        <Card className="p-6 bg-card text-center">
          <div className="relative inline-block mb-4">
            <Avatar className="size-24 border-4 border-primary/20">
              <AvatarImage src={friend.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary text-3xl">
                {friend.name[0]}
              </AvatarFallback>
            </Avatar>
          </div>

          <h2 className="text-xl font-bold text-foreground mb-1">{friend.name}</h2>
          <p className="text-muted-foreground mb-4">{friend.ownerName}的玩偶</p>

          {/* 好友类型：可点击切换 */}
          <button
            onClick={() => setTypeOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4 hover:bg-primary/20 transition-colors"
          >
            <Users className="size-4" />
            <span className="text-sm font-medium">
              {friend.friendType ? `${friendTypeLabels[friend.friendType]}好友` : "设置好友类型"}
            </span>
            <span className="text-xs text-primary/60">点击更改</span>
          </button>

          {/* 亲密度 */}
          <div className="mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-sm text-muted-foreground">亲密度</span>
              <span className="text-lg font-bold text-primary">{intimacy}%</span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
                style={{ width: `${intimacy}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              再互动 {Math.max(0, 100 - intimacy)} 次可升级为挚友
            </p>
          </div>

          <p className="text-sm text-muted-foreground">上次见面: {friend.lastMeet}</p>
        </Card>

        {/* 互动统计 */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center bg-card">
            <Calendar className="size-5 text-primary mx-auto mb-1" />
            <div className="text-lg font-bold text-foreground">15</div>
            <div className="text-xs text-muted-foreground">相识天数</div>
          </Card>
          <Card className="p-3 text-center bg-card">
            <MessageCircle className="size-5 text-secondary mx-auto mb-1" />
            <div className="text-lg font-bold text-foreground">
              {42 + interactions.length}
            </div>
            <div className="text-xs text-muted-foreground">互动次数</div>
          </Card>
          <Card className="p-3 text-center bg-card">
            <Plane className="size-5 text-accent mx-auto mb-1" />
            <div className="text-lg font-bold text-foreground">3</div>
            <div className="text-xs text-muted-foreground">共同旅行</div>
          </Card>
        </div>

        {/* 快捷操作 */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">互动</h3>

          <Link href={`/travel/cp?friendId=${friend.id}`}>
            <Card className="p-4 bg-card hover:bg-card/80 transition-colors">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Plane className="size-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">CP旅行</h4>
                  <p className="text-sm text-muted-foreground">一起去旅行，记录美好时光</p>
                </div>
              </div>
            </Card>
          </Link>

          {/* 发送语音 */}
          <Card className="p-4 bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Volume2 className="size-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">发送语音</h4>
                  <p className="text-sm text-muted-foreground">给好友发送语音消息</p>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => setVoiceOpen(true)}>
                发送
              </Button>
            </div>
          </Card>

          {/* 赠送礼物 */}
          <Card className="p-4 bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-muted flex items-center justify-center">
                  <Gift className="size-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">赠送礼物</h4>
                  <p className="text-sm text-muted-foreground">送给好友一份虚拟礼物</p>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => setGiftOpen(true)}>
                赠送
              </Button>
            </div>
          </Card>
        </div>

        {/* 互动记录：展示发送与接收方回应 */}
        {interactions.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">互动记录</h3>
            <Card className="p-4 bg-card space-y-3">
              {interactions.map((item) => (
                <div
                  key={item.id}
                  className={`flex ${item.fromMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-3 py-2 ${
                      item.fromMe
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {item.type === "voice" ? (
                      <button
                        onClick={() => playVoice(item)}
                        className="flex items-center gap-2"
                      >
                        <Play
                          className={`size-4 ${playingId === item.id ? "animate-pulse" : ""}`}
                        />
                        <span className="text-sm">
                          {playingId === item.id ? "播放中..." : `语音 ${item.duration}″`}
                        </span>
                      </button>
                    ) : item.type === "gift" ? (
                      <div className="flex items-center gap-2">
                        <Gift className="size-4" />
                        <span className="text-sm">{item.text}</span>
                      </div>
                    ) : (
                      <span className="text-sm">{item.text}</span>
                    )}
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}
      </div>

      {/* 好友类型选择 */}
      <Dialog open={typeOpen} onOpenChange={setTypeOpen}>
        <DialogContent className="max-w-sm mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center">设置好友类型</DialogTitle>
            <DialogDescription className="text-center">
              选择你和 {friend.name} 的关系
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            {friendTypeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => changeType(opt.value)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                  friend.friendType === opt.value
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className="text-left">
                  <div className="font-medium text-foreground">{opt.label}</div>
                  <div className="text-xs text-muted-foreground">{opt.desc}</div>
                </div>
                {friend.friendType === opt.value && (
                  <span className="text-xs px-2 py-1 rounded-full bg-primary text-primary-foreground">
                    当前
                  </span>
                )}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* 语音录制对话框 */}
      <Dialog
        open={voiceOpen}
        onOpenChange={(o) => {
          setVoiceOpen(o)
          if (!o) {
            setIsRecording(false)
            setRecordSeconds(0)
            if (recordTimer.current) clearInterval(recordTimer.current)
          }
        }}
      >
        <DialogContent className="max-w-sm mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center">发送语音给 {friend.name}</DialogTitle>
            <DialogDescription className="text-center">
              {isRecording ? "正在录音，点击停止结束" : "点击录音按钮开始录制语音消息"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-6 gap-4">
            <button
              onClick={isRecording ? sendVoice : startRecording}
              className={`size-20 rounded-full flex items-center justify-center transition-all ${
                isRecording
                  ? "bg-destructive animate-pulse"
                  : "bg-primary hover:bg-primary/90"
              }`}
            >
              {isRecording ? (
                <Square className="size-8 text-white fill-white" />
              ) : (
                <Mic className="size-8 text-primary-foreground" />
              )}
            </button>
            <p className="text-2xl font-bold text-foreground tabular-nums">
              {String(Math.floor(recordSeconds / 60)).padStart(2, "0")}:
              {String(recordSeconds % 60).padStart(2, "0")}
            </p>
          </div>
          {isRecording && (
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button
                onClick={sendVoice}
                className="w-full rounded-xl bg-primary hover:bg-primary/90"
              >
                停止并发送
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* 赠送礼物对话框 */}
      <Dialog
        open={giftOpen}
        onOpenChange={(o) => {
          setGiftOpen(o)
          if (!o) setSelectedGift(null)
        }}
      >
        <DialogContent className="max-w-sm mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center">赠送礼物给 {friend.name}</DialogTitle>
            <DialogDescription className="text-center">
              选择一份心意，增进彼此的亲密度
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-2">
            {giftOptions.map((gift) => (
              <button
                key={gift.id}
                onClick={() => setSelectedGift(gift.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                  selectedGift === gift.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div
                  className={`size-12 rounded-2xl bg-gradient-to-br ${gift.color} flex items-center justify-center`}
                >
                  <Gift className="size-6 text-white" />
                </div>
                <span className="text-sm font-medium text-foreground">{gift.name}</span>
              </button>
            ))}
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button
              onClick={sendGift}
              disabled={!selectedGift}
              className="w-full rounded-xl bg-primary hover:bg-primary/90"
            >
              确认赠送
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
