'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/common/page-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MapPin, Calendar, Heart, Share2, Sparkles } from 'lucide-react'
import { mockPostcards } from '@/lib/mock-data'
import { TravelPostcard } from '@/lib/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const locationEmoji = (location: string) => {
  if (location.includes('巴黎')) return '🗼'
  if (location.includes('东京')) return '🌸'
  if (location.includes('纽约')) return '🗽'
  return '🏛️'
}

export default function PostcardsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [likedPosts, setLikedPosts] = useState<string[]>([])
  const [detailPostcard, setDetailPostcard] = useState<TravelPostcard | null>(null)

  const displayedPostcards =
    activeTab === 'all'
      ? mockPostcards
      : activeTab === 'unread'
        ? mockPostcards.filter((p) => !p.isRead)
        : mockPostcards.filter((p) => p.isRead)

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('zh-CN', { month: 'short', day: 'numeric' }).format(date)

  const toggleLike = (id: string) => {
    setLikedPosts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cute-cream via-background to-cute-orange/10 pb-20">
      <PageHeader title="旅行明信片" showBack />

      <div className="px-4 py-4">
        <div className="max-w-lg mx-auto space-y-4">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-3 h-auto p-1 bg-muted/50 rounded-xl">
              <TabsTrigger value="all" className="rounded-lg text-xs py-2">
                全部
              </TabsTrigger>
              <TabsTrigger value="unread" className="rounded-lg text-xs py-2">
                未读
              </TabsTrigger>
              <TabsTrigger value="read" className="rounded-lg text-xs py-2">
                已读
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Postcards */}
          <div className="space-y-4">
            {displayedPostcards.map((postcard) => (
              <Card key={postcard.id} className="overflow-hidden border-0 bg-card/80">
                <div className="h-48 bg-gradient-to-br from-cute-sky/30 to-cute-mint/30 flex items-center justify-center relative">
                  <span className="text-6xl">{locationEmoji(postcard.location)}</span>
                  {!postcard.isRead && (
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-cute-coral/90 text-primary-foreground text-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      未读
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg">
                      来自{postcard.location}的明信片
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 -mr-2"
                      onClick={() => toggleLike(postcard.id)}
                    >
                      <Heart
                        className={cn(
                          'w-5 h-5 transition-colors',
                          likedPosts.includes(postcard.id)
                            ? 'fill-destructive text-destructive'
                            : 'text-muted-foreground'
                        )}
                      />
                    </Button>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {postcard.location} · {postcard.country}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(postcard.createdAt)}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                    {postcard.message}
                  </p>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-xl"
                      onClick={() => toast.success('已复制分享链接')}
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      分享
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 rounded-xl bg-gradient-to-r from-primary to-cute-coral"
                      onClick={() => setDetailPostcard(postcard)}
                    >
                      查看详情
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {displayedPostcards.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 text-3xl">
                🏝️
              </div>
              <p className="text-muted-foreground">还没有明信片</p>
              <p className="text-sm text-muted-foreground mt-1">
                和玩偶多聊聊旅行的话题吧
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 明信片详情弹窗 */}
      <Dialog
        open={!!detailPostcard}
        onOpenChange={(open) => !open && setDetailPostcard(null)}
      >
        <DialogContent>
          {detailPostcard && (
            <>
              <DialogHeader>
                <DialogTitle>来自{detailPostcard.location}的明信片</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="h-40 rounded-2xl bg-gradient-to-br from-cute-sky/30 to-cute-mint/30 flex items-center justify-center text-6xl">
                  {locationEmoji(detailPostcard.location)}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-cute-coral" />
                    {detailPostcard.location} · {detailPostcard.country}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-cute-sky" />
                    {formatDate(detailPostcard.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {detailPostcard.message}
                </p>
                <Button
                  onClick={() => toast.success('已收藏到我的明信片')}
                  className="w-full rounded-xl bg-gradient-to-r from-primary to-cute-coral"
                >
                  <Heart className="w-4 h-4 mr-1" />
                  收藏明信片
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
