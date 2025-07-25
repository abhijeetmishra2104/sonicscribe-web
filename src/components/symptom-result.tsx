import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Stethoscope, Activity } from "lucide-react"

interface MedicalAnalysisCardProps {
  analysis: string // Now a JSON string
}

export function MedicalAnalysisCard({ analysis }: MedicalAnalysisCardProps) {
  let parsedData: {
    advice?: string
    probable_conditions?: string[]
    specialist_to_consult?: string
    triage_level?: string
  } = {}

  try {
    parsedData = JSON.parse(analysis)
  } catch (err) {
    console.error("Failed to parse analysis:", err)
  }

  const getTriageColor = (level: string) => {
    const l = level.toLowerCase()
    if (l.includes("emergency")) return "bg-red-500/20 text-red-400 border-red-500/30"
    if (l.includes("urgent")) return "bg-orange-500/20 text-orange-400 border-orange-500/30"
    return "bg-green-500/20 text-green-400 border-green-500/30"
  }

  return (
    <div className="mt-10 w-full max-w-4xl space-y-6 pb-20 bg-black">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
          <img src="/symptom-checker.png" alt="Symptom Logo" className="h-12 w-12" />
        </div>
        <div>
          <h2 className="text-2xl font-heading font-bold text-white">AI Symptom Analysis</h2>
          <p className="text-gray-400 text-sm">
            This is not a diagnosis. Please consult a licensed medical professional.
          </p>
        </div>
      </div>

      {parsedData.probable_conditions && parsedData.probable_conditions.length > 0 && (
        <Card className="bg-gray-900/50 border border-gray-700/50 backdrop-blur-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                <img src="/virus.png" alt="Virus Icon" className="h-12 w-12" />
              </div>
              <h3 className="text-2xl font-heading font-semibold text-white">Probable Conditions</h3>
            </div>
            <ul className="text-gray-300 font-body text-lg leading-relaxed list-disc pl-5">
              {parsedData.probable_conditions.map((condition, index) => (
                <li key={index}>{condition}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {parsedData.triage_level && (
          <Card className="bg-gray-900/50 border border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6 space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/20 border border-orange-500/30">
                  <img src="/alert.png" alt="Alert Icon" className="h-12 w-12" />
                </div>
                <h3 className="text-2xl font-semibold text-white">Triage Level</h3>
              </div>
              <p
                className={cn(
                  getTriageColor(parsedData.triage_level),
                  "rounded-md px-3 py-2 text-lg font-medium break-words whitespace-pre-wrap",
                )}
              >
                {parsedData.triage_level}
              </p>
            </CardContent>
          </Card>
        )}

        {parsedData.specialist_to_consult && (
          <Card className="bg-gray-900/50 border border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6 space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/20 border border-green-500/30">
                  <img src={"/doctor.png"} alt="Doctor Icon" className="h-12 w-12" />
                </div>
                <h3 className="text-2xl font-semibold text-white">Recommended Specialist</h3>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed break-words whitespace-pre-wrap">
                {parsedData.specialist_to_consult}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {parsedData.advice && (
        <Card className="bg-amber-500/5 border border-amber-500/20 backdrop-blur-sm">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/30">
                <img src={"/info.png"} alt="Info icon" className="h-12 w-12" />
              </div>
              <h3 className="text-2xl font-semibold text-amber-200">Disclaimer</h3>
            </div>
            <p className="text-amber-100/80 text-lg leading-relaxed whitespace-pre-wrap">{parsedData.advice}</p>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-lg px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2">
          <Stethoscope className="h-4 w-4" />
          Find Nearby Specialists
        </button>
        <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-lg px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2">
          <Activity className="h-4 w-4" />
          Track Symptoms
        </button>
      </div>
    </div>
  )
}
