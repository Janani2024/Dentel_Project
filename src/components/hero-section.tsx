"use client";

import { motion } from "framer-motion";
import { Sparkles, Shield, Zap, Brain, ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden bg-gradient-soft">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-primary-100 mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span className="text-sm text-primary-600 font-medium">
                AI-Powered Dental Analysis
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6"
            >
              <span className="text-gray-900">Protect Your</span>
              <br />
              <span className="gradient-text">Oral Health</span>
              <br />
              <span className="text-gray-900">with AI</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Upload a photo of your teeth and get instant AI-powered analysis.
              Detect potential dental issues early and receive personalized
              recommendations.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
            >
              <a
                href="#analyze"
                className="btn-primary inline-flex items-center justify-center gap-2 text-lg"
              >
                Start Free Analysis
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#how-it-works"
                className="btn-secondary inline-flex items-center justify-center text-lg"
              >
                Learn More
              </a>
            </motion.div>

            {/* Feature pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-6 justify-center lg:justify-start"
            >
              {[
                { icon: Shield, text: "Private & Secure" },
                { icon: Zap, text: "Instant Results" },
                { icon: Brain, text: "AI Accuracy" },
              ].map((feature, index) => (
                <div
                  key={feature.text}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="font-medium">{feature.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right content - Stats Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { label: "Accuracy", value: "84%", color: "primary" },
              { label: "Conditions", value: "7+", color: "accent" },
              { label: "Analysis Time", value: "< 3s", color: "success" },
              { label: "Users", value: "10K+", color: "warning" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="card p-6 text-center"
              >
                <div className={`text-3xl font-bold gradient-text mb-2`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
