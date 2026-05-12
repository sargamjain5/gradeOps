import fitz
import os

def pdf_to_images(pdf_path):

    doc = fitz.open(pdf_path)

    image_paths = []

    for i, page in enumerate(doc):

        pix = page.get_pixmap()

        image_path = f"cleaned/page_{i}.png"

        pix.save(image_path)

        image_paths.append(image_path)

    return image_paths