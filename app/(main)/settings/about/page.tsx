"use client"

import { PageHeader } from "@/components/common/page-header"
import { Card } from "@/components/ui/card"
import { Heart, Shield, FileText, Mail, Star } from "lucide-react"
import { toast } from "sonner"

const APP_VERSION = "1.0.0"

const links = [
  { icon: FileText, label: "用户协议", action: () => toast("用户协议页面建设中") },
  { icon: Shield, label: "隐私政策", action: () => toast("隐私政策页面建设中") },
  { icon: Star, label: "给我们评分", action: () => toast.success("感谢你的支持！") },
  { icon: Mail, label: "联系我们", action: () => toast("客服邮箱：support@mianhua.app") },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <PageHeader title="关于" showBack />

      <div className="flex-1 p-4 space-y-4">
        {/* App identity */}
        <Card className="p-8">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-cute-coral flex items-center justify-center">
              <Heart className="w-10 h-10 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold">棉花伴侣</h2>
              <p className="text-sm text-muted-foreground mt-1">版本 v{APP_VERSION}</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
              棉花伴侣是一款陪伴型智能玩偶配套应用，让你的毛绒玩偶拥有温暖的灵魂，
              陪你聊天、记录心情、一起云端旅行。
            </p>
          </div>
        </Card>

        {/* Links */}
        <Card className="overflow-hidden">
          {links.map((link, i) => (
            <button
              key={link.label}
              onClick={link.action}
              className={`w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left ${
                i !== links.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                <link.icon className="w-4 h-4 text-foreground" />
              </div>
              <span className="text-sm font-medium">{link.label}</span>
            </button>
          ))}
        </Card>

        {/* Footer */}
        <div className="text-center space-y-1 pt-4">
          <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
            <Heart className="w-4 h-4 fill-cute-coral text-cute-coral" />
            <span className="text-xs">Made with care</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 棉花伴侣 保留所有权利</p>
        </div>
      </div>
    </div>
  )
}
