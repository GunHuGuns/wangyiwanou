"use client"

import { useState, useEffect, useCallback } from "react"

// 支持的语言列表
export interface LanguageOption {
  code: string
  name: string
  // 用于匹配 navigator.language 的前缀
  match: string[]
}

export const LANGUAGES: LanguageOption[] = [
  { code: "zh-CN", name: "简体中文", match: ["zh-cn", "zh-hans", "zh"] },
  { code: "zh-TW", name: "繁體中文", match: ["zh-tw", "zh-hant", "zh-hk", "zh-mo"] },
  { code: "en", name: "English", match: ["en"] },
  { code: "fr", name: "Français", match: ["fr"] },
  { code: "es", name: "Español", match: ["es"] },
  { code: "pt", name: "Português", match: ["pt"] },
  { code: "de", name: "Deutsch", match: ["de"] },
  { code: "pl", name: "Polski", match: ["pl"] },
  { code: "it", name: "Italiano", match: ["it"] },
  { code: "ru", name: "Русский", match: ["ru"] },
  { code: "ja", name: "日本語", match: ["ja"] },
  { code: "ko", name: "한국어", match: ["ko"] },
]

const KEY = "appLanguage"
const EVENT = "app-language-change"
// 特殊值：跟随系统语言
export const FOLLOW_SYSTEM = "system"

// 根据浏览器/系统语言推断默认语言代码
export function detectSystemLanguage(): string {
  if (typeof navigator === "undefined") return "zh-CN"
  const candidates = navigator.languages?.length
    ? navigator.languages
    : [navigator.language]
  for (const raw of candidates) {
    const lower = raw.toLowerCase()
    const found = LANGUAGES.find((l) =>
      l.match.some((m) => lower === m || lower.startsWith(m + "-")),
    )
    if (found) return found.code
  }
  return "zh-CN"
}

export function getLanguageOption(code: string): LanguageOption {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0]
}

// 读取已保存的选择（可能是 "system" 或具体语言代码）
export function readLanguagePref(): string {
  if (typeof window === "undefined") return FOLLOW_SYSTEM
  try {
    return localStorage.getItem(KEY) || FOLLOW_SYSTEM
  } catch {
    return FOLLOW_SYSTEM
  }
}

export function writeLanguagePref(pref: string | null) {
  if (typeof window === "undefined") return
  if (pref) {
    localStorage.setItem(KEY, pref)
  } else {
    localStorage.removeItem(KEY)
  }
  window.dispatchEvent(new Event(EVENT))
}

export function useLanguage() {
  // pref 为用户选择（"system" 或语言代码）
  const [pref, setPref] = useState<string>(FOLLOW_SYSTEM)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setPref(readLanguagePref())
    setLoaded(true)
    const handler = () => setPref(readLanguagePref())
    window.addEventListener(EVENT, handler)
    window.addEventListener("storage", handler)
    return () => {
      window.removeEventListener(EVENT, handler)
      window.removeEventListener("storage", handler)
    }
  }, [])

  const setLanguage = useCallback((pref: string) => {
    writeLanguagePref(pref)
  }, [])

  // 实际生效的语言代码
  const resolvedCode = pref === FOLLOW_SYSTEM ? detectSystemLanguage() : pref

  return {
    pref,
    loaded,
    setLanguage,
    isFollowingSystem: pref === FOLLOW_SYSTEM,
    language: getLanguageOption(resolvedCode),
    resolvedCode,
  }
}
