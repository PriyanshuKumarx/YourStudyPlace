import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  auth,
  googleProvider,
  githubProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "../Firebase/firebaseConfig";
import { signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import "./Login.css";

const Login = ({ isVisible, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [user, setUser] = useState(null);

  // Sign Up State
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  // Sign In State
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  const toggleForm = () => {
    setIsActive(!isActive);
    console.log("Toggle form clicked, isActive:", !isActive); // Debug log
  };

  useEffect(() => {
    if (isVisible) document.body.classList.add("login-visible");
    else document.body.classList.remove("login-visible");
    
    // Reset active state when modal is closed
    if (!isVisible) {
      setIsActive(false);
    }
  }, [isVisible]);


  // Google Sign-in
  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      window.location.reload();
    } catch (error) {
      alert(`Google Login Failed: ${error.code} - ${error.message}`);
    }
  };

  // GitHub Sign-in
  const handleGitHubLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithPopup(auth, githubProvider);
      setUser(result.user);
      window.location.reload();
    } catch (error) {
      alert(`GitHub Login Failed: ${error.code} - ${error.message}`);
    }
  };

  // Email/Password Handlers
  const handleSignUp = async (e) => {
    e.preventDefault();
    console.log("Sign up form submitted"); // Debug log
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signUpEmail,
        signUpPassword
      );
      await updateProfile(userCredential.user, { displayName: signUpName });
      window.location.reload();
    } catch (error) {
      alert(`Sign Up Error: ${error.code} - ${error.message}`);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    console.log("Sign in form submitted"); // Debug log
    try {
      await signInWithEmailAndPassword(auth, signInEmail, signInPassword);
      window.location.reload();
    } catch (error) {
      alert(`Sign In Error: ${error.code} - ${error.message}`);
    }
  };

  const handleForgotPassword = async () => {
    const email = prompt("Enter your email to reset password:");
    if (!email) return;

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset link sent! Check your email.");
    } catch (error) {
      alert(`Password Reset Error: ${error.code} - ${error.message}`);
    }
  };

  console.log("Rendering Login component, isActive:", isActive); // Debug log

  return (
    <div className={`login-container ${isVisible ? "visible" : ""}`}>
      <div className={`container ${isActive ? "active" : ""}`} id="container">
        {/* Sign Up Form */}
        <div className="form-container sign-up">
          <form onSubmit={handleSignUp}>
            <h1>Create Account</h1>
            <div className="social-icons">
              <a
                onClick={handleGoogleLogin}
                className="icon"
                role="button"
                aria-label="Google"
              >
                <i className="fab fa-google"></i>
              </a>
              <a
                onClick={handleGitHubLogin}
                className="icon"
                role="button"
                aria-label="GitHub"
              >
                <i className="fab fa-github"></i>
              </a>
            </div>
            <span>or use your email for registration</span>
            <input
              type="text"
              placeholder="Name"
              value={signUpName}
              onChange={(e) => setSignUpName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
              required
            />
            <button type="submit">Sign Up</button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className="form-container sign-in">
          <form onSubmit={handleSignIn}>
            <h1>Sign In</h1>
            <div className="social-icons">
              <a
                onClick={handleGoogleLogin}
                className="icon"
                role="button"
                aria-label="Google"
              >
                <i className="fab fa-google"></i>
              </a>
              <a
                onClick={handleGitHubLogin}
                className="icon"
                role="button"
                aria-label="GitHub"
              >
                <i className="fab fa-github"></i>
              </a>
            </div>
            <span>or use your email and password</span>
            <input
              type="email"
              placeholder="Email"
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={signInPassword}
              onChange={(e) => setSignInPassword(e.target.value)}
              required
            />
            <a href="#" onClick={handleForgotPassword}>
              Forgot Your Password?
            </a>
            <button type="submit">Sign In</button>
          </form>
        </div>

        {/* Toggle Container */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all site features</p>
              <button className="toggle-btn" onClick={toggleForm} type="button">
                Sign In
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <p>
                Register with your personal details to use all site features
              </p>
              <button className="toggle-btn" onClick={toggleForm} type="button">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
      {isVisible && <div className="overlay" onClick={onClose}></div>}
    </div>
  );
};

Login.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Login;