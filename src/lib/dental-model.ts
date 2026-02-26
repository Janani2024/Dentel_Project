import * as tf from "@tensorflow/tfjs";

// Analysis mode: photo (oral camera) or xray (dental radiograph)
export type AnalysisMode = "photo" | "xray";

// Multiclass dental condition types (including "healthy" for no disease detected)
export type DentalCondition =
  | "healthy"
  | "calculus"
  | "cavity"
  | "discoloration"
  | "gingivitis"
  | "hypodontia"
  | "ulcer"
  | "caries"
  | "impacted_teeth"
  | "fractured_teeth"
  | "infection"
  | "bdc_bdr"
  | "healthy_teeth";

export interface ConditionInfo {
  name: string;
  description: string;
  severity: "low" | "moderate" | "high";
  color: string;
  recommendations: string[];
  urgency: string;
}

// Condition details for multiclass classification
// Model now has 7 classes including "healthy" - trained with real healthy teeth images
export const conditionDetails: Record<DentalCondition, ConditionInfo> = {
  healthy: {
    name: "Healthy Teeth",
    description:
      "Great news! Your teeth appear to be in good health. No significant dental conditions were detected in the analysis.",
    severity: "low",
    color: "#10b981", // Green
    recommendations: [
      "Continue your excellent oral hygiene routine",
      "Brush twice daily for at least 2 minutes",
      "Floss daily to maintain healthy gums",
      "Visit your dentist for regular check-ups every 6 months",
      "Maintain a balanced diet and limit sugary snacks",
      "Replace your toothbrush every 3-4 months",
    ],
    urgency: "Continue routine dental check-ups every 6 months.",
  },
  calculus: {
    name: "Dental Calculus (Tartar)",
    description:
      "Hardened plaque (calculus or tartar) has been detected on your teeth. Calculus cannot be removed by brushing alone and requires professional dental cleaning.",
    severity: "moderate",
    color: "#f59e0b",
    recommendations: [
      "Schedule a professional dental cleaning (scaling) within 2-4 weeks",
      "Improve daily brushing technique, especially along the gum line",
      "Use tartar-control toothpaste",
      "Floss daily to prevent further buildup",
      "Consider using an electric toothbrush for better plaque removal",
      "Regular dental cleanings every 6 months are essential",
    ],
    urgency: "Professional cleaning recommended within 2-4 weeks.",
  },
  cavity: {
    name: "Dental Cavity (Caries)",
    description:
      "The analysis suggests possible dental caries (cavity) in the visible teeth. Cavities are permanently damaged areas in the tooth enamel that require professional treatment.",
    severity: "moderate",
    color: "#ef4444",
    recommendations: [
      "Schedule a dental appointment within 1-2 weeks for professional evaluation",
      "Avoid very sweet, hot, or cold foods that may increase sensitivity",
      "Use fluoride toothpaste to help protect remaining enamel",
      "Reduce sugar intake between meals to slow further decay",
      "Rinse with salt water to help reduce oral bacteria",
    ],
    urgency: "Dental visit recommended within 1–2 weeks.",
  },
  discoloration: {
    name: "Tooth Discoloration",
    description:
      "Tooth discoloration or staining has been detected. This can be caused by various factors including food/drink stains, medication, or underlying dental issues.",
    severity: "low",
    color: "#8b5cf6",
    recommendations: [
      "Schedule a dental consultation to determine the cause",
      "Maintain good oral hygiene with regular brushing and flossing",
      "Consider professional teeth whitening if appropriate",
      "Limit consumption of staining foods and drinks (coffee, tea, wine)",
      "Use whitening toothpaste as part of your routine",
      "Avoid smoking, which can cause severe discoloration",
    ],
    urgency: "Routine dental consultation recommended.",
  },
  gingivitis: {
    name: "Gingivitis (Gum Inflammation)",
    description:
      "Signs of gingivitis (gum inflammation) have been detected. This is an early stage of gum disease that can be reversed with proper care.",
    severity: "moderate",
    color: "#f97316",
    recommendations: [
      "Schedule a dental appointment for professional evaluation and cleaning",
      "Improve daily oral hygiene - brush twice daily and floss daily",
      "Use an antiseptic mouthwash to reduce bacteria",
      "Consider using a soft-bristled toothbrush to avoid further irritation",
      "Massage gums gently while brushing to improve circulation",
      "Avoid smoking, which worsens gum disease",
    ],
    urgency: "Dental visit recommended within 2-3 weeks.",
  },
  hypodontia: {
    name: "Hypodontia (Missing Teeth)",
    description:
      "Missing teeth (hypodontia) have been detected. This condition may be congenital or acquired and may require dental intervention depending on the extent.",
    severity: "high",
    color: "#dc2626",
    recommendations: [
      "Schedule a dental consultation with a prosthodontist or oral surgeon",
      "Discuss treatment options such as dental implants, bridges, or dentures",
      "Maintain excellent oral hygiene for remaining teeth",
      "Consider orthodontic evaluation if multiple teeth are missing",
      "Regular dental check-ups to monitor oral health",
    ],
    urgency: "Dental consultation recommended as soon as possible.",
  },
  ulcer: {
    name: "Mouth Ulcer",
    description:
      "Mouth ulcers or sores have been detected. These can be caused by various factors including trauma, infection, or underlying health conditions.",
    severity: "moderate",
    color: "#e11d48",
    recommendations: [
      "Schedule a dental or medical consultation if ulcers persist more than 2 weeks",
      "Avoid spicy, acidic, or rough foods that may irritate the ulcers",
      "Maintain gentle oral hygiene to prevent infection",
      "Use a soft-bristled toothbrush",
      "Consider over-the-counter topical treatments for pain relief",
      "Monitor for signs of infection (increased pain, swelling, fever)",
    ],
    urgency: "Medical consultation recommended if ulcers persist beyond 2 weeks.",
  },
  // X-ray model conditions
  caries: {
    name: "Dental Caries",
    description:
      "Dental caries (tooth decay) has been detected in the X-ray. This appears as dark areas within the tooth structure indicating mineral loss and cavity formation.",
    severity: "moderate",
    color: "#ef4444",
    recommendations: [
      "Schedule a dental appointment for professional evaluation and treatment",
      "A filling or crown may be required depending on the extent of decay",
      "Use fluoride toothpaste and mouthwash to prevent further decay",
      "Reduce sugar intake between meals",
      "Regular dental check-ups every 6 months",
    ],
    urgency: "Dental visit recommended within 1-2 weeks.",
  },
  impacted_teeth: {
    name: "Impacted Tooth",
    description:
      "An impacted tooth has been detected in the X-ray. This tooth is unable to fully erupt through the gum line, often due to lack of space or abnormal positioning.",
    severity: "high",
    color: "#dc2626",
    recommendations: [
      "Consult an oral surgeon for evaluation",
      "Surgical extraction may be necessary to prevent complications",
      "Monitor for pain, swelling, or infection around the impacted area",
      "Keep the area clean to prevent pericoronitis",
      "Follow up with regular panoramic X-rays to monitor changes",
    ],
    urgency: "Oral surgery consultation recommended soon.",
  },
  fractured_teeth: {
    name: "Fractured Tooth",
    description:
      "A tooth fracture has been detected in the X-ray. The fracture line may extend through the enamel, dentin, or into the root depending on severity.",
    severity: "high",
    color: "#b91c1c",
    recommendations: [
      "Seek immediate dental care to prevent further damage",
      "Avoid chewing on the affected side",
      "Treatment may include bonding, crown, or root canal depending on severity",
      "If the root is fractured, extraction may be necessary",
      "Take over-the-counter pain relief if needed",
    ],
    urgency: "Dental visit recommended as soon as possible.",
  },
  infection: {
    name: "Dental Infection",
    description:
      "Signs of dental infection have been detected in the X-ray. This may appear as a dark area around the root tip (periapical abscess) indicating bacterial infection.",
    severity: "high",
    color: "#991b1b",
    recommendations: [
      "Seek urgent dental care - infections can spread if untreated",
      "Antibiotics may be prescribed to control the infection",
      "Root canal treatment or extraction may be necessary",
      "Do not ignore persistent pain or swelling",
      "Warm salt water rinses can help manage symptoms temporarily",
    ],
    urgency: "Urgent dental visit recommended within 24-48 hours.",
  },
  bdc_bdr: {
    name: "Broken Down Crown/Root",
    description:
      "A broken down crown or root (BDC/BDR) has been detected. The tooth structure has significantly deteriorated and may only have root remnants remaining.",
    severity: "high",
    color: "#7f1d1d",
    recommendations: [
      "Consult a dentist for evaluation of the remaining tooth structure",
      "Extraction is often necessary for severely broken down teeth",
      "Discuss replacement options: implant, bridge, or denture",
      "Keep the area clean to prevent infection",
      "Do not delay treatment as remaining roots can become infected",
    ],
    urgency: "Dental consultation recommended within 1 week.",
  },
  healthy_teeth: {
    name: "Healthy Teeth (X-ray)",
    description:
      "The X-ray shows healthy teeth with no significant abnormalities detected. Tooth structure, roots, and surrounding bone appear normal.",
    severity: "low",
    color: "#10b981",
    recommendations: [
      "Continue your excellent oral hygiene routine",
      "Maintain regular dental check-ups every 6 months",
      "Continue brushing twice daily and flossing",
      "Periodic X-rays help catch issues early",
    ],
    urgency: "Continue routine dental check-ups every 6 months.",
  },
};

// Model configurations per mode
const MODEL_CONFIGS: Record<
  AnalysisMode,
  { path: string; classNamesPath: string; defaultClasses: DentalCondition[] }
> = {
  photo: {
    path: "/models/dental/model.json",
    classNamesPath: "/models/dental/class_names.json",
    defaultClasses: ["calculus", "cavity", "discoloration", "gingivitis", "healthy", "hypodontia", "ulcer"],
  },
  xray: {
    path: "/models/dental-xray/model.json",
    classNamesPath: "/models/dental-xray/class_names.json",
    defaultClasses: ["bdc_bdr", "caries", "fractured_teeth", "healthy_teeth", "impacted_teeth", "infection"],
  },
};

// X-ray class name mapping (dataset folder names → DentalCondition keys)
const XRAY_CLASS_MAP: Record<string, DentalCondition> = {
  "BDC-BDR": "bdc_bdr",
  "Caries": "caries",
  "Fractured Teeth": "fractured_teeth",
  "Healthy Teeth": "healthy_teeth",
  "Impacted teeth": "impacted_teeth",
  "Infection": "infection",
};

// Current mode
let currentMode: AnalysisMode = "photo";
let CLASS_NAMES: DentalCondition[] = MODEL_CONFIGS.photo.defaultClasses;

// Load class names from JSON file for the given mode
async function loadClassNames(mode: AnalysisMode): Promise<DentalCondition[]> {
  const config = MODEL_CONFIGS[mode];
  try {
    const response = await fetch(config.classNamesPath);
    if (response.ok) {
      const names: string[] = await response.json();
      // Map class names to DentalCondition keys
      const mappedNames = names.map((name) => {
        if (mode === "xray" && XRAY_CLASS_MAP[name]) return XRAY_CLASS_MAP[name];
        return name.toLowerCase().replace(/\s+/g, "_") as DentalCondition;
      });
      const validNames = mappedNames.filter((name) =>
        Object.keys(conditionDetails).includes(name)
      );
      if (validNames.length > 0) {
        CLASS_NAMES = validNames;
        console.log(`Loaded ${mode} class names:`, CLASS_NAMES);
      }
    }
  } catch (error) {
    console.warn(`Could not load class_names.json for ${mode}, using defaults:`, error);
    CLASS_NAMES = config.defaultClasses;
  }
  return CLASS_NAMES;
}

export function setAnalysisMode(mode: AnalysisMode): void {
  if (mode !== currentMode) {
    currentMode = mode;
    // Reset model state so it reloads for the new mode
    model = null;
    modelLoading = null;
    classNamesLoaded = false;
    CLASS_NAMES = MODEL_CONFIGS[mode].defaultClasses;
    console.log(`Switched to ${mode} analysis mode`);
  }
}

export function getAnalysisMode(): AnalysisMode {
  return currentMode;
}

export interface AnalysisResult {
  conditions: {
    condition: DentalCondition;
    confidence: number; // 0–1
    info: ConditionInfo;
  }[];
  overallHealth: number; // 0–100
  primaryCondition: DentalCondition;
  analysisTimestamp: string;
  imageQuality: "good" | "fair" | "poor";
}

// Model singleton
let model: tf.GraphModel | null = null;
let modelLoading: Promise<tf.GraphModel> | null = null;
let classNamesLoaded = false;

/**
 * Load the trained multiclass dental disease detection model.
 * The model should be placed in public/models/dental/model.json
 */
async function loadModel(): Promise<tf.GraphModel> {
  if (model) return model;
  if (modelLoading) return modelLoading;

  modelLoading = (async () => {
    try {
      // Load class names first
      if (!classNamesLoaded) {
        await loadClassNames(currentMode);
        classNamesLoaded = true;
      }

      console.log(
        `Loading multiclass dental disease detection model (${CLASS_NAMES.length} classes)...`
      );
      const loadedModel = await tf.loadGraphModel(MODEL_CONFIGS[currentMode].path);
      console.log("Model loaded successfully!");
      model = loadedModel;
      return loadedModel;
    } catch (error) {
      console.warn("Trained model not found:", error);
      throw new Error(
        "Model not found. Please convert and place the TensorFlow.js model in public/models/dental."
      );
    }
  })();

  return modelLoading;
}

/**
 * Preprocess image for model input (224x224).
 * The model has built-in preprocessing (mobilenet_v3.preprocess_input),
 * so we only resize and pass raw pixel values [0, 255] as float32.
 */
function preprocessImage(imageElement: HTMLImageElement): tf.Tensor4D {
  return tf.tidy(() => {
    const tensor = tf.browser.fromPixels(imageElement);
    const resized = tf.image.resizeBilinear(tensor, [224, 224]);
    const floatTensor = resized.toFloat();
    return floatTensor.expandDims(0) as tf.Tensor4D;
  });
}

/**
 * Fallback analysis when the trained model is not available.
 * Uses simple image analysis as a heuristic.
 */
async function fallbackAnalysis(
  imageElement: HTMLImageElement
): Promise<AnalysisResult> {
  console.log("Using fallback multiclass analysis (no trained model)...");

  const tensor = tf.browser
    .fromPixels(imageElement)
    .resizeNearestNeighbor([224, 224])
    .toFloat()
    .div(tf.scalar(255));

  const data = await tensor.data();
  tensor.dispose();

  let totalR = 0,
    totalG = 0,
    totalB = 0;
  let count = 0;
  let darkPixels = 0;
  let redPixels = 0;

  for (let i = 0; i < data.length; i += 3) {
    totalR += data[i];
    totalG += data[i + 1];
    totalB += data[i + 2];
    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
    if (brightness < 0.3) darkPixels++;
    if (data[i] > data[i + 1] + 0.2 && data[i] > data[i + 2] + 0.2)
      redPixels++;
    count++;
  }

  const avgR = totalR / count;
  const avgG = totalG / count;
  const avgB = totalB / count;
  const brightness = (avgR + avgG + avgB) / 3;
  const darkRatio = darkPixels / count;
  const redRatio = redPixels / count;

  // Heuristic probabilities for each class
  const probabilities: number[] = new Array(CLASS_NAMES.length).fill(0.1);

  // Cavity: dark areas
  if (darkRatio > 0.15) {
    probabilities[CLASS_NAMES.indexOf("cavity")] = Math.min(0.4, darkRatio * 2);
  }

  // Gingivitis/Ulcer: red areas
  if (redRatio > 0.1) {
    const redProb = Math.min(0.35, redRatio * 3);
    probabilities[CLASS_NAMES.indexOf("gingivitis")] = redProb * 0.6;
    probabilities[CLASS_NAMES.indexOf("ulcer")] = redProb * 0.4;
  }

  // Discoloration: uneven color distribution
  if (Math.abs(avgR - avgG) > 0.1 || Math.abs(avgG - avgB) > 0.1) {
    probabilities[CLASS_NAMES.indexOf("discoloration")] = 0.3;
  }

  // Normalize probabilities
  const sum = probabilities.reduce((a, b) => a + b, 0);
  for (let i = 0; i < probabilities.length; i++) {
    probabilities[i] = probabilities[i] / sum;
  }

  return processModelOutput(probabilities, brightness);
}

/**
 * Convert probabilities into an AnalysisResult.
 * The model now has a native "healthy" class, so we use its predictions directly.
 */
function processModelOutput(
  probabilities: number[],
  brightness: number = 0.5
): AnalysisResult {
  // Ensure we have probabilities for all classes
  if (probabilities.length !== CLASS_NAMES.length) {
    console.warn(
      `Mismatch: model output has ${probabilities.length} classes, expected ${CLASS_NAMES.length}`
    );
    // Pad or truncate as needed
    while (probabilities.length < CLASS_NAMES.length) {
      probabilities.push(0);
    }
    probabilities = probabilities.slice(0, CLASS_NAMES.length);
    // Renormalize
    const sum = probabilities.reduce((a, b) => a + b, 0);
    if (sum > 0) {
      for (let i = 0; i < probabilities.length; i++) {
        probabilities[i] = probabilities[i] / sum;
      }
    }
  }

  // Build conditions list from model output - model now includes "healthy" class
  const conditions = CLASS_NAMES.map((condition, index) => ({
    condition,
    confidence: Math.round(probabilities[index] * 100) / 100,
    info: conditionDetails[condition],
  })).sort((a, b) => b.confidence - a.confidence);

  const primaryCondition = conditions[0].condition;
  const primaryConfidence = conditions[0].confidence;

  // Overall health score (0–100)
  let overallHealth: number;
  
  // Check if model predicted "healthy" as primary (photo: "healthy", xray: "healthy_teeth")
  const healthyKey = currentMode === "xray" ? "healthy_teeth" : "healthy";
  const healthyIndex = CLASS_NAMES.indexOf(healthyKey);
  const healthyConfidence = healthyIndex >= 0 ? probabilities[healthyIndex] : 0;
  const isHealthy = primaryCondition === "healthy" || primaryCondition === "healthy_teeth";

  if (isHealthy) {
    overallHealth = Math.round(70 + healthyConfidence * 30);
  } else {
    const highSeverityConditions = [
      "cavity", "hypodontia", "ulcer", "gingivitis",
      "caries", "impacted_teeth", "fractured_teeth", "infection", "bdc_bdr",
    ];
    const isHighSeverity = highSeverityConditions.includes(primaryCondition);
    const baseScore = healthyConfidence * 50 + (1 - primaryConfidence) * 30;
    const severityPenalty = isHighSeverity ? 20 : 10;
    overallHealth = Math.max(15, Math.min(75, Math.round(baseScore + 20 - severityPenalty)));
  }

  // Image quality based on brightness
  let imageQuality: "good" | "fair" | "poor" = "good";
  if (brightness < 0.2 || brightness > 0.9) imageQuality = "poor";
  else if (brightness < 0.3 || brightness > 0.8) imageQuality = "fair";

  console.log(`Analysis: primary=${primaryCondition} (${(primaryConfidence * 100).toFixed(1)}%), healthy=${(healthyConfidence * 100).toFixed(1)}%, score=${overallHealth}`);

  return {
    conditions,
    overallHealth,
    primaryCondition,
    analysisTimestamp: new Date().toISOString(),
    imageQuality,
  };
}

/**
 * Analyze a dental image with the trained multiclass classifier.
 */
export async function analyzeDentalImage(
  imageElement: HTMLImageElement
): Promise<AnalysisResult> {
  await tf.ready();

  // Ensure class names are loaded
  if (!classNamesLoaded) {
    await loadClassNames(currentMode);
    classNamesLoaded = true;
  }

  try {
    const loadedModel = await loadModel();
    const inputTensor = preprocessImage(imageElement);
    const predictions = loadedModel.predict(inputTensor) as tf.Tensor;
    let probabilities = Array.from(await predictions.data());
    inputTensor.dispose();
    predictions.dispose();

    // Check if outputs are already probabilities (sum ~1) or logits
    const sum = probabilities.reduce((a, b) => a + b, 0);
    if (Math.abs(sum - 1.0) > 0.1) {
      // Outputs are logits, apply softmax manually
      const maxVal = Math.max(...probabilities);
      const expVals = probabilities.map((v) => Math.exp(v - maxVal));
      const expSum = expVals.reduce((a, b) => a + b, 0);
      probabilities = expVals.map((v) => v / expSum);
    }

    // brightness for quality
    const brightnessTensor = tf.browser.fromPixels(imageElement).mean();
    const brightness = (await brightnessTensor.data())[0] / 255;
    brightnessTensor.dispose();

    return processModelOutput(probabilities, brightness);
  } catch (error) {
    console.warn("Model inference failed, falling back to heuristic:", error);
    return fallbackAnalysis(imageElement);
  }
}

/**
 * Detect whether an image looks like an X-ray or a regular photo.
 * Uses multiple heuristics: saturation, color channel difference, and grayscale ratio.
 * X-rays are nearly grayscale with dark backgrounds; photos have color.
 * Returns "xray" or "photo".
 */
export function detectImageType(imageElement: HTMLImageElement): "xray" | "photo" {
  const canvas = document.createElement("canvas");
  const size = 100; // downsample for speed
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(imageElement, 0, 0, size, size);
  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;

  let totalSaturation = 0;
  let grayscalePixels = 0;
  let redPixels = 0; // pixels with strong red/pink tone (gums, lips — only in real photos)
  let pixelCount = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Nearly grayscale: all channels within 25 of each other
    if (Math.abs(r - g) < 25 && Math.abs(g - b) < 25 && Math.abs(r - b) < 25) {
      grayscalePixels++;
    }

    // Strong red/pink pixel — characteristic of gums, lips, tongue in dental photos
    if (r > 140 && r > g + 30 && r > b + 30) {
      redPixels++;
    }

    // HSL saturation
    const rn = r / 255, gn = g / 255, bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const l = (max + min) / 2;
    const sat = max === min ? 0 : l > 0.5
      ? (max - min) / (2 - max - min)
      : (max - min) / (max + min);
    totalSaturation += sat;
    pixelCount++;
  }

  const avgSaturation = totalSaturation / pixelCount;
  const grayscaleRatio = grayscalePixels / pixelCount;
  const redRatio = redPixels / pixelCount;

  console.log(`Image type detection: saturation=${avgSaturation.toFixed(4)}, grayscaleRatio=${grayscaleRatio.toFixed(4)}, redRatio=${redRatio.toFixed(4)}`);

  // Dental photos ALWAYS have significant red/pink pixels (gums, lips) and high saturation.
  // X-rays are mostly grayscale even if they have a slight color tint from scanning.
  // A photo is identified by strong red presence OR very high saturation.
  // Everything else is treated as an X-ray.
  const isPhoto = redRatio > 0.06 || avgSaturation > 0.30;

  return isPhoto ? "photo" : "xray";
}

export async function isModelAvailable(): Promise<boolean> {
  try {
    await loadModel();
    return true;
  } catch {
    return false;
  }
}

export function getModelInfo(): {
  loaded: boolean;
  classNames: string[];
  inputShape: number[];
} {
  return {
    loaded: model !== null,
    classNames: CLASS_NAMES,
    inputShape: [224, 224, 3],
  };
}
