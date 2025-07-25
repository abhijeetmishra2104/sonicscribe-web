"use client";

import type React from "react";
import { useState } from "react";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import { IconSquareRoundedX } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PredictionResultCard } from "@/components/risk-prediction-result";
import { useLoading } from "@/lib/use-loading";

const loadingStates = [
  { text: "Validating Inputs" },
  { text: "Predicting..." },
  { text: "Finalizing Result" },
];

export function RiskPrediction() {
  const { loading, setLoading } = useLoading();
  const [gender, setGender] = useState("");
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState("");
  const [dischargeTo, setDischargeTo] = useState("");
  const [risk, setRisk] = useState<number | null>(null);
  const [decision, setDecision] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setRisk(null);
    setDecision(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const payload = {
      age: formData.get("age"),
      gender,
      primaryDiagnosis,
      numProcedures: formData.get("numProcedures"),
      daysInHospital: formData.get("daysInHospital"),
      comorbidityScore: formData.get("comorbidityScore"),
      dischargeTo,
    };

    try {
      const res = await fetch("/api/risk-prediction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      setTimeout(() => {
        setRisk(data.risk);
        setDecision(data.decision);
        setLoading(false);
      }, 4500);
    } catch (error) {
      console.error("Prediction error:", error);
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 bg-black flex flex-col items-center justify-center text-white p-6 relative">
      <h1 className="text-3xl font-bold mb-10">
        Hospitalization Risk Prediction
      </h1>

      <div className="w-full max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              className="w-full"
              placeholder="Age"
              name="age"
              required
              type="number"
            />

            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Male</SelectItem>
                <SelectItem value="1">Female</SelectItem>
                <SelectItem value="2">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={primaryDiagnosis}
              onValueChange={setPrimaryDiagnosis}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Primary Diagnosis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Hypertension</SelectItem>
                <SelectItem value="1">COPD</SelectItem>
                <SelectItem value="2">Diabetes</SelectItem>
                <SelectItem value="3">Kidney Disease</SelectItem>
                <SelectItem value="4">Heart Disease</SelectItem>
              </SelectContent>
            </Select>

            <Input
              className="w-full"
              placeholder="Number of Procedures"
              name="numProcedures"
              required
              type="number"
            />
            <Input
              className="w-full"
              placeholder="Days in Hospital"
              name="daysInHospital"
              required
              type="number"
            />
            <Input
              className="w-full"
              placeholder="Comorbidity Score"
              name="comorbidityScore"
              required
              type="number"
            />

            <div className="sm:col-span-2">
              <Select value={dischargeTo} onValueChange={setDischargeTo}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Discharge To" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Home</SelectItem>
                  <SelectItem value="1">Rehabilitation Facility</SelectItem>
                  <SelectItem value="2">Skilled Nursing Facility</SelectItem>
                  <SelectItem value="3">Home Health Care</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-center">
            <Button
              type="submit"
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Predict Risk
            </Button>
          </div>
        </form>
      </div>

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

      {risk !== null && !loading && (
        <PredictionResultCard risk={risk} decision={decision} />
      )}
    </div>
  );
}
