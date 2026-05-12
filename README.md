# GradeOps 🎯

**GradeOps** is an AI-powered evaluation infrastructure designed to bridge the gap between handwritten student submissions and digital academic grading. It automates transcription (OCR), applies instructor-defined rubrics via AI, and provides a secure dashboard for TAs and Professors.

---

## 🚀 Features

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

## 🛠️ Tech Stack

- **Frontend**: React.js, Material Symbols, Inter Font family.
- **Backend**: Python (FastAPI/Flask), Axios for API communication.
- **AI/ML**: OCR for handwriting recognition & LLM for rubric-based grading.
- **Styling**: Premium Bento-grid design with a Dark Emerald aesthetic.

---

## 📦 Installation & Setup

### **1. Clone the Repository**
```bash
git clone [https://github.com/sargamjain5/gradeOps.git](https://github.com/sargamjain5/gradeOps.git)
cd gradeOps
