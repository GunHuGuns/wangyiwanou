'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PageHeader } from '@/components/common/page-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, BookOpen, ChevronRight, Sparkles } from 'lucide-react'
import { mockDiaryEntries, moodIcons } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export default function DiaryPage() {
  const [activeTab, setActiveTab] = useState('all')

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    }).format(date)
  }

  const groupedDiaries = mockDiaryEntries.reduce(
    (acc, diary) => {
      const monthKey = new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: 'long',
      }).format(diary.date)
      if (!acc[monthKey]) acc[monthKey] = []
      acc[monthKey].push(diary)
      return acc
    },
    {} as Record<string, typeof mockDiaryEntries>
  )

  const filteredDiaries =
    activeTab === 'all'
      ? mockDiaryEntries
      : mockDiaryEntries.filter((d) => d.mood === activeTab)

  return (
    <div className="min-h-screen bg-gradient-to-br from-cute-cream via-background to-cute-orange/10 pb-20">
      <PageHeader
        title="心情日记"
        subtitle="玩偶每天为你记录"
        rightElement={
          <Button variant="ghost" size="icon" className="rounded-full">
            <Calendar className="w-5 h-5" />
          </Button>
        }
      />

      <div className="px-4 py-4">
        <div className="max-w-lg mx-auto space-y-4">
          {/* Today's Summary Card */}
          <Card className="p-5 bg-gradient-to-br from-primary/10 to-cute-orange/10 border-0">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-cute-coral flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">今日日记</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {mockDiaryEntries[0]?.summary || '今天还没有日记哦，快去和玩偶聊天吧！'}
                </p>
                <Link href={`/diary/${mockDiaryEntries[0]?.id}`}>
                  <Button size="sm" variant="secondary" className="rounded-xl">
                    查看详情
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Mood Filter */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-5 h-auto p-1 bg-muted/50 rounded-xl">
              <TabsTrigger value="all" className="rounded-lg text-xs py-2">
                全部
              </TabsTrigger>
              <TabsTrigger value="happy" className="rounded-lg text-xs py-2">
                {moodIcons.happy}
              </TabsTrigger>
              <TabsTrigger value="calm" className="rounded-lg text-xs py-2">
                {moodIcons.calm}
              </TabsTrigger>
              <TabsTrigger value="excited" className="rounded-lg text-xs py-2">
                {moodIcons.excited}
              </TabsTrigger>
              <TabsTrigger value="sad" className="rounded-lg text-xs py-2">
                {moodIcons.sad}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Diary List */}
          <div className="space-y-6">
            {Object.entries(groupedDiaries).map(([month, diaries]) => (
              <div key={month}>
                <h4 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
                  {month}
                </h4>
                <div className="space-y-3">
                  {diaries
                    .filter((d) => activeTab === 'all' || d.mood === activeTab)
                    .map((diary) => (
                      <Link key={diary.id} href={`/diary/${diary.id}`}>
                        <Card className="p-4 hover:shadow-md transition-all duration-200 border-0 bg-card/80 cute-hover">
                          <div className="flex items-start gap-3">
                            {/* Mood Icon */}
                            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl flex-shrink-0">
                              {moodIcons[diary.mood]}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-medium truncate">
                                  {diary.title}
                                </h3>
                                <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                                  {formatDate(diary.date)}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {diary.summary}
                              </p>
                              {/* Keywords */}
                              <div className="flex flex-wrap gap-1 mt-2">
                                {diary.keywords.slice(0, 3).map((keyword) => (
                                  <span
                                    key={keyword}
                                    className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                                  >
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {filteredDiaries.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">还没有这个心情的日记</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
