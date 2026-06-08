"use client"

import { useState } from "react"
import { PageHeader } from "@/components/common/page-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Heart, MessageCircle, Share2, Globe, Sparkles, Send } from "lucide-react"
import { toast } from "sonner"

interface Comment {
  id: string
  author: string
  text: string
}

const initialEncounters = [
  {
    id: "1",
    toyName: "小棉花",
    toyAvatar: "",
    ownerName: "悠悠",
    location: "巴黎埃菲尔铁塔",
    message: "今天在巴黎遇到了一位新朋友！铁塔下的夜景真美~",
    likes: 128,
    time: "2小时前",
    comments: [
      { id: "c1", author: "毛毛", text: "好浪漫呀，下次带我一起去！" },
      { id: "c2", author: "球球", text: "铁塔夜景yyds" },
    ] as Comment[],
  },
  {
    id: "2",
    toyName: "毛毛",
    toyAvatar: "",
    ownerName: "小明",
    location: "东京浅草寺",
    message: "在浅草寺祈福，希望大家都平安健康！抽到了大吉签~",
    likes: 256,
    time: "5小时前",
    comments: [{ id: "c3", author: "小棉花", text: "恭喜抽到大吉！" }] as Comment[],
  },
  {
    id: "3",
    toyName: "球球",
    toyAvatar: "",
    ownerName: "小红",
    location: "纽约时代广场",
    message: "纽约的夜晚太繁华了！霓虹灯闪烁，让我想起家乡的灯火~",
    likes: 89,
    time: "1天前",
    comments: [] as Comment[],
  },
]

export default function CloudTravelPage() {
  const [encounters, setEncounters] = useState(initialEncounters)
  const [likedPosts, setLikedPosts] = useState<string[]>([])
  const [commentTarget, setCommentTarget] = useState<string | null>(null)
  const [commentText, setCommentText] = useState("")

  const toggleLike = (id: string) => {
    setLikedPosts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const activePost = encounters.find((p) => p.id === commentTarget)

  const submitComment = () => {
    if (!commentText.trim() || !commentTarget) return
    setEncounters((prev) =>
      prev.map((p) =>
        p.id === commentTarget
          ? {
              ...p,
              comments: [
                ...p.comments,
                { id: `c-${Date.now()}`, author: "小棉花", text: commentText.trim() },
              ],
            }
          : p
      )
    )
    setCommentText("")
    toast.success("评论已发布")
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
          {encounters.map((post) => (
            <Card key={post.id} className="overflow-hidden bg-card">
              {/* 头部信息 */}
              <div className="p-4 flex items-center gap-3">
                <Avatar className="size-10 border-2 border-primary/20">
                  <AvatarImage src={post.toyAvatar} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {post.toyName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{post.toyName}</span>
                    <Sparkles className="w-4 h-4 text-cute-coral" />
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
                  <span className="text-cute-coral">{post.location}</span>
                </div>

                {/* 互动按钮 */}
                <div className="flex items-center gap-6 pt-3 border-t border-border">
                  <button
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => toggleLike(post.id)}
                  >
                    <Heart
                      className={`w-5 h-5 ${likedPosts.includes(post.id) ? "fill-primary text-primary" : ""}`}
                    />
                    <span className="text-sm">
                      {likedPosts.includes(post.id) ? post.likes + 1 : post.likes}
                    </span>
                  </button>
                  <button
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setCommentTarget(post.id)}
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm">{post.comments.length}</span>
                  </button>
                  <button
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors ml-auto"
                    onClick={() => toast.success("已复制分享链接")}
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                {/* 最近评论预览 */}
                {post.comments.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    {post.comments.slice(-2).map((c) => (
                      <p key={c.id} className="text-sm">
                        <span className="font-medium text-foreground">{c.author}</span>
                        <span className="text-muted-foreground">：{c.text}</span>
                      </p>
                    ))}
                    {post.comments.length > 2 && (
                      <button
                        className="text-xs text-primary"
                        onClick={() => setCommentTarget(post.id)}
                      >
                        查看全部 {post.comments.length} 条评论
                      </button>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 评论弹窗 */}
      <Dialog
        open={!!commentTarget}
        onOpenChange={(open) => !open && setCommentTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>评论 · {activePost?.toyName}</DialogTitle>
          </DialogHeader>

          <div className="max-h-60 overflow-y-auto space-y-3">
            {activePost?.comments.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">
                还没有评论，来抢沙发吧
              </p>
            )}
            {activePost?.comments.map((c) => (
              <div key={c.id} className="flex items-start gap-2">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {c.author[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-muted/50 rounded-2xl px-3 py-2">
                  <p className="text-xs font-medium">{c.author}</p>
                  <p className="text-sm text-muted-foreground">{c.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="说点什么..."
              className="rounded-full"
              onKeyDown={(e) => e.key === "Enter" && submitComment()}
              autoFocus
            />
            <Button
              size="icon"
              onClick={submitComment}
              disabled={!commentText.trim()}
              className="rounded-full bg-gradient-to-r from-primary to-cute-coral flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
