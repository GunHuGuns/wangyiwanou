'use client'

import { PageHeader } from '@/components/common/page-header'
import { Card } from '@/components/ui/card'
import { Check, Languages, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
  useLanguage,
  LANGUAGES,
  FOLLOW_SYSTEM,
  getLanguageOption,
  detectSystemLanguage,
} from '@/lib/hooks/use-language'

export default function LanguageSettingsPage() {
  const { pref, loaded, setLanguage, isFollowingSystem } = useLanguage()

  const systemLang = loaded ? getLanguageOption(detectSystemLanguage()) : null

  const handleSelect = (value: string) => {
    setLanguage(value)
    if (value === FOLLOW_SYSTEM) {
      toast.success('已设置为跟随系统语言')
    } else {
      toast.success(`语言已切换为${getLanguageOption(value).name}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cute-cream via-background to-cute-lavender/10 pb-24">
      <PageHeader title="语言设置" showBack />

      <div className="px-4 py-4">
        <div className="max-w-lg mx-auto space-y-6">
          {/* 说明 */}
          <Card className="p-5 bg-card/80 border-0">
            <div className="flex items-center gap-2 mb-2">
              <Languages className="w-4 h-4 text-primary" />
              <h3 className="font-semibold">应用语言</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              选择应用的显示语言。默认跟随手机系统语言，你也可以手动指定一种语言。
            </p>
          </Card>

          {/* 跟随系统 */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
              推荐
            </h3>
            <Card className="border-0 bg-card/80 overflow-hidden">
              <button
                type="button"
                onClick={() => handleSelect(FOLLOW_SYSTEM)}
                className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors text-left"
                aria-label="跟随系统语言"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cute-sky to-cute-mint flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium">跟随系统</h4>
                  <p className="text-xs text-muted-foreground truncate">
                    {systemLang
                      ? `当前系统语言：${systemLang.name}`
                      : '使用手机系统的语言设置'}
                  </p>
                </div>
                {isFollowingSystem && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </button>
            </Card>
          </div>

          {/* 语言列表 */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
              选择语言
            </h3>
            <Card className="divide-y divide-border border-0 bg-card/80">
              {LANGUAGES.map((lang) => {
                const active = !isFollowingSystem && pref === lang.code
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelect(lang.code)}
                    className={cn(
                      'w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors text-left first:rounded-t-lg last:rounded-b-lg',
                    )}
                    aria-label={`选择${lang.name}`}
                  >
                    <span className="flex-1 font-medium">{lang.name}</span>
                    {active && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                )
              })}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
