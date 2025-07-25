"use client"

import { useState } from "react"

export function useLoading() {
  const [loading, setLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [analysis, setAnalysis] = useState<string | null>(null)

  const startLoading = () => {
    setShowAlert(false)
    setLoading(true)
    setAnalysis(null)
  }

  const stopLoading = (result?: string) => {
    setLoading(false)
    if (result) {
      setAnalysis(result)
      setShowAlert(true)
    }
  }

  const resetState = () => {
    setLoading(false)
    setShowAlert(false)
    setAnalysis(null)
  }

  return {
    loading,
    showAlert,
    analysis,
    startLoading,
    stopLoading,
    resetState,
    setLoading,
  }
}
