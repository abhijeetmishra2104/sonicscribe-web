"use client"

import { useRef, useState, useEffect } from "react"
import { TopBar } from "@/components/Topbar"
import { FeatureSelector } from "@/components/feature-selector"
import { SymptomChecker } from "@/components/features/symptom-checker"
import { RiskPrediction } from "@/components/features/risk-prediction"
import { Documentation } from "@/components/features/documentation"

export default function UploadPage() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)
  const featureRef = useRef<HTMLDivElement | null>(null)

  // Scroll into view when feature is selected
  useEffect(() => {
    if (selectedFeature && featureRef.current) {
      featureRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [selectedFeature])

  const renderFeature = () => {
    switch (selectedFeature) {
      case "symptom-checker":
        return <SymptomChecker />
      case "risk-model":
        return <RiskPrediction />
      case "documentation":
        return <Documentation />
      default:
        return null
    }
  }

  return (
    <>
      <TopBar />
      <main className="min-h-screen bg-black text-white pt-20 px-4 sm:px-6 md:px-10">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-12">
          {/* Feature Selector always visible */}
          <FeatureSelector
            selectedFeature={selectedFeature}
            onFeatureSelect={setSelectedFeature}
          />

          {/* Selected Feature renders below cards */}
          <div ref={featureRef} className="w-full">
            {renderFeature()}
          </div>
        </div>
      </main>
    </>
  )
}
