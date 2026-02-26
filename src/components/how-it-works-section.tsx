"use client";

import { motion } from "framer-motion";
import { Upload, Cpu, FileCheck, ArrowRight } from "lucide-react";
import Image from "next/image";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload Your Image",
    description:
      "Take a clear photo of your teeth and gums, then upload it to our platform. Ensure good lighting for best results.",
    image:
      "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=300&fit=crop",
  },
  {
    number: "02",
    icon: Cpu,
    title: "AI Analysis",
    description:
      "Our advanced AI analyzes your image, examining for signs of various dental conditions using machine learning.",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop",
  },
  {
    number: "03",
    icon: FileCheck,
    title: "Get Your Report",
    description:
      "Receive a comprehensive oral health report with findings, health score, and personalized recommendations.",
    image:
      "https://images.unsplash.com/photo-1559757175-7cb057fba93c?w=400&h=300&fit=crop",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section bg-gradient-soft">
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
            <ArrowRight className="w-4 h-4 text-primary-600" />
            <span className="text-sm text-primary-600 font-medium">How It Works</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            Three Simple Steps to
            <br />
            <span className="gradient-text">Better Oral Health</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get your oral health analysis in minutes. No appointments, no
            waiting rooms – just instant AI-powered insights.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-16 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative"
            >
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/4 left-full w-full h-0.5">
                  <div className="w-full h-full bg-gradient-to-r from-primary-300 to-transparent" />
                </div>
              )}

              <div className="card overflow-hidden">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />

                  {/* Step number */}
                  <div className="absolute bottom-4 left-4">
                    <span className="text-5xl font-display font-bold text-white/20">
                      {step.number}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
