'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Battery,
  Wifi,
  MessageCircle,
  Map,
  Users,
  BookOpen,
  Clock,
  Sparkles,
  ChevronRight,
  Volume2,
  Settings,
} from 'lucide-react'
import { PlushDevice } from '@/lib/types'
import { plushTypeIcons } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const quickActions = [
  {
    href: '/chat',
    icon: MessageCircle,
    label: '开始对话',
    color: 'from-primary to-cute-coral',
    description: '和玩偶聊天',
  },
  {
    href: '/diary',
    icon: BookOpen,
    label: '心情日记',
    color: 'from-cute-orange to-cute-pink',
    description: '查看今日日记',
  },
  {
    href: '/travel',
    icon: Map,
    label: '云旅行',
    color: 'from-cute-mint to-cute-sky',
    description: '探索新地方',
  },
  {
    href: '/social',
    icon: Users,
    label: '交朋友',
    color: 'from-cute-lavender to-cute-pink',
    description: '碰一碰交友',
  },
]

const moreFeatures = [
  { href: '/alarm', icon: Clock, label: '闹钟', badge: '3个' },
  { href: '/settings/device', icon: Volume2, label: '音量调节' },
  { href: '/settings/character', icon: Sparkles, label: '角色切换' },
  { href: '/settings', icon: Settings, label: '更多设置' },
]

export default function HomePage() {
  const router = useRouter()
  const [device, setDevice] = useState<PlushDevice | null>(null)
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    // Get connected device
    const deviceData = localStorage.getItem('connectedDevice')
    if (deviceData) {
      setDevice(JSON.parse(deviceData))
    } else {
      // Redirect to connect if no device
      router.push('/connect')
    }

    // Set greeting based on time
    const hour = new Date().getHours()
    if (hour < 6) setGreeting('夜深了')
    else if (hour < 12) setGreeting('早上好')
    else if (hour < 14) setGreeting('中午好')
    else if (hour < 18) setGreeting('下午好')
    else setGreeting('晚上好')
  }, [router])

  if (!device) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cute-cream via-background to-cute-pink/10">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="max-w-lg mx-auto">
          <p className="text-muted-foreground text-sm">{greeting}</p>
          <h1 className="text-2xl font-bold">和{device.name}一起玩吧</h1>
        </div>
      </div>

      {/* Device Status Card */}
      <div className="px-4 mb-6">
        <div className="max-w-lg mx-auto">
          <Card className="p-5 bg-gradient-to-br from-card to-cute-cream/30 border-0 shadow-lg">
            <div className="flex items-center gap-4">
              {/* Device Avatar */}
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-cute-orange/20 flex items-center justify-center">
                  <span className="text-5xl animate-bounce-soft">
                    {plushTypeIcons[device.type]}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-cute-mint flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-white" />
                </div>
              </div>

              {/* Device Info */}
              <div className="flex-1">
                <h2 className="text-lg font-bold mb-1">{device.name}</h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Battery className="w-4 h-4" />
                    <span>{device.batteryLevel}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Wifi className="w-4 h-4" />
                    <span className="truncate max-w-[80px]">
                      {device.wifiSSID || '已连接'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Chat Button */}
              <Button
                onClick={() => router.push('/chat')}
                size="icon"
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-cute-coral shadow-md"
              >
                <MessageCircle className="w-5 h-5" />
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="px-4 mb-6">
        <div className="max-w-lg mx-auto">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
            快捷功能
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <Card className="p-4 h-full hover:shadow-md transition-all duration-200 cute-hover border-0 bg-card/80">
                  <div
                    className={cn(
                      'w-11 h-11 rounded-2xl flex items-center justify-center mb-3 bg-gradient-to-br',
                      action.color
                    )}
                  >
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold mb-0.5">{action.label}</h4>
                  <p className="text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* More Features */}
      <div className="px-4 mb-6">
        <div className="max-w-lg mx-auto">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
            更多功能
          </h3>
          <Card className="divide-y divide-border border-0 bg-card/80">
            {moreFeatures.map((feature) => (
              <Link
                key={feature.href}
                href={feature.href}
                className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className="flex-1 font-medium">{feature.label}</span>
                {feature.badge && (
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {feature.badge}
                  </span>
                )}
                <ChevronRight className="w-5 h-5 text-muted-foreground/50" />
              </Link>
            ))}
          </Card>
        </div>
      </div>

      {/* Today's Tip */}
      <div className="px-4 pb-8">
        <div className="max-w-lg mx-auto">
          <Card className="p-4 bg-gradient-to-r from-cute-lavender/20 to-cute-pink/20 border-0">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-cute-lavender/30 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">今日小贴士</h4>
                <p className="text-sm text-muted-foreground">
                  试试和{device.name}聊聊你今天的心情，它会记住你分享的一切，并在日记中为你记录下来哦~
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
