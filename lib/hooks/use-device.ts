"use client"

import { useState, useEffect, useCallback } from "react"
import type { PlushDevice } from "@/lib/types"

// 设备连接状态：正常 / 断开连接 / 蓝牙关闭 / 低电量
export type DeviceConnState = "connected" | "disconnected" | "bluetooth-off" | "low-battery"

export interface DeviceState extends PlushDevice {
  volume?: number
  status?: DeviceConnState
}

const KEY = "connectedDevice"
const EVENT = "device-change"

export function readDevice(): DeviceState | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as DeviceState
    if (!parsed.status) parsed.status = "connected"
    return parsed
  } catch {
    return null
  }
}

export function writeDevice(device: DeviceState | null) {
  if (typeof window === "undefined") return
  if (device) {
    localStorage.setItem(KEY, JSON.stringify(device))
  } else {
    localStorage.removeItem(KEY)
  }
  window.dispatchEvent(new Event(EVENT))
}

export function useDevice() {
  const [device, setDevice] = useState<DeviceState | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setDevice(readDevice())
    setLoaded(true)
    const handler = () => setDevice(readDevice())
    window.addEventListener(EVENT, handler)
    window.addEventListener("storage", handler)
    return () => {
      window.removeEventListener(EVENT, handler)
      window.removeEventListener("storage", handler)
    }
  }, [])

  // 局部更新设备字段
  const update = useCallback((patch: Partial<DeviceState>) => {
    const current = readDevice()
    if (!current) return
    writeDevice({ ...current, ...patch })
  }, [])

  const disconnect = useCallback(() => {
    writeDevice(null)
  }, [])

  return { device, loaded, update, setDevice: writeDevice, disconnect }
}

// 设备是否可正常使用功能（在线且蓝牙开启）
export function isDeviceUsable(device: DeviceState | null): boolean {
  if (!device) return false
  return device.status === "connected" || device.status === "low-battery"
}
