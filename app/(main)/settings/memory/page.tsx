'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/common/page-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  MessageSquare,
  Clock,
  Brain,
  Trash2,
  AlertTriangle,
} from 'lucide-react'

export default function MemorySettingsPage() {
  const [temporaryMemoryEnabled, setTemporaryMemoryEnabled] = useState(true)
  const [longTermMemoryEnabled, setLongTermMemoryEnabled] = useState(true)
  const [dialogType, setDialogType] = useState<string | null>(null)
  const [isClearing, setIsClearing] = useState(false)

  const handleClear = async (type: string) => {
    setIsClearing(true)
    // Simulate clearing
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsClearing(false)
    setDialogType(null)
  }

  const memoryOptions = [
    {
      id: 'chat',
      icon: MessageSquare,
      title: '聊天记录',
      description: '清除与玩偶的所有对话历史',
      color: 'from-cute-sky to-cute-mint',
      warning: '清除后将无法恢复所有聊天记录',
    },
    {
      id: 'temporary',
      icon: Clock,
      title: '临时记忆',
      description: '清除当前对话的上下文记忆',
      color: 'from-cute-orange to-cute-pink',
      warning: '玩偶将忘记最近的对话内容',
    },
    {
      id: 'longterm',
      icon: Brain,
      title: '长期记忆',
      description: '清除玩偶学习到的关于你的信息',
      color: 'from-cute-lavender to-cute-coral',
      warning: '玩偶将忘记关于你的所有喜好和习惯',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cute-cream via-background to-cute-orange/10 pb-20">
      <PageHeader title="记忆管理" showBack />

      <div className="px-4 py-4">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Memory Settings */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
              记忆设置
            </h3>
            <Card className="divide-y divide-border border-0 bg-card/80">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cute-orange to-cute-pink flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">临时记忆</h4>
                    <p className="text-xs text-muted-foreground">
                      记住当前对话的上下文
                    </p>
                  </div>
                </div>
                <Switch
                  checked={temporaryMemoryEnabled}
                  onCheckedChange={setTemporaryMemoryEnabled}
                />
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cute-lavender to-cute-coral flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">长期记忆</h4>
                    <p className="text-xs text-muted-foreground">
                      学习并记住你的喜好
                    </p>
                  </div>
                </div>
                <Switch
                  checked={longTermMemoryEnabled}
                  onCheckedChange={setLongTermMemoryEnabled}
                />
              </div>
            </Card>
          </div>

          {/* Clear Memory */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
              清除记忆
            </h3>
            <Card className="divide-y divide-border border-0 bg-card/80">
              {memoryOptions.map((option) => (
                <Dialog
                  key={option.id}
                  open={dialogType === option.id}
                  onOpenChange={(open) => setDialogType(open ? option.id : null)}
                >
                  <DialogTrigger
                    render={
                      <button className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors first:rounded-t-lg last:rounded-b-lg text-left">
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center`}
                        >
                          <option.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium">{option.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {option.description}
                          </p>
                        </div>
                        <Trash2 className="w-5 h-5 text-muted-foreground/50" />
                      </button>
                    }
                  />
                  <DialogContent className="max-w-sm mx-4 rounded-2xl">
                    <DialogHeader>
                      <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-2">
                        <AlertTriangle className="w-6 h-6 text-destructive" />
                      </div>
                      <DialogTitle className="text-center">
                        清除{option.title}
                      </DialogTitle>
                      <DialogDescription className="text-center">
                        {option.warning}
                        <br />
                        此操作不可撤销
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col gap-2 sm:flex-col">
                      <Button
                        variant="destructive"
                        onClick={() => handleClear(option.id)}
                        disabled={isClearing}
                        className="w-full rounded-xl"
                      >
                        {isClearing ? '清除中...' : '确认清除'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setDialogType(null)}
                        disabled={isClearing}
                        className="w-full rounded-xl"
                      >
                        取消
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ))}
            </Card>
          </div>

          {/* Info */}
          <Card className="p-4 bg-muted/50 border-0">
            <p className="text-sm text-muted-foreground">
              <strong>提示：</strong>
              临时记忆帮助玩偶理解当前对话内容，长期记忆让玩偶记住你的喜好和习惯。清除记忆后，玩偶将重新学习了解你。
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
