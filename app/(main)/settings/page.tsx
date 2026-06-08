'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/common/page-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/contexts/auth-context'
import {
  ChevronRight,
  Volume2,
  Brain,
  Bluetooth,
  Info,
  Sparkles,
  Cpu,
  LogOut,
  User,
} from 'lucide-react'
import { toast } from 'sonner'

const settingsGroups = [
  {
    title: '玩偶设置',
    items: [
      {
        href: '/settings/character',
        icon: Sparkles,
        label: '角色设置',
        description: '切换或自定义玩偶角色',
        color: 'from-primary to-cute-coral',
      },
      {
        href: '/settings/device',
        icon: Volume2,
        label: '设备控制',
        description: '音量调节、设备信息',
        color: 'from-cute-mint to-cute-sky',
      },
      {
        href: '/settings/firmware',
        icon: Cpu,
        label: '固件升级',
        description: '检查并升级玩偶固件',
        color: 'from-cute-coral to-cute-orange',
      },
      {
        href: '/settings/memory',
        icon: Brain,
        label: '记忆管理',
        description: '清除聊天记录和记忆',
        color: 'from-cute-orange to-cute-pink',
      },
    ],
  },
  {
    title: '连接设置',
    items: [
      {
        href: '/connect',
        icon: Bluetooth,
        label: '重新连接',
        description: '更换或重新连接玩偶',
        color: 'from-cute-sky to-cute-lavender',
      },
    ],
  },
  {
    title: '其他',
    items: [
      {
        href: '/settings/about',
        icon: Info,
        label: '关于',
        description: '应用版本和帮助',
        color: 'from-cute-lavender to-cute-pink',
      },
    ],
  },
]

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    toast.success('已退出登录')
    router.push('/auth')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cute-cream via-background to-cute-lavender/10 pb-20">
      <PageHeader title="设置" />

      <div className="px-4 py-4">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Account card */}
          <Card className="flex items-center gap-4 p-4 border-0 bg-card/80">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-cute-coral flex items-center justify-center">
              <User className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold truncate">{user?.username || '小主人'}</h4>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email || '未登录'}
              </p>
            </div>
          </Card>

          {settingsGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
                {group.title}
              </h3>
              <Card className="divide-y divide-border border-0 bg-card/80">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}
                    >
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium">{item.label}</h4>
                      <p className="text-xs text-muted-foreground truncate">
                        {item.description}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground/50 flex-shrink-0" />
                  </Link>
                ))}
              </Card>
            </div>
          ))}

          {/* Logout */}
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full h-12 text-cute-coral border-cute-coral/30 hover:bg-cute-coral/10 hover:text-cute-coral"
          >
            <LogOut className="w-5 h-5 mr-2" />
            退出登录
          </Button>
        </div>
      </div>
    </div>
  )
}
