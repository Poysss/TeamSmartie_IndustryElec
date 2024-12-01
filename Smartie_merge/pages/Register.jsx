import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  UserPlus, 
  User, 
  Mail, 
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  AlertTriangle,
  Loader
} from 'lucide-react';
import authService from '../services/auth.service';
import '../styles/pages/register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [validations, setValidations] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecial: false,
    passwordsMatch: false
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('Current validations:', validations);
    console.log('Current form data:', { ...formData, password: '[HIDDEN]' });
    console.log('Is form valid:', isPasswordValid());
  }, [validations, formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      checkPasswordValidation(value, formData.confirmPassword);
    } else if (name === 'confirmPassword') {
      checkPasswordValidation(formData.password, value);
    }

    if (error) setError('');
  };

  const checkPasswordValidation = (password, confirmPass) => {
    const newValidations = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      passwordsMatch: password === confirmPass && confirmPass !== ''
    };
    
    setValidations(newValidations);
    console.log('Password Validations:', newValidations);
  };

  const isPasswordValid = () => {
    const allValidationsPass = Object.values(validations).every(Boolean);
    
    const allFieldsFilled = 
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.username.trim() !== '' &&
      formData.password.trim() !== '' &&
      formData.confirmPassword.trim() !== '';

    console.log('All validations pass:', allValidationsPass);
    console.log('All fields filled:', allFieldsFilled);

    return allValidationsPass && allFieldsFilled;
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submission attempted');

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!isPasswordValid()) {
      console.log('Form validation failed');
      setError('Please ensure all fields are filled and password meets requirements');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      console.log('Attempting registration...');
      await authService.register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        username: formData.username.trim(),
        password: formData.password
      });
      
      console.log('Registration successful');
      await authService.login(formData.username.trim(), formData.password);
      console.log('Auto-login successful');
      
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <UserPlus className="register-icon" />
          <h2>Create Account</h2>
          <p>Join Smartie and start learning</p>
        </div>

        {error && (
          <div className="error-message">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <Mail size={18} />
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">
              <User size={18} />
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose username"
              required
            />
          </div>

          <div className="form-group password-group">
            <label htmlFor="password">
              <Lock size={18} />
              Password
            </label>
            <div className="password-input-container">
              <input
                type={showPassword.password ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => togglePasswordVisibility('password')}
              >
                {showPassword.password ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="password-requirements">
              <ul>
                <li className={validations.minLength ? 'valid' : ''}>
                  {validations.minLength ? <Check size={16} /> : <X size={16} />}
                  At least 8 characters
                </li>
                <li className={validations.hasUpperCase ? 'valid' : ''}>
                  {validations.hasUpperCase ? <Check size={16} /> : <X size={16} />}
                  One uppercase letter
                </li>
                <li className={validations.hasLowerCase ? 'valid' : ''}>
                  {validations.hasLowerCase ? <Check size={16} /> : <X size={16} />}
                  One lowercase letter
                </li>
                <li className={validations.hasNumber ? 'valid' : ''}>
                  {validations.hasNumber ? <Check size={16} /> : <X size={16} />}
                  One number
                </li>
                <li className={validations.hasSpecial ? 'valid' : ''}>
                  {validations.hasSpecial ? <Check size={16} /> : <X size={16} />}
                  One special character
                </li>
              </ul>
            </div>
          </div>

          <div className="form-group password-group">
            <label htmlFor="confirmPassword">
              <Lock size={18} />
              Confirm Password
            </label>
            <div className="password-input-container">
              <input
                type={showPassword.confirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => togglePasswordVisibility('confirmPassword')}
              >
                {showPassword.confirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formData.confirmPassword && (
              <div className="password-match">
                <span className={validations.passwordsMatch ? 'valid' : 'invalid'}>
                  {validations.passwordsMatch ? <Check size={16} /> : <X size={16} />}
                  {validations.passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                </span>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className={`register-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading || !isPasswordValid()}
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin" size={18} />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <UserPlus size={18} />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        <div className="register-footer">
          <p>Already have an account?</p>
          <Link to="/login" className="login-link">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;