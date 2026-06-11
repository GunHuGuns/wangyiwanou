"use client"

import { useState } from "react"
import { PageHeader } from "@/components/common/page-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { 
  Clock, 
  Plus, 
  Bell, 
  Sun, 
  Moon,
  Trash2,
  Volume2
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface Alarm {
  id: string
  time: string
  label: string
  enabled: boolean
  repeat: string[]
  voiceType: "natural" | "gentle" | "energetic"
}

const weekDays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
const voiceTypes = [
  { value: "natural", label: "自然语音", icon: Volume2 },
  { value: "gentle", label: "温柔叫醒", icon: Moon },
  { value: "energetic", label: "活力唤醒", icon: Sun },
]

export default function AlarmPage() {
  const [alarms, setAlarms] = useState<Alarm[]>([
    {
      id: "1",
      time: "07:00",
      label: "起床啦",
      enabled: true,
      repeat: ["周一", "周二", "周三", "周四", "周五"],
      voiceType: "gentle",
    },
    {
      id: "2",
      time: "08:30",
      label: "出门提醒",
      enabled: true,
      repeat: ["周一", "周二", "周三", "周四", "周五"],
      voiceType: "energetic",
    },
    {
      id: "3",
      time: "22:00",
      label: "睡前故事时间",
      enabled: false,
      repeat: [],
      voiceType: "natural",
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newAlarm, setNewAlarm] = useState({
    time: "08:00",
    label: "",
    repeat: [] as string[],
    voiceType: "natural" as const,
  })

  const toggleAlarm = (id: string) => {
    setAlarms(prev => 
      prev.map(alarm => 
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
      )
    )
  }

  const deleteAlarm = (id: string) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== id))
  }

  const toggleRepeatDay = (day: string) => {
    setNewAlarm(prev => ({
      ...prev,
      repeat: prev.repeat.includes(day)
        ? prev.repeat.filter(d => d !== day)
        : [...prev.repeat, day]
    }))
  }

  const addAlarm = () => {
    const alarm: Alarm = {
      id: Date.now().toString(),
      time: newAlarm.time,
      label: newAlarm.label || "闹钟",
      enabled: true,
      repeat: newAlarm.repeat,
      voiceType: newAlarm.voiceType,
    }
    setAlarms(prev => [...prev, alarm])
    setIsDialogOpen(false)
    setNewAlarm({
      time: "08:00",
      label: "",
      repeat: [],
      voiceType: "natural",
    })
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <PageHeader title="智能闹钟" showBack />
      
      <div className="flex-1 p-4 space-y-4">
        {/* 说明 */}
        <Card className="p-4 bg-primary/10 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">AI语音闹钟</h3>
              <p className="text-sm text-muted-foreground">
                玩偶会用自然语音叫你起床，而不是传统铃声
              </p>
            </div>
          </div>
        </Card>

        {/* 闹钟列表 */}
        <div className="space-y-3">
          {alarms.map((alarm) => (
            <Card 
              key={alarm.id} 
              className={`p-4 bg-card transition-opacity ${!alarm.enabled ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-light text-foreground">
                      {alarm.time}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {alarm.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">
                      {alarm.repeat.length > 0 
                        ? alarm.repeat.join(" ") 
                        : "仅响一次"}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {voiceTypes.find(v => v.value === alarm.voiceType)?.label}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => deleteAlarm(alarm.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Switch 
                    checked={alarm.enabled}
                    onCheckedChange={() => toggleAlarm(alarm.id)}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 添加闹钟按钮 */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-primary hover:bg-primary/90">
              <Plus className="w-5 h-5 mr-2" />
              添加闹钟
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle>添加新闹钟</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* 时间选择 */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  时间
                </label>
                <Input
                  type="time"
                  value={newAlarm.time}
                  onChange={(e) => setNewAlarm(prev => ({ ...prev, time: e.target.value }))}
                  className="text-2xl h-14 text-center"
                />
              </div>

              {/* 标签 */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  标签
                </label>
                <Input
                  placeholder="例如：起床啦"
                  value={newAlarm.label}
                  onChange={(e) => setNewAlarm(prev => ({ ...prev, label: e.target.value }))}
                />
              </div>

              {/* 重复 */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  重复
                </label>
                <div className="flex flex-wrap gap-2">
                  {weekDays.map((day) => (
                    <Button
                      key={day}
                      size="sm"
                      variant={newAlarm.repeat.includes(day) ? "default" : "outline"}
                      onClick={() => toggleRepeatDay(day)}
                      className={newAlarm.repeat.includes(day) ? "bg-primary" : ""}
                    >
                      {day}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 语音类型 */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  叫醒方式
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {voiceTypes.map((type) => (
                    <Button
                      key={type.value}
                      variant={newAlarm.voiceType === type.value ? "default" : "outline"}
                      onClick={() => setNewAlarm(prev => ({ 
                        ...prev, 
                        voiceType: type.value as typeof prev.voiceType 
                      }))}
                      className={`h-auto py-3 ${newAlarm.voiceType === type.value ? "bg-primary" : ""}`}
                    >
                      <div className="text-center">
                        <type.icon className="w-5 h-5 mx-auto mb-1" />
                        <span className="text-xs">{type.label}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <Button onClick={addAlarm} className="w-full bg-primary hover:bg-primary/90">
                保存闹钟
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
