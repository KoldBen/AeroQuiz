const API_BASE_URL = "http://localhost:8000/api";

export const uploadFileForQuiz = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to upload file");
  }

  return await response.json();
};
