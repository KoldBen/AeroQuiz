import React, { useState } from 'react';
import UploadZone from './components/UploadZone';
import LoadingScreen from './components/LoadingScreen';
import QuizInterface from './components/QuizInterface';
import { uploadFileForQuiz } from './api';
import './index.css';

function App() {
  const [appState, setAppState] = useState('upload'); // upload, loading, quiz, error
  const [quizData, setQuizData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileUpload = async (file) => {
    setAppState('loading');
    setErrorMessage('');

    try {
      const result = await uploadFileForQuiz(file);
      setQuizData(result.quiz);
      setAppState('quiz');
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
      setAppState('error');
    }
  };

  const resetApp = () => {
    setAppState('upload');
    setQuizData(null);
    setErrorMessage('');
  };

  return (
    <>
      <header>
        <h1>AeroQuiz</h1>
        <p>Transform any document into an interactive quiz instantly.</p>
      </header>

      <main className="app-main">
        {appState === 'upload' && <UploadZone onUpload={handleFileUpload} />}

        {appState === 'loading' && <LoadingScreen />}

        {appState === 'quiz' && quizData && (
          <QuizInterface quiz={quizData} onReset={resetApp} />
        )}

        {appState === 'error' && (
          <div className="glass-panel text-center">
            <h2 style={{ color: 'var(--error-color)', marginBottom: '1rem' }}>Oops! Something went wrong</h2>
            <p style={{ marginBottom: '2rem' }}>{errorMessage}</p>
            <button className="btn-secondary" onClick={resetApp}>Try Again</button>
          </div>
        )}
      </main>
    </>
  );
}

export default App;
