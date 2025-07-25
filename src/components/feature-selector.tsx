"use client"
import { CardSpotlight } from "@/components/ui/card-spotlight"
import { cn } from "@/lib/utils"

const features = [
  {
    title: "AI Symptom Checker",
    description: "Virtual assistant for symptom analysis and doctor recommendations.",
    id: "symptom-checker",
  },
  {
    title: "Predictive Patient Risk Models",
    description: "Forecast hospital readmissions and calculate patient risk.",
    id: "risk-model",
  },
  {
    title: "Automated Clinical Documentation",
    description: "Use voice and NLP to generate clinical notes.",
    id: "documentation",
  },
]

interface FeatureSelectorProps {
  selectedFeature: string | null
  onFeatureSelect: (featureId: string) => void
}

export function FeatureSelector({ selectedFeature, onFeatureSelect }: FeatureSelectorProps) {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <p className="text-center text-gray-400 my-10">
        Choose a feature to get started with AI-powered healthcare solutions.
      </p>

      <div className="flex justify-center gap-6 flex-wrap mt-10">
        {features.map((feature) => (
          <CardSpotlight
            key={feature.id}
            className={cn(
              "w-60 h-72 cursor-pointer p-6 flex flex-col justify-between border rounded-md transition",
              selectedFeature === feature.id ? "border-blue-500" : "border-gray-700",
            )}
            onClick={() => onFeatureSelect(feature.id)}
          >
            <h3 className="text-lg font-semibold">{feature.title}</h3>
            <p className="text-sm text-gray-400">{feature.description}</p>
          </CardSpotlight>
        ))}
      </div>
    </div>
  )
}
