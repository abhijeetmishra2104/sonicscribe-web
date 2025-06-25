'use client';

import React, { useState } from 'react';
import { FileUpload } from '@/components/ui/FileUpload';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2Icon } from 'lucide-react';
import { MultiStepLoader } from '@/components/ui/multi-step-loader';
import { IconSquareRoundedX } from '@tabler/icons-react';
import { Card, CardContent } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MedicalAnalysisCard } from '@/components/symptom-result';
import { PredictionResultCard } from '@/components/risk-prediction-result';
import AnalysisDisplay from '@/components/analysis-display';

const loadingStates = [
  { text: "Reading audio file..." },
  { text: "Uploading to Cloudinary..." },
  { text: "Saving metadata to database..." },
  { text: "Sending to AI model for processing..." },
  { text: "Analyzing symptoms and medical history..." },
  { text: "Generating diagnosis report..." },
  { text: "Finalizing..." },
];

const features = [
  {
    title: "AI Symptom Checker",
    description:
      "Virtual assistant for symptom analysis and doctor recommendations.",
    id: "symptom-checker",
  },
  {
    title: "Predictive Patient Risk Models",
    description:
      "Forecast hospital readmissions and calculate patient risk.",
    id: "risk-model",
  },
  {
    title: "Automated Clinical Documentation",
    description: "Use voice and NLP to generate clinical notes.",
    id: "documentation",
  },
];

export default function UploadPage() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  // Add at top of your component
  const [gender, setGender] = useState("");
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState("");
  const [dischargeTo, setDischargeTo] = useState("");


  async function handleUpload(files: File[]) {
    setShowAlert(false);
    setLoading(true);
    setAnalysis(null); // reset previous result

    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      console.log('Upload response:', data);

      if (data.success) {
        setShowAlert(true);
        setAnalysis(data.analysis?.response || null); 
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setLoading(false);
    }
  }

  const [symptomText, setSymptomText] = useState('');
const [uploadedFile, setUploadedFile] = useState<File | null>(null);

async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  setShowAlert(false);
  setLoading(true);
  setAnalysis(null);

  try {
    const res = await fetch('/api/symptom-upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (data.success) {
      setShowAlert(true);
      setAnalysis(data.analysis || null);
    }
  } catch (err) {
    console.error("File upload failed", err);
  } finally {
    setLoading(false);
  }
}

async function submitSymptomChecker() {
  setShowAlert(false);
  setLoading(true);
  setAnalysis(null);

  try {
    const formData = new FormData();

    if (uploadedFile) {
      formData.append('audio_file', uploadedFile);
    } else if (symptomText.trim()) {
      formData.append('text_input', symptomText.trim());
    } else {
      alert('Please enter symptoms or upload an audio file.');
      setLoading(false);
      return;
    }

    const res = await fetch('/api/symptom-upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      setShowAlert(true);
      setAnalysis(data.result || null);
    } else {
      alert(data.error || 'Submission failed. Please try again.');
    }
  } catch (err) {
    console.error('Submission failed', err);
    alert('Submission failed. Please try again.');
  } finally {
    setLoading(false);
  }
}


// When user uploads a file:
function handleSymptomUpload(files: File[]) {
  if (files.length > 0) {
    setUploadedFile(files[0]);
    setSymptomText(''); // Clear text input if any
  } else {
    setUploadedFile(null);
  }
}

// When user types symptoms:
function handleSymptomTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
  setSymptomText(e.target.value);
  if (e.target.value.trim()) {
    setUploadedFile(null); // Clear uploaded file if any text entered
  }
}

  function submitRiskForm(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name');
    const age = formData.get('age');
    const gender = formData.get('gender');

    setShowAlert(false);
    setLoading(true);
    setAnalysis(null);

    fetch('/api/risk-model', {
      method: 'POST',
      body: JSON.stringify({ name, age, gender }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (data.success) {
          setShowAlert(true);
          setAnalysis(data.analysis || null);
        }
      })
      .catch((err) => {
        console.error("Risk model submission failed", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  const [risk, setRisk] = useState<number | null>(null);
  const [decision, setDecision] = useState<string | null>(null);
  return (
    <div className="min-h-screen bg-black text-inter text-white pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6 text-center">SonicScribe AI</h1>
        <p className="text-center text-gray-400 mb-10">
          Choose a feature to get started with AI-powered healthcare solutions.
        </p>
      </div>
      <div className="flex justify-center gap-6 flex-wrap mt-10">
  {features.map((f) => (
    <CardSpotlight
      key={f.id}
      className={cn(
        "w-60 h-72 cursor-pointer p-6 flex flex-col justify-between border rounded-md transition",
        selectedFeature === f.id ? "border-blue-500" : "border-gray-700"
      )}
      onClick={() => setSelectedFeature(f.id)}
    >
      <h3 className="text-lg font-semibold">{f.title}</h3>
      <p className="text-sm text-gray-400">{f.description}</p>
    </CardSpotlight>
  ))}
</div>

      {selectedFeature === 'symptom-checker' && (
  <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6 relative">
    <h1 className="text-3xl font-bold mb-10">Enter your Symptoms or Upload Audio</h1>

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

    {/* AI Analysis Output */}
    {analysis && (
      <MedicalAnalysisCard analysis={analysis} />
    )}
  </div>
)}


{selectedFeature === 'risk-model' && (
  <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6 relative">
    <h1 className="text-3xl font-bold mb-10">Hospitalization Risk Prediction</h1>

    <div className="w-full max-w-2xl">
      <form
  onSubmit={async (e) => {
    e.preventDefault();
    setLoading(true);
    setRisk(null);
    setDecision(null);
    setAnalysis(null);

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
  }}
  className="space-y-6"
>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <Input className="w-full" placeholder="Age" name="age" required type="number" />

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

    <Select value={primaryDiagnosis} onValueChange={setPrimaryDiagnosis}>
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

    <Input className="w-full" placeholder="Number of Procedures" name="numProcedures" required type="number" />
    <Input className="w-full" placeholder="Days in Hospital" name="daysInHospital" required type="number" />
    <Input className="w-full" placeholder="Comorbidity Score" name="comorbidityScore" required type="number" />

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

    {/* Loader */}
    <MultiStepLoader
      loadingStates={[
        { text: "Validating Inputs" },
        { text: "Predicting..." },
        { text: "Finalizing Result" }
      ]}
      loading={loading}
      duration={1500}
      loop={false}
    />

    {/* Cancel button */}
    {loading && (
      <Button
        className="fixed top-4 right-4 text-white z-50"
        onClick={() => setLoading(false)}
      >
        <IconSquareRoundedX className="h-10 w-10" />
      </Button>
    )}

    {/* Prediction Output */}
    {risk !== null && !loading && <PredictionResultCard risk={risk} decision={decision} />}
  </div>
)}
      {selectedFeature === 'documentation' && (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6 relative">
          <h1 className="text-3xl font-bold mb-10">Upload your Audio File</h1>

          <div className="w-full max-w-2xl">
            <FileUpload onChange={handleUpload} />
          </div>

          {showAlert && (
            <div className="mt-6 w-full max-w-2xl">
              <Alert>
                <CheckCircle2Icon className="h-5 w-5" />
                <AlertTitle>Success! Your file has been uploaded.</AlertTitle>
                <AlertDescription>
                  It is now stored securely and ready for use.
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

          
            <AnalysisDisplay analysis={analysis ?? ""} />
          
        </div>
      )}
    </div>
  );
}
