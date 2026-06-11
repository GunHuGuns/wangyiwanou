'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/common/page-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  MapPin,
  Search,
  Loader2,
  Utensils,
  Camera,
  Music,
  Hotel,
  ChevronRight,
  Pencil,
  Clock,
} from 'lucide-react'
import { mockTravelPlans } from '@/lib/mock-data'
import { TravelPlan, TravelActivity } from '@/lib/types'
import { toast } from 'sonner'

const activityIcons: Record<string, typeof Utensils> = {
  food: Utensils,
  attraction: Camera,
  entertainment: Music,
  accommodation: Hotel,
}

const activityTypeLabels: Record<string, string> = {
  food: '美食',
  attraction: '景点',
  entertainment: '娱乐',
  accommodation: '住宿',
}

export default function TravelPlanPage() {
  const [destination, setDestination] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPlan, setGeneratedPlan] = useState<TravelPlan | null>(null)

  // 历史规划本地状态（支持重命名）
  const [plans, setPlans] = useState(
    mockTravelPlans.map((p) => ({ ...p, customName: `${p.destination}之旅` }))
  )

  // 重命名弹窗
  const [renameTarget, setRenameTarget] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')

  // 行程详情弹窗
  const [detailActivity, setDetailActivity] = useState<{
    activity: TravelActivity
    dayIndex: number
    planName: string
  } | null>(null)

  const handleGenerate = async () => {
    if (!destination.trim()) return
    setIsGenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newPlan: TravelPlan = {
      id: `plan-${Date.now()}`,
      destination: destination,
      days: 3,
      activities: [
        {
          id: '1',
          name: `${destination}必去景点`,
          type: 'attraction',
          description: '欣赏当地最具代表性的风景，感受独特的人文气息。',
          location: `${destination}市中心`,
        },
        {
          id: '2',
          name: '当地特色美食',
          type: 'food',
          description: '品尝最地道的当地风味，探索藏在街巷里的老字号。',
          location: `${destination}美食街`,
        },
        {
          id: '3',
          name: '文化体验活动',
          type: 'entertainment',
          description: '深入了解当地文化传统，参与一场难忘的民俗体验。',
          location: `${destination}文化中心`,
        },
      ],
    }

    setGeneratedPlan(newPlan)
    setIsGenerating(false)
  }

  const handleSavePlan = () => {
    if (!generatedPlan) return
    setPlans((prev) => [
      { ...generatedPlan, customName: `${generatedPlan.destination}之旅` },
      ...prev,
    ])
    toast.success('行程已保存到历史规划')
    setGeneratedPlan(null)
    setDestination('')
  }

  const openRename = (id: string, currentName: string) => {
    setRenameTarget(id)
    setRenameValue(currentName)
  }

  const confirmRename = () => {
    if (!renameValue.trim() || !renameTarget) return
    setPlans((prev) =>
      prev.map((p) =>
        p.id === renameTarget ? { ...p, customName: renameValue.trim() } : p
      )
    )
    toast.success('已重命名')
    setRenameTarget(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cute-cream via-background to-cute-lavender/10 pb-20">
      <PageHeader title="旅行规划" showBack />

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
                    <button
                      key={activity.id}
                      onClick={() =>
                        setDetailActivity({
                          activity,
                          dayIndex: index,
                          planName: `${generatedPlan.destination}之旅`,
                        })
                      }
                      className="w-full flex items-start gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-left"
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
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {activity.description}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground/50 flex-shrink-0 self-center" />
                    </button>
                  )
                })}
              </div>

              <Button
                onClick={handleSavePlan}
                className="w-full mt-4 rounded-xl bg-gradient-to-r from-primary to-cute-coral"
              >
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
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cute-mint to-cute-sky flex items-center justify-center text-lg flex-shrink-0">
                    🗺️
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{plan.customName}</h4>
                    <p className="text-xs text-muted-foreground">
                      {plan.days}天 · {plan.activities.length}个活动
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={() => openRename(plan.id, plan.customName)}
                    aria-label="重命名"
                  >
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </Card>
            {/* 展开第一个历史规划的每日行程，可点击查看详情 */}
            {plans[0] && (
              <div className="mt-3">
                <h4 className="text-xs font-semibold text-muted-foreground mb-2 px-1">
                  {plans[0].customName} · 每日行程
                </h4>
                <Card className="divide-y divide-border border-0 bg-card/80">
                  {plans[0].activities.map((activity, index) => {
                    const Icon = activityIcons[activity.type] || Camera
                    return (
                      <button
                        key={activity.id}
                        onClick={() =>
                          setDetailActivity({
                            activity,
                            dayIndex: index,
                            planName: plans[0].customName,
                          })
                        }
                        className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left first:rounded-t-lg last:rounded-b-lg"
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                              Day {index + 1}
                            </span>
                            <span className="font-medium truncate text-sm">
                              {activity.name}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
                      </button>
                    )
                  })}
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 重命名弹窗 */}
      <Dialog open={!!renameTarget} onOpenChange={(open) => !open && setRenameTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>重命名行程</DialogTitle>
          </DialogHeader>
          <Input
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            placeholder="输入新的行程名称"
            className="rounded-xl"
            onKeyDown={(e) => e.key === 'Enter' && confirmRename()}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameTarget(null)}>
              取消
            </Button>
            <Button
              onClick={confirmRename}
              className="bg-gradient-to-r from-primary to-cute-coral"
            >
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 行程详情弹窗 */}
      <Dialog
        open={!!detailActivity}
        onOpenChange={(open) => !open && setDetailActivity(null)}
      >
        <DialogContent>
          {detailActivity && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    Day {detailActivity.dayIndex + 1}
                  </span>
                  {detailActivity.activity.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-cute-lavender/20 text-cute-lavender font-medium">
                    {activityTypeLabels[detailActivity.activity.type]}
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {detailActivity.activity.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-cute-coral" />
                  {detailActivity.activity.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 text-cute-sky" />
                  建议游玩 2-3 小时
                </div>
                <Button
                  onClick={() => {
                    toast.success('已添加到今日提醒')
                    setDetailActivity(null)
                  }}
                  className="w-full rounded-xl bg-gradient-to-r from-primary to-cute-coral"
                >
                  添加到提醒
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
