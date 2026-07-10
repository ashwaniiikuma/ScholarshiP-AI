import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { post } from '../util/request';
import { URL } from '../util/api';
import jslLogo from '../jsl.logo.jpg';
import SignupFormFields, {
  createInitialSignupForm,
  validateSignupForm,
} from '../components/auth/SignupFormFields';
import { useAppContext } from '../context/AppContext';

function decodeJwtPayload(token) {
  if (typeof token !== 'string') {
    return null;
  }

  const payload = token.split('.')[1];
  if (!payload) {
    return null;
  }

  try {
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const decoded = window.atob(paddedBase64);

    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function getLoginRole(response) {
  const role =
    response?.role ??
    response?.user?.role ??
    response?.data?.role ??
    response?.data?.user?.role;

  if (typeof role === 'string') {
    return role.toLowerCase();
  }

  const token =
    response?.token ??
    response?.jwt ??
    response?.accessToken ??
    response?.data?.token ??
    response?.data?.jwt ??
    response?.data?.accessToken;

  const tokenRole = decodeJwtPayload(token)?.role;

  return typeof tokenRole === 'string' ? tokenRole.toLowerCase() : '';
}

function getLoginToken(response) {
  return (
    response?.token ??
    response?.jwt ??
    response?.accessToken ??
    response?.data?.token ??
    response?.data?.jwt ??
    response?.data?.accessToken ??
    ''
  );
}

function hasSuccessfulLoginResponse(response) {
  if (response?.success === false) {
    return false;
  }

  return Boolean(getLoginToken(response));
}

function getLoginRedirectPath(email, response) {
  const role = getLoginRole(response);

  if (role === 'admin') {
    return '/admin';
  }

  if (role === 'user') {
    return '/personal-details';
  }

  return email === 'admin@scholarhub.com' || email.startsWith('admin@')
    ? '/admin'
    : '/personal-details';
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { applyRegistrationProfile, state, setAuthMode } = useAppContext();
  const [loginForm, setLoginForm] = useState({
    emailOrPhone: state.profile.email,
    password: '',
  });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupForm, setSignupForm] = useState(() => createInitialSignupForm(state));
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const loginRequestInFlight = useRef(false);

  const isLogin = state.authMode === 'login';

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    if (loginRequestInFlight.current) {
      return;
    }

    setLoginError('');

    const email = loginForm.emailOrPhone.trim().toLowerCase();
    const password = loginForm.password;
             
    if (!email) {
      setLoginError('Email is required.');
      return;
    }

    if (!password) {
      setLoginError('Password is required.');
      return;
    }

    const requestData = {
      email,
      password,
    };

    loginRequestInFlight.current = true;
    setLoginLoading(true);

    try {
      const response = await fetch('http://localhost:5000/user/login',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });
      if (!response.ok) {
        window.localStorage.removeItem('scholarhub-auth-token');
        window.localStorage.removeItem('token');

        
        const errrorText = await response.text();
        setLoginError(errrorText || 'Login failed. Please check the API response and try again.');
        return;
      }

      const data = await response.json();
      const token = data.token;

      if(!token){
        setLoginError('Token not received from server.')
      }

    window.localStorage.setItem('scholarhub-auth-token', token);
    window.localStorage.setItem('token', token);

      const role = data.role ||  (data.user && data.user.role) || '';
      if(role.toLowerCase() === 'admin'){
        navigate('/admin');
      }else{
        navigate('/personal-details')
      }

    } catch (error) {
      window.localStorage.removeItem('scholarhub-auth-token');
      window.localStorage.removeItem('token');
      setLoginError(error.message || 'Unable to login right now.');
    } finally {
      loginRequestInFlight.current = false;
      setLoginLoading(false);
    }
  };

  const handleSignupFieldChange = (field) => (event) => {
    const nextValue =
      event.target.type === 'checkbox' ? event.target.checked : event.target.value;

    setSignupForm((current) => ({
      ...current,
      [field]: nextValue,
    }));
  };

  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    setSignupError('');
    setSignupSuccess('');

    const validationError = validateSignupForm(signupForm);
    if (validationError) {
      setSignupError(validationError);
      return;
    }

    const requestData = {
      name: signupForm.name.trim(),
      email: signupForm.email.trim().toLowerCase(),
      password: signupForm.password,
      state: signupForm.state,
      category: signupForm.category,
      income: Number(signupForm.income),
      educationLevel: signupForm.educationLevel,
      cgpa: Number(signupForm.cgpa),
    };

    setSignupLoading(true);

    try {
      const response = await post(URL.Register, requestData);
      applyRegistrationProfile(requestData, response);
      setSignupSuccess(response?.message ?? 'Registration successful.');
      navigate('/personal-details');
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        applyRegistrationProfile(requestData);
        navigate('/personal-details');
        return;
      }

      setSignupError(error.message || 'Unable to register right now.');
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      
      <section className="auth-hero">
        <div className="main-wrapper"> 
      {/* Logo ko yahan sabse upar rakho, taaki ye pure screen ka top-left corner le */}
      <div className="logo-header">
        <img src={jslLogo} alt="JSL Logo" />
      </div>
      </div>
        <div className="brand-lockup">
          
          <span className="brand-mark">SH</span>
          <span className="brand-text">
            ScholarHub
            <small>From static HTML to React</small>
          </span>
        </div>

        <div className="auth-hero__content">
          <p className="eyebrow">Scholarship operating system</p>
          <h1>
            Find the right funding,
            <span> finish the application,</span>
            and keep every deadline visible.
          </h1>
          <p className="auth-hero__copy">
            This React version keeps the original project flow, but replaces isolated pages with
            reusable layouts, shared state, and route-based navigation.
          </p>

          <div className="hero-feature-grid">
            <div className="hero-feature-card">
              <strong>Unified flow</strong>
              <p>Login, application steps, review, dashboard, alerts, and assistant now share one state model.</p>
            </div>
            <div className="hero-feature-card">
              <strong>Cleaner maintenance</strong>
              <p>Reusable components replace inline CSS and per-page scripts from the legacy files.</p>
            </div>
            <div className="hero-feature-card">
              <strong>Faster extension</strong>
              <p>Add APIs, persistence, or real auth later without rebuilding the UI structure again.</p>
            </div>
          </div>

          <div className="hero-kpis">
            <div>
              <strong>9</strong>
              <span>legacy screens mapped</span>
            </div>
            <div>
              <strong>1</strong>
              <span>React state source</span>
            </div>
            <div>
              <strong>4</strong>
              <span>application steps</span>
            </div>
          </div>
        </div>
      </section>


    
      <section className="auth-panel">
 
        <div className="auth-card">
 
          <p className="eyebrow">Access portal</p>
          <h2>Continue your scholarship journey</h2>
          <p className="auth-card__copy">
            Use the login tab to jump into the dashboard, or switch to signup to continue the profile flow.
          </p>

          <div className="tab-switch">
            <button
              className={isLogin ? 'is-active' : ''}
              onClick={() => setAuthMode('login')}
              type="button"
            >
              Login
            </button>
            <button
              className={!isLogin ? 'is-active' : ''}
              onClick={() => setAuthMode('signup')}
              type="button"
            >
              Sign up
            </button>
          </div>

          {isLogin ? (
            <form className="stack-form" onSubmit={handleLoginSubmit}>
              <label className="form-field">
                <span>Email</span>
                <input
                  className="input"
                  onChange={(event) =>
                    setLoginForm((current) => ({
                      ...current,
                      emailOrPhone: event.target.value,
                    }))
                  }
                  placeholder="Enter your email"
                  type="email"
                  value={loginForm.emailOrPhone}
                />
              </label>

              <label className="form-field">
                <span>Password</span>
                <input
                  className="input"
                  onChange={(event) =>
                    setLoginForm((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  placeholder="Enter your password"
                  type="password"
                  value={loginForm.password}
                />
              </label>

              {loginError ? <p className="form-error">{loginError}</p> : null}

              <button className="button button--primary" disabled={loginLoading} type="submit">
                {loginLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          ) : (
            <SignupFormFields
              error={signupError}
              form={signupForm}
              loading={signupLoading}
              onFieldChange={handleSignupFieldChange}
              onSubmit={handleSignupSubmit}
              submitLabel="Register and continue"
              successMessage={signupSuccess}
            />
          )}

        </div>
      </section>
    </div>
  );
}
