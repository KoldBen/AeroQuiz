import os
import shutil
import json
from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from db import models, database
from services.ai_service import generate_quiz_from_file

# Create the database tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="AeroQuiz API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_DIR = "temp_uploads"
os.makedirs(TEMP_DIR, exist_ok=True)

@app.get("/")
def read_root():
    return {"message": "AeroQuiz API is running"}

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...), db: Session = Depends(database.get_db)):
    try:
        # Save file temporarily
        file_path = os.path.join(TEMP_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Call AI service
        mime_type = file.content_type
        # Default to pdf if None
        if not mime_type:
            mime_type = "application/pdf"
            
        quiz_data = generate_quiz_from_file(file_path, mime_type)
        
        # Save to database
        db_quiz = models.Quiz(title=quiz_data.get("title", "Generated Quiz"))
        db.add(db_quiz)
        db.commit()
        db.refresh(db_quiz)
        
        for q in quiz_data.get("questions", []):
            db_question = models.Question(
                quiz_id=db_quiz.id,
                question_text=q.get("question_text", ""),
                options=json.dumps(q.get("options", [])),
                correct_answer=q.get("correct_answer", "")
            )
            db.add(db_question)
        db.commit()
        
        # Clean up temp file
        if os.path.exists(file_path):
            os.remove(file_path)
            
        return {"quiz_id": db_quiz.id, "quiz": quiz_data}
    except Exception as e:
        # Clean up temp file on failure just in case
        if "file_path" in locals() and os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/quizzes/{quiz_id}")
def get_quiz(quiz_id: int, db: Session = Depends(database.get_db)):
    quiz = db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
        
    questions = db.query(models.Question).filter(models.Question.quiz_id == quiz_id).all()
    q_out = []
    for q in questions:
        q_out.append({
            "id": q.id,
            "question_text": q.question_text,
            "options": json.loads(q.options),
            "correct_answer": q.correct_answer
        })
        
    return {"title": quiz.title, "questions": q_out}
