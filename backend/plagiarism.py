from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer('all-MiniLM-L6-v2')

def check_similarity(answers):

    embeddings = model.encode(answers)

    similarity_matrix = cosine_similarity(embeddings)

    flagged = []

    for i in range(len(answers)):

        for j in range(i + 1, len(answers)):

            score = similarity_matrix[i][j]

            if score > 0.85:

                flagged.append({
                    "student1": i,
                    "student2": j,
                    "similarity": float(score)
                })

    return flagged