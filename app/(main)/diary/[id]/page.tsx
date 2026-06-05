'use client'

import { use } from 'react'
import { PageHeader } from '@/components/common/page-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Share2, Heart, Calendar } from 'lucide-react'
import { mockDiaryEntries, moodIcons } from '@/lib/mock-data'
import { notFound } from 'next/navigation'

interface DiaryDetailPageProps {
  params: Promise<{ id: string }>
}

export default function DiaryDetailPage({ params }: DiaryDetailPageProps) {
  const { id } = use(params)
  const diary = mockDiaryEntries.find((d) => d.id === id)

  if (!diary) {
    notFound()
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }).format(date)
  }

  const moodLabels: Record<string, string> = {
    happy: '开心',
    sad: '难过',
    excited: '兴奋',
    calm: '平静',
    tired: '疲惫',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cute-cream via-background to-cute-lavender/10 pb-20">
      <PageHeader
        title="日记详情"
        showBack
        backHref="/diary"
        rightElement={
          <Button variant="ghost" size="icon" className="rounded-full">
            <Share2 className="w-5 h-5" />
          </Button>
        }
      />

      <div className="px-4 py-4">
        <div className="max-w-lg mx-auto space-y-4">
          {/* Header Card */}
          <Card className="p-5 bg-gradient-to-br from-primary/10 to-cute-orange/10 border-0">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-card flex items-center justify-center text-3xl shadow-sm">
                {moodIcons[diary.mood]}
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold mb-1">{diary.title}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {formatDate(diary.date)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1 rounded-full bg-card text-foreground">
                {moodLabels[diary.mood]}
              </span>
              {diary.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </Card>

          {/* Content */}
          <Card className="p-5 bg-card/80 border-0">
            <div className="prose prose-sm max-w-none">
              <p className="text-foreground leading-relaxed whitespace-pre-line">
                {diary.content}
              </p>
            </div>
          </Card>

          {/* Summary */}
          <Card className="p-5 bg-muted/50 border-0">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" />
              今日小结
            </h3>
            <p className="text-sm text-muted-foreground">{diary.summary}</p>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 rounded-xl">
              <Share2 className="w-4 h-4 mr-2" />
              分享日记
            </Button>
            <Button className="flex-1 rounded-xl bg-gradient-to-r from-primary to-cute-coral">
              <Heart className="w-4 h-4 mr-2" />
              收藏
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
