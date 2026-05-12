from paddleocr import PaddleOCR
import re

# FAST OCR MODEL
ocr = PaddleOCR(
    lang='en'
)

# =========================
# OCR EXTRACTION
# =========================

def extract_text(image_path):

    result = ocr.predict(image_path)

    full_text = ""

    try:

        if result and len(result) > 0:

            texts = result[0].get(
                "rec_texts",
                []
            )

            full_text = "\n".join(texts)

    except Exception as e:

        print("OCR ERROR:", e)

    return full_text

# =========================
# SPLIT QUESTIONS
# =========================

def split_questions(full_text):

    pattern = r"(Q\d+|Question\s*\d+|\d+\.)"

    splits = re.split(
        pattern,
        full_text
    )

    questions = []

    current = ""

    for part in splits:

        if re.match(
            pattern,
            part
        ):

            if current.strip():

                questions.append(
                    current.strip()
                )

            current = part

        else:

            current += " " + part

    if current.strip():

        questions.append(
            current.strip()
        )

    return questions