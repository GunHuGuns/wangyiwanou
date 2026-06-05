'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/common/page-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import {
  Volume2,
  VolumeX,
  Volume1,
  Battery,
  Wifi,
  Cpu,
  Power,
} from 'lucide-react'
import { PlushDevice } from '@/lib/types'
import { plushTypeIcons } from '@/lib/mock-data'
import { useRouter } from 'next/navigation'

export default function DeviceSettingsPage() {
  const router = useRouter()
  const [device, setDevice] = useState<PlushDevice | null>(null)
  const [volume, setVolume] = useState(70)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    const deviceData = localStorage.getItem('connectedDevice')
    if (deviceData) {
      const parsed = JSON.parse(deviceData)
      setDevice(parsed)
      setVolume(parsed.volume || 70)
    }
  }, [])

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (newVolume > 0) setIsMuted(false)

    // Update device in storage
    if (device) {
      const updated = { ...device, volume: newVolume }
      localStorage.setItem('connectedDevice', JSON.stringify(updated))
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleDisconnect = () => {
    localStorage.removeItem('connectedDevice')
    sessionStorage.removeItem('selectedDevice')
    router.push('/connect')
  }

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return VolumeX
    if (volume < 50) return Volume1
    return Volume2
  }

  const VolumeIcon = getVolumeIcon()

  if (!device) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cute-cream via-background to-cute-mint/10 pb-20">
      <PageHeader title="设备控制" showBack />

      <div className="px-4 py-4">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Device Info Card */}
          <Card className="p-5 bg-card/80 border-0">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-cute-orange/20 flex items-center justify-center">
                <span className="text-4xl">{plushTypeIcons[device.type]}</span>
              </div>
              <div>
                <h2 className="text-lg font-bold">{device.name}</h2>
                <p className="text-sm text-cute-mint">已连接</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-xl">
                <Battery className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-sm font-medium">{device.batteryLevel}%</p>
                <p className="text-xs text-muted-foreground">电量</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-xl">
                <Wifi className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-sm font-medium truncate">
                  {device.wifiSSID || '已连接'}
                </p>
                <p className="text-xs text-muted-foreground">网络</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-xl">
                <Cpu className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-sm font-medium">{device.firmwareVersion}</p>
                <p className="text-xs text-muted-foreground">固件</p>
              </div>
            </div>
          </Card>

          {/* Volume Control */}
          <Card className="p-5 bg-card/80 border-0">
            <h3 className="font-semibold mb-4">音量控制</h3>

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

            {/* Quick Volume Presets */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: '静音', value: 0 },
                { label: '低', value: 30 },
                { label: '中', value: 60 },
                { label: '高', value: 100 },
              ].map((preset) => (
                <Button
                  key={preset.label}
                  variant={volume === preset.value && !isMuted ? 'default' : 'outline'}
                  size="sm"
                  className="rounded-xl"
                  onClick={() => {
                    setVolume(preset.value)
                    setIsMuted(preset.value === 0)
                    if (device) {
                      const updated = { ...device, volume: preset.value }
                      localStorage.setItem('connectedDevice', JSON.stringify(updated))
                    }
                  }}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </Card>

          {/* Disconnect Button */}
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
        </div>
      </div>
    </div>
  )
}
