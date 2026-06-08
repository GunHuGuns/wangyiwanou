"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check, Sparkles } from "lucide-react"
import confetti from "canvas-confetti"

export default function SuccessPage() {
  const router = useRouter()
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // 触发庆祝动画
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FF9B8E", "#FFB347", "#87CEEB"],
    })
    
    setTimeout(() => setShowContent(true), 300)
  }, [])

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className={`flex flex-col items-center transition-all duration-500 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        {/* 成功图标 */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-12 h-12 text-green-500" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-6 h-6 text-secondary" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">连接成功</h1>
        <p className="text-muted-foreground text-center mb-8">
          太棒了！你的玩偶已经准备就绪
        </p>

        {/* 设备信息 */}
        <div className="w-full bg-card rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">小棉花</p>
              <p className="text-sm text-muted-foreground">已连接到 HomeWiFi</p>
              <p className="text-xs text-green-500 mt-1">在线</p>
            </div>
          </div>
        </div>

        <Button
          onClick={() => router.push("/home")}
          className="w-full bg-primary hover:bg-primary/90"
          size="lg"
        >
          开始探索
        </Button>
      </div>
    </main>
  )
}
