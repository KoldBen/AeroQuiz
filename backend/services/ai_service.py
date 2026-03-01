import os
import json
import base64
import requests
from typing import Dict, Any
from dotenv import load_dotenv
from PyPDF2 import PdfReader

load_dotenv()

# Configure OpenRouter API
api_key = os.getenv("OPENROUTER_API_KEY")

def extract_text_from_pdf(file_path: str) -> str:
    """Extracts text content from a PDF file locally."""
    try:
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        print(f"Error extracting PDF text: {e}")
        return ""

def encode_image(image_path: str) -> str:
    """Encodes an image to base64 string."""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def generate_quiz_from_file(file_path: str, mime_type: str, num_questions: int = 10, comments: str = "") -> Dict[str, Any]:
    """
    Sends file content to OpenRouter API and asks it to generate a quiz.
    Uses GPT-4o-mini for multimodal support (text or images).
    """
    if not api_key:
        raise ValueError("OPENROUTER_API_KEY is not set.")

    instruction_text = f" User instructions: {comments}" if comments else ""
    prompt = (
        f"Generate a {num_questions}-question multiple-choice quiz based on the provided content.{instruction_text} "
        "Return the output strictly in JSON format without any markdown backticks "
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

    messages = [{"role": "user", "content": []}]
    
    if "pdf" in mime_type:
        # Extract text for PDFs as many models prefer text input for large docs
        text_content = extract_text_from_pdf(file_path)
        messages[0]["content"].append({
            "type": "text",
            "text": f"{prompt}\n\nCONTENT TO ANALYZE:\n{text_content}"
        })
    else:
        # Handle as image
        base64_image = encode_image(file_path)
        messages[0]["content"].append({
            "type": "text",
            "text": prompt
        })
        messages[0]["content"].append({
            "type": "image_url",
            "image_url": {
                "url": f"data:{mime_type};base64,{base64_image}"
            }
        })

    response = requests.post(
        url="https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {api_key}",
            "HTTP-Referer": "http://localhost:3000", # Optional
            "X-Title": "AeroQuiz", # Optional
        },
        data=json.dumps({
            "model": "openai/gpt-4o-mini", # Using a highly capable multimodal model
            "messages": messages
        })
    )

    if response.status_code != 200:
        raise Exception(f"OpenRouter API Error: {response.status_code} - {response.text}")

    response_data = response.json()
    response_text = response_data['choices'][0]['message']['content'].strip()
    
    # Strip markdown if model ignores the instruction
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
