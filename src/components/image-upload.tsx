"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Camera, X, Loader2, AlertCircle, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  isAnalyzing: boolean;
  mode?: "photo" | "xray";
}

export default function ImageUpload({
  onImageSelect,
  isAnalyzing,
  mode = "photo",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      const file = acceptedFiles[0];

      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file (JPG, PNG, WebP)");
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("Image size should be less than 10MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreview(result);
        onImageSelect(file, result);
      };
      reader.readAsDataURL(file);
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    disabled: isAnalyzing,
  });

  const clearImage = () => {
    setPreview(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div
              {...getRootProps()}
              className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer bg-white ${
                isDragActive
                  ? "border-primary-400 bg-primary-50 scale-[1.02]"
                  : "border-gray-300 hover:border-primary-400 hover:bg-primary-50/50"
              } ${isAnalyzing ? "pointer-events-none opacity-50" : ""}`}
            >
              <div className="p-12 text-center">
                <motion.div
                  animate={{
                    y: isDragActive ? -10 : 0,
                  }}
                  className="mb-6"
                >
                  <div className="relative mx-auto w-24 h-24">
                    <motion.div
                      animate={{
                        scale: isDragActive ? 1.1 : 1,
                      }}
                      className="absolute inset-0 rounded-full bg-primary-100 blur-xl"
                    />
                    <div className="relative w-24 h-24 rounded-full gradient-primary flex items-center justify-center shadow-lg">
                      {isDragActive ? (
                        <Upload className="w-10 h-10 text-white animate-bounce" />
                      ) : (
                        <Camera className="w-10 h-10 text-white" />
                      )}
                    </div>
                  </div>
                </motion.div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {isDragActive
                    ? "Drop your image here"
                    : mode === "xray"
                    ? "Upload Dental X-Ray"
                    : "Upload Oral Image"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {mode === "xray"
                    ? "Drag and drop or click to select a dental X-ray image"
                    : "Drag and drop or click to select an image of your teeth"}
                </p>

                <input {...getInputProps()} />

                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <ImageIcon className="w-4 h-4" />
                    JPG, PNG, WebP
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-400" />
                  <span>Max 10MB</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 p-4 card"
            >
              <h4 className="text-sm font-medium text-primary-600 mb-2">
                Tips for best results:
              </h4>
              {mode === "xray" ? (
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Use OPG (panoramic) or periapical dental X-rays</li>
                  <li>• Ensure the X-ray image is clear and not cropped</li>
                  <li>• Digital X-rays work best (photos of printed X-rays may reduce accuracy)</li>
                  <li>• Standard dental radiograph formats (JPG, PNG) are supported</li>
                </ul>
              ) : (
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Use good lighting - natural light works best</li>
                  <li>• Capture clear, focused images of your teeth</li>
                  <li>• Include both upper and lower teeth if possible</li>
                  <li>• Avoid blurry or dark images</li>
                </ul>
              )}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden card">
              {/* Preview Image */}
              <div className="relative aspect-[4/3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Selected dental image"
                  className="w-full h-full object-cover"
                />

                {/* Scanning overlay when analyzing */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center">
                    <div className="absolute inset-0 overflow-hidden">
                      <motion.div
                        initial={{ y: "-100%" }}
                        animate={{ y: "100%" }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-full h-1 bg-gradient-to-r from-transparent via-primary-400 to-transparent"
                      />
                    </div>
                    <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                    <p className="text-gray-900 font-medium">Analyzing image...</p>
                    <p className="text-gray-600 text-sm mt-1">
                      {mode === "xray"
                        ? "AI is analyzing your dental X-ray"
                        : "AI is examining your oral health"}
                    </p>
                  </div>
                )}
              </div>

              {/* Clear button */}
              {!isAnalyzing && (
                <button
                  onClick={clearImage}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </motion.div>
      )}
    </div>
  );
}
