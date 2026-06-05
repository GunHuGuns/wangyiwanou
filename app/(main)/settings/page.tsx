'use client'

import Link from 'next/link'
import { PageHeader } from '@/components/common/page-header'
import { Card } from '@/components/ui/card'
import {
  ChevronRight,
  User,
  Volume2,
  Brain,
  Trash2,
  Bluetooth,
  Info,
  Sparkles,
  Shield,
} from 'lucide-react'

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
        color: 'from-muted-foreground to-muted-foreground',
      },
    ],
  },
]

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cute-cream via-background to-cute-lavender/10 pb-20">
      <PageHeader title="设置" />

      <div className="px-4 py-4">
        <div className="max-w-lg mx-auto space-y-6">
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
        </div>
      </div>
    </div>
  )
}
