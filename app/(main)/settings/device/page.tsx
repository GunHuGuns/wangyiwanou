'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/common/page-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { DeviceStatusBanner } from '@/components/common/device-status-banner'
import {
  Volume2,
  VolumeX,
  Volume1,
  Battery,
  BatteryLow,
  Wifi,
  WifiOff,
  Cpu,
  Power,
  Bluetooth,
  BluetoothOff,
  PlugZap,
  FlaskConical,
} from 'lucide-react'
import { plushTypeIcons } from '@/lib/mock-data'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useDevice, type DeviceConnState } from '@/lib/hooks/use-device'
import { cn } from '@/lib/utils'

const testScenarios: {
  id: DeviceConnState | 'unlinked'
  label: string
  desc: string
  icon: typeof Wifi
}[] = [
  { id: 'connected', label: '正常连接', desc: '设备在线，功能可用', icon: Wifi },
  { id: 'disconnected', label: '设备断连', desc: '设备离线，需重新连接', icon: WifiOff },
  { id: 'bluetooth-off', label: '蓝牙关闭', desc: '手机蓝牙未开启', icon: BluetoothOff },
  { id: 'low-battery', label: '低电量', desc: '电量低于 20%', icon: BatteryLow },
  { id: 'unlinked', label: '未连接设备', desc: '清除当前设备', icon: PlugZap },
]

export default function DeviceSettingsPage() {
  const router = useRouter()
  const { device, loaded, update, disconnect } = useDevice()
  const [volume, setVolume] = useState(70)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    if (device) setVolume(device.volume || 70)
  }, [device])

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (newVolume > 0) setIsMuted(false)
    update({ volume: newVolume })
  }

  const toggleMute = () => setIsMuted(!isMuted)

  const handleDisconnect = () => {
    disconnect()
    sessionStorage.removeItem('selectedDevice')
    router.push('/connect')
  }

  const applyScenario = (id: DeviceConnState | 'unlinked') => {
    if (id === 'unlinked') {
      disconnect()
      toast('已清除设备，进入未连接状态')
      return
    }
    // 低电量场景同步调整电量数值
    const patch: Record<string, unknown> = { status: id }
    if (id === 'low-battery') patch.batteryLevel = 15
    else if (device && device.batteryLevel < 20) patch.batteryLevel = 86
    update(patch)
    const scenario = testScenarios.find((s) => s.id === id)
    toast.success(`已切换到「${scenario?.label}」场景`)
  }

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return VolumeX
    if (volume < 50) return Volume1
    return Volume2
  }

  const VolumeIcon = getVolumeIcon()

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const isOffline = device?.status === 'disconnected' || device?.status === 'bluetooth-off'
  const isLowBattery = device?.status === 'low-battery'

  return (
    <div className="min-h-screen bg-gradient-to-br from-cute-cream via-background to-cute-mint/10 pb-20">
      <PageHeader title="设备控制" showBack />

      <div className="px-4 py-4">
        <div className="max-w-lg mx-auto space-y-6">
          {/* 异常 / 未连接横幅 */}
          {(!device || device.status !== 'connected') && (
            <DeviceStatusBanner device={device} feature="设备控制" />
          )}

          {/* Device Info Card */}
          {device && (
            <Card className="p-5 bg-card/80 border-0">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-cute-orange/20 flex items-center justify-center">
                  <span className="text-4xl">{plushTypeIcons[device.type]}</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold">{device.name}</h2>
                  <p
                    className={cn(
                      'text-sm',
                      isOffline ? 'text-destructive' : 'text-cute-mint'
                    )}
                  >
                    {isOffline ? '已离线' : isLowBattery ? '电量过低' : '已连接'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-xl">
                  {isLowBattery ? (
                    <BatteryLow className="w-5 h-5 mx-auto mb-1 text-destructive" />
                  ) : (
                    <Battery className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                  )}
                  <p
                    className={cn(
                      'text-sm font-medium',
                      isLowBattery && 'text-destructive'
                    )}
                  >
                    {device.batteryLevel}%
                  </p>
                  <p className="text-xs text-muted-foreground">电量</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-xl">
                  {isOffline ? (
                    <WifiOff className="w-5 h-5 mx-auto mb-1 text-destructive" />
                  ) : (
                    <Wifi className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                  )}
                  <p className="text-sm font-medium truncate">
                    {isOffline ? '离线' : device.wifiSSID || '已连接'}
                  </p>
                  <p className="text-xs text-muted-foreground">网络</p>
                </div>
                <button
                  onClick={() => router.push('/settings/firmware')}
                  className="text-center p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors"
                >
                  <Cpu className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-sm font-medium">{device.firmwareVersion}</p>
                  <p className="text-xs text-muted-foreground">固件 ›</p>
                </button>
              </div>
            </Card>
          )}

          {/* Volume Control（设备在线可用） */}
          {device && (
            <Card className="p-5 bg-card/80 border-0">
              <h3 className="font-semibold mb-4">音量控制</h3>
              {isOffline ? (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 text-sm text-muted-foreground">
                  <WifiOff className="w-4 h-4" />
                  设备离线，连接后可调节音量
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-4">
                    <button
                      onClick={toggleMute}
                      className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                    >
                      <VolumeIcon className="w-6 h-6" />
                    </button>
                    <div className="flex-1">
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        onValueChange={handleVolumeChange}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">
                      {isMuted ? 0 : volume}%
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: '静音', value: 0 },
                      { label: '低', value: 30 },
                      { label: '中', value: 60 },
                      { label: '高', value: 100 },
                    ].map((preset) => (
                      <Button
                        key={preset.label}
                        variant={
                          volume === preset.value && !isMuted ? 'default' : 'outline'
                        }
                        size="sm"
                        className="rounded-xl"
                        onClick={() => {
                          setVolume(preset.value)
                          setIsMuted(preset.value === 0)
                          update({ volume: preset.value })
                          toast.success(`音量已设为${preset.label}`)
                        }}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </>
              )}
            </Card>
          )}

          {/* 异常场景测试面板 */}
          <Card className="p-5 bg-card/80 border-0">
            <div className="flex items-center gap-2 mb-1">
              <FlaskConical className="w-4 h-4 text-cute-lavender" />
              <h3 className="font-semibold">异常场景测试</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              模拟不同设备状态，验证各功能在异常情况下的表现
            </p>
            <div className="grid grid-cols-1 gap-2">
              {testScenarios.map((scenario) => {
                const Icon = scenario.icon
                const active =
                  scenario.id === 'unlinked'
                    ? !device
                    : device?.status === scenario.id
                return (
                  <button
                    key={scenario.id}
                    onClick={() => applyScenario(scenario.id)}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left',
                      active
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-card hover:border-primary/30'
                    )}
                  >
                    <div
                      className={cn(
                        'size-9 rounded-lg flex items-center justify-center flex-shrink-0',
                        active ? 'bg-primary/15' : 'bg-muted'
                      )}
                    >
                      <Icon
                        className={cn(
                          'w-4 h-4',
                          active ? 'text-primary' : 'text-muted-foreground'
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{scenario.label}</p>
                      <p className="text-xs text-muted-foreground">{scenario.desc}</p>
                    </div>
                    {active && (
                      <span className="text-xs text-primary font-medium flex-shrink-0">
                        当前
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </Card>

          {/* 连接 / 断开 */}
          {device ? (
            <Card className="p-5 bg-card/80 border-0">
              <h3 className="font-semibold mb-2">断开连接</h3>
              <p className="text-sm text-muted-foreground mb-4">
                断开后需要重新扫描连接玩偶
              </p>
              <Button
                variant="destructive"
                className="w-full rounded-xl"
                onClick={handleDisconnect}
              >
                <Power className="w-4 h-4 mr-2" />
                断开连接
              </Button>
            </Card>
          ) : (
            <Card className="p-5 bg-card/80 border-0">
              <h3 className="font-semibold mb-2">连接玩偶</h3>
              <p className="text-sm text-muted-foreground mb-4">
                扫描并连接你的毛绒玩偶
              </p>
              <Button
                className="w-full rounded-xl bg-primary hover:bg-primary/90"
                onClick={() => router.push('/connect')}
              >
                <Bluetooth className="w-4 h-4 mr-2" />
                去连接
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
