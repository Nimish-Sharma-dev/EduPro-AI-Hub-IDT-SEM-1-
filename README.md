# Unified Smart Productivity Suite

A production-ready full-stack AI-powered productivity application featuring 5 intelligent modules built with Next.js 15, React, TypeScript, TailwindCSS, ShadCN UI, Supabase, and LLM integration.

## 🚀 Features

### 1. **AI Notes Summarizer**
- Upload PDF, TXT, or DOCX files
- Extract text automatically
- Generate AI-powered summaries
- Download summaries as text files

### 2. **AI Flashcard Generator**
- Convert notes into Q&A flashcards
- Support for text input or file upload
- Interactive flip-card UI with 3D animations
- Export flashcards for studying

### 3. **AI Resume Analyzer**
- Upload and analyze resumes
- Get scored feedback (0-100)
- Receive strengths, weaknesses, and suggestions
- Download comprehensive analysis reports

### 4. **Portfolio Generator**
- Create professional portfolio websites
- Fill out a simple form with your information
- Generate complete HTML/CSS portfolio
- Download as a ZIP file ready for deployment

### 5. **Chat with Website**
- Input any website URL
- Scrape and extract content
- Chat with the content using AI
- Get context-aware answers

## 📋 Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- OpenAI API key OR LM Studio running locally

## 🛠️ Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd unified-productivity-suite
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   copy .env.example .env.local
   ```

   Edit `.env.local` and fill in your credentials:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # LLM Configuration (Choose one)
   # Option 1: OpenAI API
   OPENAI_API_KEY=your_openai_api_key
   OPENAI_MODEL=gpt-4-turbo-preview

   # Option 2: LM Studio (Local)
   LM_STUDIO_URL=http://localhost:1234/v1
   LM_STUDIO_MODEL=local-model

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   LLM_PROVIDER=openai  # or 'lmstudio'
   ```

4. **Set up Supabase:**

   a. Create a new project at [supabase.com](https://supabase.com)
   
   b. Go to SQL Editor in your Supabase dashboard
   
   c. Run the SQL schema from `supabase/schema.sql`
   
   d. Copy your project URL and anon key to `.env.local`

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Project Structure

```
unified-productivity-suite/
├── app/
│   ├── (dashboard)/          # Protected dashboard routes
│   │   ├── dashboard/        # Main dashboard
│   │   ├── notes-summarizer/ # Notes module
│   │   ├── flashcards/       # Flashcards module
│   │   ├── resume-analyzer/  # Resume module
│   │   ├── portfolio-generator/ # Portfolio module
│   │   └── chat-website/     # Chat module
│   ├── api/                  # API routes
│   │   ├── summarize/
│   │   ├── generate-flashcards/
│   │   ├── analyze-resume/
│   │   ├── generate-portfolio/
│   │   ├── scrape-website/
│   │   └── chat-website/
│   ├── login/                # Login page
│   ├── signup/               # Signup page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Landing page
│   └── globals.css           # Global styles
├── components/
│   ├── ui/                   # ShadCN UI components
│   ├── file-upload.tsx       # File upload component
│   ├── flashcard.tsx         # Flashcard component
│   └── navigation.tsx        # Navigation sidebar
├── lib/
│   ├── supabase/             # Supabase clients
│   ├── llm.ts                # LLM service
│   ├── portfolio-templates.ts # Portfolio templates
│   └── utils.ts              # Utility functions
├── utils/
│   ├── file-processors.ts    # File extraction utilities
│   └── web-scraper.ts        # Web scraping utility
└── supabase/
    └── schema.sql            # Database schema
```

## 🔧 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **UI Components:** ShadCN UI
- **Authentication & Database:** Supabase
- **AI/LLM:** OpenAI API / LM Studio
- **File Processing:** pdf-parse, mammoth
- **Web Scraping:** Cheerio
- **File Generation:** JSZip

## 🎨 Features Highlights

- **Fully Responsive:** Works on desktop, tablet, and mobile
- **Clean UI:** Modern, minimal design with ShadCN components
- **Type-Safe:** Full TypeScript implementation
- **Secure:** Supabase Row Level Security (RLS)
- **Error Handling:** Comprehensive error handling and loading states
- **Real-time Feedback:** Toast notifications for user actions
- **File Support:** PDF, DOCX, TXT file processing
- **Downloadable Outputs:** Export summaries, flashcards, and portfolios

## 📝 Usage

### Notes Summarizer
1. Navigate to "Notes Summarizer"
2. Upload a PDF, TXT, or DOCX file
3. Click "Generate Summary"
4. Download the summary

### Flashcard Generator
1. Go to "Flashcard Generator"
2. Enter text or upload a file
3. Click "Generate Flashcards"
4. Review flashcards (click to flip)
5. Download for studying

### Resume Analyzer
1. Visit "Resume Analyzer"
2. Upload your resume
3. Get instant analysis with score
4. Review strengths, weaknesses, and suggestions
5. Download full report

### Portfolio Generator
1. Open "Portfolio Generator"
2. Fill in your information
3. Add skills, projects, and experience
4. Click "Generate & Download Portfolio"
5. Extract ZIP and deploy

### Chat with Website
1. Go to "Chat with Website"
2. Enter a website URL
3. Click "Load Website"
4. Ask questions about the content
5. Get AI-powered answers

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for Vercel, Netlify, and other platforms.

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Built with ❤️ using Next.js, React, and AI

---

**Note:** Make sure to configure your environment variables before running the application. Never commit your `.env.local` file to version control.
