"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle2, ChevronRight, Activity, Gauge } from "lucide-react"
import clsx from "clsx"
import { motion } from "framer-motion"

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto mt-10"
    >
      <Card className="relative w-full max-w-2xl mx-auto mt-10 rounded-2xl border border-white/10 bg-gradient-to-b from-[#0a0a0a] to-[#111827] shadow-[0_0_0_1px_rgba(255,255,255,0.05)] overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Gradient top border */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#4ade80] via-[#facc15] to-[#f87171]" />

        <CardContent className="relative z-10 p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">Prediction Result</h2>
            <Badge
              className={clsx(
                "text-xs px-3 py-1 rounded-full font-semibold border",
                riskLevel === "low" && "bg-emerald-900/30 text-emerald-400 border-emerald-600",
                riskLevel === "medium" && "bg-yellow-900/30 text-yellow-300 border-yellow-500",
                riskLevel === "high" && "bg-red-900/30 text-red-400 border-red-500",
              )}
            >
              {riskLevel.toUpperCase()} RISK
            </Badge>
          </div>

          {/* Risk Score */}
          <div className="bg-black/30 rounded-xl p-5 border border-white/10 backdrop-blur-md shadow-inner space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Gauge className="h-4 w-4" />
                <span>Risk Score</span>
              </div>
              <span className="text-3xl font-bold text-white tabular-nums">{risk.toFixed(2)}%</span>
            </div>
            <Progress
              value={risk}
              className={clsx(
                "h-2 rounded-full bg-zinc-800 overflow-hidden",
                risk < 30
                  ? "[&_.progress-bar]:bg-gradient-to-r [&_.progress-bar]:from-emerald-500 [&_.progress-bar]:to-emerald-400"
                  : risk < 70
                    ? "[&_.progress-bar]:bg-gradient-to-r [&_.progress-bar]:from-yellow-400 [&_.progress-bar]:to-yellow-300"
                    : "[&_.progress-bar]:bg-gradient-to-r [&_.progress-bar]:from-red-500 [&_.progress-bar]:to-red-400",
              )}
            />
          </div>

          {/* Decision Box */}
          <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Activity className="h-4 w-4 text-blue-400" />
                <span>Decision</span>
              </div>
              <div className="flex items-center gap-2 text-white font-medium">
                {decisionIcon}
                <span>{decision}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="flex justify-end">
            <div className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1 cursor-pointer">
              <span>Based on patient data analysis</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
