# GradeOps

**GradeOps** is an AI-powered evaluation infrastructure designed to bridge the gap between handwritten student submissions and digital academic grading. It automates transcription (OCR), applies instructor-defined rubrics via AI, and provides a secure dashboard for TAs and Professors.

---

## Demo

Check out **GradeOps** in action:  
[🎥 Watch the Demo on Google Drive](https://drive.google.com/file/d/12CRIigDNH4ajEXUuUz28aZqnUj1a-aU3/view?usp=sharing)
(!! Only frontend is deployed on vercel)

---

# Features

## **Instructor Hub**
- **Bulk Upload**: Upload scanned student answer sheets (JPG/PNG/PDF).
- **Dynamic Rubrics**: Define custom grading criteria and point weightage.
- **Evaluation History**: Manage and track past grading records.
- **TA Handover**: Seamlessly transition results to the TA Dashboard for review.

---

## **TA Dashboard & Reviewer**
- **AI Scoring**: View AI-generated scores and feedback for each question.
- **Integrity Check**: Automatic plagiarism and similarity detection flags.
- **Live Overrides**: Teaching Assistants can manually adjust marks with real-time grade recalculation.
- **CSV Export**: Export final results for official record-keeping.

---

## **Security**
- **Gatekeeper**: Password-protected access to return to the Instructor Hub.
- **Environment Safety**: Sensitive API keys and backend configurations are handled via `.env` (excluded from tracking).

---

# The AI Pipeline

GradeOps uses a sophisticated multi-stage pipeline to transform physical handwriting into actionable academic insights.

---

## **1. The Vision Layer (OCR)**

The system ingests raw image data (JPG/PNG/PDF) and processes it through an **Optical Character Recognition (OCR)** engine.

- **Digitization:** Converts handwritten strokes into digital text.
- **Structural Mapping:** Identifies specific answer blocks corresponding to the exam layout.

---

## **2. The Intelligence Layer (Mistral AI)**

Once digitized, the text is fed into the **Mistral AI** model (via API) alongside the instructor's custom rubric.

- **Semantic Evaluation:** Mistral analyzes the meaning and context of the student's response rather than relying only on keywords.
- **Rubric Alignment:** The AI measures responses against the instructor-defined grading criteria and weightage.
- **Feedback Generation:** Generates human-like qualitative feedback explaining the assigned score.

---

## **3. The Integrity Layer**

Simultaneously, the content is analyzed for:

- **Plagiarism Detection:** Cross-referencing submissions to identify high similarity scores.
- **Consistency Checks:** Ensuring OCR transcription quality and academic coherence.

---

# Tech Stack & Integration

- **Frontend:** React.js
- **Backend:** Python (FastAPI)
- **OCR Engine:** Tesseract OCR / EasyOCR
- **LLM:** Mistral AI (Mistral-Large / Mistral-Medium)
- **Database:** MongoDB
- **Storage:** Cloudinary
- **State Management:** React Hooks & Local Overrides
- **Styling:** Premium Bento-grid UI with Dark Emerald aesthetic

---

# Installation & Setup

## **1. Clone the Repository**

```bash
git clone https://github.com/sargamjain5/gradeOps.git
cd gradeOps
```

---

## **2. Frontend Setup**

```bash
cd frontend
npm install
npm start
```

---

## **3. Backend Setup**

```bash
cd backend
pip install -r requirements.txt
python main.py
```

---

## **4. Create a `.env` File**

Create a `.env` file inside the `backend/` directory and add:

```env
MISTRAL_API_KEY=your_mistral_api_key

MONGO_URI=mongodb://localhost:27017/gradeops

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

# Default Credentials

## **Instructor Login**

```txt
Username: instructor
Password: 1234
```

---

## **TA Login**

```txt
Username: ta
Password: 1234
```

---

## **Instructor Dashboard Access Password**

```txt
admin123
```

---

# License

This project is intended for educational and research purposes.
