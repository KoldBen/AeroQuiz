import os
import json
import google.generativeai as genai
from typing import Dict, Any

# Configure Gemini API
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

def generate_quiz_from_file(file_path: str, mime_type: str) -> Dict[str, Any]:
    """
    Sends a file to the Gemini API and asks it to generate a quiz based on the content.
    Expects a strict JSON output matching the requested schema.
    """
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not set. Please set the environment variable.")
    
    # Upload file to Gemini using generativeai File API
    uploaded_file = genai.upload_file(path=file_path, mime_type=mime_type)
    
    # Choose model
    model = genai.GenerativeModel('gemini-1.5-pro')
    
    prompt = (
        "Analyze the attached document. Generate a 5-to-10-question multiple-choice quiz "
        "based on the core concepts. Return the output strictly in JSON format without any markdown backticks "
        "or additional text, matching exactly this structure:\n"
        "{\n"
        '  "title": "A summary title for the quiz",\n'
        '  "questions": [\n'
        '    {\n'
        '      "question_text": "The question here",\n'
        '      "options": ["Option A", "Option B", "Option C", "Option D"],\n'
        '      "correct_answer": "Option A"\n'
        '    }\n'
        '  ]\n'
        "}\n"
    )

    response = model.generate_content([uploaded_file, prompt])
    
    # Clean up the uploaded file from Google servers
    genai.delete_file(uploaded_file.name)
    
    # Parse the response as JSON
    response_text = response.text.strip()
    # Strip markdown if Gemini ignores the instruction
    if response_text.startswith("```json"):
        response_text = response_text[7:]
    if response_text.endswith("```"):
        response_text = response_text[:-3]
        
    try:
        quiz_data = json.loads(response_text)
        return quiz_data
    except Exception as e:
        print("Failed to parse AI output:", response_text)
        raise e
