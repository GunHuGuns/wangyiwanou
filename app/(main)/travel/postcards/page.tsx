'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/common/page-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MapPin, Calendar, Heart, Share2, Sparkles } from 'lucide-react'
import { mockPostcards } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export default function PostcardsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [likedPosts, setLikedPosts] = useState<string[]>([])

  const myPostcards = mockPostcards.filter((p) => !p.isFromCloud)
  const cloudPostcards = mockPostcards.filter((p) => p.isFromCloud)

  const displayedPostcards =
    activeTab === 'all'
      ? mockPostcards
      : activeTab === 'mine'
        ? myPostcards
        : cloudPostcards

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  const toggleLike = (id: string) => {
    setLikedPosts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cute-cream via-background to-cute-orange/10 pb-20">
      <PageHeader title="旅行明信片" showBack backHref="/travel" />

      <div className="px-4 py-4">
        <div className="max-w-lg mx-auto space-y-4">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-3 h-auto p-1 bg-muted/50 rounded-xl">
              <TabsTrigger value="all" className="rounded-lg text-xs py-2">
                全部
              </TabsTrigger>
              <TabsTrigger value="mine" className="rounded-lg text-xs py-2">
                我的明信片
              </TabsTrigger>
              <TabsTrigger value="cloud" className="rounded-lg text-xs py-2">
                云端偶遇
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Postcards Grid */}
          <div className="space-y-4">
            {displayedPostcards.map((postcard) => (
              <Card
                key={postcard.id}
                className="overflow-hidden border-0 bg-card/80"
              >
                {/* Image placeholder */}
                <div className="h-48 bg-gradient-to-br from-cute-sky/30 to-cute-mint/30 flex items-center justify-center relative">
                  <span className="text-6xl">
                    {postcard.location.includes('巴黎')
                      ? '🗼'
                      : postcard.location.includes('东京')
                        ? '🌸'
                        : '🏛️'}
                  </span>
                  {postcard.isFromCloud && (
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-cute-sky/80 text-white text-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      云端偶遇
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg">{postcard.title}</h3>
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
                      {postcard.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(postcard.createdAt)}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                    {postcard.story}
                  </p>

                  {postcard.isFromCloud && postcard.authorPlushName && (
                    <p className="text-xs text-cute-sky mb-3">
                      来自：{postcard.authorPlushName}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-xl"
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      分享
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 rounded-xl bg-gradient-to-r from-primary to-cute-coral"
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
    </div>
  )
}
