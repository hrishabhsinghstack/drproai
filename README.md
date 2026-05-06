# DrPro AI Assistant

![DrPro AI](reference%20design/reference%20(1).PNG)

DrPro AI is a comprehensive, AI-powered medical assistant application built with Next.js, React, TailwindCSS, and the Google Gemini API. It provides a conversational interface for users to perform a variety of health-related tasks, from symptom checking to lab report analysis and doctor finding.

## 🚀 Features

- **Conversational UI**: A beautifully designed, mobile-responsive chat interface mirroring premium healthcare apps.
- **Symptom Checker**: Intelligent AI conversation to evaluate symptoms and suggest next steps.
- **Lab Report Analysis**: Upload PDF or image lab reports (e.g., CBC) and get an easy-to-understand breakdown.
- **Medicine Identification**: Upload a photo of a medicine strip to identify the medication and its uses.
- **Doctor Finder**: Search for nearby specialists, view their detailed profiles, ratings, and book appointments.
- **Exercise & Wellness**: Get customized yoga and exercise suggestions complete with intensity levels and duration.
- **Period Tracker**: Log cycles, predict periods, and get insights into symptoms and irregularities.
- **Rich Interactive Cards**: Dynamic UI components for Doctors, Lab Tests, Exercises, and Supplements directly within the chat flow.

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & [shadcn/ui](https://ui.shadcn.com/)
- **AI Engine**: Google Generative AI ([Gemini 2.5 Flash Lite](https://ai.google.dev/))
- **Icons**: Lucide React
- **Avatars**: DiceBear API

## 📋 Prerequisites

- Node.js 18+
- npm or yarn or pnpm
- Google Gemini API Key

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hrishabhsinghstack/drproai.git
   cd drproai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add your Gemini API Key:
   ```env
   GEMINI_API_KEY="your_api_key_here"
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the App:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## 🎨 UI & Design System

The application is built using a custom tokenized theme in `globals.css` using `oklch` colors.
- **Primary Color**: Deep Indigo (`#5048E5`)
- **Typography**: Clean Sans-Serif stack
- **Components**: Utilizes fully responsive, animated, and accessible interactive cards for medical data.

## 🔒 Security & Privacy

- **Data Privacy**: The application emphasizes user privacy. All prompt handling and interactions are processed securely.
- **Disclaimer**: DrPro Assistant provides general health information and is *not a substitute for professional medical advice, diagnosis, or treatment*.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/hrishabhsinghstack/drproai/issues).
