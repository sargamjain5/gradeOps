import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("MISTRAL_API_KEY")

# REORDERED: student_answer first to match main.py call: 
# grade_answer(extracted_text, q["question"], q["rubric"], q["max_marks"])
def grade_answer(student_answer, question, rubric, max_marks):

    prompt = f"""
You are a strict university examiner. 

QUESTION:
{question}

MAXIMUM MARKS:
{max_marks}

RUBRIC:
{rubric}

STUDENT ANSWER:
{student_answer}

INSTRUCTIONS:
- Award partial marks fairly.
- Evaluate semantic meaning.
- Mention missing concepts (e.g., if the answer discusses photosynthesis instead of normalization).
- Give concise but useful feedback.
- Provide reasoning for awarded marks.

Return ONLY valid JSON.

Format:
{{
    "marks": number,
    "feedback": "short feedback",
    "reasoning": "why these marks were awarded",
    "matched_rubric_points": [],
    "missing_rubric_points": [],
    "confidence": "high"
}}
"""

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "mistral-small-latest",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "response_format": {"type": "json_object"} # Force Mistral to return valid JSON
    }

    try:
        response = requests.post(
            "https://api.mistral.ai/v1/chat/completions",
            headers=headers,
            json=payload
        )
        response.raise_for_status()
        data = response.json()

        content = data["choices"][0]["message"]["content"]
        
        # Robust JSON extraction
        start = content.find("{")
        end = content.rfind("}") + 1
        json_text = content[start:end]
        
        parsed = json.loads(json_text)
        return parsed

    except Exception as e:
        print("GRADING ERROR:", e)
        return {
            "marks": 0,
            "feedback": "AI grading failed",
            "reasoning": str(e),
            "matched_rubric_points": [],
            "missing_rubric_points": [],
            "confidence": "low"
        }