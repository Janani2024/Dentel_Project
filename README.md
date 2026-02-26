# DentalAI - Oral Health Analysis

AI-powered dental disease detection and comprehensive oral health analysis platform built with Next.js 15, TensorFlow.js, and Supabase.

![DentalAI Preview](https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1200&h=600&fit=crop)

## Features

- **AI-Powered Analysis**: Advanced image analysis using TensorFlow.js to detect dental conditions
- **Multi-Condition Detection**: Identifies 8+ conditions including:
  - Cavities (Dental Caries)
  - Gingivitis
  - Periodontitis
  - Oral Ulcers
  - Tooth Discoloration
  - Plaque Buildup
  - Calculus (Tartar)
- **Comprehensive Reports**: Detailed oral health reports with findings, severity levels, and recommendations
- **Health Score**: Overall oral health score with personalized grade
- **Downloadable Reports**: Export your analysis as a text report
- **Privacy Focused**: Images processed locally in the browser

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI/ML**: TensorFlow.js
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Database** (Optional): Supabase

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/dental-disease-detection.git
cd dental-disease-detection
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Set up Supabase for image storage:
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Supabase Setup (Optional)

If you want to enable image storage and analysis history:

1. Create a new Supabase project
2. Run the following SQL to create the required tables:

```sql
-- Create analysis history table
CREATE TABLE analysis_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  image_url TEXT,
  health_score INTEGER,
  primary_condition TEXT,
  analysis_data JSONB
);

-- Create storage bucket for dental images
INSERT INTO storage.buckets (id, name, public)
VALUES ('dental-images', 'dental-images', true);

-- Set up storage policies
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'dental-images');

CREATE POLICY "Upload Access" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'dental-images');
```

## Usage

1. Navigate to the "Start Analysis" section
2. Upload a clear image of your teeth
3. Wait for the AI to analyze the image
4. Review your comprehensive oral health report
5. Download the report for your records

## Tips for Best Results

- Use good lighting (natural light works best)
- Capture clear, focused images of your teeth
- Include both upper and lower teeth if possible
- Avoid blurry or dark images

## Disclaimer

This AI-powered tool is for informational purposes only and is not a substitute for professional dental care. Always consult with a qualified dental professional for accurate diagnosis and treatment recommendations. If you experience dental pain or emergencies, seek immediate professional care.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
