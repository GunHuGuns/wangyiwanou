"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check, Sparkles } from "lucide-react"
import confetti from "canvas-confetti"

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showContent, setShowContent] = useState(false)
  const [deviceName, setDeviceName] = useState("小棉花")
  const [ssid, setSsid] = useState("HomeWiFi")

  useEffect(() => {
    // 读取连接信息：优先 URL 参数，其次已存储设备
    const nameParam = searchParams.get("device")
    const ssidParam = searchParams.get("ssid")
    const stored = typeof window !== "undefined" ? localStorage.getItem("connectedDevice") : null
    const device = stored ? JSON.parse(stored) : null

    const finalName = nameParam || device?.name || "小棉花"
    const finalSsid = ssidParam || device?.wifiSSID || "HomeWiFi"
    setDeviceName(finalName)
    setSsid(finalSsid)

    // 确保设备已持久化，保证主应用能识别连接状态
    if (typeof window !== "undefined" && !stored) {
      localStorage.setItem(
        "connectedDevice",
        JSON.stringify({
          id: "plush-1",
          name: finalName,
          type: "bear",
          macAddress: "A1:B2:C3:D4:E5:F6",
          firmwareVersion: "1.2.0",
          batteryLevel: 86,
          isOnline: true,
          wifiSSID: finalSsid,
        }),
      )
    }

    // 触发庆祝动画
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FF9B8E", "#FFB347", "#87CEEB"],
    })

    setTimeout(() => setShowContent(true), 300)
  }, [searchParams])

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div
        className={`flex w-full flex-col items-center transition-all duration-500 ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* 成功图标 */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full bg-cute-mint/40 flex items-center justify-center">
            <Check className="w-12 h-12 text-foreground" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-6 h-6 text-secondary" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">连接成功</h1>
        <p className="text-muted-foreground text-center mb-8">太棒了！你的玩偶已经准备就绪</p>

        {/* 设备信息 */}
        <div className="w-full bg-card rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl">
              {"🧸"}
            </div>
            <div>
              <p className="font-semibold text-foreground">{deviceName}</p>
              <p className="text-sm text-muted-foreground">已连接到 {ssid}</p>
              <p className="text-xs text-cute-mint mt-1 font-medium">● 在线</p>
            </div>
          </div>
        </div>

        <Button onClick={() => router.push("/home")} className="w-full" size="lg">
          开始探索
        </Button>
      </div>
    </main>
  )
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
