"use client"

import { useState, useEffect, useCallback } from "react"
import { mockFriends } from "@/lib/mock-data"
import type { Friend, FriendType } from "@/lib/types"

const KEY = "plush_friends"
const EVENT = "friends-change"

function read(): Friend[] {
  if (typeof window === "undefined") return mockFriends
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return mockFriends
    return JSON.parse(raw) as Friend[]
  } catch {
    return mockFriends
  }
}

function write(friends: Friend[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY, JSON.stringify(friends))
  window.dispatchEvent(new Event(EVENT))
}

export const friendTypeLabels: Record<FriendType, string> = {
  lover: "情侣",
  friend: "朋友",
  family: "亲人",
}

export function useFriends() {
  const [friends, setFriends] = useState<Friend[]>(mockFriends)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // 首次确保写入初始数据
    if (!localStorage.getItem(KEY)) write(mockFriends)
    setFriends(read())
    setLoaded(true)
    const handler = () => setFriends(read())
    window.addEventListener(EVENT, handler)
    window.addEventListener("storage", handler)
    return () => {
      window.removeEventListener(EVENT, handler)
      window.removeEventListener("storage", handler)
    }
  }, [])

  const addFriend = useCallback((friend: Friend) => {
    write([...read(), friend])
  }, [])

  const updateFriend = useCallback((id: string, patch: Partial<Friend>) => {
    write(read().map((f) => (f.id === id ? { ...f, ...patch } : f)))
  }, [])

  const removeFriend = useCallback((id: string) => {
    write(read().filter((f) => f.id !== id))
  }, [])

  return { friends, loaded, addFriend, updateFriend, removeFriend }
}

export function getFriend(id: string | null): Friend | undefined {
  if (!id) return undefined
  return read().find((f) => f.id === id)
}
