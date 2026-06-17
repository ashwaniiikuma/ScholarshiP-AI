import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { post } from '../util/request';
import { URL } from '../util/api';
import SignupFormFields, {
  createInitialSignupForm,
  validateSignupForm,
} from '../components/auth/SignupFormFields';
import { useAppContext } from '../context/AppContext';

export default function SignupPage() {
  const navigate = useNavigate();
  const { applyRegistrationProfile, state } = useAppContext();
  const [form, setForm] = useState(() => createInitialSignupForm(state));
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFieldChange = (field) => (event) => {
    const nextValue =
      event.target.type === 'checkbox' ? event.target.checked : event.target.value;

    setForm((current) => ({
      ...current,
      [field]: nextValue,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    const validationError = validateSignupForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    const requestData = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      state: form.state,
      category: form.category,
      income: Number(form.income),
      educationLevel: form.educationLevel,
      cgpa: Number(form.cgpa),
    };

    setLoading(true);

    try {
      const response = await post(URL.Register, requestData);
      applyRegistrationProfile(requestData, response);
      setSuccessMessage(response?.message ?? 'Registration successful.');
      navigate('/personal-details');
    } catch (requestError) {
      setError(requestError.message || 'Unable to register right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-screen">
      <section className="signup-aside">
        <div className="brand-lockup">
          <span className="brand-mark">SH</span>
          <span className="brand-text">
            ScholarHub
            <small>Create account</small>
          </span>
        </div>

        <div className="signup-aside__content">
          <p className="eyebrow">Student onboarding</p>
          <h1>Build one profile and reuse it across every scholarship application.</h1>
          <p>
            The original HTML project had a dedicated signup screen. This React version keeps it as a separate route so the flow remains familiar.
          </p>

          <div className="signup-highlights">
            <div>
              <strong>Personalized matching</strong>
              <p>Academic and income details drive better ranking across programs.</p>
            </div>
            <div>
              <strong>Submission readiness</strong>
              <p>Document gaps, deadline risks, and incomplete fields stay visible in the dashboard.</p>
            </div>
            <div>
              <strong>Reusable profile</strong>
              <p>Changes made in review automatically propagate to the dashboard and assistant context.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="signup-panel">
        <div className="signup-card">
          <div className="surface-card__head">
            <div>
              <h2>Create your account</h2>
              <p>Continue into the scholarship application flow.</p>
            </div>
            <Link className="text-link" to="/">
              Back to login
            </Link>
          </div>

          <SignupFormFields
            error={error}
            form={form}
            loading={loading}
            onFieldChange={handleFieldChange}
            onSubmit={handleSubmit}
            submitLabel="Register and continue"
            successMessage={successMessage}
          />
        </div>
      </section>
    </div>
  );
}
