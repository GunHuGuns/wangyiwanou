"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bluetooth, RefreshCw, Wifi, ChevronRight } from "lucide-react"

interface ScannedDevice {
  id: string
  name: string
  rssi: number
  type: string
}

export default function ConnectPage() {
  const router = useRouter()
  const [isScanning, setIsScanning] = useState(false)
  const [devices, setDevices] = useState<ScannedDevice[]>([])

  const startScan = () => {
    setIsScanning(true)
    setDevices([])
    
    // 模拟蓝牙扫描
    setTimeout(() => {
      setDevices([
        { id: "1", name: "小棉花", rssi: -45, type: "bear" },
        { id: "2", name: "跳跳兔", rssi: -60, type: "rabbit" },
      ])
      setIsScanning(false)
    }, 2000)
  }

  const selectDevice = (device: ScannedDevice) => {
    router.push(`/connect/wifi?deviceId=${device.id}&deviceName=${device.name}`)
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="flex flex-col items-center pt-8">
        {/* 标题 */}
        <h1 className="text-2xl font-bold text-foreground mb-2">连接玩偶</h1>
        <p className="text-muted-foreground text-center mb-8">
          请打开玩偶电源，确保蓝牙已开启
        </p>

        {/* 扫描动画区域 */}
        <div className="relative w-48 h-48 mb-8">
          <div className={`absolute inset-0 rounded-full bg-primary/10 ${isScanning ? "animate-ping" : ""}`} />
          <div className={`absolute inset-4 rounded-full bg-primary/20 ${isScanning ? "animate-ping delay-100" : ""}`} />
          <div className="absolute inset-8 rounded-full bg-primary/30 flex items-center justify-center">
            <Bluetooth className={`w-12 h-12 text-primary ${isScanning ? "animate-pulse" : ""}`} />
          </div>
        </div>

        {/* 扫描按钮 */}
        <Button
          onClick={startScan}
          disabled={isScanning}
          className="mb-8 bg-primary hover:bg-primary/90"
          size="lg"
        >
          {isScanning ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              扫描中...
            </>
          ) : (
            <>
              <Bluetooth className="w-5 h-5 mr-2" />
              开始扫描
            </>
          )}
        </Button>

        {/* 设备列表 */}
        {devices.length > 0 && (
          <div className="w-full space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground mb-3">
              发现 {devices.length} 个设备
            </h2>
            {devices.map((device) => (
              <Card
                key={device.id}
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => selectDevice(device)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bluetooth className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{device.name}</p>
                      <p className="text-sm text-muted-foreground">
                        信号强度: {device.rssi > -50 ? "强" : device.rssi > -70 ? "中" : "弱"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* 提示 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            找不到设备？请确保玩偶已开机且距离较近
          </p>
        </div>
      </div>
    </main>
  )
}
