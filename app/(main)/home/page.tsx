'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import {
  Battery,
  BatteryLow,
  Wifi,
  WifiOff,
  BookOpen,
  Sparkles,
  ChevronRight,
  Volume2,
  VolumeX,
  PlugZap,
} from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { plushTypeIcons, mockDiaryEntries, moodIcons } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { useDevice, isDeviceUsable } from '@/lib/hooks/use-device'
import { DeviceStatusBanner } from '@/components/common/device-status-banner'

export default function HomePage() {
  const { device, loaded, update } = useDevice()
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 6) setGreeting('夜深了')
    else if (hour < 12) setGreeting('早上好')
    else if (hour < 14) setGreeting('中午好')
    else if (hour < 18) setGreeting('下午好')
    else setGreeting('晚上好')
  }, [])

  const handleVolumeChange = (value: number[] | number) => {
    const newVolume = Array.isArray(value) ? value[0] : value
    update({ volume: newVolume })
  }

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const isLowBattery = device?.status === 'low-battery'
  const isOffline = device?.status === 'disconnected' || device?.status === 'bluetooth-off'
  const todayDiary = mockDiaryEntries[0]
  const volume = device?.volume ?? 60

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

      {/* 今日日记外显 */}
      <div className="px-4 mb-6">
        <div className="max-w-lg mx-auto">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
            心情日记
          </h3>
          <Card className="p-5 border-0 bg-card/80">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-2xl flex-shrink-0">
                {todayDiary ? moodIcons[todayDiary.mood] : <BookOpen className="w-6 h-6 text-muted-foreground" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">今日日记</h4>
                  {todayDiary && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {todayDiary.title}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {todayDiary?.summary || '今天还没有日记哦，快去和玩偶聊天吧！'}
                </p>
                {todayDiary && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {todayDiary.keywords.slice(0, 3).map((keyword) => (
                      <span
                        key={keyword}
                        className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <Link
              href="/diary"
              className="mt-4 flex items-center justify-center gap-1 text-sm font-medium text-primary"
            >
              查看更多日记
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Card>
        </div>
      </div>

      {/* 音量调节 */}
      {device && (
        <div className="px-4 mb-6">
          <div className="max-w-lg mx-auto">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
              音量调节
            </h3>
            <Card className="p-5 border-0 bg-card/80">
              <div className="flex items-center gap-4">
                {volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                ) : (
                  <Volume2 className="w-5 h-5 text-primary flex-shrink-0" />
                )}
                <Slider
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="flex-1"
                  disabled={isOffline}
                  aria-label="玩偶音量"
                />
                <span className="w-10 text-right text-sm tabular-nums text-muted-foreground">
                  {volume}%
                </span>
              </div>
              {isOffline && (
                <p className="text-xs text-muted-foreground mt-3">
                  玩偶当前离线，连接后可调节音量
                </p>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* 角色切换 */}
      <div className="px-4 mb-6">
        <div className="max-w-lg mx-auto">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
            更多功能
          </h3>
          <Card className="border-0 bg-card/80">
            <Link
              href="/settings/character"
              className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors rounded-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="flex-1 font-medium">角色切换</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground/50" />
            </Link>
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
