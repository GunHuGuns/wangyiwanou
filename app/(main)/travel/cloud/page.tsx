"use client"

import { useState } from "react"
import { PageHeader } from "@/components/common/page-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share2, Globe, Sparkles } from "lucide-react"

const cloudEncounters = [
  {
    id: "1",
    toyName: "小棉花",
    toyAvatar: "",
    ownerName: "悠悠",
    location: "巴黎埃菲尔铁塔",
    postcard: "/postcards/paris.jpg",
    message: "今天在巴黎遇到了一位新朋友！铁塔下的夜景真美~",
    likes: 128,
    comments: 23,
    time: "2小时前",
  },
  {
    id: "2",
    toyName: "毛毛",
    toyAvatar: "",
    ownerName: "小明",
    location: "东京浅草寺",
    postcard: "/postcards/tokyo.jpg",
    message: "在浅草寺祈福，希望大家都平安健康！抽到了大吉签~",
    likes: 256,
    comments: 45,
    time: "5小时前",
  },
  {
    id: "3",
    toyName: "球球",
    toyAvatar: "",
    ownerName: "小红",
    location: "纽约时代广场",
    postcard: "/postcards/newyork.jpg",
    message: "纽约的夜晚太繁华了！霓虹灯闪烁，让我想起家乡的灯火~",
    likes: 89,
    comments: 12,
    time: "1天前",
  },
]

export default function CloudTravelPage() {
  const [likedPosts, setLikedPosts] = useState<string[]>([])

  const toggleLike = (id: string) => {
    setLikedPosts(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <PageHeader title="云旅行" showBack />
      
      <div className="flex-1 p-4 space-y-4">
        {/* 顶部提示 */}
        <Card className="p-4 bg-primary/10 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">云端偶遇</h3>
              <p className="text-sm text-muted-foreground">
                看看其他玩偶的旅行明信片和精彩故事
              </p>
            </div>
          </div>
        </Card>

        {/* 动态列表 */}
        <div className="space-y-4">
          {cloudEncounters.map((post) => (
            <Card key={post.id} className="overflow-hidden bg-card">
              {/* 头部信息 */}
              <div className="p-4 flex items-center gap-3">
                <Avatar className="w-10 h-10 border-2 border-primary/20">
                  <AvatarImage src={post.toyAvatar} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {post.toyName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{post.toyName}</span>
                    <Sparkles className="w-4 h-4 text-secondary" />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {post.ownerName}的玩偶 · {post.time}
                  </div>
                </div>
              </div>

              {/* 图片区域 */}
              <div className="aspect-[4/3] bg-muted relative">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Globe className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">{post.location}</p>
                  </div>
                </div>
              </div>

              {/* 内容区域 */}
              <div className="p-4">
                <p className="text-foreground mb-3">{post.message}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                  <span className="text-secondary">{post.location}</span>
                </div>

                {/* 互动按钮 */}
                <div className="flex items-center gap-6 pt-3 border-t border-border">
                  <button 
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => toggleLike(post.id)}
                  >
                    <Heart className={`w-5 h-5 ${likedPosts.includes(post.id) ? 'fill-primary text-primary' : ''}`} />
                    <span className="text-sm">
                      {likedPosts.includes(post.id) ? post.likes + 1 : post.likes}
                    </span>
                  </button>
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm">{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors ml-auto">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
