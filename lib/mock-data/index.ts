import { Character, AIModel, DiaryEntry, Friend, NFCSpot, TravelPostcard, TravelPlan, PlushType } from "@/lib/types"

// 玩偶类型图标
export const plushTypeIcons: Record<PlushType, string> = {
  bear: "🧸",
  rabbit: "🐰",
  cat: "🐱",
  dog: "🐶",
  custom: "✨",
}

// 心情图标
export const moodIcons: Record<string, string> = {
  happy: "😊",
  sad: "😢",
  excited: "🤩",
  calm: "😌",
  tired: "😴",
}

// 预设角色
export const presetCharacters: Character[] = [
  {
    id: "bear-cotton",
    name: "小棉花",
    description: "温柔可爱的小熊，喜欢讲故事和唱儿歌",
    personality: "温柔、耐心、善解人意",
    voiceTone: "温柔甜美",
    avatar: "",
    isCustom: false,
    systemPrompt: "你是一只温柔可爱的小熊玩偶，名叫小棉花。你喜欢讲故事、唱儿歌，对小朋友非常有耐心。",
  },
  {
    id: "bunny-jump",
    name: "跳跳兔",
    description: "活泼好动的小兔子，充满正能量",
    personality: "活泼、开朗、爱运动",
    voiceTone: "活力满满",
    avatar: "",
    isCustom: false,
    systemPrompt: "你是一只活泼好动的小兔子玩偶，名叫跳跳兔。你充满正能量，喜欢鼓励别人运动和保持健康。",
  },
  {
    id: "cat-wisdom",
    name: "智慧猫",
    description: "聪明睿智的小猫咪，知识渊博",
    personality: "聪明、好奇、爱学习",
    voiceTone: "沉稳温和",
    avatar: "",
    isCustom: false,
    systemPrompt: "你是一只聪明睿智的小猫咪玩偶，名叫智慧猫。你知识渊博，喜欢和小朋友一起探索新知识。",
  },
  {
    id: "dog-meng",
    name: "萌萌狗",
    description: "忠诚友善的小狗狗，最好的朋友",
    personality: "忠诚、友善、爱冒险",
    voiceTone: "热情可爱",
    avatar: "",
    isCustom: false,
    systemPrompt: "你是一只忠诚友善的小狗狗玩偶，名叫萌萌狗。你是最好的朋友，喜欢和小朋友一起冒险。",
  },
]

// AI模型列表
export const aiModels: AIModel[] = [
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

// 心情日记数据
export const mockDiaryEntries: DiaryEntry[] = [
  {
    id: "1",
    date: new Date("2024-01-15"),
    title: "今天和小主人一起看星星",
    content:
      "今天晚上天气很好，小主人带我到阳台上看星星。我们数了好多星星，还看到了北斗七星！小主人说长大后要当宇航员，我说我会一直陪着她。\n\n看着满天的星星，我觉得好幸福。和小主人在一起的每一天都是美好的回忆。",
    mood: "happy",
    summary: "和小主人一起在阳台看星星，聊起了长大后的梦想，度过了温馨的一晚。",
    keywords: ["看星星", "数星星", "聊梦想"],
    createdAt: new Date("2024-01-15T22:00:00"),
  },
  {
    id: "2",
    date: new Date("2024-01-14"),
    title: "下雨天的故事时光",
    content:
      "今天下雨了，小主人没有出去玩。我们窝在沙发上，我给她讲了三只小猪的故事。她听得很认真，还问了好多问题。\n\n下雨天其实也很温馨呢，可以安安静静地待在一起。",
    mood: "calm",
    summary: "下雨天窝在沙发上给小主人讲三只小猪的故事，享受安静的亲子时光。",
    keywords: ["讲故事", "下雨天", "三只小猪"],
    createdAt: new Date("2024-01-14T20:00:00"),
  },
  {
    id: "3",
    date: new Date("2024-01-13"),
    title: "学会了新儿歌",
    content:
      "今天小主人教我唱了一首新儿歌《小星星》。虽然我唱得不太好，但是小主人很开心。我们一起唱了好多遍！\n\n一闪一闪亮晶晶，满天都是小星星~",
    mood: "excited",
    summary: "小主人教唱新儿歌《小星星》，一起开心地唱了好多遍。",
    keywords: ["学唱歌", "小星星", "一起唱"],
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

// 旅行活动类型图标
export const activityTypeIcons: Record<string, string> = {
  food: "🍜",
  attraction: "📸",
  entertainment: "🎵",
  accommodation: "🏨",
}

// 旅行计划数据
export const mockTravelPlans: TravelPlan[] = [
  {
    id: "1",
    destination: "杭州",
    days: 3,
    activities: [
      {
        id: "a1",
        type: "attraction",
        name: "西湖游船",
        description: "乘船游览西湖，欣赏断桥残雪和三潭印月",
        location: "杭州西湖",
      },
      {
        id: "a2",
        type: "food",
        name: "品尝西湖醋鱼",
        description: "在楼外楼品尝正宗的杭帮菜",
        location: "楼外楼餐厅",
      },
      {
        id: "a3",
        type: "attraction",
        name: "灵隐寺祈福",
        description: "千年古刹，感受佛教文化的宁静",
        location: "灵隐寺",
      },
    ],
  },
  {
    id: "2",
    destination: "成都",
    days: 4,
    activities: [
      {
        id: "b1",
        type: "attraction",
        name: "大熊猫基地",
        description: "近距离观察可爱的大熊猫",
        location: "成都大熊猫繁育研究基地",
      },
      {
        id: "b2",
        type: "food",
        name: "品尝火锅",
        description: "体验地道的成都麻辣火锅",
        location: "宽窄巷子",
      },
    ],
  },
]
