import { Card, CardContent } from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { AlertTriangle, Stethoscope, UserCheck, Info, Activity } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface MedicalAnalysisCardProps {
  analysis: string
}

export function MedicalAnalysisCard({ analysis }: MedicalAnalysisCardProps) {
  // Parse the analysis to extract structured information
  const parseAnalysis = (text: string) => {
  const lines = text.split("\n").filter((line) => line.trim());

  let mainAnalysis = "";
  let triageLevel = "";
  let specialist = "";
  let disclaimer = "";

  let currentSection = "main";

  for (const line of lines) {
    if (line.toLowerCase().includes("triage level:")) {
      currentSection = "triage";
      triageLevel = line
        .replace(/triage level:/i, "")
        .replace(/^\*+/, "") // remove leading asterisks
        .trim();
    } else if (line.toLowerCase().includes("specialist to consult:")) {
      currentSection = "specialist";
      specialist = line
        .replace(/specialist to consult:/i, "")
        .replace(/^\*+/, "") // remove leading asterisks
        .trim();
    } else if (
      line.toLowerCase().includes("please remember") ||
      line.toLowerCase().includes("disclaimer")
    ) {
      currentSection = "disclaimer";
      disclaimer += line + " ";
    } else {
      if (currentSection === "main") {
        mainAnalysis += line + "\n";
      } else if (currentSection === "disclaimer") {
        disclaimer += line + " ";
      }
    }
  }

  return {
    mainAnalysis: mainAnalysis.trim(),
    triageLevel: triageLevel.trim(),
    specialist: specialist.trim(),
    disclaimer: disclaimer.trim(),
  };
};

  const parsed = parseAnalysis(analysis)

  const getTriageColor = (level: string) => {
    const lowerLevel = level.toLowerCase()
    if (lowerLevel.includes("urgent") || lowerLevel.includes("emergency")) {
      return "bg-red-500/20 text-red-400 border-red-500/30"
    } else if (lowerLevel.includes("moderate") || lowerLevel.includes("soon")) {
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    } else {
      return "bg-green-500/20 text-green-400 border-green-500/30"
    }
  }

  return (
    <div className="mt-10 w-full max-w-4xl space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
          <Activity className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">AI Symptom Analysis</h2>
          <p className="text-gray-400 text-sm">Preliminary assessment based on your symptoms</p>
        </div>
      </div>

      {/* Main Analysis */}
      <Card className="bg-gray-900/50 border border-gray-700/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30 mt-1">
              <Stethoscope className="h-5 w-5 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-3">Symptom Analysis</h3>
              <div className="prose prose-invert prose-sm max-w-none">
                <div className="text-gray-300 leading-relaxed">
                  <ReactMarkdown>{parsed.mainAnalysis}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Triage and Specialist Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Triage Level */}
        {parsed.triageLevel && (
          <Card className="bg-gray-900/50 border border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-orange-500/20 border border-orange-500/30">
                  <AlertTriangle className="h-5 w-5 text-orange-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-3">Triage Level</h3>
                  <Badge className={`${getTriageColor(parsed.triageLevel)} font-medium px-3 py-1 whitespace-normal break-words`}>
                    {parsed.triageLevel}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Specialist Recommendation */}
        {parsed.specialist && (
          <Card className="bg-gray-900/50 border border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-500/20 border border-green-500/30">
                  <UserCheck className="h-5 w-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-3">Recommended Specialist</h3>
                  <p className="text-gray-300 font-medium">{parsed.specialist}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Disclaimer */}
      {parsed.disclaimer && (
        <Card className="bg-amber-500/5 border border-amber-500/20 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/30">
                <Info className="h-5 w-5 text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-amber-200 mb-2">Important Disclaimer</h3>
                <p className="text-amber-100/80 text-sm leading-relaxed">{parsed.disclaimer}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2">
          <Stethoscope className="h-4 w-4" />
          Find Nearby Specialists
        </button>
        <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2">
          <Activity className="h-4 w-4" />
          Track Symptoms
        </button>
      </div>
    </div>
  )
}
