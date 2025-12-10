import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Splash.css';

export default function Splash() {
    const navigate = useNavigate();

    return (
        <div className="splash-container">
            <div className="splash-content">
                <h1>Global Vehicle Export System</h1>
                
                <p className="subtitle">Your trusted platform for international vehicle trading</p>
                
                <div className="info-section">

                    
                    <ul className="features">
                        ✓ Secure transactions<br />
                        ✓ Global shipping network<br />
                        ✓ Real-time tracking<br />
                       ✓ 24/7 customer support
                    </ul>
                </div>

                <div className="button-group">
                    <button className="btn btn-login" onClick={() => navigate('/login')}>Login</button>
                    <button className="btn btn-signup" onClick={() => navigate('/signup')}>Sign Up</button>
                </div>
            </div>
        </div>
    );
}
