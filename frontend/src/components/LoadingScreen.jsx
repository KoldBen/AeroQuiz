import React from 'react';

function LoadingScreen() {
    return (
        <div className="glass-panel text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
            <div className="spinner-container" style={{ marginBottom: '2rem', position: 'relative' }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    border: '4px solid rgba(255,255,255,0.1)',
                    borderTop: '4px solid var(--accent-color)',
                    borderRadius: '50%',
                    animation: 'spin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite'
                }}></div>
            </div>
            <h2>AI is Reading Your Document</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Extracting insights and generating brain-teasers...</p>

            <style>
                {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
            </style>
        </div>
    );
}

export default LoadingScreen;
