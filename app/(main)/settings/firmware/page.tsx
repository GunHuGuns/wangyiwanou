"use client"

import { useState } from "react"
import { PageHeader } from "@/components/common/page-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Cpu, Download, CheckCircle2, Sparkles, AlertCircle } from "lucide-react"
import { toast } from "sonner"

const CURRENT_VERSION = "1.2.0"
const LATEST_VERSION = "1.3.0"

const changelog = [
  "优化语音识别准确率，响应更快更灵敏",
  "新增 3 套眼部表情动画，互动更生动",
  "修复长时间待机偶发断连的问题",
  "降低待机功耗，续航提升约 15%",
]

type UpdateStage = "idle" | "downloading" | "installing" | "done"

export default function FirmwarePage() {
  const [stage, setStage] = useState<UpdateStage>("idle")
  const [progress, setProgress] = useState(0)

  const hasUpdate = CURRENT_VERSION !== (LATEST_VERSION as string)

  const startUpdate = () => {
    setStage("downloading")
    setProgress(0)
    const downloadTimer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(downloadTimer)
          setStage("installing")
          setTimeout(() => {
            setStage("done")
            toast.success(`已升级到固件 v${LATEST_VERSION}`)
          }, 2200)
          return 100
        }
        return p + 5
      })
    }, 120)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <PageHeader title="固件升级" showBack />

      <div className="flex-1 p-4 space-y-4">
        {/* Device firmware status */}
        <Card className="p-6">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary to-cute-coral flex items-center justify-center">
              <Cpu className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">小棉花</h2>
              <p className="text-sm text-muted-foreground">当前固件版本 v{CURRENT_VERSION}</p>
            </div>

            {stage === "done" ? (
              <div className="flex items-center gap-2 text-cute-mint font-medium">
                <CheckCircle2 className="w-5 h-5" />
                已是最新版本 v{LATEST_VERSION}
              </div>
            ) : hasUpdate ? (
              <div className="flex items-center gap-2 text-cute-coral font-medium">
                <Sparkles className="w-5 h-5" />
                发现新版本 v{LATEST_VERSION}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-cute-mint font-medium">
                <CheckCircle2 className="w-5 h-5" />
                已是最新版本
              </div>
            )}
          </div>
        </Card>

        {/* Update progress */}
        {(stage === "downloading" || stage === "installing") && (
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                {stage === "downloading" ? "正在下载固件..." : "正在安装，请勿断开连接..."}
              </span>
              <span className="text-muted-foreground">
                {stage === "downloading" ? `${progress}%` : ""}
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-cute-coral transition-all duration-150"
                style={{ width: stage === "installing" ? "100%" : `${progress}%` }}
              />
            </div>
            {stage === "installing" && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                安装过程中玩偶会重启，属于正常现象
              </p>
            )}
          </Card>
        )}

        {/* Changelog */}
        {hasUpdate && stage !== "done" && (
          <Card className="p-5 space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cute-coral" />
              v{LATEST_VERSION} 更新内容
            </h3>
            <ul className="space-y-2">
              {changelog.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-cute-mint shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Action button */}
        {stage === "idle" && hasUpdate && (
          <Button
            onClick={startUpdate}
            className="w-full h-12 bg-gradient-to-r from-primary to-cute-coral text-primary-foreground"
          >
            <Download className="w-5 h-5 mr-2" />
            立即升级到 v{LATEST_VERSION}
          </Button>
        )}

        {stage === "done" && (
          <p className="text-center text-sm text-muted-foreground">
            固件升级完成，快去和小棉花互动吧
          </p>
        )}
      </div>
    </div>
  )
}
