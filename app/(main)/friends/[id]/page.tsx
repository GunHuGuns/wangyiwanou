"use client"

import { useState } from "react"
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
  Heart,
  MessageCircle,
  Plane,
  Sparkles,
  Volume2,
  Gift,
  Calendar,
  Mic,
  Square,
} from "lucide-react"
import { mockFriends } from "@/lib/mock-data"
import Link from "next/link"
import { toast } from "sonner"

const giftOptions = [
  { id: "flower", name: "鲜花", emoji: "花束", color: "from-cute-pink to-cute-coral" },
  { id: "cake", name: "蛋糕", emoji: "蛋糕", color: "from-cute-orange to-cute-pink" },
  { id: "star", name: "星星", emoji: "星星", color: "from-cute-orange to-cute-mint" },
  { id: "heart", name: "爱心", emoji: "爱心", color: "from-secondary to-cute-coral" },
]

export default function FriendDetailPage() {
  const params = useParams()
  const friend = mockFriends.find((f) => f.id === params.id) || mockFriends[0]
  const [showAnimation, setShowAnimation] = useState(false)
  const [voiceOpen, setVoiceOpen] = useState(false)
  const [giftOpen, setGiftOpen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordSeconds, setRecordSeconds] = useState(0)
  const [selectedGift, setSelectedGift] = useState<string | null>(null)
  const [intimacy, setIntimacy] = useState(friend.intimacy)

  const triggerSpecialEffect = () => {
    setShowAnimation(true)
    toast.success("已触发CP专属特效")
    setTimeout(() => setShowAnimation(false), 2000)
  }

  const startRecording = () => {
    setIsRecording(true)
    setRecordSeconds(0)
    const timer = setInterval(() => {
      setRecordSeconds((s) => {
        if (s >= 10) {
          clearInterval(timer)
          return s
        }
        return s + 1
      })
    }, 1000)
    ;(window as any).__voiceTimer = timer
  }

  const sendVoice = () => {
    clearInterval((window as any).__voiceTimer)
    setIsRecording(false)
    setVoiceOpen(false)
    setIntimacy((v) => Math.min(100, v + 1))
    toast.success(`已向 ${friend.name} 发送语音消息`)
    setRecordSeconds(0)
  }

  const sendGift = () => {
    if (!selectedGift) {
      toast.error("请先选择一个礼物")
      return
    }
    const gift = giftOptions.find((g) => g.id === selectedGift)
    setGiftOpen(false)
    setSelectedGift(null)
    setIntimacy((v) => Math.min(100, v + 3))
    toast.success(`已赠送 ${gift?.name} 给 ${friend.name}，亲密度+3`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <PageHeader title="好友详情" showBack />

      <div className="flex-1 p-4 space-y-4">
        {/* 好友信息卡片 */}
        <Card className="p-6 bg-card text-center relative overflow-hidden">
          {showAnimation && (
            <div className="absolute inset-0 flex items-center justify-center bg-primary/10 z-10 backdrop-blur-sm">
              <div className="text-center animate-bounce">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Heart className="size-8 text-secondary fill-secondary animate-pulse" />
                  <Sparkles className="size-12 text-secondary" />
                  <Heart className="size-8 text-secondary fill-secondary animate-pulse" />
                </div>
                <p className="text-lg font-medium text-primary">CP专属特效触发!</p>
              </div>
            </div>
          )}

          <div className="relative inline-block mb-4">
            <Avatar className="size-24 border-4 border-primary/20">
              <AvatarImage src={friend.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary text-3xl">
                {friend.name[0]}
              </AvatarFallback>
            </Avatar>
            {friend.isCp && (
              <div className="absolute -bottom-2 -right-2 size-8 rounded-full bg-secondary flex items-center justify-center">
                <Heart className="size-4 text-white fill-white" />
              </div>
            )}
          </div>

          <h2 className="text-xl font-bold text-foreground mb-1">{friend.name}</h2>
          <p className="text-muted-foreground mb-4">{friend.ownerName}的玩偶</p>

          {friend.isCp && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary mb-4">
              <Heart className="size-4 fill-secondary" />
              <span className="text-sm font-medium">CP好友</span>
            </div>
          )}

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
            <div className="text-lg font-bold text-foreground">42</div>
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

          {friend.isCp && (
            <Card className="p-4 bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Sparkles className="size-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">CP专属特效</h4>
                    <p className="text-sm text-muted-foreground">触发CP专属表情和声音</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={triggerSpecialEffect}
                  className="bg-secondary hover:bg-secondary/90"
                >
                  触发
                </Button>
              </div>
            </Card>
          )}

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
          )}

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
      </div>

      {/* 语音录制对话框 */}
      <Dialog open={voiceOpen} onOpenChange={(o) => { setVoiceOpen(o); if (!o) { setIsRecording(false); setRecordSeconds(0); clearInterval((window as any).__voiceTimer) } }}>
        <DialogContent className="max-w-sm mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center">发送语音给 {friend.name}</DialogTitle>
            <DialogDescription className="text-center">
              {isRecording ? "正在录音，点击停止结束" : "按住录音按钮开始录制语音消息"}
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
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            {isRecording && (
              <Button onClick={sendVoice} className="w-full rounded-xl bg-primary hover:bg-primary/90">
                停止并发送
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 赠送礼物对话框 */}
      <Dialog open={giftOpen} onOpenChange={(o) => { setGiftOpen(o); if (!o) setSelectedGift(null) }}>
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
