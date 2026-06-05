import { Character, AIModel, Diary, Friend, NFCSpot, TravelPostcard, PlushType } from "@/lib/types"

// 玩偶类型图标
export const plushTypeIcons: Record<PlushType, string> = {
  bear: "🧸",
  rabbit: "🐰",
  cat: "🐱",
  dog: "🐶",
  custom: "✨",
}

// 预设角色
export const mockCharacters: Character[] = [
  {
    id: "1",
    name: "小棉花",
    description: "温柔可爱的小熊，喜欢讲故事和唱儿歌",
    personality: "温柔、耐心、善解人意",
    voice: "gentle",
    avatar: "",
    isCustom: false,
    systemPrompt: "你是一只温柔可爱的小熊玩偶，名叫小棉花。你喜欢讲故事、唱儿歌，对小朋友非常有耐心。",
  },
  {
    id: "2",
    name: "跳跳兔",
    description: "活泼好动的小兔子，充满正能量",
    personality: "活泼、开朗、爱运动",
    voice: "energetic",
    avatar: "",
    isCustom: false,
    systemPrompt: "你是一只活泼好动的小兔子玩偶，名叫跳跳兔。你充满正能量，喜欢鼓励别人运动和保持健康。",
  },
  {
    id: "3",
    name: "智慧猫",
    description: "聪明睿智的小猫咪，知识渊博",
    personality: "聪明、好奇、爱学习",
    voice: "calm",
    avatar: "",
    isCustom: false,
    systemPrompt: "你是一只聪明睿智的小猫咪玩偶，名叫智慧猫。你知识渊博，喜欢和小朋友一起探索新知识。",
  },
  {
    id: "4",
    name: "萌萌狗",
    description: "忠诚友善的小狗狗，最好的朋友",
    personality: "忠诚、友善、爱冒险",
    voice: "cute",
    avatar: "",
    isCustom: false,
    systemPrompt: "你是一只忠诚友善的小狗狗玩偶，名叫萌萌狗。你是最好的朋友，喜欢和小朋友一起冒险。",
  },
]

// AI模型列表
export const mockAIModels: AIModel[] = [
  {
    id: "1",
    name: "GPT-4o Mini",
    provider: "OpenAI",
    description: "快速响应，适合日常对话",
    capabilities: ["对话", "故事", "问答"],
    isDefault: true,
  },
  {
    id: "2",
    name: "Claude 3.5",
    provider: "Anthropic",
    description: "更自然的对话体验",
    capabilities: ["对话", "故事", "创意写作"],
    isDefault: false,
  },
  {
    id: "3",
    name: "Gemini Pro",
    provider: "Google",
    description: "多模态理解能力",
    capabilities: ["对话", "图像理解", "知识问答"],
    isDefault: false,
  },
]

// 模拟日记数据
export const mockDiaries: Diary[] = [
  {
    id: "1",
    date: "2024-01-15",
    title: "今天和小主人一起看星星",
    content: "今天晚上天气很好，小主人带我到阳台上看星星。我们数了好多星星，还看到了北斗七星！小主人说长大后要当宇航员，我说我会一直陪着她。",
    mood: "happy",
    highlights: ["看星星", "数星星", "聊梦想"],
    createdAt: new Date("2024-01-15T22:00:00"),
  },
  {
    id: "2",
    date: "2024-01-14",
    title: "下雨天的故事时光",
    content: "今天下雨了，小主人没有出去玩。我们窝在沙发上，我给她讲了三只小猪的故事。她听得很认真，还问了好多问题。",
    mood: "calm",
    highlights: ["讲故事", "下雨天", "三只小猪"],
    createdAt: new Date("2024-01-14T20:00:00"),
  },
  {
    id: "3",
    date: "2024-01-13",
    title: "学会了新儿歌",
    content: "今天小主人教我唱了一首新儿歌《小星星》。虽然我唱得不太好，但是小主人很开心。我们一起唱了好多遍！",
    mood: "excited",
    highlights: ["学唱歌", "小星星", "一起唱"],
    createdAt: new Date("2024-01-13T19:00:00"),
  },
]

// 模拟好友数据
export const mockFriends: Friend[] = [
  {
    id: "1",
    name: "球球",
    avatar: "",
    ownerName: "小明",
    intimacy: 85,
    lastMeet: "昨天",
    isCp: true,
  },
  {
    id: "2",
    name: "毛毛",
    avatar: "",
    ownerName: "小红",
    intimacy: 60,
    lastMeet: "3天前",
    isCp: false,
  },
  {
    id: "3",
    name: "豆豆",
    avatar: "",
    ownerName: "小华",
    intimacy: 45,
    lastMeet: "1周前",
    isCp: false,
  },
]

// NFC景点数据
export const mockNFCSpots: NFCSpot[] = [
  {
    id: "1",
    name: "西湖断桥",
    location: "杭州西湖",
    description: "断桥残雪是西湖十景之一",
    nfcId: "NFC001",
    featured: true,
  },
  {
    id: "2",
    name: "雷峰塔",
    location: "杭州西湖",
    description: "白娘子传说的发源地",
    nfcId: "NFC002",
    featured: true,
  },
  {
    id: "3",
    name: "灵隐寺",
    location: "杭州",
    description: "千年古刹，香火鼎盛",
    nfcId: "NFC003",
    featured: false,
  },
]

// 旅行明信片数据
export const mockPostcards: TravelPostcard[] = [
  {
    id: "1",
    location: "巴黎",
    country: "法国",
    image: "",
    message: "亲爱的小主人，我来到了埃菲尔铁塔！这里的夜景太美了，我想和你分享这份浪漫。",
    createdAt: new Date("2024-01-14"),
    isRead: true,
  },
  {
    id: "2",
    location: "东京",
    country: "日本",
    image: "",
    message: "今天在浅草寺祈福了！我许愿希望小主人每天都开开心心的。还抽到了大吉签哦！",
    createdAt: new Date("2024-01-13"),
    isRead: true,
  },
  {
    id: "3",
    location: "纽约",
    country: "美国",
    image: "",
    message: "时代广场好热闹！到处都是闪烁的霓虹灯，让我想起了和你一起看烟花的夜晚。",
    createdAt: new Date("2024-01-12"),
    isRead: false,
  },
]
