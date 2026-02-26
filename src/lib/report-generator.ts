import { AnalysisResult, conditionDetails } from "./dental-model";

export interface OralHealthReport {
  summary: string;
  healthScore: number;
  healthGrade: string;
  findings: Finding[];
  recommendations: string[];
  nextSteps: string[];
  disclaimer: string;
  generatedAt: string;
}

export interface Finding {
  condition: string;
  confidence: number;
  severity: "low" | "moderate" | "high";
  description: string;
  color: string;
}

export function generateOralHealthReport(
  analysis: AnalysisResult
): OralHealthReport {
  const healthGrade = getHealthGrade(analysis.overallHealth);
  const summary = generateSummary(analysis);
  const findings = generateFindings(analysis);
  const recommendations = generateRecommendations(analysis);
  const nextSteps = generateNextSteps(analysis);

  return {
    summary,
    healthScore: analysis.overallHealth,
    healthGrade,
    findings,
    recommendations,
    nextSteps,
    disclaimer: generateDisclaimer(),
    generatedAt: new Date().toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "short",
    }),
  };
}

function getHealthGrade(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Good";
  if (score >= 70) return "Fair";
  if (score >= 50) return "Needs Attention";
  return "Requires Dental Care";
}

function generateSummary(analysis: AnalysisResult): string {
  const primary = analysis.primaryCondition;
  const info = conditionDetails[primary];
  const score = analysis.overallHealth;
  const confidence = Math.round(
    analysis.conditions.find((c) => c.condition === primary)!.confidence * 100
  );

  // Healthy teeth detected
  if (primary === "healthy") {
    return `Great news! Your oral health analysis indicates your teeth are in ${
      score >= 90 ? "excellent" : "very good"
    } condition with an overall health score of ${score}/100 and ${confidence}% confidence. The AI analysis found no significant signs of dental disease. ${info.description} Continue maintaining your current oral hygiene routine!`;
  }

  // Problem conditions
  const urgentConditions = ["cavity", "gingivitis", "ulcer", "hypodontia"];
  const moderateConditions = ["calculus", "discoloration"];

  if (urgentConditions.includes(primary)) {
    const urgencyLevel =
      confidence >= 70 ? "strongly recommend" : "recommend considering";
    return `Your oral health analysis has detected potential signs of ${info.name.toLowerCase()} with ${confidence}% confidence. Your overall health score is ${score}/100, which indicates the need for professional dental evaluation. We ${urgencyLevel} scheduling a dental appointment soon. ${info.description}`;
  }

  if (moderateConditions.includes(primary)) {
    return `Your oral health analysis has detected ${info.name.toLowerCase()} with ${confidence}% confidence. Your overall health score is ${score}/100. ${info.description} Please review the detailed findings and recommendations below.`;
  }

  // Default case
  return `Your oral health analysis has detected ${info.name.toLowerCase()} with ${confidence}% confidence. Your overall health score is ${score}/100. ${info.description} Please review the detailed findings and recommendations below.`;
}

function generateFindings(analysis: AnalysisResult): Finding[] {
  // Only return the top predicted condition
  const primary = analysis.conditions[0];
  return [{
    condition: primary.info.name,
    confidence: Math.round(primary.confidence * 100),
    severity: primary.info.severity,
    description: primary.info.description,
    color: primary.info.color,
  }];
}

function generateRecommendations(analysis: AnalysisResult): string[] {
  const recommendations = new Set<string>();
  const primary = analysis.primaryCondition;

  // Add recommendations from primary condition
  const primaryInfo = conditionDetails[primary];
  if (primaryInfo) {
    primaryInfo.recommendations.forEach((rec) =>
      recommendations.add(rec)
    );
  }

  // Add recommendations from other detected conditions (confidence > 20%)
  analysis.conditions
    .filter(c => c.condition !== primary && c.confidence > 0.2)
    .forEach(({ condition, info }) => {
      info.recommendations.slice(0, 2).forEach((rec) =>
        recommendations.add(rec)
      );
    });

  // Add general recommendations
  recommendations.add("Brush your teeth twice daily for at least 2 minutes");
  recommendations.add("Maintain a balanced diet and limit sugary snacks");
  recommendations.add("Stay hydrated to promote saliva production");
  recommendations.add("Replace your toothbrush every 3-4 months");

  return Array.from(recommendations).slice(0, 10);
}

function generateNextSteps(analysis: AnalysisResult): string[] {
  const steps: string[] = [];
  const primary = analysis.primaryCondition;
  const primaryInfo = conditionDetails[primary];

  // Healthy teeth
  if (primary === "healthy") {
    steps.push("Continue your excellent oral hygiene routine - you're doing great!");
    steps.push("Keep brushing twice daily and flossing daily");
    steps.push("Schedule your next routine dental check-up in 6 months");
    steps.push("Maintain a balanced diet and limit sugary snacks");
    steps.push(primaryInfo.urgency);
    steps.push("Save or download this report for your records");
    return steps;
  }

  // Problem conditions that need immediate attention
  const urgentConditions = ["cavity", "gingivitis", "ulcer", "hypodontia"];
  if (urgentConditions.includes(primary)) {
    steps.push(
      "Schedule an appointment with a dental professional within the next 1-2 weeks"
    );
    steps.push("Bring this report to your dental visit for reference");
    if (primary === "cavity") {
      steps.push(
        "Avoid hard, sticky, or very cold/hot foods until evaluated by a dentist"
      );
      steps.push("Use fluoride toothpaste and mouthwash for added protection");
    } else if (primary === "hypodontia") {
      steps.push("Consult with a prosthodontist or oral surgeon for treatment options");
      steps.push("Maintain excellent oral hygiene for remaining teeth");
    }
  } 
  // Moderate conditions
  else if (primary === "calculus") {
    steps.push(
      "Schedule a dental consultation within the next month for professional cleaning"
    );
    steps.push("Bring this report to your dental visit for reference");
    steps.push("Improve daily brushing technique, especially along the gum line");
  }
  // Cosmetic or minor conditions
  else if (primary === "discoloration") {
    steps.push("Consider professional teeth whitening if desired");
    steps.push("Reduce consumption of staining foods and drinks");
    steps.push("Schedule a cosmetic consultation at your convenience");
  }
  // High health score scenarios
  else if (analysis.overallHealth >= 80) {
    steps.push("Continue your excellent oral hygiene routine");
    steps.push("Schedule your next routine dental check-up in 6 months");
    steps.push("Consider professional cleaning for optimal dental health");
  } else {
    steps.push(
      "Consider scheduling a dental check-up within the next month for confirmation"
    );
    steps.push("Monitor your oral health and note any changes or sensitivity");
    steps.push("Maintain consistent brushing and flossing habits");
  }

  steps.push(primaryInfo.urgency);
  steps.push("Save or download this report for your records");
  steps.push("Take follow-up photos in 2-4 weeks to track any changes");

  return steps;
}

function generateDisclaimer(): string {
  return "DISCLAIMER: This AI-powered analysis is for informational and screening purposes only. It should NOT be considered a substitute for professional dental diagnosis, advice, or treatment. The analysis is based on image recognition technology which has inherent limitations and may not detect all dental conditions. Always consult with a qualified dental professional for accurate diagnosis and treatment recommendations. If you are experiencing dental pain, bleeding, swelling, or other symptoms, please seek professional care immediately. Early detection and treatment of dental issues leads to better outcomes.";
}

// Generate PDF report content
export function generatePDFContent(report: OralHealthReport): string {
  return `
DENTAL HEALTH ANALYSIS REPORT
Generated: ${report.generatedAt}
═══════════════════════════════════════════════════════════════════

OVERALL HEALTH SCORE: ${report.healthScore}/100 (${report.healthGrade})

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY
───────────────────────────────────────────────────────────────────
${report.summary}

DETAILED FINDINGS
───────────────────────────────────────────────────────────────────
${report.findings
  .map(
    (f, i) =>
      `${i + 1}. ${f.condition}
   Confidence: ${f.confidence}%
   Severity: ${f.severity.toUpperCase()}
   
   ${f.description}`
  )
  .join("\n\n")}

RECOMMENDATIONS
───────────────────────────────────────────────────────────────────
${report.recommendations.map((r, i) => `${i + 1}. ${r}`).join("\n")}

NEXT STEPS
───────────────────────────────────────────────────────────────────
${report.nextSteps.map((s, i) => `${i + 1}. ${s}`).join("\n")}

═══════════════════════════════════════════════════════════════════
IMPORTANT NOTICE
═══════════════════════════════════════════════════════════════════
${report.disclaimer}

═══════════════════════════════════════════════════════════════════

Powered by DentalAI - AI-Powered Dental Disease Detection
For screening purposes only. Always consult a dental professional.
  `;
}
