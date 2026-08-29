"use client"
import { FileUpload } from "@/components/ui/FileUpload"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2Icon } from "lucide-react"
import { MultiStepLoader } from "@/components/ui/multi-step-loader"
import { IconSquareRoundedX } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { StructuredAnalysisDisplay } from "@/components/structured-analysis-display"
import { useLoading } from "@/lib/use-loading"
import { useState } from "react"

const loadingStates = [
  { text: "Reading audio file..." },
  { text: "Uploading to Cloudinary..." },
  { text: "Saving metadata to database..." },
  { text: "Sending to AI model for processing..." },
  { text: "Analyzing symptoms and medical history..." },
  { text: "Generating diagnosis report..." },
  { text: "Finalizing..." },
]

interface DocumentationResponse {
  analysis: {
    structured: {
      age_gender: string
      medical_history: string[]
      name: string
      notes: string
      possible_disease: string[]
      recommendation: {
        next_steps: string
        should_be_admitted: boolean
      }
      risk_prediction: string
      symptoms: string[]
    }
    transcript: string
    triage: {
      advice: string
      probable_conditions: string[]
      specialist_to_consult: string
      triage_level: string
    }
  }
  file: {
    originalName: string
    uploadedAt: string
    url: string | null
  }
  success: boolean
}

export function Documentation() {
  const { loading, showAlert, analysis, error, startLoading, stopLoading, resetState, setLoading, setError } = useLoading()
  // FileUpload keeps the picked file in its own state and in the native input.
  // Bumping this key remounts it on reset so a retry starts from a clean picker
  // instead of showing the previous file's chip.
  const [uploadKey, setUploadKey] = useState(0)

  const handleReset = () => {
    resetState()
    setUploadKey((k) => k + 1)
  }

  async function handleUpload(files: File[]) {
    startLoading()

    const formData = new FormData()
    formData.append("file", files[0])

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      console.log("Upload response:", data)

      if (data.success) {
        // Store the entire response object as a JSON string
        stopLoading(JSON.stringify(data))
      } else {
        setLoading(false)
        setError(data.error || "An unknown error occurred during upload.")
      }
    } catch (err: any) {
      console.error("Upload failed", err)
      setLoading(false)
      setError(err.message || "Failed to reach the server. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6 relative">
      {!analysis && (
        <div className="w-full max-w-2xl">
          <FileUpload key={uploadKey} onChange={handleUpload} />
        </div>
      )}

      {showAlert && (
        <div className="mt-6 w-full max-w-2xl">
          <Alert>
            <CheckCircle2Icon className="h-5 w-5" />
            <AlertTitle>Success! Your file has been uploaded.</AlertTitle>
            <AlertDescription>It is now stored securely and ready for use.</AlertDescription>
          </Alert>
        </div>
      )}

      <MultiStepLoader loadingStates={loadingStates} loading={loading} duration={1500} loop={false} />

      {loading && (
        <Button className="fixed top-4 right-4 text-white z-50" onClick={() => setLoading(false)}>
          <IconSquareRoundedX className="h-10 w-10" />
        </Button>
      )}

      {error && (
        <div className="mt-6 w-full max-w-2xl">
          <Alert variant="destructive" className="border-red-500 bg-red-950 text-red-100">
            <IconSquareRoundedX className="h-5 w-5" />
            <AlertTitle>Error Uploading File</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-4 flex justify-center">
            <Button onClick={handleReset} variant="outline" className="text-white">
              Try Again
            </Button>
          </div>
        </div>
      )}

      {analysis && (
        <div className="w-full max-w-4xl flex flex-col items-center">
          <StructuredAnalysisDisplay data={analysis} />
          <div className="mt-8 flex justify-center w-full pb-10">
            <Button onClick={handleReset} size="lg" className="bg-white text-black hover:bg-neutral-200">
              Upload Another Audio
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
