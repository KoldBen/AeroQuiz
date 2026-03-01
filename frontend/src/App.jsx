import React, { useState } from 'react';
import UploadZone from './components/UploadZone';
import LoadingScreen from './components/LoadingScreen';
import QuizInterface from './components/QuizInterface';
import { uploadFileForQuiz, generateMoreQuestions } from './api';
import logo from './assets/logo.png';
import './index.css';

function App() {
  const [appState, setAppState] = useState('upload'); // upload, loading, quiz, error
  const [quizData, setQuizData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastUploadInfo, setLastUploadInfo] = useState(null);
  const [lastNumQuestions, setLastNumQuestions] = useState(10);

  const handleFileUpload = async (file, numQuestions, comments) => {
    setAppState('loading');
    setErrorMessage('');
    setLastNumQuestions(numQuestions);

    try {
      const result = await uploadFileForQuiz(file, numQuestions, comments);
      setQuizData(result.quiz);
      setLastUploadInfo({
        fileName: result.file_name,
        mimeType: result.mime_type,
        comments: comments
      });
      setAppState('quiz');
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
      setAppState('error');
    }
  };

  const handleGenerateMore = async () => {
    if (!lastUploadInfo) return;

    setAppState('loading');
    setErrorMessage('');

    try {
      const result = await generateMoreQuestions(
        lastUploadInfo.fileName,
        lastUploadInfo.mimeType,
        lastNumQuestions,
        lastUploadInfo.comments
      );
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
    setLastUploadInfo(null);
  };


  return (
    <>
      <header>
        <img
          src={logo}
          alt="AeroQuiz Logo"
          style={{
            maxWidth: '400px',
            margin: '0 auto 1.5rem auto',
            display: 'block',
            filter: 'drop-shadow(0 0 20px rgba(26, 35, 126, 0.5))'
          }}
        />
      </header>

      <main className="app-main">
        {appState === 'upload' && <UploadZone onUpload={handleFileUpload} />}

        {appState === 'loading' && <LoadingScreen />}

        {appState === 'quiz' && quizData && (
          <QuizInterface
            quiz={quizData}
            onReset={resetApp}
            onGenerateMore={handleGenerateMore}
          />
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
