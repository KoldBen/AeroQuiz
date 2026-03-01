import React, { useCallback, useState } from 'react';

function UploadZone({ onUpload }) {
    const [isDragActive, setIsDragActive] = useState(false);

    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            validateAndUpload(file);
        }
    }, [onUpload]);

    const handleChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            validateAndUpload(file);
        }
    };

    const validateAndUpload = (file) => {
        const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        if (validTypes.includes(file.type)) {
            onUpload(file);
        } else {
            alert("Please upload a valid PDF, JPG, or PNG file.");
        }
    };

    return (
        <div
            className={`glass-panel upload-zone ${isDragActive ? 'active' : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{
                textAlign: 'center',
                border: isDragActive ? '2px dashed var(--accent-color)' : '1px solid var(--glass-border)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: isDragActive ? 'scale(1.02)' : 'scale(1)'
            }}
            onClick={() => document.getElementById('file-upload').click()}
        >
            <input
                id="file-upload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                style={{ display: 'none' }}
                onChange={handleChange}
            />

            <div style={{ padding: '2rem 0' }}>
                <svg fill="var(--accent-color)" width="64px" height="64px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '1rem' }}>
                    <path d="M19,13a1,1,0,0,0-1,1v.38L16.52,12.9a2.79,2.79,0,0,0-3.93,0l-7,7V5a1,1,0,0,1,1-1h6a1,1,0,0,0,0-2H6A3,3,0,0,0,3,5V19a3,3,0,0,0,3,3H18a3,3,0,0,0,3-3V14A1,1,0,0,0,19,13ZM5,20a1,1,0,0,1-1-1V18.21l6.38-6.38a.79.79,0,0,1,1.14,0L18,18.38V19a1,1,0,0,1-1,1Zm14,2a1,1,0,0,1-1,1H6A5,5,0,0,1,1,15V5A5,5,0,0,1,6,0h6A1,1,0,0,1,13,1V5H17.59l4.7-4.71a1,1,0,0,1,1.42,1.42l-5,5A1,1,0,0,1,18,7H14V3H6A3,3,0,0,0,3,6v9a3,3,0,0,0,3,3H18a3,3,0,0,0,3-3v-.38L19.52,16.1a2.79,2.79,0,0,0-3.93,0l-1.3,1.3a1,1,0,0,1-1.42-1.42l1.3-1.3A4.79,4.79,0,0,1,21,14.68v.53L23.71,12.5a1,1,0,0,1,1.42,1.42l-2,2A1,1,0,0,1,22.29,16.5l2-2A1,1,0,0,1,25,13.5a1,1,0,0,1-1-1Zm-1-8a3,3,0,1,0-3-3A3,3,0,0,0,18,14Zm0-4a1,1,0,1,1-1,1A1,1,0,0,1,18,10Z" />
                    <path d="M12,17H6a1,1,0,0,1-1-1V9A1,1,0,0,1,6,8h3a1,1,0,0,1,1,1v2A1,1,0,0,0,11,12h2a1,1,0,0,0,1-1V9a1,1,0,0,1,2,0v7A1,1,0,0,1,15,17Z" opacity="0" />
                    <path d="M21.5,8h-3a1,1,0,0,1-1-1V4.5a.5.5,0,0,1,.85-.35l3.5,3.5A.5.5,0,0,1,21.5,8Z" />
                </svg>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Drag & Drop here</h2>
                <p style={{ color: 'var(--text-muted)' }}>Supports .PDF, .JPG, .PNG</p>
                <button className="btn-primary" style={{ marginTop: '2rem' }}>Browse Files</button>
            </div>
        </div>
    );
}

export default UploadZone;
