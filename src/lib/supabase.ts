import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface AnalysisHistory {
  id: string;
  created_at: string;
  image_url: string;
  health_score: number;
  primary_condition: string;
  analysis_data: Record<string, unknown>;
}

// Save analysis to history
export async function saveAnalysisToHistory(
  imageUrl: string,
  healthScore: number,
  primaryCondition: string,
  analysisData: Record<string, unknown>
): Promise<{ data: AnalysisHistory | null; error: Error | null }> {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log("Supabase not configured - skipping history save");
    return { data: null, error: null };
  }

  const { data, error } = await supabase
    .from("analysis_history")
    .insert([
      {
        image_url: imageUrl,
        health_score: healthScore,
        primary_condition: primaryCondition,
        analysis_data: analysisData,
      },
    ])
    .select()
    .single();

  return { data, error: error as Error | null };
}

// Get analysis history
export async function getAnalysisHistory(): Promise<{
  data: AnalysisHistory[] | null;
  error: Error | null;
}> {
  if (!supabaseUrl || !supabaseAnonKey) {
    return { data: [], error: null };
  }

  const { data, error } = await supabase
    .from("analysis_history")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  return { data, error: error as Error | null };
}

// Upload image to storage
export async function uploadImage(
  file: File
): Promise<{ url: string | null; error: Error | null }> {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a local object URL if Supabase isn't configured
    return { url: URL.createObjectURL(file), error: null };
  }

  const fileName = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("dental-images")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    return { url: null, error: error as Error };
  }

  const { data: urlData } = supabase.storage
    .from("dental-images")
    .getPublicUrl(fileName);

  return { url: urlData.publicUrl, error: null };
}
