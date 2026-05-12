from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from bson import ObjectId
import shutil
import os
import json
import difflib

# Internal Modules
from preprocess import preprocess_image
from ocr import extract_text
from grading import grade_answer # Your Mistral-powered module
from database import results_collection
from auth import authenticate_user, create_access_token

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_FOLDER), name="uploads")

class MarksUpdate(BaseModel):
    marks: float

@app.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": user["username"], "role": user["role"]})
    return {"access_token": access_token, "token_type": "bearer", "role": user["role"]}

@app.post("/grade")
async def grade_papers(
    files: list[UploadFile] = File(...),
    student_data: str = Form(...),
    questions: str = Form(...)
):
    try:
        s_data = json.loads(student_data)
        qs = json.loads(questions)
    except:
        raise HTTPException(status_code=400, detail="Invalid JSON data")

    graded_results = []
    past_submissions = list(results_collection.find({}, {"student_name": 1, "ocr_answer": 1}))

    for i, file in enumerate(files):
        student = s_data[i]
        safe_name = f"{ObjectId()}_{file.filename.replace(' ', '_')}"
        path = os.path.join(UPLOAD_FOLDER, safe_name)
        
        with open(path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        text = extract_text(preprocess_image(path))
        
        # Plagiarism Check
        warning = "Clear"
        for past in past_submissions:
            sim = difflib.SequenceMatcher(None, text, past["ocr_answer"]).ratio()
            if sim > 0.8:
                warning = f"Similarity: {round(sim*100)}% with {past['student_name']}"
                break

        total_m, total_max_m = 0, 0
        q_results = []
        
        for q in qs:
            # Calling your updated grading logic
            res = grade_answer(text, q["question"], q["rubric"], q["max_marks"])
            
            m = res.get("marks", 0)
            total_m += m
            total_max_m += int(q["max_marks"])
            
            q_results.append({
                "question": q["question"],
                "marks": m,
                "feedback": res.get("feedback", ""),
                "reasoning": res.get("reasoning", ""),
                "missing": res.get("missing_rubric_points", [])
            })

        perc = round((total_m / total_max_m) * 100, 2) if total_max_m > 0 else 0
        if perc >= 90: g = "A+"
        elif perc >= 80: g = "A"
        elif perc >= 70: g = "B"
        elif perc >= 50: g = "C"
        else: g = "F"

        result_obj = {
            "student_name": student.get("name"),
            "enrollment_number": student.get("enrollment"),
            "file_url": f"http://127.0.0.1:8000/uploads/{safe_name}",
            "ocr_answer": text,
            "question_results": q_results,
            "total_marks": total_m,
            "total_max_marks": total_max_m,
            "percentage": perc,
            "grade": g,
            "plagiarism_warning": warning
        }
        
        results_collection.insert_one(result_obj)
        result_obj["_id"] = str(result_obj["_id"])
        graded_results.append(result_obj)

    return {"graded_results": graded_results}

@app.get("/results")
async def get_results():
    results = list(results_collection.find())
    for r in results: r["_id"] = str(r["_id"])
    return results

@app.put("/update_marks/{student_id}")
async def update_marks(student_id: str, update: MarksUpdate):
    existing = results_collection.find_one({"_id": ObjectId(student_id)})
    if not existing: raise HTTPException(status_code=404)

    max_m = existing.get("total_max_marks", 100)
    perc = round((update.marks / max_m) * 100, 2)
    
    if perc >= 90: g = "A+"
    elif perc >= 80: g = "A"
    elif perc >= 70: g = "B"
    elif perc >= 50: g = "C"
    else: g = "F"

    results_collection.update_one(
        {"_id": ObjectId(student_id)},
        {"$set": {"total_marks": update.marks, "percentage": perc, "grade": g}}
    )
    return {"status": "success", "grade": g}

@app.delete("/delete_submission/{student_id}")
async def delete_submission(student_id: str):
    results_collection.delete_one({"_id": ObjectId(student_id)})
    return {"status": "deleted"}