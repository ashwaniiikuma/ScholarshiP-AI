import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApplicationShell } from '../components/ApplicationShell';
import { states } from '../data/mockData';
import { useAppContext } from '../context/AppContext';

export default function PersonalDetailsPage() {
  const navigate = useNavigate();
  const { state, updateSection } = useAppContext();
  const [errors, setErrors] = useState({});

  const values = state.personal;

  const validate = () => {
    const nextErrors = {};

    if (!values.fullName.trim()) nextErrors.fullName = 'Full name is required.';
    if (!values.dob) nextErrors.dob = 'Date of birth is required.';
    if (!values.state) nextErrors.state = 'Please select a state.';
    if (!values.city.trim()) nextErrors.city = 'City is required.';
    if (!values.mobile.trim()) nextErrors.mobile = 'Mobile number is required.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }
    navigate('/academic-details');
  };

  return (
    <ApplicationShell
      asideText="Your personal information helps ScholarHub create stronger scholarship recommendations and cleaner application summaries."
      asideTitle="Start with the student profile."
      backLabel="Back to signup"
      backTo="/signup"
      currentStep="personal"
      highlights={[
        'Location and gender details help narrow regional and category-specific schemes.',
        'The same data is reused later in review and dashboard recommendations.',
        'You can still edit everything before final submission.',
      ]}
      metrics={[
        { label: 'Active scholarships', value: '480+' },
        { label: 'Potential award pool', value: 'Rs 2.4Cr' },
      ]}
      subtitle="Tell us about yourself so the matching engine has a reliable base profile."
      title="Personal details"
    >
      <form className="stack-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label className="form-field">
            <span>Full name</span>
            <input
              className="input"
              onChange={(event) => updateSection('personal', { fullName: event.target.value })}
              placeholder="Enter your full name"
              type="text"
              value={values.fullName}
            />
            {errors.fullName ? <small className="form-error">{errors.fullName}</small> : null}
          </label>

          <label className="form-field">
            <span>Date of birth</span>
            <input
              className="input"
              onChange={(event) => updateSection('personal', { dob: event.target.value })}
              type="date"
              value={values.dob}
            />
            {errors.dob ? <small className="form-error">{errors.dob}</small> : null}
          </label>
        </div>

        <div className="form-grid">
          <label className="form-field">
            <span>Gender</span>
            <select
              className="input"
              onChange={(event) => updateSection('personal', { gender: event.target.value })}
              value={values.gender}
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </label>

          <label className="form-field">
            <span>Mobile number</span>
            <input
              className="input"
              onChange={(event) => updateSection('personal', { mobile: event.target.value })}
              placeholder="Enter your mobile number"
              type="text"
              value={values.mobile}
            />
            {errors.mobile ? <small className="form-error">{errors.mobile}</small> : null}
          </label>
        </div>

        <div className="form-grid">
          <label className="form-field">
            <span>State</span>
            <select
              className="input"
              onChange={(event) => updateSection('personal', { state: event.target.value })}
              value={values.state}
            >
              <option value="">Select your state</option>
              {states.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {errors.state ? <small className="form-error">{errors.state}</small> : null}
          </label>

          <label className="form-field">
            <span>City</span>
            <input
              className="input"
              onChange={(event) => updateSection('personal', { city: event.target.value })}
              placeholder="Enter your city"
              type="text"
              value={values.city}
            />
            {errors.city ? <small className="form-error">{errors.city}</small> : null}
          </label>
        </div>

        <div className="button-row">
          <button className="button button--ghost" onClick={() => navigate('/signup')} type="button">
            Back
          </button>
          <button className="button button--primary" type="submit">
            Save and continue
          </button>
        </div>
      </form>
    </ApplicationShell>
  );
}
