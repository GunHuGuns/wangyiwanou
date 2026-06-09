"use client"

import { useState, useEffect, useCallback } from "react"

// 语音克隆状态：未克隆 / 克隆中 / 已就绪
export type VoiceCloneStatus = "none" | "cloning" | "ready"

export interface VoiceCloneState {
  status: VoiceCloneStatus
  // 克隆音色名称
  name: string
  // 录音时长（秒）
  durationSec: number
  // 是否已应用到玩偶发音
  applied: boolean
  // 创建时间
  createdAt: string | null
}

const KEY = "voiceClone"
const EVENT = "voice-clone-change"

const DEFAULT_STATE: VoiceCloneState = {
  status: "none",
  name: "",
  durationSec: 0,
  applied: false,
  createdAt: null,
}

// 录音时长限制（秒）
export const MIN_RECORD_SECONDS = 10
export const MAX_RECORD_SECONDS = 300

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
