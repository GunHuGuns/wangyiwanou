"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles, Mail, Lock, User as UserIcon, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/contexts/auth-context"
import { toast } from "sonner"

export default function AuthPage() {
  const router = useRouter()
  const { login, register } = useAuth()
  const [mode, setMode] = useState<"login" | "register">("login")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || (mode === "register" && !username)) {
      toast.error("请填写所有字段")
      return
    }
    if (password.length < 6) {
      toast.error("密码至少需要6位")
      return
    }
    setIsSubmitting(true)
    setTimeout(() => {
      const result =
        mode === "login" ? login(email, password) : register(username, email, password)
      setIsSubmitting(false)
      if (result.ok) {
        toast.success(mode === "login" ? "登录成功" : "注册成功，欢迎加入")
        router.push("/connect")
      } else {
        toast.error(result.error || "操作失败")
      }
    }, 600)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary/20 via-background to-background p-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-4">
            <Sparkles className="w-9 h-9 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">毛绒精灵</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "login" ? "欢迎回来，登录你的账号" : "创建账号，开启奇妙旅程"}
          </p>
        </div>

        <Card className="p-6 bg-card border-0 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "register" && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="username" className="text-sm font-medium text-foreground">
                  昵称
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="给自己起个名字"
                    className="pl-9"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                邮箱
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="至少6位密码"
                  className="pl-9"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 mt-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : mode === "login" ? (
                "登录"
              ) : (
                "注册"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            {mode === "login" ? "还没有账号？" : "已有账号？"}
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-primary font-medium ml-1 hover:underline"
            >
              {mode === "login" ? "立即注册" : "去登录"}
            </button>
          </div>
        </Card>
      </div>
    </main>
  )
}
