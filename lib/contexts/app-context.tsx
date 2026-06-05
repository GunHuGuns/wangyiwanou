"use client"

import { createContext, useContext, useReducer, ReactNode } from "react"
import { Device, Character, AIModel, Message, Diary, Friend, TravelPostcard, Alarm } from "@/lib/types"

interface AppState {
  // 设备状态
  connectedDevice: Device | null
  isConnecting: boolean
  connectionStep: "idle" | "bluetooth" | "wifi" | "connected"
  
  // 角色和AI设置
  currentCharacter: Character | null
  currentAIModel: AIModel | null
  
  // 聊天
  messages: Message[]
  
  // 日记
  diaries: Diary[]
  
  // 好友
  friends: Friend[]
  
  // 旅行
  postcards: TravelPostcard[]
  
  // 闹钟
  alarms: Alarm[]
  
  // 设备设置
  volume: number
}

type AppAction =
  | { type: "SET_DEVICE"; payload: Device | null }
  | { type: "SET_CONNECTING"; payload: boolean }
  | { type: "SET_CONNECTION_STEP"; payload: AppState["connectionStep"] }
  | { type: "SET_CHARACTER"; payload: Character }
  | { type: "SET_AI_MODEL"; payload: AIModel }
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "CLEAR_MESSAGES" }
  | { type: "SET_VOLUME"; payload: number }
  | { type: "ADD_FRIEND"; payload: Friend }
  | { type: "UPDATE_FRIEND"; payload: Friend }
  | { type: "ADD_POSTCARD"; payload: TravelPostcard }
  | { type: "ADD_DIARY"; payload: Diary }
  | { type: "ADD_ALARM"; payload: Alarm }
  | { type: "UPDATE_ALARM"; payload: Alarm }
  | { type: "DELETE_ALARM"; payload: string }

const initialState: AppState = {
  connectedDevice: null,
  isConnecting: false,
  connectionStep: "idle",
  currentCharacter: null,
  currentAIModel: null,
  messages: [],
  diaries: [],
  friends: [],
  postcards: [],
  alarms: [],
  volume: 70,
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_DEVICE":
      return { ...state, connectedDevice: action.payload }
    case "SET_CONNECTING":
      return { ...state, isConnecting: action.payload }
    case "SET_CONNECTION_STEP":
      return { ...state, connectionStep: action.payload }
    case "SET_CHARACTER":
      return { ...state, currentCharacter: action.payload }
    case "SET_AI_MODEL":
      return { ...state, currentAIModel: action.payload }
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] }
    case "CLEAR_MESSAGES":
      return { ...state, messages: [] }
    case "SET_VOLUME":
      return { ...state, volume: action.payload }
    case "ADD_FRIEND":
      return { ...state, friends: [...state.friends, action.payload] }
    case "UPDATE_FRIEND":
      return {
        ...state,
        friends: state.friends.map((f) =>
          f.id === action.payload.id ? action.payload : f
        ),
      }
    case "ADD_POSTCARD":
      return { ...state, postcards: [...state.postcards, action.payload] }
    case "ADD_DIARY":
      return { ...state, diaries: [...state.diaries, action.payload] }
    case "ADD_ALARM":
      return { ...state, alarms: [...state.alarms, action.payload] }
    case "UPDATE_ALARM":
      return {
        ...state,
        alarms: state.alarms.map((a) =>
          a.id === action.payload.id ? action.payload : a
        ),
      }
    case "DELETE_ALARM":
      return {
        ...state,
        alarms: state.alarms.filter((a) => a.id !== action.payload),
      }
    default:
      return state
  }
}

interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<AppAction>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
