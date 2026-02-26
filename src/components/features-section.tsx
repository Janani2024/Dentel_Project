"use client";

import { motion } from "framer-motion";
import {
  Scan,
  FileSearch,
  FileText,
  ShieldCheck,
  Clock,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Scan,
    title: "Advanced Image Analysis",
    description:
      "Our AI examines your oral images using advanced computer vision to identify potential dental conditions.",
    color: "primary",
  },
  {
    icon: FileSearch,
    title: "Multi-Condition Detection",
    description:
      "Detects 7+ dental conditions including cavities, gingivitis, calculus, discoloration, and more.",
    color: "accent",
  },
  {
    icon: FileText,
    title: "Comprehensive Reports",
    description:
      "Receive detailed oral health reports with findings, severity levels, and personalized recommendations.",
    color: "primary",
  },
  {
    icon: ShieldCheck,
    title: "Privacy Focused",
    description:
      "Your images are processed securely in your browser. No data is stored on external servers.",
    color: "accent",
  },
  {
    icon: Clock,
    title: "Instant Results",
    description:
      "Get your analysis results within seconds. No waiting, no appointments needed.",
    color: "primary",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Accuracy",
    description:
      "Powered by MobileNet CNN trained on real dental images with 83.87% validation accuracy.",
    color: "accent",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="section bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 mb-6">
            <Sparkles className="w-4 h-4 text-primary-600" />
            <span className="text-sm text-primary-600 font-medium">Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            Everything You Need for
            <br />
            <span className="gradient-text">Oral Health Analysis</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform provides comprehensive dental analysis to
            help you understand and maintain your oral health.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="card p-6 group"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110 ${
                  feature.color === "primary"
                    ? "bg-primary-100"
                    : "bg-accent-100"
                }`}
              >
                <feature.icon
                  className={`w-7 h-7 ${
                    feature.color === "primary"
                      ? "text-primary-600"
                      : "text-accent-600"
                  }`}
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
