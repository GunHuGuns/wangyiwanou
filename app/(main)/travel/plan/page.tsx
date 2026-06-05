'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/common/page-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MapPin, Search, Loader2, Utensils, Camera, Music, Hotel, ChevronRight } from 'lucide-react'
import { mockTravelPlans, activityTypeIcons } from '@/lib/mock-data'
import { TravelPlan, TravelActivity } from '@/lib/types'

const activityIcons: Record<string, typeof Utensils> = {
  food: Utensils,
  attraction: Camera,
  entertainment: Music,
  accommodation: Hotel,
}

export default function TravelPlanPage() {
  const [destination, setDestination] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPlan, setGeneratedPlan] = useState<TravelPlan | null>(null)

  const handleGenerate = async () => {
    if (!destination.trim()) return

    setIsGenerating(true)

    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Use mock data or generate new
    const newPlan: TravelPlan = {
      id: `plan-${Date.now()}`,
      destination: destination,
      days: 3,
      activities: [
        {
          id: '1',
          name: `${destination}必去景点`,
          type: 'attraction',
          description: '欣赏当地最具代表性的风景',
          location: `${destination}市中心`,
        },
        {
          id: '2',
          name: '当地特色美食',
          type: 'food',
          description: '品尝最地道的当地风味',
          location: `${destination}美食街`,
        },
        {
          id: '3',
          name: '文化体验活动',
          type: 'entertainment',
          description: '深入了解当地文化传统',
          location: `${destination}文化中心`,
        },
      ],
      createdAt: new Date(),
    }

    setGeneratedPlan(newPlan)
    setIsGenerating(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cute-cream via-background to-cute-lavender/10 pb-20">
      <PageHeader title="旅行规划" showBack backHref="/travel" />

      <div className="px-4 py-4">
        <div className="max-w-lg mx-auto space-y-4">
          {/* Search Card */}
          <Card className="p-5 bg-card/80 border-0">
            <h3 className="font-semibold mb-3">想去哪里旅行？</h3>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="输入目的地，如：成都、杭州"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="pl-10 rounded-xl"
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
              </div>
              <Button
                onClick={handleGenerate}
                disabled={!destination.trim() || isGenerating}
                className="rounded-xl bg-gradient-to-r from-cute-lavender to-cute-pink"
              >
                {isGenerating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </Button>
            </div>

            {/* Quick suggestions */}
            <div className="flex flex-wrap gap-2 mt-3">
              {['北京', '上海', '成都', '杭州', '西安'].map((city) => (
                <Button
                  key={city}
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs"
                  onClick={() => setDestination(city)}
                >
                  {city}
                </Button>
              ))}
            </div>
          </Card>

          {/* Loading State */}
          {isGenerating && (
            <Card className="p-8 bg-card/80 border-0 text-center">
              <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">
                AI正在为你规划{destination}之旅...
              </p>
            </Card>
          )}

          {/* Generated Plan */}
          {generatedPlan && !isGenerating && (
            <Card className="p-5 bg-card/80 border-0">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">{generatedPlan.destination}之旅</h3>
                  <p className="text-sm text-muted-foreground">
                    {generatedPlan.days}天行程 · {generatedPlan.activities.length}个活动
                  </p>
                </div>
                <div className="text-4xl">🗺️</div>
              </div>

              <div className="space-y-3">
                {generatedPlan.activities.map((activity, index) => {
                  const Icon = activityIcons[activity.type] || Camera
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 rounded-xl bg-muted/50"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            Day {index + 1}
                          </span>
                          <h4 className="font-medium truncate">{activity.name}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          📍 {activity.location}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <Button className="w-full mt-4 rounded-xl bg-gradient-to-r from-primary to-cute-coral">
                保存行程
              </Button>
            </Card>
          )}

          {/* History */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
              历史规划
            </h3>
            <Card className="divide-y divide-border border-0 bg-card/80">
              {mockTravelPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cute-mint to-cute-sky flex items-center justify-center text-lg">
                    🗺️
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium">{plan.destination}之旅</h4>
                    <p className="text-xs text-muted-foreground">
                      {plan.days}天 · {plan.activities.length}个活动
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground/50" />
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
