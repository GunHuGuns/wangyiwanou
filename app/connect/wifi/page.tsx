"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Wifi, WifiOff, Eye, EyeOff, ChevronLeft, Loader2 } from "lucide-react"

interface WifiNetwork {
  id: string
  ssid: string
  signal: number
  secured: boolean
}

function WifiContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const deviceName = searchParams.get("deviceName") || "玩偶"
  
  const [isScanning, setIsScanning] = useState(false)
  const [networks, setNetworks] = useState<WifiNetwork[]>([])
  const [selectedNetwork, setSelectedNetwork] = useState<WifiNetwork | null>(null)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  const scanWifi = () => {
    setIsScanning(true)
    setTimeout(() => {
      setNetworks([
        { id: "1", ssid: "HomeWiFi", signal: 90, secured: true },
        { id: "2", ssid: "OfficeNetwork", signal: 75, secured: true },
        { id: "3", ssid: "GuestWiFi", signal: 60, secured: false },
      ])
      setIsScanning(false)
    }, 1500)
  }

  const connectWifi = () => {
    if (!selectedNetwork) return
    setIsConnecting(true)
    setTimeout(() => {
      router.push("/connect/success")
    }, 2000)
  }

  return (
    <main className="min-h-screen bg-background p-6">
      {/* 返回按钮 */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.back()}
        className="mb-4"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-foreground mb-2">配置WiFi</h1>
        <p className="text-muted-foreground mb-6">
          为{deviceName}配置WiFi连接
        </p>

        {/* WiFi图标 */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Wifi className="w-10 h-10 text-primary" />
          </div>
        </div>

        {/* 扫描按钮 */}
        {networks.length === 0 && (
          <Button
            onClick={scanWifi}
            disabled={isScanning}
            className="mb-6 bg-primary hover:bg-primary/90"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                扫描中...
              </>
            ) : (
              "扫描WiFi网络"
            )}
          </Button>
        )}

        {/* 网络列表 */}
        {networks.length > 0 && !selectedNetwork && (
          <div className="space-y-3 mb-6">
            <h2 className="text-sm font-medium text-muted-foreground">
              可用网络
            </h2>
            {networks.map((network) => (
              <Card
                key={network.id}
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedNetwork(network)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Wifi className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">
                      {network.ssid}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {network.secured && (
                      <span className="text-xs text-muted-foreground">需要密码</span>
                    )}
                    <div className="w-4 h-4 flex items-end gap-0.5">
                      <div className={`w-1 ${network.signal > 30 ? "bg-primary" : "bg-muted"} h-1 rounded-full`} />
                      <div className={`w-1 ${network.signal > 50 ? "bg-primary" : "bg-muted"} h-2 rounded-full`} />
                      <div className={`w-1 ${network.signal > 70 ? "bg-primary" : "bg-muted"} h-3 rounded-full`} />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* 密码输入 */}
        {selectedNetwork && (
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Wifi className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">
                {selectedNetwork.ssid}
              </span>
            </div>
            
            {selectedNetwork.secured && (
              <div className="mb-4">
                <label className="text-sm text-muted-foreground mb-2 block">
                  输入WiFi密码
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="WiFi密码"
                    className="pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setSelectedNetwork(null)}
              >
                取消
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={connectWifi}
                disabled={selectedNetwork.secured && !password || isConnecting}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    连接中...
                  </>
                ) : (
                  "连接"
                )}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </main>
  )
}

export default function WifiPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </main>
      }
    >
      <WifiContent />
    </Suspense>
  )
}
