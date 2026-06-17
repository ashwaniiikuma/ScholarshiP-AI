import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { post } from '../util/request';
import { URL } from '../util/api';
import SignupFormFields, {
  createInitialSignupForm,
  validateSignupForm,
} from '../components/auth/SignupFormFields';
import { useAppContext } from '../context/AppContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { applyRegistrationProfile, state, setAuthMode } = useAppContext();
  const [loginForm, setLoginForm] = useState({
    emailOrPhone: state.profile.email,
    password: '',
  });
  const [signupForm, setSignupForm] = useState(() => createInitialSignupForm(state));
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);

  const isLogin = state.authMode === 'login';

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    navigate('/dashboard');
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
      setSignupError(error.message || 'Unable to register right now.');
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <section className="auth-hero">
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
                <span>Email or mobile number</span>
                <input
                  className="input"
                  onChange={(event) =>
                    setLoginForm((current) => ({
                      ...current,
                      emailOrPhone: event.target.value,
                    }))
                  }
                  placeholder="Enter your email or mobile number"
                  type="text"
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

              <button className="button button--primary" type="submit">
                Open dashboard
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

          <div className="auth-card__footer">
            <Link className="text-link" to="/signup">
              Open dedicated signup screen
            </Link>
            <Link className="text-link" to="/assistant">
              Preview AI assistant
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
