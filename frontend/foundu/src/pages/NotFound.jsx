import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Home } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#000000',
            color: '#ffffff',
            padding: '20px',
            textAlign: 'center',
            fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}>
            <div style={{ width: '100%', maxWidth: '500px', marginBottom: '-20px' }}>
                <DotLottieReact
                    src="https://lottie.host/9c2fc713-f37a-46ef-ac5c-79a767ccca38/k9BFbOVmY1.lottie"
                    loop
                    autoplay
                />
            </div>

            <h1 style={{
                fontSize: 'clamp(2rem, 8vw, 4rem)',
                fontWeight: 900,
                marginBottom: '10px',
                background: 'linear-gradient(to bottom, #ffffff, #666666)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>
                LOST IN SPACE?
            </h1>

            <p style={{
                color: '#9ca3af',
                fontSize: '18px',
                marginBottom: '40px',
                maxWidth: '500px'
            }}>
                The page you're looking for was either deleted or never existed in this dimension.
            </p>

            <button
                onClick={() => navigate('/')}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px 28px',
                    background: '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(59, 130, 246, 0.5)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1) translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.3)';
                }}
            >
                <Home size={20} />
                BACK TO HOME
            </button>

            {/* Subtle background glow */}
            <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                pointerEvents: 'none',
                zIndex: -1
            }} />
        </div>
    );
};

export default NotFound;
