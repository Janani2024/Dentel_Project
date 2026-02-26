"use client";

import { useState } from "react";
import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";
import HowItWorksSection from "@/components/how-it-works-section";
import AnalyzeSection from "@/components/analyze-section";
import HistorySection from "@/components/history-section";
import Footer from "@/components/footer";
import { type HistoryItem } from "@/lib/history-storage";

export default function Home() {
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null);

  const handleSelectHistory = (item: HistoryItem) => {
    setSelectedHistoryItem(item);
  };

  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <AnalyzeSection selectedHistoryItem={selectedHistoryItem} />
      <HistorySection onSelectHistory={handleSelectHistory} />
      <Footer />
    </main>
  );
}
