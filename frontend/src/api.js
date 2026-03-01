const API_BASE_URL = import.meta.env.VITE_API_URL || "https://aeroquiz-0ksb.onrender.com/api";

export const uploadFileForQuiz = async (file, numQuestions = 10, comments = '') => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/upload?num_questions=${numQuestions}&comments=${encodeURIComponent(comments)}`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to upload file");
  }

  return await response.json();
};

export const generateMoreQuestions = async (fileName, mimeType, numQuestions = 10, comments = '') => {
  const response = await fetch(`${API_BASE_URL}/generate-more`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      file_name: fileName,
      mime_type: mimeType,
      num_questions: numQuestions,
      comments: comments
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to generate more questions");
  }

  return await response.json();
};

