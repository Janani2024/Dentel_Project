"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Heart,
  TrendingUp,
  FileText,
  Download,
  RefreshCw,
} from "lucide-react";
import { OralHealthReport } from "@/lib/report-generator";

interface AnalysisResultsProps {
  report: OralHealthReport;
  imagePreview: string;
  onReset: () => void;
  onDownload: () => void;
}

export default function AnalysisResults({
  report,
  imagePreview,
  onReset,
  onDownload,
}: AnalysisResultsProps) {
  const getSeverityIcon = (severity: "low" | "moderate" | "high") => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="w-5 h-5" />;
      case "moderate":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-blue-400";
    if (score >= 70) return "text-yellow-400";
    if (score >= 50) return "text-orange-400";
    return "text-red-500";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 85) return "from-blue-400 to-blue-600";
    if (score >= 70) return "from-yellow-400 to-yellow-600";
    if (score >= 50) return "from-orange-400 to-orange-600";
    return "from-red-400 to-red-600";
  };

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (report.healthScore / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto"
    >
      {/* Header with score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 mb-4">
          <Heart className="w-4 h-4 text-primary-600" />
          <span className="text-sm text-primary-600 font-medium">
            Analysis Complete
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
          Your Oral Health Report
        </h2>
        <p className="text-gray-600">
          Generated on {report.generatedAt}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Health Score Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-1 report-card rounded-2xl p-6"
        >
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">Overall Health Score</p>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                <motion.circle
                  cx="64" cy="64" r="40"
                  stroke="url(#scoreGradient)"
                  strokeWidth="8" fill="none" strokeLinecap="round"
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  style={{ strokeDasharray: circumference }}
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={report.healthScore >= 70 ? "#3b82f6" : "#ef4444"} />
                    <stop offset="100%" stopColor={report.healthScore >= 70 ? "#2563eb" : "#dc2626"} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className={`text-4xl font-bold ${getScoreColor(report.healthScore)}`}
                >
                  {report.healthScore}
                </motion.span>
                <span className="text-gray-500 text-xs">/100</span>
              </div>
            </div>
            <div className={`inline-block px-4 py-1.5 rounded-full bg-gradient-to-r ${getScoreGradient(report.healthScore)} text-white text-sm font-medium`}>
              {report.healthGrade}
            </div>
          </div>
        </motion.div>

        {/* Image Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="md:col-span-2 report-card rounded-2xl p-4"
        >
          <div className="aspect-video rounded-xl overflow-hidden bg-slate-950/50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreview}
              alt="Analyzed dental image"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>

      {/* Predicted Condition */}
      {report.findings[0] && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            Predicted Condition
          </h3>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="report-card rounded-2xl p-6"
            style={{ borderLeft: `4px solid ${report.findings[0].color}` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${report.findings[0].color}20` }}
                >
                  <span style={{ color: report.findings[0].color }}>
                    {getSeverityIcon(report.findings[0].severity)}
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">
                    {report.findings[0].condition}
                  </h4>
                  <span
                    className="text-xs px-3 py-1 rounded-full capitalize font-medium"
                    style={{
                      backgroundColor: `${report.findings[0].color}20`,
                      color: report.findings[0].color,
                    }}
                  >
                    {report.findings[0].severity} severity
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div
                  className="text-3xl font-bold"
                  style={{ color: report.findings[0].color }}
                >
                  {report.findings[0].confidence}%
                </div>
                <div className="text-xs text-gray-500">confidence</div>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {report.findings[0].description}
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="report-card rounded-2xl p-6 mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Summary</h3>
        </div>
        <p className="text-gray-700 leading-relaxed">{report.summary}</p>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="report-card rounded-2xl p-6 mb-8"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Personalized Recommendations
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {report.recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + index * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-primary-50 border border-primary-100"
            >
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5 border border-primary-100">
                <CheckCircle className="w-3.5 h-3.5 text-primary-600" />
              </div>
              <p className="text-sm text-gray-800">{rec}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="report-card rounded-2xl p-6 mb-8"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Next Steps
        </h3>
        <div className="space-y-3">
          {report.nextSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 + index * 0.05 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center text-white text-sm font-medium">
                {index + 1}
              </div>
              <p className="text-gray-800">{step}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 mb-8"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-400">{report.disclaimer}</p>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <button
          onClick={onDownload}
          className="btn-primary px-8 py-3 rounded-full text-white font-medium flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          Download Report
        </button>
        <button
          onClick={onReset}
          className="px-8 py-3 rounded-full text-white font-medium border border-gray-700 hover:border-blue-500 hover:bg-blue-500/10 transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Analyze Another Image
        </button>
      </motion.div>
    </motion.div>
  );
}
