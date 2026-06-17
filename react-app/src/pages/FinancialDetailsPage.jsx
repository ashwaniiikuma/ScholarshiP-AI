import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApplicationShell } from '../components/ApplicationShell';
import { categoryOptions, incomeOptions } from '../data/mockData';
import { useAppContext } from '../context/AppContext';

export default function FinancialDetailsPage() {
  const navigate = useNavigate();
  const { state, updateSection } = useAppContext();
  const [errors, setErrors] = useState({});

  const values = state.financial;

  const validate = () => {
    const nextErrors = {};
    if (!values.incomeRange) nextErrors.incomeRange = 'Select your annual family income.';
    if (!values.category) nextErrors.category = 'Select your category.';
    if (!values.hostelResident) nextErrors.hostelResident = 'Choose hostel resident status.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    updateSection('financial', { certificateName: file.name });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }
    navigate('/review-submit');
  };

  return (
    <ApplicationShell
      asideText="Financial data determines means-tested scholarship eligibility and unlocks the programs that depend on verified income bands."
      asideTitle="Finish the financial profile."
      backLabel="Back to academic details"
      backTo="/academic-details"
      currentStep="financial"
      highlights={[
        'Income and category fields drive several recommendation filters.',
        'Uploading the certificate now reduces the risk of late-stage review blockers.',
        'This stage maps directly to the original financial detail page.',
      ]}
      metrics={[
        { label: 'Matched scholarships', value: '14' },
        { label: 'Estimated award value', value: 'Rs 1.8L' },
      ]}
      subtitle="Add financial context so the scholarship shortlist reflects both merit and means-based support."
      title="Financial details"
    >
      <form className="stack-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label className="form-field">
            <span>Annual family income</span>
            <select
              className="input"
              onChange={(event) => updateSection('financial', { incomeRange: event.target.value })}
              value={values.incomeRange}
            >
              <option value="">Select income range</option>
              {incomeOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {errors.incomeRange ? <small className="form-error">{errors.incomeRange}</small> : null}
          </label>

          <label className="form-field">
            <span>Category</span>
            <select
              className="input"
              onChange={(event) => updateSection('financial', { category: event.target.value })}
              value={values.category}
            >
              <option value="">Select your category</option>
              {categoryOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {errors.category ? <small className="form-error">{errors.category}</small> : null}
          </label>
        </div>

        <fieldset className="radio-panel">
          <legend>Are you a hostel resident?</legend>
          <div className="radio-line">
            {['Yes', 'No'].map((item) => (
              <label className="radio-choice" key={item}>
                <input
                  checked={values.hostelResident === item}
                  name="hostelResident"
                  onChange={() => updateSection('financial', { hostelResident: item })}
                  type="radio"
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
          {errors.hostelResident ? <small className="form-error">{errors.hostelResident}</small> : null}
        </fieldset>

        <label className="form-field">
          <span>Income certificate</span>
          <input className="input input--file" onChange={handleFileChange} type="file" />
          <small className="field-hint">
            Current file: {values.certificateName || 'No file selected yet'}
          </small>
        </label>

        <div className="button-row">
          <button className="button button--ghost" onClick={() => navigate('/academic-details')} type="button">
            Back
          </button>
          <button className="button button--primary" type="submit">
            Save and review
          </button>
        </div>
      </form>
    </ApplicationShell>
  );
}
