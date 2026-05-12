# GradeOps 

**GradeOps** is an AI-powered evaluation infrastructure designed to bridge the gap between handwritten student submissions and digital academic grading. It automates transcription (OCR), applies instructor-defined rubrics via AI, and provides a secure dashboard for TAs and Professors.

**DemoVideo** https://drive.google.com/file/d/12CRIigDNH4ajEXUuUz28aZqnUj1a-aU3/view?usp=sharing
---

## Features

### **Instructor Hub**
- **Bulk Upload**: Upload scanned student answer sheets (JPG/PNG/PDF).
- **Dynamic Rubrics**: Define custom grading criteria and point weightage.
- **Evaluation History**: Manage and track past grading records.
- **TA Handover**: Seamlessly transition results to the TA Dashboard for review.

### **TA Dashboard & Reviewer**
- **AI Scoring**: View AI-generated scores and feedback for each question.
- **Integrity Check**: Automatic plagiarism and similarity detection flags.
- **Live Overrides**: Teaching Assistants can manually adjust marks with real-time grade recalculation.
- **CSV Export**: Export final results for official record-keeping.

### **Security**
- **Gatekeeper**: Password-protected access to return to the Instructor Hub.
- **Environment Safety**: Sensitive API keys and backend configurations are handled via `.env` (excluded from tracking).

---

## The AI Pipeline

GradeOps uses a sophisticated multi-stage pipeline to transform physical handwriting into actionable academic insights.

### 1. The Vision Layer (OCR)
The system ingests raw image data (JPG/PNG) and processes it through an **Optical Character Recognition (OCR)** engine. 
- **Digitization:** Converts handwritten strokes into digital strings.
- **Structural Mapping:** Identifies specific answer blocks corresponding to the exam layout.

### 2. The Intelligence Layer (Mistral AI)
Once digitized, the text is fed into the **Mistral AI** model (via API) alongside the instructor's custom rubric.
- **Semantic Evaluation:** Mistral analyzes the *meaning* and *context* of the student's response rather than just looking for keywords.
- **Rubric Alignment:** The AI measures the response against the weightage and criteria defined in the Instructor Hub.
- **Feedback Generation:** Generates human-like qualitative feedback to explain the assigned score.

### 3. The Integrity Layer
Simultaneously, the content is analyzed for:
- **Plagiarism Detection:** Cross-referencing submissions to find high similarity scores.
- **Consistency Checks:** Ensuring the handwriting transcription aligns with expected academic patterns.

---

## 🛠️ Tech Stack & Integration

- **Frontend:** React.js 
- **Backend:** Python (FastAPI)
- **OCR Engine:** Tesseract OCR / EasyOCR (Local on-device transcription)
- **LLM:** Mistral AI (Mistral-Large / Mistral-Medium)
- **State Management:** React Hooks & Local Overrides
- **Storage**: Cloudinary

## Tech Stack

- **Frontend**: React.js, Material Symbols, Inter Font family.
- **Backend**: Python (FastAPI/Flask), Axios for API communication.
- **AI/ML**: OCR for handwriting recognition & LLM for rubric-based grading.
- **Styling**: Premium Bento-grid design with a Dark Emerald aesthetic.

---

## Installation & Setup

### **1. Clone the Repository**
```bash
git clone [https://github.com/sargamjain5/gradeOps.git](https://github.com/sargamjain5/gradeOps.git)
cd gradeOps
```
### **2. Frontend Setup**
```bash
cd frontend
npm install
npm start
```
### **3. Backend Setup**
```bash
cd backend
pip install -r requirements.txt
# Create a .env file and add your API keys
python main.py
```
