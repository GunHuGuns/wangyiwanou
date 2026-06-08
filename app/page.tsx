"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sparkles } from "lucide-react"
import { useAuth } from "@/lib/contexts/auth-context"

export default function SplashPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false)
      if (isLoading) return
      router.push(user ? "/connect" : "/auth")
    }, 2500)
    return () => clearTimeout(timer)
  }, [router, user, isLoading])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary/20 via-background to-background p-6">
      {/* Logo动画 */}
      <div className={`flex flex-col items-center gap-6 ${isAnimating ? "animate-pulse" : ""}`}>
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-primary/30 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-3xl">
                <Sparkles className="w-8 h-8" />
              </div>
            </div>
          </div>
          {/* 装饰光点 */}
          <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-secondary animate-bounce" />
          <div className="absolute -bottom-1 -left-3 w-3 h-3 rounded-full bg-accent animate-bounce delay-100" />
          <div className="absolute top-1/2 -right-4 w-2 h-2 rounded-full bg-primary animate-bounce delay-200" />
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">毛绒精灵</h1>
          <p className="text-muted-foreground">与你的玩偶开启奇妙旅程</p>
        </div>
      </div>

      {/* 加载提示 */}
      <div className="absolute bottom-20 flex flex-col items-center gap-3">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-100" />
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-200" />
        </div>
        <p className="text-sm text-muted-foreground">正在启动...</p>
      </div>
    </main>
  )
}
