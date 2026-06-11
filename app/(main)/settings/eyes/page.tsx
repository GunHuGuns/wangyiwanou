'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { PageHeader } from '@/components/common/page-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Eye, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useDevice, isDeviceUsable } from '@/lib/hooks/use-device'
import { useDollEyes, EYE_PRESETS, getEyePreset } from '@/lib/hooks/use-doll-eyes'

export default function EyesSettingsPage() {
  const { eyeId, loaded, setEye } = useDollEyes()
  const { device } = useDevice()
  const usable = isDeviceUsable(device)

  // 当前预览选中的眼睛（未保存前的临时选择）
  const [selected, setSelected] = useState<string>(EYE_PRESETS[0].id)

  useEffect(() => {
    if (loaded) setSelected(eyeId)
  }, [loaded, eyeId])

  const handleApply = () => {
    setEye(selected)
    const preset = getEyePreset(selected)
    if (usable) {
      toast.success(`已将「${preset.name}」应用到玩偶眼睛`)
    } else {
      toast.success(`已保存「${preset.name}」，玩偶在线后自动生效`)
    }
  }

  const previewPreset = getEyePreset(selected)
  const changed = selected !== eyeId

  return (
    <div className="min-h-screen bg-gradient-to-br from-cute-cream via-background to-cute-lavender/10 pb-24">
      <PageHeader title="眼睛显示" showBack />

      <div className="px-4 py-4">
        <div className="max-w-lg mx-auto space-y-6">
          {/* 说明 */}
          <Card className="p-5 bg-card/80 border-0">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-primary" />
              <h3 className="font-semibold">玩偶眼睛显示</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              从预置的眼睛样式中选择一款，应用后将显示在玩偶的眼睛屏幕上，让它更有表情。
            </p>
          </Card>

          {/* 预览 */}
          <Card className="p-5 bg-card/80 border-0">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">预览</h3>
            <div className="rounded-2xl bg-foreground/90 p-6 flex items-center justify-center">
              <div className="relative w-40 h-40">
                <Image
                  src={previewPreset.src || '/placeholder.svg'}
                  alt={`${previewPreset.name}眼睛预览`}
                  fill
                  sizes="160px"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <p className="text-center text-sm font-medium mt-3">{previewPreset.name}</p>
          </Card>

          {/* 选择 */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
              选择眼睛样式
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {EYE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelected(preset.id)}
                  className="text-left"
                  aria-label={`选择${preset.name}`}
                >
                  <Card
                    className={cn(
                      'p-2 cursor-pointer transition-all duration-200 border-2 relative',
                      selected === preset.id
                        ? 'border-primary bg-primary/5'
                        : 'border-transparent hover:border-primary/30'
                    )}
                  >
                    <div className="relative aspect-square rounded-xl bg-foreground/90 overflow-hidden">
                      <Image
                        src={preset.src || '/placeholder.svg'}
                        alt={`${preset.name}眼睛`}
                        fill
                        sizes="120px"
                        className="object-contain p-1.5"
                      />
                      {selected === preset.id && (
                        <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-medium text-center mt-1.5 truncate">
                      {preset.name}
                    </p>
                  </Card>
                </button>
              ))}
            </div>
          </div>

          {!usable && (
            <p className="text-xs text-center text-muted-foreground">
              提示：玩偶当前未连接，保存后将在玩偶上线时自动生效。
            </p>
          )}

          {/* 应用按钮 */}
          <Button
            onClick={handleApply}
            disabled={!changed}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-cute-coral"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {changed ? '应用到玩偶眼睛' : '已应用当前样式'}
          </Button>
        </div>
      </div>
    </div>
  )
}
