"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
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
  Camera, 
  MapPin, 
  Image as ImageIcon,
  Share2,
  Sparkles,
  Check
} from "lucide-react"
import { mockFriends } from "@/lib/mock-data"
import { useApp } from "@/lib/contexts/app-context"
import { toast } from "sonner"

const destinationOptions = [
  { id: "paris", name: "巴黎", desc: "浪漫之都，埃菲尔铁塔" },
  { id: "tokyo", name: "东京", desc: "繁华都市，樱花满街" },
  { id: "sanya", name: "三亚", desc: "阳光沙滩，碧海蓝天" },
  { id: "xian", name: "西安", desc: "千年古都，兵马俑" },
  { id: "lijiang", name: "丽江", desc: "古城慢生活，雪山相伴" },
  { id: "iceland", name: "冰岛", desc: "极光与冰川的奇境" },
]

const cpTravelMemories = [
  {
    id: "1",
    location: "西湖",
    date: "2024-01-15",
    image: "/cp-travel/xihu.png",
    description: "和好友在西湖边散步，断桥残雪真美~",
  },
  {
    id: "2",
    location: "故宫",
    date: "2024-01-10",
    image: "/cp-travel/gugong.png",
    description: "故宫的红墙金瓦，我们拍了很多合照！",
  },
]

function CPTravelContent() {
  const searchParams = useSearchParams()
  const friendId = searchParams.get("friendId")
  const friend = mockFriends.find(f => f.id === friendId) || mockFriends[0]
  const { state } = useApp()
  const myToy = state.connectedDevice

  const [isGenerating, setIsGenerating] = useState(false)
  const [destOpen, setDestOpen] = useState(false)
  const [selectedDest, setSelectedDest] = useState<string | null>(null)
  const [chosenDest, setChosenDest] = useState<(typeof destinationOptions)[number] | null>(null)
  const [memories, setMemories] = useState(cpTravelMemories)

  const confirmDestination = () => {
    if (!selectedDest) {
      toast.error("请先选择一个目的地")
      return
    }
    const dest = destinationOptions.find((d) => d.id === selectedDest) || null
    setChosenDest(dest)
    setDestOpen(false)
    toast.success(`已选择目的地：${dest?.name}，点击生成合照开启旅程`)
  }

  const generatePostcard = () => {
    if (!chosenDest) {
      toast.error("请先选择旅行目的地")
      setDestOpen(true)
      return
    }
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      const newMemory = {
        id: `m-${Date.now()}`,
        location: chosenDest.name,
        date: new Date().toISOString().slice(0, 10),
        image: "/cp-travel/generic.png",
        description: `和${friend.name}一起来到${chosenDest.name}，${chosenDest.desc}，留下了甜蜜合照~`,
      }
      setMemories((prev) => [newMemory, ...prev])
      toast.success(`${chosenDest.name}合照生成成功，已保存到旅行回忆`)
      setChosenDest(null)
      setSelectedDest(null)
    }, 2000)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <PageHeader title="CP旅行" showBack />
      
      <div className="flex-1 p-4 space-y-4">
        {/* CP信息 */}
        <Card className="p-4 bg-card">
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <Avatar className="w-16 h-16 border-2 border-primary/20 mx-auto mb-2">
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  {myToy?.name?.[0] || "我"}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm font-medium text-foreground">
                {myToy?.name || "我的玩偶"}
              </p>
            </div>
            
            <div className="flex flex-col items-center gap-1">
              <Heart className="w-8 h-8 text-secondary fill-secondary" />
              <span className="text-xs text-secondary font-medium">CP</span>
            </div>
            
            <div className="text-center">
              <Avatar className="w-16 h-16 border-2 border-secondary/20 mx-auto mb-2">
                <AvatarImage src={friend.avatar} />
                <AvatarFallback className="bg-secondary/10 text-secondary text-xl">
                  {friend.name[0]}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm font-medium text-foreground">{friend.name}</p>
            </div>
          </div>
        </Card>

        {/* 旅行统计 */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center bg-card">
            <div className="text-2xl font-bold text-primary">5</div>
            <div className="text-xs text-muted-foreground">共同旅行</div>
          </Card>
          <Card className="p-3 text-center bg-card">
            <div className="text-2xl font-bold text-secondary">12</div>
            <div className="text-xs text-muted-foreground">合照数量</div>
          </Card>
          <Card className="p-3 text-center bg-card">
            <div className="text-2xl font-bold text-accent">8</div>
            <div className="text-xs text-muted-foreground">明信片</div>
          </Card>
        </div>

        {/* 创建新旅行 */}
        <Card className="p-4 bg-primary/10 border-primary/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">开启新旅程</h3>
              <p className="text-sm text-muted-foreground">
                {chosenDest
                  ? `目的地：${chosenDest.name}`
                  : `和${friend.name}一起去冒险吧！`}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={chosenDest ? "default" : "outline"}
              className={chosenDest ? "h-auto py-3 bg-secondary hover:bg-secondary/90" : "h-auto py-3"}
              onClick={() => setDestOpen(true)}
            >
              <div className="text-center">
                <MapPin className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm">
                  {chosenDest ? chosenDest.name : "选择目的地"}
                </span>
              </div>
            </Button>
            <Button 
              className="h-auto py-3 bg-primary hover:bg-primary/90"
              onClick={generatePostcard}
              disabled={isGenerating}
            >
              <div className="text-center">
                <Camera className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm">
                  {isGenerating ? "生成中..." : "生成合照"}
                </span>
              </div>
            </Button>
          </div>
        </Card>

        {/* 旅行回忆 */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">旅行回忆</h3>
          <div className="space-y-3">
            {memories.map((memory) => (
              <Card key={memory.id} className="overflow-hidden bg-card">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  {memory.image ? (
                    <img
                      src={memory.image || "/placeholder.svg"}
                      alt={`${memory.location} 合照`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">{memory.location} 合照</p>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-secondary" />
                    <span className="text-sm font-medium text-foreground">
                      {memory.location}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {memory.date}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {memory.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => toast(`查看${memory.location}合照`)}>
                      <ImageIcon className="w-4 h-4 mr-1" />
                      查看
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.success("已复制分享链接")}>
                      <Share2 className="w-4 h-4 mr-1" />
                      分享
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* 选择目的地对话框 */}
      <Dialog
        open={destOpen}
        onOpenChange={(o) => {
          setDestOpen(o)
          if (!o && !chosenDest) setSelectedDest(null)
        }}
      >
        <DialogContent className="max-w-sm mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center">选择旅行目的地</DialogTitle>
            <DialogDescription className="text-center">
              和 {friend.name} 一起去哪里呢？
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-2 max-h-72 overflow-y-auto">
            {destinationOptions.map((dest) => (
              <button
                key={dest.id}
                onClick={() => setSelectedDest(dest.id)}
                className={`flex flex-col items-start gap-1 p-3 rounded-2xl border-2 text-left transition-all ${
                  selectedDest === dest.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className="flex items-center gap-1.5 w-full">
                  <MapPin className="size-4 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground">{dest.name}</span>
                  {selectedDest === dest.id && (
                    <Check className="size-4 text-primary ml-auto" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{dest.desc}</span>
              </button>
            ))}
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button
              onClick={confirmDestination}
              disabled={!selectedDest}
              className="w-full rounded-xl bg-primary hover:bg-primary/90"
            >
              确认目的地
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function CPTravelPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col min-h-screen bg-background pb-20">
          <PageHeader title="CP旅行" showBack />
          <div className="flex-1 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          </div>
        </div>
      }
    >
      <CPTravelContent />
    </Suspense>
  )
}
