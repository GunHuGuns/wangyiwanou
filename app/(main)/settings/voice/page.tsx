'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { PageHeader } from '@/components/common/page-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { DeviceStatusBanner } from '@/components/common/device-status-banner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Mic,
  Square,
  Play,
  Pause,
  Trash2,
  Sparkles,
  CheckCircle2,
  Volume2,
  RotateCcw,
  AudioLines,
  Check,
  CreditCard,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useDevice, isDeviceUsable } from '@/lib/hooks/use-device'
import {
  useVoiceClone,
  readVoiceClone,
  writeVoiceClone,
  MIN_RECORD_SECONDS,
  MAX_RECORD_SECONDS,
  PRICE_PER_VOICE,
  CLONES_PER_CYCLE,
  SUPPORTED_DIALECTS,
  getRemainingClones,
} from '@/lib/hooks/use-voice-clone'

// 朗读提示文本，帮助用户录出更稳定的音色
const SAMPLE_TEXT =
  '你好呀，我是你的专属玩偶。今天过得怎么样？无论开心还是难过，我都会一直陪着你，听你说说心里话。'

function formatTime(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function VoiceClonePage() {
  const { device } = useDevice()
  const usable = isDeviceUsable(device)
  const { voice, loaded, update } = useVoiceClone()

  // 录音相关
  const [isRecording, setIsRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isCloning, setIsCloning] = useState(false)
  const [cloneProgress, setCloneProgress] = useState(0)
  const [voiceName, setVoiceName] = useState('')
  const [dialect, setDialect] = useState<string>('普通话')
  // 付费弹窗
  const [payOpen, setPayOpen] = useState(false)
  const [isPaying, setIsPaying] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const secondsRef = useRef(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (loaded) {
      setVoiceName(voice.name || '我的声音')
      if (voice.dialect) setDialect(voice.dialect)
    }
  }, [loaded, voice.name, voice.dialect])

  // 清理资源
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      streamRef.current?.getTracks().forEach((t) => t.stop())
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop()
    }
    streamRef.current?.getTracks().forEach((t) => t.stop())
    stopTimer()
    setIsRecording(false)
  }, [])

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error('当前环境不支持录音')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      chunksRef.current = []
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev)
          return url
        })
      }

      recorder.start()
      secondsRef.current = 0
      setSeconds(0)
      setAudioUrl(null)
      setIsRecording(true)

      timerRef.current = setInterval(() => {
        secondsRef.current += 1
        setSeconds(secondsRef.current)
        if (secondsRef.current >= MAX_RECORD_SECONDS) {
          stopRecording()
          toast('已达到最长录音时长')
        }
      }, 1000)
    } catch {
      toast.error('无法访问麦克风，请检查权限设置')
    }
  }

  const handleToggleRecord = () => {
    if (isRecording) {
      if (secondsRef.current < MIN_RECORD_SECONDS) {
        toast.error(`录音至少需要 ${MIN_RECORD_SECONDS} 秒`)
        return
      }
      stopRecording()
    } else {
      startRecording()
    }
  }

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
  }

  const discardRecording = () => {
    setAudioUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    setSeconds(0)
    secondsRef.current = 0
    setIsPlaying(false)
  }

  // 点击「开始克隆」：先校验录音，再判断是否有剩余次数
  const handleClone = () => {
    if (!audioUrl || seconds < MIN_RECORD_SECONDS) {
      toast.error(`请先录制至少 ${MIN_RECORD_SECONDS} 秒的声音`)
      return
    }
    // 剩余次数不足，需要付费购买新的计费周期
    if (getRemainingClones(voice) <= 0) {
      setPayOpen(true)
      return
    }
    runClone()
  }

  // 付费购买一个计费周期（15 元，含 5 次克隆额度），完成后立即克隆
  const handlePayAndClone = () => {
    setIsPaying(true)
    setTimeout(() => {
      const current = readVoiceClone()
      writeVoiceClone({ ...current, paidCycles: current.paidCycles + 1 })
      setIsPaying(false)
      setPayOpen(false)
      toast.success(`支付成功，已获得 ${CLONES_PER_CYCLE} 次克隆额度`)
      runClone()
    }, 1200)
  }

  // 模拟 AI 克隆处理过程
  const runClone = () => {
    setIsCloning(true)
    setCloneProgress(0)
    update({
      status: 'cloning',
      durationSec: seconds,
      dialect,
      name: voiceName.trim() || '我的声音',
    })

    const interval = setInterval(() => {
      setCloneProgress((p) => {
        const next = Math.min(100, p + Math.random() * 18 + 6)
        if (next >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsCloning(false)
            const current = readVoiceClone()
            writeVoiceClone({
              ...current,
              status: 'ready',
              applied: true,
              durationSec: seconds,
              dialect,
              name: voiceName.trim() || '我的声音',
              cloneCount: current.cloneCount + 1,
              createdAt: new Date().toISOString(),
            })
            toast.success('声音克隆完成，已应用到玩偶发音')
            discardRecording()
          }, 400)
        }
        return next
      })
    }, 500)
  }

  const handleReClone = () => {
    // 保留已购买的计费周期与已用次数，仅回到录制状态
    update({ status: 'none', applied: false })
    discardRecording()
    toast('可重新录制并克隆新音色')
  }

  const toggleApply = (checked: boolean) => {
    update({ applied: checked })
    toast.success(checked ? '已应用克隆音色到玩偶' : '已切换回默认音色')
  }

  const canStop = isRecording && seconds >= MIN_RECORD_SECONDS
  const recordProgress = (seconds / MAX_RECORD_SECONDS) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-cute-cream via-background to-cute-lavender/10 pb-20">
      <PageHeader title="语音克隆" showBack />

      <div className="px-4 py-4">
        <div className="max-w-lg mx-auto space-y-6">
          {(!device || device.status !== 'connected') && (
            <DeviceStatusBanner device={device} feature="语音克隆" />
          )}

          {/* 已就绪音色卡片 */}
          {loaded && voice.status === 'ready' && (
            <Card className="p-5 bg-card/80 border-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-cute-coral flex items-center justify-center flex-shrink-0">
                  <AudioLines className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{voice.name}</h3>
                    <span className="flex items-center gap-1 text-xs text-cute-mint">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      已就绪
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {voice.dialect} · 采样时长 {formatTime(voice.durationSec)} · 已克隆{' '}
                    {voice.cloneCount} 次
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">应用到玩偶发音</span>
                </div>
                <Switch checked={voice.applied} onCheckedChange={toggleApply} />
              </div>

              <Button
                variant="outline"
                className="w-full rounded-xl mt-3"
                onClick={handleReClone}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                重新录制克隆
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-2">
                剩余 {getRemainingClones(voice)} 次克隆额度 · 每个音色{' '}
                {PRICE_PER_VOICE} 元含 {CLONES_PER_CYCLE} 次
              </p>
            </Card>
          )}

          {/* 录制与克隆流程（未就绪时展示） */}
          {loaded && voice.status !== 'ready' && (
            <>
              {/* 说明 */}
              <Card className="p-5 bg-card/80 border-0">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold">克隆你的声音</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  录制一段 {MIN_RECORD_SECONDS}–{MAX_RECORD_SECONDS} 秒的清晰朗读，AI
                  将学习你的音色，并应用到玩偶的后续发音中。请在安静环境下，自然地朗读下面的文字。
                </p>
                <div className="mt-3 p-3 rounded-xl bg-muted/50 text-sm leading-relaxed text-foreground/80">
                  {SAMPLE_TEXT}
                </div>

                {/* 计费规则 */}
                <div className="mt-3 p-3 rounded-xl bg-primary/5 border border-primary/15">
                  <div className="flex items-center gap-2 mb-1.5">
                    <CreditCard className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">收费规则</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    每个音色 {PRICE_PER_VOICE} 元，含 {CLONES_PER_CYCLE}{' '}
                    次克隆额度；超过 {CLONES_PER_CYCLE} 次后，再次按 {PRICE_PER_VOICE}{' '}
                    元循环计费。
                  </p>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-muted-foreground">
                      已克隆 {voice.cloneCount} 次
                    </span>
                    <span className="font-medium text-primary">
                      剩余 {getRemainingClones(voice)} 次额度
                    </span>
                  </div>
                </div>
              </Card>

              {/* 克隆进行中 */}
              {isCloning ? (
                <Card className="p-6 bg-card/80 border-0 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                  <h3 className="font-semibold mb-1">正在克隆你的声音…</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    AI 正在分析音色特征，请稍候
                  </p>
                  <Progress value={cloneProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {Math.round(cloneProgress)}%
                  </p>
                </Card>
              ) : (
                <Card className="p-6 bg-card/80 border-0">
                  {/* 录音按钮区 */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={handleToggleRecord}
                      className={cn(
                        'w-24 h-24 rounded-full flex items-center justify-center transition-all',
                        isRecording
                          ? 'bg-destructive/15 ring-4 ring-destructive/30'
                          : 'bg-primary/15 ring-4 ring-primary/20 hover:ring-primary/40'
                      )}
                      aria-label={isRecording ? '停止录音' : '开始录音'}
                    >
                      {isRecording ? (
                        <Square className="w-9 h-9 text-destructive fill-destructive" />
                      ) : (
                        <Mic className="w-10 h-10 text-primary" />
                      )}
                    </button>

                    <p className="text-2xl font-bold mt-4 tabular-nums">
                      {formatTime(seconds)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isRecording
                        ? canStop
                          ? '点击停止录音'
                          : `还需录制 ${MIN_RECORD_SECONDS - seconds} 秒`
                        : audioUrl
                          ? '录音完成，可试听或开始克隆'
                          : `点击开始录音（${MIN_RECORD_SECONDS}–${MAX_RECORD_SECONDS} 秒）`}
                    </p>

                    {(isRecording || seconds > 0) && (
                      <div className="w-full mt-4">
                        <Progress value={recordProgress} className="h-1.5" />
                        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                          <span>0:00</span>
                          <span>{formatTime(MAX_RECORD_SECONDS)}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 试听 + 操作 */}
                  {audioUrl && !isRecording && (
                    <div className="mt-6 space-y-3">
                      <audio
                        ref={audioRef}
                        src={audioUrl}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onEnded={() => setIsPlaying(false)}
                        className="hidden"
                      />
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          className="flex-1 rounded-xl"
                          onClick={togglePlay}
                        >
                          {isPlaying ? (
                            <>
                              <Pause className="w-4 h-4 mr-2" />
                              暂停
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              试听
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-xl text-destructive border-destructive/30 hover:bg-destructive/10"
                          onClick={discardRecording}
                          aria-label="删除录音"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">
                          音色名称
                        </label>
                        <Input
                          value={voiceName}
                          onChange={(e) => setVoiceName(e.target.value)}
                          placeholder="给你的声音起个名字"
                          maxLength={20}
                          className="rounded-xl"
                        />
                      </div>

                      {/* 方言 / 语种选择 */}
                      <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">
                          语音方言（仅支持以下方言与语种）
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {SUPPORTED_DIALECTS.map((d) => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => setDialect(d)}
                              className={cn(
                                'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                                dialect === d
                                  ? 'bg-primary text-primary-foreground border-primary'
                                  : 'bg-muted/50 text-muted-foreground border-transparent hover:border-primary/30'
                              )}
                            >
                              {dialect === d && (
                                <Check className="w-3 h-3 mr-1 inline-block align-[-1px]" />
                              )}
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>

                      <Button
                        className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90"
                        onClick={handleClone}
                      >
                        {getRemainingClones(voice) > 0 ? (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            开始克隆声音（剩余 {getRemainingClones(voice)} 次）
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4 mr-2" />
                            支付 {PRICE_PER_VOICE} 元并克隆
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </Card>
              )}
            </>
          )}

          {!usable && (
            <p className="text-xs text-center text-muted-foreground">
              提示：克隆完成后，需玩偶在线才能将音色应用到实际发音。
            </p>
          )}
        </div>
      </div>

      {/* 付费弹窗 */}
      <Dialog open={payOpen} onOpenChange={(o) => !isPaying && setPayOpen(o)}>
        <DialogContent className="max-w-sm rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              购买音色克隆
            </DialogTitle>
            <DialogDescription>
              当前克隆额度已用完，购买一个新的计费周期即可继续克隆。
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-2xl bg-muted/50 p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">音色克隆套餐</span>
              <span className="font-medium">{CLONES_PER_CYCLE} 次额度</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">方言 / 语种</span>
              <span className="font-medium">{dialect}</span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-2">
              <span className="text-sm font-medium">应付金额</span>
              <span className="text-lg font-bold text-primary">
                ¥{PRICE_PER_VOICE}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            超过 {CLONES_PER_CYCLE} 次后将按 {PRICE_PER_VOICE} 元循环计费。
          </p>

          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90"
              onClick={handlePayAndClone}
              disabled={isPaying}
            >
              {isPaying ? (
                '支付处理中…'
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  确认支付 ¥{PRICE_PER_VOICE}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
