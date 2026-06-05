"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { PageHeader } from "@/components/common/page-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Heart, 
  MessageCircle, 
  Plane, 
  Sparkles, 
  Volume2,
  Gift,
  Calendar
} from "lucide-react"
import { mockFriends } from "@/lib/mock-data"
import Link from "next/link"

export default function FriendDetailPage() {
  const params = useParams()
  const friend = mockFriends.find(f => f.id === params.id) || mockFriends[0]
  const [showAnimation, setShowAnimation] = useState(false)

  const triggerSpecialEffect = () => {
    setShowAnimation(true)
    setTimeout(() => setShowAnimation(false), 2000)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <PageHeader title="好友详情" showBack />
      
      <div className="flex-1 p-4 space-y-4">
        {/* 好友信息卡片 */}
        <Card className="p-6 bg-card text-center relative overflow-hidden">
          {showAnimation && (
            <div className="absolute inset-0 flex items-center justify-center bg-primary/10 z-10">
              <div className="text-center animate-bounce">
                <Sparkles className="w-16 h-16 text-secondary mx-auto mb-2" />
                <p className="text-lg font-medium text-primary">好友特效触发!</p>
              </div>
            </div>
          )}
          
          <div className="relative inline-block mb-4">
            <Avatar className="w-24 h-24 border-4 border-primary/20">
              <AvatarImage src={friend.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary text-3xl">
                {friend.name[0]}
              </AvatarFallback>
            </Avatar>
            {friend.isCp && (
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
            )}
          </div>

          <h2 className="text-xl font-bold text-foreground mb-1">{friend.name}</h2>
          <p className="text-muted-foreground mb-4">{friend.ownerName}的玩偶</p>

          {friend.isCp && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary mb-4">
              <Heart className="w-4 h-4 fill-secondary" />
              <span className="text-sm font-medium">CP好友</span>
            </div>
          )}

          {/* 亲密度 */}
          <div className="mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-sm text-muted-foreground">亲密度</span>
              <span className="text-lg font-bold text-primary">{friend.intimacy}%</span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
                style={{ width: `${friend.intimacy}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              再互动 {100 - friend.intimacy} 次可升级为挚友
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            上次见面: {friend.lastMeet}
          </p>
        </Card>

        {/* 互动统计 */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center bg-card">
            <Calendar className="w-5 h-5 text-primary mx-auto mb-1" />
            <div className="text-lg font-bold text-foreground">15</div>
            <div className="text-xs text-muted-foreground">相识天数</div>
          </Card>
          <Card className="p-3 text-center bg-card">
            <MessageCircle className="w-5 h-5 text-secondary mx-auto mb-1" />
            <div className="text-lg font-bold text-foreground">42</div>
            <div className="text-xs text-muted-foreground">互动次数</div>
          </Card>
          <Card className="p-3 text-center bg-card">
            <Plane className="w-5 h-5 text-accent mx-auto mb-1" />
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
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">CP专属特效</h4>
                    <p className="text-sm text-muted-foreground">
                      触发CP专属表情和声音
                    </p>
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
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Plane className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">CP旅行</h4>
                  <p className="text-sm text-muted-foreground">
                    一起去旅行，记录美好时光
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Card className="p-4 bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">发送语音</h4>
                  <p className="text-sm text-muted-foreground">
                    给好友发送语音消息
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                发送
              </Button>
            </div>
          </Card>

          <Card className="p-4 bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Gift className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">赠送礼物</h4>
                  <p className="text-sm text-muted-foreground">
                    送给好友一份虚拟礼物
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                赠送
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
