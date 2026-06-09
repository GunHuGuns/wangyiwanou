"use client"

import { PageHeader } from "@/components/common/page-header"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart } from "lucide-react"
import { useFriends, friendTypeLabels } from "@/lib/hooks/use-friends"
import type { FriendType } from "@/lib/types"
import Link from "next/link"

const friendTypeStyles: Record<FriendType, string> = {
  lover: "bg-secondary/20 text-secondary",
  friend: "bg-primary/15 text-primary",
  family: "bg-cute-mint/30 text-cute-mint",
}

export default function FriendsPage() {
  const { friends } = useFriends()
  const acceptedFriends = friends.filter((f) => !f.pending)

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <PageHeader title="玩偶社交" showBack />

      <div className="flex-1 p-4 space-y-4">
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
      </div>
    </div>
  )
}
