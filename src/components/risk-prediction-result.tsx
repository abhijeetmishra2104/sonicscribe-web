import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle2, ChevronRight, Activity, Gauge } from "lucide-react"

interface PredictionResultProps {
  risk: number | null
  decision: string | null
}

export function PredictionResultCard({ risk, decision }: PredictionResultProps) {
  if (risk === null || decision === null) return null

  // Determine risk level for styling
  const getRiskLevel = (score: number) => {
    if (score < 30) return "low"
    if (score < 70) return "medium"
    return "high"
  }

  const riskLevel = getRiskLevel(risk)

  const riskColors = {
    low: "from-emerald-500/20 to-emerald-500/10 text-emerald-400",
    medium: "from-amber-500/20 to-amber-500/10 text-amber-400",
    high: "from-red-500/20 to-red-500/10 text-red-400",
  }

  const decisionIcon = decision.toLowerCase().includes("no") ? (
    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
  ) : (
    <AlertCircle className="h-5 w-5 text-red-400" />
  )

  return (
    <Card className="mt-10 w-full max-w-2xl border-0 bg-gradient-to-br from-gray-900 to-black shadow-xl shadow-blue-900/10 overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r" />

      <CardContent className="p-8 relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Prediction Result
          </h2>
          <Badge variant="outline" className={cn("px-3 py-1 border-0 bg-gradient-to-r", riskColors[riskLevel])}>
            {riskLevel.toUpperCase()} RISK
          </Badge>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400">
                <Gauge className="h-4 w-4" />
                <span>Risk Score</span>
              </div>
              <span className="text-2xl font-bold text-white">{risk.toFixed(2)}%</span>
            </div>

            <div className="relative pt-1">
              <Progress
                value={risk}
                className={cn(
                  "h-2 bg-gray-800",
                  risk < 30
                    ? "bg-emerald-900/30 [&_.progress-bar]:from-emerald-500 [&_.progress-bar]:to-emerald-400"
                    : risk < 70
                      ? "bg-amber-900/30 [&_.progress-bar]:from-amber-500 [&_.progress-bar]:to-amber-400"
                      : "bg-red-900/30 [&_.progress-bar]:from-red-500 [&_.progress-bar]:to-red-400",
                  "bg-gradient-to-r"
                )}
              />
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">Decision</span>
              </div>
              <div className="flex items-center gap-2">
                {decisionIcon}
                <span className="font-medium text-white">{decision}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <span>Based on patient data analysis</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
