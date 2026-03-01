import React, { useState } from 'react';

function QuizInterface({ quiz, onReset }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const questions = quiz.questions || [];
    const currentQuestion = questions[currentQuestionIndex];

    const handleOptionSelect = (option) => {
        if (isAnswered) return;

        setSelectedOption(option);
        setIsAnswered(true);

        if (option === currentQuestion.correct_answer) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setShowResults(true);
        }
    };

    if (showResults) {
        return (
            <div className="glass-panel text-center">
                <h2>Quiz Complete!</h2>
                <div style={{
                    fontSize: '4rem',
                    fontWeight: 'bold',
                    margin: '2rem 0',
                    background: 'var(--accent-gradient)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    {score} / {questions.length}
                </div>
                <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
                    {score === questions.length ? "Perfect score! You've mastered this topic." : "Good effort! Try again to boost your understanding."}
                </p>
                <button className="btn-primary" onClick={onReset}>Generate Another Quiz</button>
            </div>
        );
    }

    return (
        <div className="glass-panel" style={{ animation: 'fadeInUp 0.4s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ margin: 0, color: 'var(--accent-color)' }}>{quiz.title}</h3>
                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.3rem 1rem', borderRadius: '50px' }}>
                    {currentQuestionIndex + 1} of {questions.length}
                </span>
            </div>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', lineHeight: '1.4' }}>
                {currentQuestion.question_text}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {currentQuestion.options.map((option, index) => {
                    let btnStyle = {
                        padding: '1.2rem 1.5rem',
                        background: 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '12px',
                        textAlign: 'left',
                        color: 'var(--text-main)',
                        fontSize: '1.1rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        fontFamily: "'Outfit', sans-serif"
                    };

                    if (isAnswered) {
                        if (option === currentQuestion.correct_answer) {
                            btnStyle.background = 'rgba(0, 230, 118, 0.2)';
                            btnStyle.border = '1px solid var(--success-color)';
                        } else if (option === selectedOption) {
                            btnStyle.background = 'rgba(255, 61, 0, 0.2)';
                            btnStyle.border = '1px solid var(--error-color)';
                        }
                    } else if (selectedOption === option) {
                        btnStyle.border = '1px solid var(--accent-color)';
                    }

                    return (
                        <button
                            key={index}
                            style={btnStyle}
                            onClick={() => handleOptionSelect(option)}
                            onMouseEnter={(e) => {
                                if (!isAnswered) {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isAnswered) {
                                    e.currentTarget.style.background = 'var(--glass-bg)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{
                                    display: 'inline-block',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.1)',
                                    textAlign: 'center',
                                    lineHeight: '32px',
                                    marginRight: '1rem',
                                    fontWeight: 'bold',
                                }}>
                                    {String.fromCharCode(65 + index)}
                                </span>
                                {option}
                            </div>
                        </button>
                    )
                })}
            </div>

            {isAnswered && (
                <div style={{ marginTop: '2rem', textAlign: 'right', animation: 'fadeInUp 0.3s ease' }}>
                    <button className="btn-primary" onClick={handleNext}>
                        {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
                    </button>
                </div>
            )}
        </div>
    );
}

export default QuizInterface;
