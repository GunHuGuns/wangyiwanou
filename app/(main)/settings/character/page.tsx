'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/common/page-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Check, Plus, Sparkles, Pencil, Trash2 } from 'lucide-react'
import { presetCharacters, aiModels } from '@/lib/mock-data'
import { Character } from '@/lib/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

function getCharacterEmoji(id: string) {
  if (id.includes('bear')) return '🧸'
  if (id.includes('bunny')) return '🐰'
  if (id.includes('cat')) return '🐱'
  if (id.includes('dog')) return '🐕'
  if (id.includes('fairy')) return '🧚'
  return '⭐'
}

const emptyForm = { name: '', personality: '', voiceTone: '', description: '' }

export default function CharacterSettingsPage() {
  const [selectedCharacter, setSelectedCharacter] = useState<string>(presetCharacters[0].id)
  const [selectedModel, setSelectedModel] = useState<string>(aiModels[0].id)
  const [customCharacters, setCustomCharacters] = useState<Character[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<Character | null>(null)

  const allCharacters = [...presetCharacters, ...customCharacters]

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEdit = (character: Character) => {
    setEditingId(character.id)
    setForm({
      name: character.name,
      personality: character.personality,
      voiceTone: character.voiceTone,
      description: character.description,
    })
    setDialogOpen(true)
  }

  const handleSubmit = () => {
    if (!form.name || !form.personality) return

    if (editingId) {
      setCustomCharacters((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? {
                ...c,
                name: form.name,
                personality: form.personality,
                voiceTone: form.voiceTone || '温柔',
                description: form.description || `自定义角色：${form.name}`,
              }
            : c
        )
      )
      toast.success('角色已更新')
    } else {
      const character: Character = {
        id: `custom-${Date.now()}`,
        name: form.name,
        avatar: '',
        personality: form.personality,
        voiceTone: form.voiceTone || '温柔',
        isCustom: true,
        description: form.description || `自定义角色：${form.name}`,
      }
      setCustomCharacters((prev) => [...prev, character])
      setSelectedCharacter(character.id)
      toast.success('角色已创建')
    }
    setDialogOpen(false)
    setForm(emptyForm)
    setEditingId(null)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    setCustomCharacters((prev) => prev.filter((c) => c.id !== deleteTarget.id))
    if (selectedCharacter === deleteTarget.id) {
      setSelectedCharacter(presetCharacters[0].id)
    }
    toast.success(`已删除角色「${deleteTarget.name}」`)
    setDeleteTarget(null)
  }

  const handleSave = () => {
    toast.success('设置已保存')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cute-cream via-background to-cute-lavender/10 pb-20">
      <PageHeader title="角色设置" showBack />

      <div className="px-4 py-4">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Character Selection */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-semibold text-muted-foreground">选择角色</h3>
              <Button variant="ghost" size="sm" className="gap-1" onClick={openCreate}>
                <Plus className="w-4 h-4" />
                自定义
              </Button>
            </div>

            <ScrollArea className="w-full">
              <div className="flex gap-3 pb-2">
                {allCharacters.map((character) => (
                  <Card
                    key={character.id}
                    onClick={() => setSelectedCharacter(character.id)}
                    className={cn(
                      'flex-shrink-0 w-32 p-4 cursor-pointer transition-all duration-200 border-2 relative',
                      selectedCharacter === character.id
                        ? 'border-primary bg-primary/5'
                        : 'border-transparent hover:border-primary/30'
                    )}
                  >
                    <div className="relative">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-cute-orange/20 flex items-center justify-center mb-2">
                        <span className="text-3xl">{getCharacterEmoji(character.id)}</span>
                      </div>
                      {selectedCharacter === character.id && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <h4 className="text-sm font-medium text-center truncate">
                      {character.name}
                    </h4>
                    <p className="text-xs text-muted-foreground text-center truncate">
                      {character.voiceTone}
                    </p>
                    {character.isCustom && (
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            openEdit(character)
                          }}
                          className="size-6 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors"
                          aria-label="编辑角色"
                        >
                          <Pencil className="w-3 h-3 text-muted-foreground" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setDeleteTarget(character)
                          }}
                          className="size-6 rounded-full bg-muted flex items-center justify-center hover:bg-destructive/20 transition-colors"
                          aria-label="删除角色"
                        >
                          <Trash2 className="w-3 h-3 text-destructive" />
                        </button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Selected Character Detail */}
          {selectedCharacter && (
            <Card className="p-5 bg-card/80 border-0">
              <h3 className="font-semibold mb-3">角色详情</h3>
              {(() => {
                const character = allCharacters.find((c) => c.id === selectedCharacter)
                if (!character) return null
                return (
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">性格</p>
                      <p className="text-sm">{character.personality}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">描述</p>
                      <p className="text-sm">{character.description}</p>
                    </div>
                  </div>
                )
              })()}
            </Card>
          )}

          {/* AI Model Selection */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
              AI大模型
            </h3>
            <Card className="divide-y divide-border border-0 bg-card/80">
              {aiModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors first:rounded-t-lg last:rounded-b-lg text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-base font-semibold text-foreground">
                    {model.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium">{model.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {model.provider} · {model.description}
                    </p>
                  </div>
                  {selectedModel === model.id && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </Card>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-cute-coral"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            保存设置
          </Button>
        </div>
      </div>

      {/* 创建/编辑角色对话框 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? '编辑角色' : '创建自定义角色'}</DialogTitle>
            <DialogDescription>设置你专属的玩偶角色</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">角色名称</label>
              <Input
                placeholder="例如：小星星"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">性格特点</label>
              <Input
                placeholder="例如：活泼开朗，喜欢讲笑话"
                value={form.personality}
                onChange={(e) => setForm({ ...form, personality: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">语气风格</label>
              <Input
                placeholder="例如：温柔甜美"
                value={form.voiceTone}
                onChange={(e) => setForm({ ...form, voiceTone: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">角色描述</label>
              <Input
                placeholder="简单描述这个角色"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleSubmit}
              disabled={!form.name || !form.personality}
              className="w-full rounded-xl bg-gradient-to-r from-primary to-cute-coral"
            >
              {editingId ? '保存修改' : '创建角色'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent className="max-w-sm mx-4 rounded-2xl">
          <DialogHeader>
            <div className="size-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-2">
              <Trash2 className="size-6 text-destructive" />
            </div>
            <DialogTitle className="text-center">
              删除角色「{deleteTarget?.name}」
            </DialogTitle>
            <DialogDescription className="text-center">
              删除后将无法恢复该自定义角色
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="w-full rounded-xl"
            >
              确认删除
            </Button>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              className="w-full rounded-xl"
            >
              取消
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
