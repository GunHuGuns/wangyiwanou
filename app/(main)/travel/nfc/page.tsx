"use client"

import { useState } from "react"
import { PageHeader } from "@/components/common/page-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Nfc, Camera, Check, Star } from "lucide-react"
import { mockNFCSpots } from "@/lib/mock-data"

export default function NFCPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [checkedIn, setCheckedIn] = useState<string[]>(["1"])

  const handleScan = () => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      // 模拟扫描到一个景点
      const unchecked = mockNFCSpots.find(s => !checkedIn.includes(s.id))
      if (unchecked) {
        setCheckedIn([...checkedIn, unchecked.id])
      }
    }, 2000)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <PageHeader title="NFC旅行打卡" showBack />
      
      <div className="flex-1 p-4 space-y-6">
        {/* 扫描区域 */}
        <Card className="p-6 text-center bg-card border-primary/20">
          <div className={`w-32 h-32 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4 ${isScanning ? 'animate-pulse' : ''}`}>
            <Nfc className={`w-16 h-16 text-primary ${isScanning ? 'animate-bounce' : ''}`} />
          </div>
          <h3 className="font-semibold text-foreground mb-2">
            {isScanning ? "正在扫描..." : "靠近NFC标签"}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            将玩偶靠近景区NFC标签，即可完成打卡
          </p>
          <Button 
            onClick={handleScan} 
            disabled={isScanning}
            className="bg-primary hover:bg-primary/90"
          >
            {isScanning ? "扫描中..." : "模拟NFC扫描"}
          </Button>
        </Card>

        {/* 打卡统计 */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center bg-card">
            <div className="text-2xl font-bold text-primary">{checkedIn.length}</div>
            <div className="text-xs text-muted-foreground">已打卡</div>
          </Card>
          <Card className="p-3 text-center bg-card">
            <div className="text-2xl font-bold text-secondary">{mockNFCSpots.length}</div>
            <div className="text-xs text-muted-foreground">总景点</div>
          </Card>
          <Card className="p-3 text-center bg-card">
            <div className="text-2xl font-bold text-accent">3</div>
            <div className="text-xs text-muted-foreground">获得徽章</div>
          </Card>
        </div>

        {/* 景点列表 */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">附近景点</h3>
          <div className="space-y-3">
            {mockNFCSpots.map((spot) => {
              const isChecked = checkedIn.includes(spot.id)
              return (
                <Card key={spot.id} className={`p-4 bg-card ${isChecked ? 'border-primary/30' : ''}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isChecked ? 'bg-primary/20' : 'bg-muted'}`}>
                      {isChecked ? (
                        <Check className="w-6 h-6 text-primary" />
                      ) : (
                        <MapPin className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground">{spot.name}</h4>
                        {spot.featured && (
                          <Star className="w-4 h-4 text-secondary fill-secondary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{spot.location}</p>
                      <p className="text-xs text-muted-foreground mt-1">{spot.description}</p>
                    </div>
                    {isChecked && (
                      <Button size="sm" variant="outline" className="shrink-0">
                        <Camera className="w-4 h-4 mr-1" />
                        查看
                      </Button>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
