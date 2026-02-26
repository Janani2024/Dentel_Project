"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, AlertCircle, Camera, ScanLine } from "lucide-react";
import ImageUpload from "./image-upload";
import AnalysisResults from "./analysis-results";
import {
  analyzeDentalImage,
  AnalysisResult,
  AnalysisMode,
  setAnalysisMode,
  getAnalysisMode,
  detectImageType,
} from "@/lib/dental-model";
import {
  generateOralHealthReport,
  generatePDFContent,
  OralHealthReport,
} from "@/lib/report-generator";
import { addToHistory, type HistoryItem } from "@/lib/history-storage";

interface AnalyzeSectionProps {
  selectedHistoryItem?: HistoryItem | null;
}

export default function AnalyzeSection({ selectedHistoryItem }: AnalyzeSectionProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [report, setReport] = useState<OralHealthReport | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [wrongMode, setWrongMode] = useState<{ message: string; suggestedMode: AnalysisMode } | null>(null);
  const [uploadKey, setUploadKey] = useState(0);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [mode, setMode] = useState<AnalysisMode>(getAnalysisMode());
  const modeRef = useRef<AnalysisMode>(getAnalysisMode());
  modeRef.current = mode; // always reflects latest mode, safe to read in stale closures
  const handleModeSwitch = (newMode: AnalysisMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    setAnalysisMode(newMode);
    // Reset current analysis when switching modes
    setAnalysisResult(null);
    setReport(null);
    setImagePreview(null);
    setError(null);
    setWrongMode(null);
    setUploadKey((k) => k + 1);
    imageRef.current = null;
  };

  const handleImageSelect = useCallback(
    async (file: File, preview: string) => {
      setError(null);
      setWrongMode(null);
      setImagePreview(preview);

      // Create an image element for analysis
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = async () => {
        imageRef.current = img;
        await performAnalysis(img, preview);
      };

      img.onerror = () => {
        setError("Failed to load image. Please try a different image.");
      };

      img.src = preview;
    },
    []
  );

  const performAnalysis = async (imgElement: HTMLImageElement, preview: string) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // Validate image type matches selected mode
      // Use modeRef.current (not mode) to avoid stale closure from useCallback
      const currentMode = modeRef.current;
      const detectedType = detectImageType(imgElement);
      if (detectedType !== currentMode) {
        setIsAnalyzing(false);
        setImagePreview(null);
        imageRef.current = null;
        setUploadKey((k) => k + 1);
        if (currentMode === "photo") {
          setWrongMode({
            message: "This looks like a dental X-ray image. Please upload it in the X-Ray section for accurate analysis.",
            suggestedMode: "xray",
          });
        } else {
          setWrongMode({
            message: "This looks like a regular dental photo. Please upload it in the Dental Photo section for accurate analysis.",
            suggestedMode: "photo",
          });
        }
        return;
      }

      // Simulate minimum analysis time for UX
      const [result] = await Promise.all([
        analyzeDentalImage(imgElement),
        new Promise((resolve) => setTimeout(resolve, 2500)),
      ]);

      setAnalysisResult(result);

      // Generate report
      const healthReport = generateOralHealthReport(result);
      setReport(healthReport);

      // Save to history
      if (preview && healthReport) {
        addToHistory({
          image: preview,
          predictions: healthReport.findings.map(f => ({
            condition: f.condition,
            confidence: f.confidence,
            severity: f.severity,
          })),
          healthScore: healthReport.healthScore,
          healthGrade: healthReport.healthGrade,
        });
      }
    } catch (err) {
      console.error("Analysis error:", err);
      setError(
        "An error occurred during analysis. Please try again with a different image."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setReport(null);
    setImagePreview(null);
    setError(null);
    setWrongMode(null);
    imageRef.current = null;
  };

  const handleDownload = () => {
    if (!report) return;

    // Generate text content for download
    const content = generatePDFContent(report);

    // Create blob and download
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dental-health-report-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Load history item when selected from HistorySection
  useEffect(() => {
    if (!selectedHistoryItem) return;

    setImagePreview(selectedHistoryItem.image);

    const historyReport: OralHealthReport = {
      healthScore: selectedHistoryItem.healthScore,
      healthGrade: selectedHistoryItem.healthGrade,
      summary: `Historical analysis from ${new Date(selectedHistoryItem.timestamp).toLocaleString()}`,
      findings: selectedHistoryItem.predictions.map((pred) => ({
        condition: pred.condition,
        confidence: pred.confidence,
        severity: pred.severity,
        description: `${pred.condition} detected with ${pred.confidence}% confidence.`,
        color: pred.severity === "high" ? "#ef4444" : pred.severity === "moderate" ? "#f59e0b" : "#10b981",
      })),
      recommendations: [
        "This is a historical record. For current assessment, analyze a new image.",
        "Maintain regular dental checkups every 6 months",
        "Practice good oral hygiene habits daily",
      ],
      nextSteps: [
        "Review the historical findings",
        "Compare with current oral health status",
        "Consult your dentist for personalized advice",
      ],
      generatedAt: new Date(selectedHistoryItem.timestamp).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      disclaimer:
        "This is a historical analysis record. AI analysis is for educational purposes only and should not replace professional dental advice.",
    };

    setReport(historyReport);

    // Scroll to analyze section
    document.getElementById("analyze")?.scrollIntoView({ behavior: "smooth" });
  }, [selectedHistoryItem]);

  return (
    <section id="analyze" className="section bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        {!report && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 mb-6">
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span className="text-sm text-primary-600 font-medium">
                Start Your Analysis
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              {mode === "photo" ? "Upload Your Oral Image" : "Upload Dental X-Ray"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {mode === "photo"
                ? "Take a clear photo of your teeth and gums. Our AI will analyze the image and provide a comprehensive oral health assessment."
                : "Upload a dental X-ray (OPG/panoramic). Our AI will analyze the radiograph and detect dental conditions."}
            </p>

            {/* Mode toggle */}
            <div className="mt-8 inline-flex items-center bg-gray-100 rounded-xl p-1 gap-1">
              <button
                onClick={() => handleModeSwitch("photo")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  mode === "photo"
                    ? "bg-white text-primary-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Camera className="w-4 h-4" />
                Dental Photo
              </button>
              <button
                onClick={() => handleModeSwitch("xray")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  mode === "xray"
                    ? "bg-white text-primary-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <ScanLine className="w-4 h-4" />
                X-Ray
              </button>
            </div>
          </motion.div>
        )}

        {/* Wrong mode warning */}
        {wrongMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-8 p-5 rounded-xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <div className="flex items-start gap-3 flex-1">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-amber-800 text-sm">{wrongMode.message}</p>
            </div>
            <button
              onClick={() => handleModeSwitch(wrongMode.suggestedMode)}
              className="shrink-0 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition-colors flex items-center gap-2"
            >
              {wrongMode.suggestedMode === "xray" ? (
                <><ScanLine className="w-4 h-4" /> Switch to X-Ray</>
              ) : (
                <><Camera className="w-4 h-4" /> Switch to Dental Photo</>
              )}
            </button>
          </motion.div>
        )}

        {/* Error display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-8 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}

        {/* Content */}
        {!report ? (
          <ImageUpload
            key={uploadKey}
            onImageSelect={handleImageSelect}
            isAnalyzing={isAnalyzing}
            mode={mode}
          />
        ) : (
          <AnalysisResults
            report={report}
            imagePreview={imagePreview!}
            onReset={handleReset}
            onDownload={handleDownload}
          />
        )}
      </div>
    </section>
  );
}
