"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  Trash2,
  Clock,
  AlertTriangle,
  Eye,
} from "lucide-react";
import {
  getHistory,
  deleteHistoryItem,
  clearHistory,
  formatTimestamp,
  type HistoryItem,
} from "@/lib/history-storage";

interface HistorySectionProps {
  onSelectHistory: (item: HistoryItem) => void;
}

export default function HistorySection({ onSelectHistory }: HistorySectionProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const items = getHistory();
    setHistory(items);
  };

  // Re-check history periodically to catch new analyses
  useEffect(() => {
    const interval = setInterval(loadHistory, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteHistoryItem(id);
    loadHistory();
  };

  const handleClearAll = () => {
    clearHistory();
    setHistory([]);
    setShowClearConfirm(false);
  };

  if (history.length === 0) return null;

  return (
    <section id="history" className="section bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 mb-6">
            <History className="w-4 h-4 text-primary-600" />
            <span className="text-sm text-primary-600 font-medium">
              Your Previous Analyses
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            Analysis History
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            View your previous dental analyses. Click on any result to see the full report again.
          </p>
        </motion.div>

        {/* History Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {history.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              onClick={() => onSelectHistory(item)}
              className="group relative rounded-2xl border border-gray-200 overflow-hidden hover:border-primary-400 hover:shadow-xl transition-all cursor-pointer bg-white"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt="Analysis thumbnail"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 text-primary-600 font-medium text-sm">
                    <Eye className="w-4 h-4" />
                    View Report
                  </div>
                </div>
                {/* Health Score Badge */}
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-sm text-white text-sm font-bold">
                  Score: {item.healthScore}/100
                </div>
                {/* Delete Button */}
                <button
                  onClick={(e) => handleDelete(item.id, e)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Details */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Clock className="w-4 h-4" />
                    {formatTimestamp(item.timestamp)}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.healthScore >= 70
                        ? "bg-green-100 text-green-700"
                        : item.healthScore >= 50
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.healthGrade}
                  </span>
                </div>

                {/* Top Conditions */}
                <div className="space-y-2">
                  {item.predictions.slice(0, 3).map((pred, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-700 truncate">
                        {pred.condition}
                      </span>
                      <div className="flex items-center gap-2 ml-2">
                        <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              pred.severity === "high"
                                ? "bg-red-500"
                                : pred.severity === "moderate"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                            style={{ width: `${pred.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-8 text-right">
                          {pred.confidence}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Clear All Button */}
        {history.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <button
              onClick={() => setShowClearConfirm(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear All History
            </button>
          </motion.div>
        )}
      </div>

      {/* Clear Confirmation Modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-[60] p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowClearConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                Clear All History?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                This will permanently delete all {history.length} analysis
                records. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
                >
                  Clear All
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
