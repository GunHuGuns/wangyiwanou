"use client"

import { useState, useEffect, useCallback } from "react"

// 预置玩偶眼睛图片
export interface EyePreset {
  id: string
  name: string
  src: string
}

export const EYE_PRESETS: EyePreset[] = [
  { id: "round", name: "圆圆眼", src: "/eyes/round.png" },
  { id: "happy", name: "微笑眼", src: "/eyes/happy.png" },
  { id: "heart", name: "爱心眼", src: "/eyes/heart.png" },
  { id: "star", name: "星星眼", src: "/eyes/star.png" },
  { id: "wink", name: "眨眼", src: "/eyes/wink.png" },
  { id: "sleepy", name: "睡眼", src: "/eyes/sleepy.png" },
]

const KEY = "dollEyes"
const EVENT = "doll-eyes-change"
const DEFAULT_EYE = EYE_PRESETS[0].id

export function getEyePreset(id: string): EyePreset {
  return EYE_PRESETS.find((e) => e.id === id) ?? EYE_PRESETS[0]
}

export function readDollEyes(): string {
  if (typeof window === "undefined") return DEFAULT_EYE
  try {
    return localStorage.getItem(KEY) || DEFAULT_EYE
  } catch {
    return DEFAULT_EYE
  }
}

export function writeDollEyes(id: string | null) {
  if (typeof window === "undefined") return
  if (id) {
    localStorage.setItem(KEY, id)
  } else {
    localStorage.removeItem(KEY)
  }
  window.dispatchEvent(new Event(EVENT))
}

export function useDollEyes() {
  const [eyeId, setEyeId] = useState<string>(DEFAULT_EYE)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setEyeId(readDollEyes())
    setLoaded(true)
    const handler = () => setEyeId(readDollEyes())
    window.addEventListener(EVENT, handler)
    window.addEventListener("storage", handler)
    return () => {
      window.removeEventListener(EVENT, handler)
      window.removeEventListener("storage", handler)
    }
  }, [])

  const setEye = useCallback((id: string) => {
    writeDollEyes(id)
  }, [])

  return { eyeId, eye: getEyePreset(eyeId), loaded, setEye }
}
