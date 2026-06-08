'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import {
  Battery,
  BatteryLow,
  Wifi,
  WifiOff,
  MessageCircle,
  Map,
  Users,
  BookOpen,
  Clock,
  Sparkles,
  ChevronRight,
  Volume2,
  PlugZap,
} from 'lucide-react'
import { plushTypeIcons } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { useDevice, isDeviceUsable } from '@/lib/hooks/use-device'
import { DeviceStatusBanner } from '@/components/common/device-status-banner'
import { toast } from 'sonner'

const quickActions = [
  {
    href: '/chat',
    icon: MessageCircle,
    label: '开始对话',
    color: 'from-primary to-cute-coral',
    description: '和玩偶聊天',
    requiresDevice: true,
  },
  {
    href: '/diary',
    icon: BookOpen,
    label: '心情日记',
    color: 'from-cute-orange to-cute-pink',
    description: '查看今日日记',
    requiresDevice: false,
  },
  {
    href: '/travel',
    icon: Map,
    label: '云旅行',
    color: 'from-cute-mint to-cute-sky',
    description: '探索新地方',
    requiresDevice: false,
  },
  {
    href: '/friends',
    icon: Users,
    label: '交朋友',
    color: 'from-cute-lavender to-cute-pink',
    description: '碰一碰交友',
    requiresDevice: true,
  },
]

const moreFeatures = [
  { href: '/alarm', icon: Clock, label: '闹钟', badge: '3个', requiresDevice: true },
  { href: '/settings/character', icon: Sparkles, label: '角色切换', requiresDevice: true },
]

export default function HomePage() {
  const { device, loaded } = useDevice()
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 6) setGreeting('夜深了')
    else if (hour < 12) setGreeting('早上好')
    else if (hour < 14) setGreeting('中午好')
    else if (hour < 18) setGreeting('下午好')
    else setGreeting('晚上好')
  }, [])

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const isLowBattery = device?.status === 'low-battery'
  const isOffline = device?.status === 'disconnected' || device?.status === 'bluetooth-off'
  const usable = isDeviceUsable(device)

  return (
    <div className="min-h-screen bg-gradient-to-br from-cute-cream via-background to-cute-pink/10">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="max-w-lg mx-auto">
          <p className="text-muted-foreground text-sm">{greeting}</p>
          <h1 className="text-2xl font-bold">
            {device ? `和${device.name}一起玩吧` : '欢迎回来'}
          </h1>
        </div>
      </div>

      {/* Device Status Card / 未连接占位 */}
      <div className="px-4 mb-6">
        <div className="max-w-lg mx-auto space-y-3">
          {device ? (
            <Card className="p-5 bg-gradient-to-br from-card to-cute-cream/30 border-0 shadow-lg">
              <div className="flex items-center gap-4">
                {/* Device Avatar */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-cute-orange/20 flex items-center justify-center">
                    <span className="text-5xl animate-bounce-soft">
                      {plushTypeIcons[device.type]}
                    </span>
                  </div>
                  <div
                    className={cn(
                      'absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center',
                      isOffline ? 'bg-muted-foreground/40' : 'bg-cute-mint'
                    )}
                  >
                    <div className="w-3 h-3 rounded-full bg-white" />
                  </div>
                </div>

                {/* Device Info */}
                <div className="flex-1">
                  <h2 className="text-lg font-bold mb-1">{device.name}</h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      {isLowBattery ? (
                        <BatteryLow className="w-4 h-4 text-destructive" />
                      ) : (
                        <Battery className="w-4 h-4" />
                      )}
                      <span className={cn(isLowBattery && 'text-destructive')}>
                        {device.batteryLevel}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {isOffline ? (
                        <>
                          <WifiOff className="w-4 h-4 text-destructive" />
                          <span className="text-destructive">离线</span>
                        </>
                      ) : (
                        <>
                          <Wifi className="w-4 h-4" />
                          <span className="truncate max-w-[80px]">
                            {device.wifiSSID || '已连接'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6 bg-gradient-to-br from-card to-cute-cream/30 border-0 shadow-lg text-center">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-primary/10 flex items-center justify-center mb-3">
                <PlugZap className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-lg font-bold mb-1">还没有连接玩偶</h2>
              <p className="text-sm text-muted-foreground mb-4">
                连接你的毛绒玩偶，开启对话、旅行和交友
              </p>
              <Link
                href="/connect"
                className="inline-flex items-center justify-center gap-1 px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground text-sm font-medium"
              >
                连接玩偶
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Card>
          )}

          {/* 异常状态横幅（断连/蓝牙关闭/低电量） */}
          {device && device.status !== 'connected' && (
            <DeviceStatusBanner device={device} />
          )}
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="px-4 mb-6">
        <div className="max-w-lg mx-auto">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
            快捷功能
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const disabled = action.requiresDevice && !usable
              const cardInner = (
                <Card
                  className={cn(
                    'p-4 h-full transition-all duration-200 border-0 bg-card/80',
                    disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:shadow-md cute-hover'
                  )}
                >
                  <div
                    className={cn(
                      'w-11 h-11 rounded-2xl flex items-center justify-center mb-3 bg-gradient-to-br',
                      action.color,
                      disabled && 'grayscale'
                    )}
                  >
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold mb-0.5">{action.label}</h4>
                  <p className="text-xs text-muted-foreground">
                    {disabled ? '需连接玩偶' : action.description}
                  </p>
                </Card>
              )

              if (disabled) {
                return (
                  <button
                    key={action.href}
                    type="button"
                    className="text-left"
                    onClick={() =>
                      toast(
                        device
                          ? '玩偶当前不在线，请重新连接后使用'
                          : '请先连接玩偶后使用'
                      )
                    }
                  >
                    {cardInner}
                  </button>
                )
              }

              return (
                <Link key={action.href} href={action.href}>
                  {cardInner}
                </Link>
              )
            })}
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
            {moreFeatures.map((feature) => {
              const disabled = feature.requiresDevice && !usable
              const rowInner = (
                <>
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <span className="flex-1 font-medium">{feature.label}</span>
                  {disabled ? (
                    <span className="text-xs text-muted-foreground">需连接玩偶</span>
                  ) : (
                    feature.badge && (
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        {feature.badge}
                      </span>
                    )
                  )}
                  <ChevronRight className="w-5 h-5 text-muted-foreground/50" />
                </>
              )

              if (disabled) {
                return (
                  <button
                    key={feature.href}
                    type="button"
                    onClick={() =>
                      toast(
                        device
                          ? '玩偶当前不在线，请重新连接后使用'
                          : '请先连接玩偶后使用'
                      )
                    }
                    className="w-full flex items-center gap-4 p-4 opacity-50 cursor-not-allowed text-left first:rounded-t-lg last:rounded-b-lg"
                  >
                    {rowInner}
                  </button>
                )
              }

              return (
                <Link
                  key={feature.href}
                  href={feature.href}
                  className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  {rowInner}
                </Link>
              )
            })}
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
                  {device
                    ? `试试和${device.name}聊聊你今天的心情，它会记住你分享的一切，并在日记中为你记录下来哦~`
                    : '连接玩偶后，它会陪你聊天、记录心情，还能带你云端旅行哦~'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
