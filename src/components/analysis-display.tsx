"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
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
  Printer,
  Share2,
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import { motion, AnimatePresence } from "framer-motion"

interface AnalysisDisplayProps {
  analysis: string
}

// Medical terms dictionary for tooltips
const medicalTerms: Record<string, string> = {
  Gastroenteritis:
    "Inflammation of the stomach and intestines, typically resulting from bacterial toxins or viral infection.",
  "Food poisoning": "Illness caused by eating contaminated food with bacteria, viruses, or toxins.",
  Diarrhea: "Loose, watery stools occurring more than three times in one day.",
  Nausea: "A feeling of sickness with an inclination to vomit.",
  Vomiting: "The forceful expulsion of stomach contents through the mouth.",
  Dizziness: "A feeling of being unsteady, lightheaded, or having a spinning sensation.",
  Indigestion: "Discomfort or pain in the upper abdomen often occurring after eating.",
}

export default function AnalysisDisplay({ analysis }: AnalysisDisplayProps) {
  console.log("Raw analysis data:", analysis)
  const [activeTab, setActiveTab] = useState("overview")
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    patientInfo: true,
    symptoms: true,
    notes: true,
    risk: true,
    diagnosis: true,
    recommendations: true,
  })
  const [copiedText, setCopiedText] = useState<string | null>(null)

  // Parse the analysis text to extract structured data
  const parseAnalysis = (text: string) => {
    if (!text || text.trim() === "") return {}

    // Initialize the parsed object
    const parsed: any = {
      name: "Not provided",
      ageGender: "Not provided",
      medicalHistory: "Not provided",
      symptoms: [],
      notes: "",
      riskPrediction: "",
      possibleDisease: "",
      recommendation: "",
    }

    // Check if we're dealing with a properly formatted medical report
    if (text.includes("Name:") && text.includes("Symptoms:")) {
      // Split by common section headers to extract each part
      const sections = [
        { key: "name", pattern: /Name:(.+?)(?=Age\/Gender:|Medical History:|Symptoms:|$)/s },
        { key: "ageGender", pattern: /Age\/Gender:(.+?)(?=Medical History:|Symptoms:|$)/s },
        { key: "medicalHistory", pattern: /Medical History:(.+?)(?=Symptoms:|$)/s },
        { key: "symptoms", pattern: /Symptoms:(.+?)(?=Notes:|Risk Prediction:|Possible Disease:|Recommendation:|$)/s },
        { key: "notes", pattern: /Notes:(.+?)(?=Risk Prediction:|Possible Disease:|Recommendation:|$)/s },
        { key: "riskPrediction", pattern: /Risk Prediction:(.+?)(?=Possible Disease:|Recommendation:|$)/s },
        { key: "possibleDisease", pattern: /Possible Disease:(.+?)(?=Recommendation:|$)/s },
        { key: "recommendation", pattern: /Recommendation:(.+?)(?=$)/s },
      ]

      // Extract each section
      sections.forEach((section) => {
        const match = text.match(section.key === "symptoms" ? section.pattern : section.pattern)
        if (match && match[1]) {
          if (section.key === "symptoms") {
            // Process the symptoms list
            parsed.symptoms = match[1]
              .trim()
              .split("\n")
              .filter((line) => line.trim())
              .map((line) => line.trim())
          } else {
            // For other sections, just trim the content
            parsed[section.key] = match[1].trim()
          }
        }
      })
    }

    console.log("Parsed data:", parsed)
    return parsed
  }

  const data = parseAnalysis(analysis)
  console.log("Parsed data:", data)

  // Calculate risk level based on text
  const getRiskLevel = () => {
    if (!data.riskPrediction) return { level: "unknown", percent: 50 }

    const text = data.riskPrediction.toLowerCase()
    if (text.includes("high risk") || text.includes("severe")) {
      return { level: "high", percent: 85 }
    } else if (text.includes("medium risk") || text.includes("moderate")) {
      return { level: "medium", percent: 50 }
    } else {
      return { level: "low", percent: 25 }
    }
  }

  const riskLevel = getRiskLevel()

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

  // Function to highlight medical terms with tooltips
  const highlightMedicalTerms = (text: string) => {
    if (!text) return text

    let highlightedText = text
    Object.keys(medicalTerms).forEach((term) => {
      const regex = new RegExp(`\\b${term}\\b`, "gi")
      highlightedText = highlightedText.replace(regex, `__TERM_START__${term}__TERM_END__`)
    })

    return highlightedText.split("__TERM_START__").map((part, index) => {
      if (index === 0) return part

      const [term, rest] = part.split("__TERM_END__")
      return (
        <>
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="underline decoration-dotted decoration-blue-400 cursor-help">{term}</span>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-gray-800 text-white border-gray-700">
                <p>{medicalTerms[term] || term}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {rest}
        </>
      )
    })
  }

  return (
    <div className="mt-10 w-full max-w-4xl space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
          <div className="p-2 bg-blue-500/20 rounded-full">
            <Stethoscope className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">AI Medical Analysis</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-1" />
          </div>
        </motion.div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="bg-gray-800 border-gray-700 hover:bg-gray-700">
                  <Printer className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Print Analysis</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="bg-gray-800 border-gray-700 hover:bg-gray-700">
                  <Download className="h-4 w-4" />
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
                <Button variant="outline" size="icon" className="bg-gray-800 border-gray-700 hover:bg-gray-700">
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share Analysis</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 bg-gray-800">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-900/50">
            Overview
          </TabsTrigger>
          <TabsTrigger value="raw" className="data-[state=active]:bg-blue-900/50">
            Raw Data
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-4">
          {/* Patient Information */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-gray-900/50 border border-gray-700/50 backdrop-blur-sm overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-800/50"
                onClick={() => toggleSection("patientInfo")}
              >
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Patient Information</h3>
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
                    transition={{ duration: 0.2 }}
                  >
                    <CardContent className="p-6 pt-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1 bg-gray-800/50 p-3 rounded-lg">
                          <p className="text-sm text-gray-400">Name</p>
                          <p className="text-white font-medium">{data.name || "Not provided"}</p>
                        </div>
                        <div className="space-y-1 bg-gray-800/50 p-3 rounded-lg">
                          <p className="text-sm text-gray-400">Age/Gender</p>
                          <p className="text-white font-medium">{data.ageGender || "Not provided"}</p>
                        </div>
                        <div className="space-y-1 bg-gray-800/50 p-3 rounded-lg">
                          <p className="text-sm text-gray-400">Medical History</p>
                          <p className="text-white font-medium">{data.medicalHistory || "Not provided"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>

          {/* Symptoms */}
          {data.symptoms && data.symptoms.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="bg-gray-900/50 border border-gray-700/50 backdrop-blur-sm overflow-hidden">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-800/50"
                  onClick={() => toggleSection("symptoms")}
                >
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-red-400" />
                    <h3 className="text-lg font-semibold text-white">Symptoms</h3>
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
                      transition={{ duration: 0.2 }}
                    >
                      <CardContent className="p-6 pt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {data.symptoms.map((symptom: string, index: number) => (
                            <motion.div
                              key={index}
                              className="flex items-center gap-2 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <div className="w-2 h-2 bg-red-400 rounded-full" />
                              <span className="text-gray-200">
                                {highlightMedicalTerms(symptom.replace(/^[•\-*]\s*/, "").trim())}
                              </span>
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

          {/* Clinical Notes */}
          {data.notes && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="bg-gray-900/50 border border-gray-700/50 backdrop-blur-sm overflow-hidden">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-800/50"
                  onClick={() => toggleSection("notes")}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-yellow-400" />
                    <h3 className="text-lg font-semibold text-white">Notes</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation()
                        copyToClipboard(data.notes, "notes")
                      }}
                    >
                      {copiedText === "notes" ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      {expandedSections.notes ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedSections.notes && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CardContent className="p-6 pt-2">
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                          <p className="text-gray-200 leading-relaxed">{highlightMedicalTerms(data.notes)}</p>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          )}

          {/* Risk Prediction */}
          {data.riskPrediction && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-700/50 backdrop-blur-sm overflow-hidden">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-orange-900/30"
                  onClick={() => toggleSection("risk")}
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-400" />
                    <h3 className="text-lg font-semibold text-white">Risk Prediction</h3>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    {expandedSections.risk ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>

                <AnimatePresence>
                  {expandedSections.risk && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CardContent className="p-6 pt-2">
                        <div className="space-y-4">
                          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                            <p className="text-gray-200 leading-relaxed">
                              {highlightMedicalTerms(data.riskPrediction)}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-400">Risk Level</span>
                              <span className="text-sm font-medium text-white capitalize">{riskLevel.level}</span>
                            </div>
                            <Progress
                              value={riskLevel.percent}
                              className="h-2 bg-gray-700"
                              indicatorClassName={`${
                                riskLevel.level === "high"
                                  ? "bg-red-500"
                                  : riskLevel.level === "medium"
                                    ? "bg-orange-500"
                                    : "bg-green-500"
                              }`}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          )}

          {/* Possible Disease */}
          {data.possibleDisease && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-700/50 backdrop-blur-sm overflow-hidden">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-purple-900/30"
                  onClick={() => toggleSection("diagnosis")}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">Possible Disease</h3>
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
                      transition={{ duration: 0.2 }}
                    >
                      <CardContent className="p-6 pt-2 max-w-full overflow-x-auto">
                        <Badge className="bg-purple-800 hover:bg-purple-700 text-white text-md py-1 px-3 break-words whitespace-normal max-w-full">
                          {highlightMedicalTerms(data.possibleDisease)}
                        </Badge>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          )}

          {/* Recommendations */}
          {data.recommendation && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-700/50 backdrop-blur-sm overflow-hidden">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-green-900/30"
                  onClick={() => toggleSection("recommendations")}
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">Recommendation</h3>
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
                      transition={{ duration: 0.2 }}
                    >
                      <CardContent className="p-6 pt-2">
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                          <p className="text-gray-200 leading-relaxed">{highlightMedicalTerms(data.recommendation)}</p>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        {/* Raw Data Tab */}
        <TabsContent value="raw" className="mt-4">
          <Card className="bg-gray-900/50 border border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6 prose prose-invert max-w-none">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white m-0">Raw Analysis Data</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-800 border-gray-700 hover:bg-gray-700"
                  onClick={() => copyToClipboard(analysis, "raw")}
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
              <div className="bg-gray-800/80 p-4 rounded-lg border border-gray-700/50 font-mono text-sm whitespace-pre-wrap">
                <ReactMarkdown>{analysis}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
