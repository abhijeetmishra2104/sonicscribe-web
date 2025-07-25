"use client";

import type React from "react";
import { useState } from "react";
import { FileUpload } from "@/components/ui/FileUpload";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon } from "lucide-react";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import { IconSquareRoundedX } from "@tabler/icons-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MedicalAnalysisCard } from "@/components/symptom-result";
import { useLoading } from "@/lib/use-loading";

const loadingStates = [
  { text: "Processing your input..." },
  { text: "Analyzing symptoms..." },
  { text: "Generating recommendations..." },
  { text: "Finalizing analysis..." },
];

export function SymptomChecker() {
  const {
    loading,
    showAlert,
    analysis,
    startLoading,
    stopLoading,
    setLoading,
  } = useLoading();
  const [symptomText, setSymptomText] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  async function submitSymptomChecker() {
    startLoading();

    try {
      const formData = new FormData();

      if (uploadedFile) {
        formData.append("audio_file", uploadedFile);
      } else if (symptomText.trim()) {
        formData.append("text_input", symptomText.trim());
      } else {
        alert("Please enter symptoms or upload an audio file.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/symptom-upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        stopLoading(data.result || null);
      } else {
        alert(data.error || "Submission failed. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Submission failed", err);
      alert("Submission failed. Please try again.");
      setLoading(false);
    }
  }

  function handleSymptomUpload(files: File[]) {
    if (files.length > 0) {
      setUploadedFile(files[0]);
      setSymptomText("");
    } else {
      setUploadedFile(null);
    }
  }

  function handleSymptomTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setSymptomText(e.target.value);
    if (e.target.value.trim()) {
      setUploadedFile(null);
    }
  }

  return (
    <div className="mt-8 bg-black flex flex-col items-center justify-center text-white p-6 relative">
      <h1 className="text-3xl font-bold mb-10">
        Enter your Symptoms or Upload Audio
      </h1>

      <div className="w-full max-w-2xl space-y-4">
        <Textarea
          className="w-full p-4 rounded bg-gray-900 border border-gray-700 text-white resize-none"
          rows={5}
          placeholder="Describe your symptoms here..."
          value={symptomText}
          onChange={handleSymptomTextChange}
        />

        <FileUpload onChange={handleSymptomUpload} />

        <div className="flex justify-center">
          <Button
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            onClick={submitSymptomChecker}
            disabled={loading}
          >
            Submit
          </Button>
        </div>
      </div>

      {showAlert && (
        <div className="mt-6 w-full max-w-2xl">
          <Alert>
            <CheckCircle2Icon className="h-5 w-5" />
            <AlertTitle>Success! Your input has been sent.</AlertTitle>
            <AlertDescription>
              AI analysis is complete and displayed below.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <MultiStepLoader
        loadingStates={loadingStates}
        loading={loading}
        duration={1500}
        loop={false}
      />

      {loading && (
        <Button
          className="fixed top-4 right-4 text-white z-50"
          onClick={() => setLoading(false)}
        >
          <IconSquareRoundedX className="h-10 w-10" />
        </Button>
      )}

      {analysis && <MedicalAnalysisCard analysis={analysis} />}
    </div>
  );
}
