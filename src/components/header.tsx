"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Menu, X, History } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg"
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <span className="font-display text-2xl font-bold">
              <span className="text-gray-900">Dental</span>
              <span className="gradient-text">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              How It Works
            </Link>
            <Link
              href="#history"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium flex items-center gap-1.5"
            >
              <History className="w-4 h-4" />
              History
            </Link>
            <Link
              href="#analyze"
              className="btn-primary px-6 py-2.5 rounded-full text-white font-medium"
            >
              Start Analysis
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-4 p-4 card"
          >
            <div className="flex flex-col gap-4">
              <Link
                href="#features"
                className="text-gray-700 hover:text-primary-600 transition-colors py-2 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-gray-700 hover:text-primary-600 transition-colors py-2 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="#history"
                className="text-gray-700 hover:text-primary-600 transition-colors py-2 font-medium flex items-center gap-1.5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <History className="w-4 h-4" />
                History
              </Link>
              <Link
                href="#analyze"
                className="btn-primary px-6 py-3 rounded-full text-white font-medium text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Start Analysis
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
