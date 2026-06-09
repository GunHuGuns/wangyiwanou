'use client'

import Link from 'next/link'
import { PageHeader } from '@/components/common/page-header'
import { Card } from '@/components/ui/card'
import { ChevronRight, Image, Cloud, MapPin, Plane } from 'lucide-react'

const travelFeatures = [
  {
    href: '/travel/postcards',
    icon: Image,
    title: '旅行明信片',
    description: '玩偶的旅行故事和照片',
    color: 'from-cute-orange to-cute-coral',
    badge: '3张新明信片',
  },
  {
    href: '/travel/cloud',
    icon: Cloud,
    title: '云旅行',
    description: '查看其他玩偶的旅行',
    color: 'from-cute-sky to-cute-mint',
  },
  {
    href: '/travel/plan',
    icon: MapPin,
    title: '旅行规划',
    description: 'AI帮你规划旅行行程',
    color: 'from-cute-lavender to-cute-pink',
  },
]

export default function TravelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cute-cream via-background to-cute-sky/10 pb-20">
      <PageHeader title="旅行" subtitle="和玩偶一起探索世界" />

      <div className="px-4 py-4">
        <div className="max-w-lg mx-auto space-y-4">
          {/* Hero Card */}
          <Card className="p-6 bg-gradient-to-br from-cute-sky/20 to-cute-mint/20 border-0 overflow-hidden relative">
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cute-sky to-cute-mint flex items-center justify-center mb-4">
                <Plane className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-2">云端旅行</h2>
              <p className="text-sm text-muted-foreground">
                即使不能亲自去，玩偶也会带你看遍世界的美景，用AI生成独特的旅行故事
              </p>
            </div>
          </Card>

          {/* Feature List */}
          <div className="space-y-3">
            {travelFeatures.map((feature) => (
              <Link key={feature.href} href={feature.href}>
                <Card className="p-4 hover:shadow-md transition-all duration-200 border-0 bg-card/80 cute-hover">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0`}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{feature.title}</h3>
                        {feature.badge && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            {feature.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground/50 flex-shrink-0" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Stats */}
          <Card className="p-4 bg-card/80 border-0">
            <h3 className="font-semibold mb-3">旅行统计</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">3</p>
                <p className="text-xs text-muted-foreground">明信片</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-cute-orange">1</p>
                <p className="text-xs text-muted-foreground">旅行计划</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
