"use client"

import { useState } from "react"
import { PageHeader } from "@/components/common/page-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Sparkles, Heart, Wifi, UserPlus, Check, X, Clock } from "lucide-react"
import { useFriends, friendTypeLabels } from "@/lib/hooks/use-friends"
import type { Friend, FriendType } from "@/lib/types"
import Link from "next/link"
import { toast } from "sonner"

interface FriendRequest {
  id: string
  name: string
  avatar: string
  ownerName: string
  message: string
  time: string
}

interface NearbyToy extends Friend {
  // 本地状态：是否已发起申请（等待对方通过）
  requested?: boolean
}

const initialRequests: FriendRequest[] = [
  {
    id: "req1",
    name: "棉花糖",
    avatar: "",
    ownerName: "小雨",
    message: "我们在公园碰到啦，加个好友吧~",
    time: "5分钟前",
  },
  {
    id: "req2",
    name: "团子",
    avatar: "",
    ownerName: "小天",
    message: "想和你的玩偶做朋友！",
    time: "2小时前",
  },
]

const friendTypeStyles: Record<FriendType, string> = {
  lover: "bg-secondary/20 text-secondary",
  friend: "bg-primary/15 text-primary",
  family: "bg-cute-mint/30 text-cute-mint",
}

export default function FriendsPage() {
  const { friends, addFriend, updateFriend } = useFriends()
  const [isSearching, setIsSearching] = useState(false)
  const [nearbyToys, setNearbyToys] = useState<NearbyToy[]>([])
  const [requests, setRequests] = useState<FriendRequest[]>(initialRequests)

  // 已通过的好友（排除等待对方通过的申请）
  const acceptedFriends = friends.filter((f) => !f.pending)
  const pendingFriends = friends.filter((f) => f.pending)

  const searchNearby = () => {
    setIsSearching(true)
    setTimeout(() => {
      setIsSearching(false)
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
      toast.success("发现 1 只附近的玩偶")
    }, 2000)
  }

  // 碰一碰发起申请：进入等待对方通过状态
  const requestNearby = (toy: NearbyToy) => {
    if (toy.requested) return
    setNearbyToys((prev) =>
      prev.map((t) => (t.id === toy.id ? { ...t, requested: true } : t))
    )
    addFriend({
      ...toy,
      requested: undefined,
      pending: true,
      friendType: "friend",
      lastMeet: "刚刚",
    } as Friend)
    toast.success(`已向 ${toy.name} 发送好友申请，等待对方通过`)
  }

  const acceptRequest = (req: FriendRequest) => {
    addFriend({
      id: req.id,
      name: req.name,
      avatar: req.avatar,
      ownerName: req.ownerName,
      intimacy: 10,
      lastMeet: "刚刚",
      isCp: false,
      friendType: "friend",
    })
    setRequests((prev) => prev.filter((r) => r.id !== req.id))
    toast.success(`已通过 ${req.name} 的好友请求`)
  }

  const rejectRequest = (req: FriendRequest) => {
    setRequests((prev) => prev.filter((r) => r.id !== req.id))
    toast(`已拒绝 ${req.name} 的请求`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <PageHeader title="玩偶社交" showBack />

      <div className="flex-1 p-4">
        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="friends">我的好友</TabsTrigger>
            <TabsTrigger value="requests" className="relative">
              新朋友
              {requests.length > 0 && (
                <span className="ml-1 inline-flex items-center justify-center min-w-4 h-4 px-1 text-[10px] rounded-full bg-secondary text-secondary-foreground">
                  {requests.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="nearby">碰一碰</TabsTrigger>
          </TabsList>

          <TabsContent value="friends" className="space-y-4">
            {/* 好友统计 */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="p-3 text-center bg-card">
                <div className="text-2xl font-bold text-primary">{acceptedFriends.length}</div>
                <div className="text-xs text-muted-foreground">好友总数</div>
              </Card>
              <Card className="p-3 text-center bg-card">
                <div className="text-2xl font-bold text-secondary">
                  {acceptedFriends.filter((f) => f.friendType === "lover").length}
                </div>
                <div className="text-xs text-muted-foreground">情侣好友</div>
              </Card>
              <Card className="p-3 text-center bg-card">
                <div className="text-2xl font-bold text-accent">12</div>
                <div className="text-xs text-muted-foreground">互动次数</div>
              </Card>
            </div>

            {/* 等待对方通过的申请 */}
            {pendingFriends.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground px-1">等待对方通过</h3>
                {pendingFriends.map((friend) => (
                  <Card key={friend.id} className="p-4 bg-muted/30">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-12 border-2 border-muted">
                        <AvatarImage src={friend.avatar} />
                        <AvatarFallback className="bg-muted text-muted-foreground">
                          {friend.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <span className="font-medium text-foreground">{friend.name}</span>
                        <p className="text-sm text-muted-foreground">{friend.ownerName}的玩偶</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3.5" />
                        等待通过
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* 好友列表 */}
            <div className="space-y-3">
              {acceptedFriends.map((friend) => (
                <Link key={friend.id} href={`/friends/${friend.id}`}>
                  <Card className="p-4 bg-card hover:bg-card/80 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="size-14 border-2 border-primary/20">
                          <AvatarImage src={friend.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary text-lg">
                            {friend.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        {friend.friendType === "lover" && (
                          <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-secondary flex items-center justify-center">
                            <Heart className="size-3 text-white fill-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{friend.name}</span>
                          {friend.friendType && (
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${friendTypeStyles[friend.friendType]}`}
                            >
                              {friendTypeLabels[friend.friendType]}
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

          {/* 新朋友：被别人添加的请求 */}
          <TabsContent value="requests" className="space-y-4">
            <Card className="p-4 bg-secondary/10 border-secondary/20">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-full bg-secondary/20 flex items-center justify-center">
                  <UserPlus className="size-6 text-secondary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">好友请求</h3>
                  <p className="text-sm text-muted-foreground">
                    其他玩偶想和你成为好友
                  </p>
                </div>
              </div>
            </Card>

            {requests.length === 0 ? (
              <Card className="p-8 text-center bg-card">
                <UserPlus className="size-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">暂时没有新的好友请求</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {requests.map((req) => (
                  <Card key={req.id} className="p-4 bg-card">
                    <div className="flex items-start gap-3">
                      <Avatar className="size-14 border-2 border-secondary/20">
                        <AvatarImage src={req.avatar} />
                        <AvatarFallback className="bg-secondary/10 text-secondary text-lg">
                          {req.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">{req.name}</span>
                          <span className="text-xs text-muted-foreground">{req.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {req.ownerName}的玩偶
                        </p>
                        <p className="text-sm text-foreground/80 mt-1">{req.message}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <Button
                            size="sm"
                            onClick={() => acceptRequest(req)}
                            className="flex-1 bg-primary hover:bg-primary/90"
                          >
                            <Check className="size-4 mr-1" />
                            接受
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => rejectRequest(req)}
                            className="flex-1"
                          >
                            <X className="size-4 mr-1" />
                            拒绝
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="nearby" className="space-y-4">
            {/* 碰一碰说明 */}
            <Card className="p-4 bg-primary/10 border-primary/20">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Wifi className="size-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">碰一碰交友</h3>
                  <p className="text-sm text-muted-foreground">
                    两只玩偶靠近碰一碰，发送申请后等待对方通过
                  </p>
                </div>
              </div>
            </Card>

            {/* 搜索按钮 */}
            <Card className="p-6 text-center bg-card">
              <div
                className={`size-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4 ${
                  isSearching ? "animate-pulse" : ""
                }`}
              >
                <Users
                  className={`size-12 text-primary ${isSearching ? "animate-bounce" : ""}`}
                />
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
                  <Sparkles className="size-4 text-secondary" />
                  发现新朋友
                </h3>
                <div className="space-y-3">
                  {nearbyToys.map((toy) => (
                    <Card key={toy.id} className="p-4 bg-card border-primary/30">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-14 border-2 border-primary/30">
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
                        <Button
                          size="sm"
                          disabled={toy.requested}
                          variant={toy.requested ? "outline" : "default"}
                          onClick={() => requestNearby(toy)}
                          className={toy.requested ? "" : "bg-primary hover:bg-primary/90"}
                        >
                          {toy.requested ? (
                            <>
                              <Clock className="size-4 mr-1" />
                              等待通过
                            </>
                          ) : (
                            <>
                              <UserPlus className="size-4 mr-1" />
                              加好友
                            </>
                          )}
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
