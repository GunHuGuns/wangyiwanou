// 玩偶设备类型
export type PlushType = "bear" | "rabbit" | "cat" | "dog" | "custom"

export interface PlushDevice {
  id: string
  name: string
  type: PlushType
  macAddress: string
  firmwareVersion: string
  batteryLevel: number
  isOnline: boolean
  wifiSSID?: string
  avatar?: string
}

// 设备类型 (兼容旧代码)
export interface Device {
  id: string
  name: string
  type: PlushType
  macAddress: string
  firmwareVersion: string
  batteryLevel: number
  isOnline: boolean
  avatar?: string
}

// 角色类型
export interface Character {
  id: string
  name: string
  description: string
  personality: string
  voiceTone: string
  avatar: string
  isCustom: boolean
  systemPrompt?: string
}

// AI模型类型
export interface AIModel {
  id: string
  name: string
  provider: string
  description: string
  capabilities: string[]
  isDefault: boolean
}

// 消息类型
export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  audioUrl?: string
}

// 日记类型
export interface Diary {
  id: string
  date: Date
  title: string
  content: string
  mood: "happy" | "sad" | "excited" | "calm" | "tired"
  summary: string
  keywords: string[]
  createdAt: Date
}

// 日记条目别名（与页面命名保持一致）
export type DiaryEntry = Diary

// 好友关系类型
export type FriendType = "lover" | "friend" | "family"

// 好友类型
export interface Friend {
  id: string
  name: string
  avatar: string
  ownerName: string
  intimacy: number
  lastMeet: string
  isCp: boolean
  // 好友关系类型：情侣 / 朋友 / 亲人
  friendType?: FriendType
  // 碰一碰申请状态：pending 表示等待对方通过
  pending?: boolean
}

// 旅行明信片类型
export interface TravelPostcard {
  id: string
  location: string
  country: string
  image: string
  message: string
  createdAt: Date
  isRead: boolean
}

// NFC景点类型
export interface NFCSpot {
  id: string
  name: string
  location: string
  description: string
  nfcId: string
  featured: boolean
}

// 闹钟类型
export interface Alarm {
  id: string
  time: string
  label: string
  enabled: boolean
  repeat: string[]
  voiceType: "natural" | "gentle" | "energetic"
}

// 记忆类型
export interface Memory {
  id: string
  type: "short" | "long"
  content: string
  createdAt: Date
  importance: number
}

// 旅行活动类型
export interface TravelActivity {
  id: string
  type: "food" | "attraction" | "entertainment" | "accommodation"
  name: string
  description: string
  location: string
}

// 旅行计划类型
export interface TravelPlan {
  id: string
  destination: string
  days: number
  activities: TravelActivity[]
}
