"use client"

import { useState, useEffect, useCallback } from "react"

// 语音克隆状态：未克隆 / 克隆中 / 已就绪
export type VoiceCloneStatus = "none" | "cloning" | "ready"

export interface VoiceCloneState {
  status: VoiceCloneStatus
  // 克隆音色名称
  name: string
  // 方言 / 语种
  dialect: string
  // 录音时长（秒）
  durationSec: number
  // 是否已应用到玩偶发音
  applied: boolean
  // 已完成克隆的次数
  cloneCount: number
  // 已付费的计费周期数（每个周期 15 元，含 5 次克隆额度）
  paidCycles: number
  // 创建时间
  createdAt: string | null
}

const KEY = "voiceClone"
const EVENT = "voice-clone-change"

const DEFAULT_STATE: VoiceCloneState = {
  status: "none",
  name: "",
  dialect: "普通话",
  durationSec: 0,
  applied: false,
  cloneCount: 0,
  paidCycles: 0,
  createdAt: null,
}

// 录音时长限制（秒）
export const MIN_RECORD_SECONDS = 10
export const MAX_RECORD_SECONDS = 300

// 计费规则
export const PRICE_PER_VOICE = 15 // 元 / 音色
export const CLONES_PER_CYCLE = 5 // 每个音色（计费周期）可克隆次数上限

// 支持的方言 / 语种
export const SUPPORTED_DIALECTS = [
  "普通话",
  "东北话",
  "天津话",
  "河南话",
  "陕西话",
  "四川话",
  "重庆话",
  "山东话",
  "河北话",
  "粤语",
] as const

// 剩余可用克隆次数（基于已购买周期与已用次数计算）
export function getRemainingClones(state: VoiceCloneState): number {
  return Math.max(0, state.paidCycles * CLONES_PER_CYCLE - state.cloneCount)
}

export function readVoiceClone(): VoiceCloneState {
  if (typeof window === "undefined") return DEFAULT_STATE
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULT_STATE
    return { ...DEFAULT_STATE, ...(JSON.parse(raw) as VoiceCloneState) }
  } catch {
    return DEFAULT_STATE
  }
}

export function writeVoiceClone(state: VoiceCloneState | null) {
  if (typeof window === "undefined") return
  if (state) {
    localStorage.setItem(KEY, JSON.stringify(state))
  } else {
    localStorage.removeItem(KEY)
  }
  window.dispatchEvent(new Event(EVENT))
}

export function useVoiceClone() {
  const [voice, setVoice] = useState<VoiceCloneState>(DEFAULT_STATE)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setVoice(readVoiceClone())
    setLoaded(true)
    const handler = () => setVoice(readVoiceClone())
    window.addEventListener(EVENT, handler)
    window.addEventListener("storage", handler)
    return () => {
      window.removeEventListener(EVENT, handler)
      window.removeEventListener("storage", handler)
    }
  }, [])

  const update = useCallback((patch: Partial<VoiceCloneState>) => {
    const current = readVoiceClone()
    writeVoiceClone({ ...current, ...patch })
  }, [])

  const reset = useCallback(() => {
    writeVoiceClone(null)
  }, [])

  return { voice, loaded, update, reset }
}
