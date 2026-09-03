# 🩺 Dr. Doc — AI Document Checkup & Verification Workstation

<div align="center">

<!-- Project Status & Metadata Badges -->
[![Version](https://img.shields.io/badge/Version-v2.4.0-blue.svg?style=for-the-badge&logo=semver&logoColor=white)](https://github.com/diya-1720/dr.Doc/releases)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/diya-1720/dr.Doc)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge&logo=opensourceinitiative&logoColor=white)](https://opensource.org/licenses/MIT)
[![Mobile Support](https://img.shields.io/badge/Responsive-Mobile_%26_Desktop-9cf.svg?style=for-the-badge&logo=googlechrome&logoColor=white)](http://localhost:5173)
[![GitHub Stars](https://img.shields.io/github/stars/diya-1720/dr.Doc?style=for-the-badge&logo=github&color=gold)](https://github.com/diya-1720/dr.Doc/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/diya-1720/dr.Doc?style=for-the-badge&logo=github&color=lightgrey)](https://github.com/diya-1720/dr.Doc/network/members)

<br/>

<!-- Technology & Framework Badges -->
[![TypeScript](https://img.shields.io/badge/TypeScript_5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_18.3-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js_18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js_4-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite_5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Gemini_Vision_AI-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

<br/>

<!-- Multilingual Availability Badges -->
[![English](https://img.shields.io/badge/Language-English-0052CC?style=flat-square&logo=googletranslate&logoColor=white)](#-supported-languages)
[![Hindi](https://img.shields.io/badge/भाषा-हिंदी_(Hindi)-FF9933?style=flat-square&logo=googletranslate&logoColor=white)](#-supported-languages)
[![Marathi](https://img.shields.io/badge/भाषा-मराठी_(Marathi)-138808?style=flat-square&logo=googletranslate&logoColor=white)](#-supported-languages)

<br/>

> **"Never let paperwork be the reason an application fails."**  
> *An intelligent pre-submission assistant that audits, verifies, cross-checks, and fixes documents before you submit them to government, banking, or college portals.*

[Live Workstation](http://localhost:5173) • [Explore Features](#-key-features) • [How It Works](#-how-dr-doc-works-step-by-step-flow) • [Tech Stack](#-tech-stack) • [Quick Setup](#-quick-setup--run-locally)

</div>

---

## 🎯 Project Overview & Purpose

Every year, millions of applications for **passports, GST registration, bank accounts, university admissions, and loans** get rejected due to simple, avoidable errors:
- ❌ **Name Mismatches**: *"Rahul Kumar"* on PAN card vs. *"R. Kumar"* on Bank Statement.
- ❌ **Poor Quality & Blurry Scans**: Hard to read, bad lighting, or cropped edges.
- ❌ **File Size Violations**: Portals rejecting PDFs larger than 10 MB.
- ❌ **Missing Files**: Forgetting a mandatory electricity bill or identity proof.
- ❌ **Outdated Photographs**: Using a photo that doesn't match current age.

### 💡 The Solution: Dr. Doc
**Dr. Doc is a pre-submission digital doctor for your documents.**  
Upload your files before applying. Dr. Doc reads your documents using AI, tests their scan quality, compares names and dates across documents, lets you fix issues on the spot, and bundles everything into one verified PDF ready for submission.

---

## ✨ Key Features

| Feature | What It Does | Key Advantage |
| :--- | :--- | :--- |
| 🔍 **AI Vision OCR** | Extracts names, DOB, addresses, and ID numbers using Google Gemini Vision AI. | Instant digital extraction with confidence scores. |
| ⚖️ **Cross-Document Cross-Check** | Compares 2 documents side-by-side (e.g., PAN vs. Aadhaar) to detect name or date discrepancies. | Prevents silent administrative rejections. |
| 📊 **Scan Quality Inspector** | Scores Sharpness, Text Legibility, Lighting, and Cropping (0–100%). | Flags blurry or unreadable scans immediately. |
| 📸 **Photo Age Audit** | Verifies if the applicant's face photo matches their calculated age. | Catches outdated photos before the portal does. |
| 🛠️ **7 In-Line Fix Tools** | Compress PDF/Image, Convert Image to PDF, Merge PDFs, Enhance Contrast, Rename Files. | Fix errors directly inside the app in 1 click. |
| 📄 **Consolidated Master PDF** | Merges all approved documents into a single, paginated A4 submission package. | Ready for single-file portal uploads. |
| 🌐 **100% Multilingual (i18n)** | Full native support for **English**, **Hindi (हिंदी)**, and **Marathi (मराठी)**. | Accessible to regional applicants and centers across India. |

---

## 🌐 Supported Languages

Dr. Doc is fully accessible in 3 languages with a 1-click language switcher:

- 🇬🇧 **English** (Default)
- 🇮🇳 **Hindi (हिंदी)** — Full translation of UI, document types, quality meters, tools, and reports.
- 🇮🇳 **Marathi (मराठी)** — Native Marathi translation across all 12 pages and workspaces.

> *Example translations: Aadhaar (आधार कार्ड), PAN (पैन कार्ड / पॅन कार्ड), Electricity Bill (बिजली बिल / वीज बिल), Sharpness (स्पष्टता), Readiness (तत्परता / पूर्णता).*

---

## 🔄 How Dr. Doc Works (Step-by-Step Flow)

```
[1. Select Application Profile]  ➔  Choose KYC, GST, Loan, or College Admission
            ↓
[2. Document Inbox]             ➔  Drag & drop up to 5 documents (Auto-Classified)
            ↓
[3. AI OCR & Quality Audit]     ➔  Extracts key details & tests image legibility
            ↓
[4. Cross-Check Comparison]     ➔  Compares names & dates across different IDs
            ↓
[5. In-Line Fix Tools]          ➔  Compress large PDFs & boost contrast in 1 click
            ↓
[6. Master Bundle & Report]     ➔  Download final report & consolidated submission PDF
```

---

## 💻 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Backend**: Node.js, Express.js
- **AI Engine**: Google Gemini Vision AI (`@google/genai`)
- **Document & Image Processing**: Sharp (Image manipulation), PDF-Lib, PDFKit, PDF-Parse
- **Internationalization**: Custom React Context i18n Engine (English, Hindi, Marathi)

---

## 🚀 Quick Setup & Run Locally

### 1. Clone & Install
```bash
git clone https://github.com/diya-1720/dr.Doc.git
cd dr.Doc
npm install
```

### 2. Add Gemini API Key
Create a `.env` file in the project root:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### 3. Start Development Servers

**Terminal 1 (Backend):**
```bash
node backend/server.js
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser!

---

## 👥 The Team

- **Shravan Mali** — *Backend Architecture & APIs*
- **Yatharth Raut** — *AI Forensics & PDF Processing*
- **Diya Singh** — *Frontend UI/UX & Ingestion Desk*
- **Ved Gharat** — *State Management, Document Tools & Multilingual Engine*

---

## 📄 License
Licensed under the **MIT License**.
