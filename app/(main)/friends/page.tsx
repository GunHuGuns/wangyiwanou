"use client"

import { useState } from "react"
import { PageHeader } from "@/components/common/page-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Sparkles, Heart, MessageCircle, Wifi } from "lucide-react"
import { mockFriends } from "@/lib/mock-data"
import Link from "next/link"

export default function FriendsPage() {
  const [isSearching, setIsSearching] = useState(false)
  const [nearbyToys, setNearbyToys] = useState<typeof mockFriends>([])

  const searchNearby = () => {
    setIsSearching(true)
    setTimeout(() => {
      setIsSearching(false)
      // 模拟发现附近玩偶
      setNearbyToys([
        {
          id: "new1",
          name: "小云朵",
          avatar: "",
          ownerName: "小芳",
          intimacy: 0,
          lastMeet: "刚刚发现",
          isCp: false,
        },
      ])
    }, 2000)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <PageHeader title="玩偶社交" showBack />
      
      <div className="flex-1 p-4">
        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="friends">我的好友</TabsTrigger>
            <TabsTrigger value="nearby">碰一碰</TabsTrigger>
          </TabsList>

          <TabsContent value="friends" className="space-y-4">
            {/* 好友统计 */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="p-3 text-center bg-card">
                <div className="text-2xl font-bold text-primary">{mockFriends.length}</div>
                <div className="text-xs text-muted-foreground">好友总数</div>
              </Card>
              <Card className="p-3 text-center bg-card">
                <div className="text-2xl font-bold text-secondary">
                  {mockFriends.filter(f => f.isCp).length}
                </div>
                <div className="text-xs text-muted-foreground">CP好友</div>
              </Card>
              <Card className="p-3 text-center bg-card">
                <div className="text-2xl font-bold text-accent">12</div>
                <div className="text-xs text-muted-foreground">互动次数</div>
              </Card>
            </div>

            {/* 好友列表 */}
            <div className="space-y-3">
              {mockFriends.map((friend) => (
                <Link key={friend.id} href={`/friends/${friend.id}`}>
                  <Card className="p-4 bg-card hover:bg-card/80 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-14 h-14 border-2 border-primary/20">
                          <AvatarImage src={friend.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary text-lg">
                            {friend.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        {friend.isCp && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                            <Heart className="w-3 h-3 text-white fill-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{friend.name}</span>
                          {friend.isCp && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/20 text-secondary">
                              CP
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {friend.ownerName}的玩偶
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${friend.intimacy}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            亲密度 {friend.intimacy}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="nearby" className="space-y-4">
            {/* 碰一碰说明 */}
            <Card className="p-4 bg-primary/10 border-primary/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Wifi className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">碰一碰交友</h3>
                  <p className="text-sm text-muted-foreground">
                    两只玩偶靠近碰一碰，即可成为好友
                  </p>
                </div>
              </div>
            </Card>

            {/* 搜索按钮 */}
            <Card className="p-6 text-center bg-card">
              <div className={`w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4 ${isSearching ? 'animate-pulse' : ''}`}>
                <Users className={`w-12 h-12 text-primary ${isSearching ? 'animate-bounce' : ''}`} />
              </div>
              <Button 
                onClick={searchNearby}
                disabled={isSearching}
                className="bg-primary hover:bg-primary/90"
              >
                {isSearching ? "搜索中..." : "搜索附近玩偶"}
              </Button>
            </Card>

            {/* 发现的玩偶 */}
            {nearbyToys.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-secondary" />
                  发现新朋友
                </h3>
                <div className="space-y-3">
                  {nearbyToys.map((toy) => (
                    <Card key={toy.id} className="p-4 bg-card border-primary/30">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-14 h-14 border-2 border-primary/30">
                          <AvatarImage src={toy.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary text-lg">
                            {toy.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">{toy.name}</div>
                          <p className="text-sm text-muted-foreground">
                            {toy.ownerName}的玩偶
                          </p>
                          <p className="text-xs text-secondary mt-1">{toy.lastMeet}</p>
                        </div>
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          <Heart className="w-4 h-4 mr-1" />
                          加好友
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
