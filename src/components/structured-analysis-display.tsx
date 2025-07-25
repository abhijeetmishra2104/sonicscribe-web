"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import {
  User,
  AlertTriangle,
  Stethoscope,
  FileText,
  Activity,
  Shield,
  Lightbulb,
  Copy,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Download,
  Calendar,
  Heart,
  Thermometer,
  UserCheck,
  ClipboardList,
  AlertCircle,
  FileAudio,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface StructuredAnalysisDisplayProps {
  data: string
}

interface ParsedData {
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

export function StructuredAnalysisDisplay({ data }: StructuredAnalysisDisplayProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    patientInfo: true,
    symptoms: true,
    triage: true,
    diagnosis: true,
    recommendations: true,
    medicalHistory: true,
  })
  const [copiedText, setCopiedText] = useState<string | null>(null)

  let parsedData: ParsedData | null = null
  try {
    parsedData = JSON.parse(data)
  } catch (err) {
    console.error("Failed to parse analysis data:", err)
    return (
      <div className="mt-10 w-full max-w-4xl">
        <Card className="bg-red-900/20 border border-red-700/50">
          <CardContent className="p-6">
            <p className="text-red-400">Failed to parse analysis data. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!parsedData) return null

  const { analysis, file } = parsedData
  const { transcript, triage } = analysis

  // Function to toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Function to copy text to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(label)
    setTimeout(() => setCopiedText(null), 2000)
  }

  // Get triage level styling
  const getTriageStyle = (level: string) => {
    const l = level.toLowerCase()
    if (l.includes("emergency") || l.includes("critical")) {
      return {
        bg: "bg-red-900/30",
        border: "border-red-500/50",
        text: "text-red-400",
        badge: "bg-red-900/50 text-red-300 border-red-500",
      }
    }
    if (l.includes("urgent")) {
      return {
        bg: "bg-orange-900/30",
        border: "border-orange-500/50",
        text: "text-orange-400",
        badge: "bg-orange-900/50 text-orange-300 border-orange-500",
      }
    }
    return {
      bg: "bg-green-900/30",
      border: "border-green-500/50",
      text: "text-green-400",
      badge: "bg-green-900/50 text-green-300 border-green-500",
    }
  }

  const triageStyle = getTriageStyle(triage.triage_level)

  // Get risk level for progress bar
  const getRiskLevel = () => {
    const text = analysis.structured.risk_prediction.toLowerCase()
    if (text.includes("high")) return { level: "high", percent: 85, color: "bg-red-500" }
    if (text.includes("moderate") || text.includes("medium"))
      return { level: "moderate", percent: 60, color: "bg-orange-500" }
    return { level: "low", percent: 30, color: "bg-green-500" }
  }

  const riskLevel = getRiskLevel()

  // Download functions
  const handleDownloadTranscript = () => {
    const blob = new Blob([transcript], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transcript-${analysis.structured.name.replace(/\s+/g, "-")}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadPDF = () => {
    // Create a new window with the report content
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const currentDate = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })

    const reportHTML = `
      <!DOCTYPE html>
<html>
  <head>
    <title>Medical Analysis Report - ${analysis.structured.name}</title>
    <meta charset="UTF-8">
    <style>
            @page {
              margin: 0.75in;
              size: A4;
              background: #FFF2E0;
            }
            
            body { 
              margin: 0; 
              padding: 20px;
              font-family: Arial, sans-serif; 
              background: #FFF2E0;
              color: #333;
              font-size: 12px;
              line-height: 1.5;
            }
            
            .header {
              text-align: center;
              border-bottom: 3px solid #7469B6;
              padding-bottom: 20px;
              margin-bottom: 30px;
              page-break-after: avoid;
            }
            
            .app-name {
              font-size: 28px;
              font-weight: bold;
              color: #7F55B1;
              margin-bottom: 5px;
            }
            
            .report-title {
              font-size: 20px;
              color: #374151;
              margin-bottom: 10px;
            }
            
            .report-date {
              font-size: 14px;
              color: #6b7280;
            }
            
            .section {
              margin-bottom: 25px;
              page-break-inside: avoid;
            }
            
            .section-title {
              font-size: 18px;
              font-weight: bold;
              color: #1f2937;
              margin-bottom: 10px;
              padding-bottom: 5px;
              border-bottom: 2px solid #F0A04B;
              page-break-after: avoid;
            }
            
            .patient-info {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 20px;
            }
            
            .info-item {
              background: #BDDDE4;
              padding: 15px;
              border-radius: 8px;
              border-left: 4px solid #727D73;
              break-inside: avoid;
            }
            
            .info-label {
              font-weight: bold;
              color: #374151;
              margin-bottom: 5px;
            }
            
            .info-value {
              color: #1f2937;
            }
            
            .list-item {
              background: #BDDDE4;
              padding: 10px 15px;
              margin-bottom: 8px;
              border-radius: 6px;
              border-left: 3px solid #727D73;
              break-inside: avoid;
            }
            
            .symptoms-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
            }
            
            .triage-level {
              display: inline-block;
              padding: 8px 16px;
              border-radius: 20px;
              font-weight: bold;
              text-transform: uppercase;
              font-size: 12px;
            }
            
            .triage-urgent {
              background: #fef3c7;
              color: #92400e;
              border: 2px solid #f59e0b;
            }
            
            .triage-emergency {
              background: #fee2e2;
              color: #991b1b;
              border: 2px solid #ef4444;
            }
            
            .triage-normal {
              background: #d1fae5;
              color: #065f46;
              border: 2px solid #10b981;
            }
            
            .admission-required {
              background: #fef3c7;
              color: #991b1b;
              padding: 15px;
              border-radius: 8px;
              border: 2px solid #ef4444;
              font-weight: bold;
              text-align: center;
              margin: 15px 0;
            }
            
            .diseases-list {
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
            }
            
            .disease-tag {
              background: #ede9fe;
              color: #5b21b6;
              padding: 6px 12px;
              border-radius: 15px;
              font-size: 14px;
              border: 1px solid #c4b5fd;
            }
            
            .disclaimer {
              background: #fef3c7;
              border: 2px solid #f59e0b;
              padding: 20px;
              border-radius: 8px;
              margin-top: 30px;
              text-align: center;
              page-break-inside: avoid;
            }
            
            .disclaimer-title {
              font-weight: bold;
              color: #92400e;
              margin-bottom: 10px;
              font-size: 16px;
            }
            
            .disclaimer-text {
              color: #78350f;
              font-size: 14px;
            }
            
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #7469B6;
              text-align: center;
              color: #6b7280;
              font-size: 12px;
              page-break-inside: avoid;
            }
          </style>
  </head>
  <body>
    <div class="header">
      <div class="app-name">SonicScribe AI</div>
      <div class="report-title">Medical Analysis Report</div>
      <div class="report-date">Generated on ${currentDate}</div>
    </div>

    <div class="section">
      <div class="section-title">Patient Information</div>
      <div class="patient-info">
        <div class="info-item">
          <div class="info-label">Patient Name</div>
          <div class="info-value">${analysis.structured.name}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Age & Gender</div>
          <div class="info-value">${analysis.structured.age_gender}</div>
        </div>
      </div>
    </div>

    ${
      analysis.structured.medical_history.length > 0
        ? `
    <div class="section">
      <div class="section-title">Medical History</div>
      ${analysis.structured.medical_history
        .map((condition) => `<div class="list-item">• ${condition}</div>`)
        .join("")}
    </div>
    `
        : ""
    }

    ${
      analysis.structured.symptoms.length > 0
        ? `
    <div class="section">
      <div class="section-title">Reported Symptoms</div>
      <div class="symptoms-grid">
        ${analysis.structured.symptoms
          .map((symptom) => `<div class="list-item">• ${symptom}</div>`)
          .join("")}
      </div>
    </div>
    `
        : ""
    }

    <div class="section">
      <div class="section-title">Triage Assessment</div>
      <div style="margin-bottom: 15px;">
        <strong>Priority Level: </strong> 
        <span class="triage-level ${
          analysis.triage.triage_level.toLowerCase().includes("urgent")
            ? "triage-urgent"
            : analysis.triage.triage_level.toLowerCase().includes("emergency")
              ? "triage-emergency"
              : "triage-normal"
        }">
          ${analysis.triage.triage_level}
        </span>
      </div>

      <div style="margin-bottom: 15px;">
        <strong>Recommended Specialist: </strong>
        <span>${analysis.triage.specialist_to_consult}</span>
      </div>

      <div>
        <strong>Probable Conditions:</strong>
        ${analysis.triage.probable_conditions
          .map((condition) => `<div class="list-item">• ${condition}</div>`)
          .join("")}
      </div>
    </div>

    <div class="section">
      <div class="section-title">Risk Assessment</div>
      <div class="info-item">
        <div class="info-value">${analysis.structured.risk_prediction}</div>
      </div>
    </div>

    ${
      analysis.structured.possible_disease.length > 0
        ? `
    <div class="section">
      <div class="section-title">Possible Diseases/Conditions</div>
      <div class="diseases-list">
        ${analysis.structured.possible_disease
          .map((disease) => `<span class="disease-tag">${disease}</span>`)
          .join("")}
      </div>
    </div>
    `
        : ""
    }

    <div class="section">
      <div class="section-title">Medical Recommendations</div>

      ${
        analysis.structured.recommendation.should_be_admitted
          ? `<div class="admission-required">
              ⚠️ HOSPITAL ADMISSION RECOMMENDED
            </div>`
          : ""
      }

      <div class="info-item">
        <div class="info-label">Next Steps</div>
        <div class="info-value">${analysis.structured.recommendation.next_steps}</div>
      </div>

      ${
        analysis.structured.notes
          ? `
        <div class="info-item" style="margin-top: 15px;">
          <div class="info-label">Clinical Notes</div>
          <div class="info-value">${analysis.structured.notes}</div>
        </div>
      `
          : ""
      }
    </div>

    <div class="section">
      <div class="section-title">Source Information</div>
      <div class="info-item">
        <div class="info-label">Audio File</div>
        <div class="info-value">${file.originalName}</div>
      </div>
      <div class="info-item" style="margin-top: 10px;">
        <div class="info-label">Upload Date</div>
        <div class="info-value">${new Date(file.uploadedAt).toLocaleString()}</div>
      </div>
    </div>

    <div class="disclaimer">
      <div class="disclaimer-title">⚠️ IMPORTANT MEDICAL DISCLAIMER</div>
      <div class="disclaimer-text">
        This AI-generated analysis is for informational purposes only and should not be considered as professional medical advice, diagnosis, or treatment. 
        Always consult with qualified healthcare professionals for proper medical evaluation and care. ${analysis.triage.advice}
      </div>
    </div>

    <div class="footer">
      <div>Report generated by SonicScribe AI Medical Analysis System</div>
      <div>This document contains confidential medical information</div>
    </div>
  </body>
</html>

    `

    printWindow.document.write(reportHTML)
    printWindow.document.close()

    // Wait for content to load, then trigger print dialog
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
        // Note: The user can choose "Save as PDF" in the print dialog
        printWindow.close()
      }, 500)
    }
  }


  return (
    <div className="mt-10 w-full max-w-6xl space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30">
            <Stethoscope className="h-8 w-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Medical Analysis Report</h1>
            <p className="text-gray-400">Patient: {analysis.structured.name}</p>
            <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2" />
          </div>
        </motion.div>

        <div className="flex items-center gap-2 flex-wrap">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleDownloadPDF}
                  variant="outline"
                  size="sm"
                  className="bg-gray-800 border-gray-700 hover:bg-gray-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Report
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download as PDF</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleDownloadTranscript}
                  variant="outline"
                  size="sm"
                  className="bg-gray-800 border-gray-700 hover:bg-gray-700"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Transcript
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download Transcript</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Rest of the component remains the same... */}
      {/* File Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="bg-gray-900/50 border border-gray-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileAudio className="h-5 w-5 text-blue-400" />
              <div className="flex-1">
                <p className="text-white font-medium">{file.originalName}</p>
                <p className="text-gray-400 text-sm">Uploaded: {new Date(file.uploadedAt).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs and content remain the same as in the previous implementation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 bg-gray-800">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-900/50">
            Overview
          </TabsTrigger>
          <TabsTrigger value="transcript" className="data-[state=active]:bg-blue-900/50">
            Transcript
          </TabsTrigger>
          <TabsTrigger value="raw" className="data-[state=active]:bg-blue-900/50">
            Raw Data
          </TabsTrigger>
        </TabsList>

        {/* All the tab content remains the same as in the previous implementation */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Patient Information */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-gray-900/50 border border-gray-700/50 backdrop-blur-sm overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
                onClick={() => toggleSection("patientInfo")}
              >
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-blue-400" />
                  <h3 className="text-xl font-semibold text-white">Patient Information</h3>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  {expandedSections.patientInfo ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <AnimatePresence>
                {expandedSections.patientInfo && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent className="p-6 pt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 bg-gray-800/50 p-4 rounded-lg border border-gray-700/30">
                          <div className="flex items-center gap-2">
                            <UserCheck className="h-4 w-4 text-blue-400" />
                            <p className="text-sm text-gray-400">Name</p>
                          </div>
                          <p className="text-white font-semibold text-lg">{analysis.structured.name}</p>
                        </div>
                        <div className="space-y-2 bg-gray-800/50 p-4 rounded-lg border border-gray-700/30">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-green-400" />
                            <p className="text-sm text-gray-400">Age & Gender</p>
                          </div>
                          <p className="text-white font-semibold text-lg">{analysis.structured.age_gender}</p>
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>

          {/* Medical History */}
          {analysis.structured.medical_history.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="bg-gray-900/50 border border-gray-700/50 backdrop-blur-sm overflow-hidden">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
                  onClick={() => toggleSection("medicalHistory")}
                >
                  <div className="flex items-center gap-3">
                    <ClipboardList className="h-5 w-5 text-purple-400" />
                    <h3 className="text-xl font-semibold text-white">Medical History</h3>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    {expandedSections.medicalHistory ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <AnimatePresence>
                  {expandedSections.medicalHistory && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent className="p-6 pt-2">
                        <div className="space-y-3">
                          {analysis.structured.medical_history.map((condition, index) => (
                            <motion.div
                              key={index}
                              className="flex items-center gap-3 p-3 rounded-lg bg-purple-900/20 border border-purple-700/30"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <div className="w-2 h-2 bg-purple-400 rounded-full" />
                              <span className="text-gray-200 capitalize">{condition}</span>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          )}

          {/* Symptoms */}
          {analysis.structured.symptoms.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="bg-gray-900/50 border border-gray-700/50 backdrop-blur-sm overflow-hidden">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
                  onClick={() => toggleSection("symptoms")}
                >
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-red-400" />
                    <h3 className="text-xl font-semibold text-white">Symptoms</h3>
                    <Badge variant="secondary" className="bg-red-900/30 text-red-300">
                      {analysis.structured.symptoms.length}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    {expandedSections.symptoms ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <AnimatePresence>
                  {expandedSections.symptoms && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent className="p-6 pt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {analysis.structured.symptoms.map((symptom, index) => (
                            <motion.div
                              key={index}
                              className="flex items-center gap-3 p-3 rounded-lg bg-red-900/20 border border-red-700/30 hover:bg-red-900/30 transition-colors"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <Thermometer className="h-4 w-4 text-red-400 flex-shrink-0" />
                              <span className="text-gray-200 capitalize">{symptom}</span>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          )}

          {/* Triage Assessment */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className={cn("border backdrop-blur-sm overflow-hidden", triageStyle.bg, triageStyle.border)}>
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-black/20 transition-colors"
                onClick={() => toggleSection("triage")}
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className={cn("h-5 w-5", triageStyle.text)} />
                  <h3 className="text-xl font-semibold text-white">Triage Assessment</h3>
                  <Badge className={cn("border", triageStyle.badge)}>{triage.triage_level}</Badge>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  {expandedSections.triage ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>

              <AnimatePresence>
                {expandedSections.triage && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent className="p-6 pt-2 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h4 className="text-white font-semibold flex items-center gap-2">
                            <Shield className="h-4 w-4 text-blue-400" />
                            Probable Conditions
                          </h4>
                          <div className="space-y-2">
                            {triage.probable_conditions.map((condition, index) => (
                              <Badge key={index} variant="outline" className="mr-2 mb-2 bg-gray-800/50 text-gray-200">
                                {condition}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h4 className="text-white font-semibold flex items-center gap-2">
                            <UserCheck className="h-4 w-4 text-green-400" />
                            Recommended Specialist
                          </h4>
                          <p className="text-gray-200 bg-gray-800/50 p-3 rounded-lg border border-gray-700/30">
                            {triage.specialist_to_consult}
                          </p>
                        </div>
                      </div>
                      <div className="bg-amber-900/20 border border-amber-700/30 p-4 rounded-lg">
                        <h4 className="text-amber-200 font-semibold mb-2 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          Medical Advice
                        </h4>
                        <p className="text-amber-100/80">{triage.advice}</p>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>

          {/* Risk Assessment */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-700/50 backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-orange-400" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/30">
                  <p className="text-gray-200 leading-relaxed">{analysis.structured.risk_prediction}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Risk Level</span>
                    <span className="text-sm font-medium text-white capitalize">{riskLevel.level}</span>
                  </div>
                  <Progress
                    value={riskLevel.percent}
                    className="h-3 bg-gray-700"
                    indicatorClassName={riskLevel.color}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Possible Diseases */}
          {analysis.structured.possible_disease.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
              <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-700/50 backdrop-blur-sm overflow-hidden">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-purple-900/30 transition-colors"
                  onClick={() => toggleSection("diagnosis")}
                >
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-purple-400" />
                    <h3 className="text-xl font-semibold text-white">Possible Diseases</h3>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    {expandedSections.diagnosis ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <AnimatePresence>
                  {expandedSections.diagnosis && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent className="p-6 pt-2">
                        <div className="flex flex-wrap gap-3">
                          {analysis.structured.possible_disease.map((disease, index) => (
                            <Badge
                              key={index}
                              className="bg-purple-800/50 hover:bg-purple-700/50 text-purple-200 text-sm py-2 px-4 border border-purple-600/30"
                            >
                              {disease}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          )}

          {/* Recommendations */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-700/50 backdrop-blur-sm overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-green-900/30 transition-colors"
                onClick={() => toggleSection("recommendations")}
              >
                <div className="flex items-center gap-3">
                  <Lightbulb className="h-5 w-5 text-green-400" />
                  <h3 className="text-xl font-semibold text-white">Recommendations</h3>
                  {analysis.structured.recommendation.should_be_admitted && (
                    <Badge className="bg-red-900/50 text-red-300 border-red-500">Admission Required</Badge>
                  )}
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  {expandedSections.recommendations ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <AnimatePresence>
                {expandedSections.recommendations && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent className="p-6 pt-2 space-y-4">
                      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/30">
                        <h4 className="text-white font-semibold mb-2">Next Steps</h4>
                        <p className="text-gray-200 leading-relaxed">{analysis.structured.recommendation.next_steps}</p>
                      </div>
                      {analysis.structured.notes && (
                        <div className="bg-blue-900/20 border border-blue-700/30 p-4 rounded-lg">
                          <h4 className="text-blue-200 font-semibold mb-2">Clinical Notes</h4>
                          <p className="text-blue-100/80">{analysis.structured.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="transcript" className="mt-6">
          <Card className="bg-gray-900/50 border border-gray-700/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-400" />
                  Audio Transcript
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-800 border-gray-700 hover:bg-gray-700"
                  onClick={() => copyToClipboard(transcript, "transcript")}
                >
                  {copiedText === "transcript" ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-800/80 p-6 rounded-lg border border-gray-700/50 max-h-96 overflow-y-auto">
                <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{transcript}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="raw" className="mt-6">
          <Card className="bg-gray-900/50 border border-gray-700/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Raw Analysis Data</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-800 border-gray-700 hover:bg-gray-700"
                  onClick={() => copyToClipboard(JSON.stringify(parsedData, null, 2), "raw")}
                >
                  {copiedText === "raw" ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy All
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-800/80 p-4 rounded-lg border border-gray-700/50 font-mono text-sm max-h-96 overflow-auto">
                <pre className="text-gray-300 whitespace-pre-wrap">{JSON.stringify(parsedData, null, 2)}</pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
