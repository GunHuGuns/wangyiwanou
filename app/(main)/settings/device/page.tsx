'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/common/page-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { DeviceStatusBanner } from '@/components/common/device-status-banner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
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
  Unlink,
  AlertTriangle,
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
  const [unbindOpen, setUnbindOpen] = useState(false)

  useEffect(() => {
    if (device) setVolume(device.volume || 70)
  }, [device])

  const handleVolumeChange = (value: number[] | number) => {
    const newVolume = Array.isArray(value) ? value[0] : value
    setVolume(newVolume)
    if (newVolume > 0) setIsMuted(false)
    update({ volume: newVolume })
  }

  const toggleMute = () => setIsMuted(!isMuted)

  // 断开连接：设备仍绑定，仅置为离线状态
  const handleDisconnect = () => {
    update({ status: 'disconnected' })
    toast('设备已断开，可随时重新连接')
  }

  // 解绑设备：彻底解除绑定，清除设备数据
  const handleUnbind = () => {
    disconnect()
    sessionStorage.removeItem('selectedDevice')
    setUnbindOpen(false)
    toast.success('设备已解绑')
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

          {/* 连接 / 断开 / 解绑 */}
          {device ? (
            <Card className="p-5 bg-card/80 border-0 space-y-3">
              <div>
                <h3 className="font-semibold mb-2">连接管理</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  断开后设备仍保持绑定，可随时重新连接；解绑将彻底移除该设备
                </p>
                {!isOffline && (
                  <Button
                    variant="outline"
                    className="w-full rounded-xl mb-3"
                    onClick={handleDisconnect}
                  >
                    <Power className="w-4 h-4 mr-2" />
                    断开连接
                  </Button>
                )}
                {isOffline && (
                  <Button
                    className="w-full rounded-xl mb-3 bg-primary hover:bg-primary/90"
                    onClick={() => router.push('/connect')}
                  >
                    <Bluetooth className="w-4 h-4 mr-2" />
                    重新连接
                  </Button>
                )}
                <Button
                  variant="destructive"
                  className="w-full rounded-xl"
                  onClick={() => setUnbindOpen(true)}
                >
                  <Unlink className="w-4 h-4 mr-2" />
                  解绑设备
                </Button>
              </div>
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

      {/* 解绑确认弹窗 */}
      <Dialog open={unbindOpen} onOpenChange={setUnbindOpen}>
        <DialogContent className="max-w-sm mx-4 rounded-2xl">
          <DialogHeader>
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <DialogTitle className="text-center">确认解绑设备？</DialogTitle>
            <DialogDescription className="text-center">
              解绑后将移除「{device?.name}」的绑定关系，相关数据需要重新连接后才能恢复。此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button
              variant="destructive"
              className="w-full rounded-xl"
              onClick={handleUnbind}
            >
              确认解绑
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-xl"
              onClick={() => setUnbindOpen(false)}
            >
              取消
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
