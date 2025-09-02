// // src/components/Auth.jsx
// import { useState } from 'react';
// import { auth } from '../api/firebase';
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// export default function Auth() {
//   const [mode, setMode] = useState('login');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (mode === 'login') {
//         await signInWithEmailAndPassword(auth, email, password);
//       } else {
//         await createUserWithEmailAndPassword(auth, email, password);
//       }
//     } catch (error) {
//       alert(error.message);
//     }
//   };

//   return (
//     <div style={{ padding: "2rem", textAlign: "center" }}>
//       <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           required
//           onChange={(e) => setEmail(e.target.value)}
//         /><br /><br />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           required
//           onChange={(e) => setPassword(e.target.value)}
//         /><br /><br />
//         <button type="submit">{mode === 'login' ? 'Login' : 'Register'}</button>
//       </form>
//       <p
//         style={{ cursor: 'pointer', color: 'blue' }}
//         onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
//       >
//         {mode === 'login' ? 'No account? Register here' : 'Have an account? Login'}
//       </p>
//     </div>
//   );
// }


// src/components/Auth.jsx
import { useState } from 'react';
import { auth } from '../api/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaEnvelope, FaArrowRight, FaSpinner } from 'react-icons/fa';

export default function Auth() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (mode === 'register' && password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="auth-container">
      <div className={`auth-card ${mode}`}>
        <div className="auth-header">
          <div className="icon-circle">
            {mode === 'login' ? <FaUser /> : <FaEnvelope />}
          </div>
          <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <p>
            {mode === 'login' 
              ? 'Sign in to continue to your account' 
              : 'Join us today and get started'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <div className="input-icon">
              <FaEnvelope />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <div className="input-icon">
              <FaLock />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <div 
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          {mode === 'register' && (
            <div className="input-group">
              <div className="input-icon">
                <FaLock />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div 
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FaSpinner className="spinner" />
                Processing...
              </>
            ) : (
              <>
                {mode === 'login' ? 'Sign In' : 'Sign Up'}
                <FaArrowRight />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
            <span onClick={toggleMode}>
              {mode === 'login' ? ' Sign Up' : ' Sign In'}
            </span>
          </p>
        </div>
      </div>

      <style jsx>{`
        .auth-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .auth-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
          width: 100%;
          max-width: 420px;
          padding: 40px 30px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .auth-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, #6a11cb, #2575fc);
        }
        
        .auth-header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .icon-circle {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6a11cb, #2575fc);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: white;
          font-size: 24px;
        }
        
        .auth-header h2 {
          color: #333;
          margin-bottom: 10px;
          font-weight: 600;
        }
        
        .auth-header p {
          color: #666;
          font-size: 14px;
        }
        
        .input-group {
          position: relative;
          margin-bottom: 20px;
        }
        
        .input-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #6a11cb;
        }
        
        input {
          width: 100%;
          padding: 15px 15px 15px 45px;
          border: 1px solid #ddd;
          border-radius: 10px;
          font-size: 15px;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }
        
        input:focus {
          border-color: #6a11cb;
          box-shadow: 0 0 0 3px rgba(106, 17, 203, 0.1);
          outline: none;
        }
        
        .password-toggle {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #666;
          cursor: pointer;
        }
        
        .error-message {
          color: #e74c3c;
          background: #fdf2f2;
          padding: 10px 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
          text-align: center;
        }
        
        .auth-button {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #6a11cb, #2575fc);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s ease;
        }
        
        .auth-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(106, 17, 203, 0.4);
        }
        
        .auth-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        
        .spinner {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .auth-footer {
          text-align: center;
          margin-top: 25px;
          color: #666;
          font-size: 14px;
        }
        
        .auth-footer span {
          color: #6a11cb;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .auth-footer span:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}