"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BluetoothOff, BatteryLow, WifiOff, PlugZap } from "lucide-react"
import type { DeviceState } from "@/lib/hooks/use-device"

interface DeviceStatusBannerProps {
  device: DeviceState | null
  // 当前功能是否强依赖设备（强依赖时给出更醒目的提示）
  feature?: string
}

const stateConfig = {
  disconnected: {
    icon: WifiOff,
    title: "玩偶已断开连接",
    desc: "设备已离线，部分功能暂不可用，请重新连接",
    action: "重新连接",
    href: "/connect",
  },
  "bluetooth-off": {
    icon: BluetoothOff,
    title: "蓝牙已关闭",
    desc: "请开启手机蓝牙后重新连接玩偶",
    action: "去连接",
    href: "/connect",
  },
  "low-battery": {
    icon: BatteryLow,
    title: "玩偶电量过低",
    desc: "电量不足 20%，请及时为玩偶充电以免中断",
    action: null,
    href: null,
  },
} as const

export function DeviceStatusBanner({ device, feature }: DeviceStatusBannerProps) {
  // 未连接任何设备
  if (!device) {
    return (
      <Card className="p-4 bg-cute-orange/10 border border-cute-orange/30">
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-full bg-cute-orange/20 flex items-center justify-center flex-shrink-0">
            <PlugZap className="size-5 text-cute-orange" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground">未连接玩偶</h3>
            <p className="text-sm text-muted-foreground">
              {feature ? `连接玩偶后即可使用${feature}` : "连接玩偶后体验更多功能"}
            </p>
          </div>
          <Link href="/connect">
            <Button size="sm" className="bg-primary hover:bg-primary/90 flex-shrink-0">
              去连接
            </Button>
          </Link>
        </div>
      </Card>
    )
  }

  // 设备正常，不显示横幅
  if (device.status === "connected") return null

  const config = stateConfig[device.status as keyof typeof stateConfig]
  if (!config) return null

  const Icon = config.icon

  return (
    <Card className="p-4 bg-destructive/5 border border-destructive/20">
      <div className="flex items-start gap-3">
        <div className="size-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
          <Icon className="size-5 text-destructive" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground">{config.title}</h3>
          <p className="text-sm text-muted-foreground">{config.desc}</p>
        </div>
        {config.action && config.href && (
          <Link href={config.href}>
            <Button size="sm" variant="outline" className="flex-shrink-0">
              {config.action}
            </Button>
          </Link>
        )}
      </div>
    </Card>
  )
}
