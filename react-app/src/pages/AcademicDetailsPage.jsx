import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApplicationShell } from '../components/ApplicationShell';
import { courseOptions, streamOptions, yearOptions } from '../data/mockData';
import { useAppContext } from '../context/AppContext';

export default function AcademicDetailsPage() {
  const navigate = useNavigate();
  const { state, updateSection } = useAppContext();
  const [errors, setErrors] = useState({});

  const values = state.academic;

  const validate = () => {
    const nextErrors = {};
    if (!values.course) nextErrors.course = 'Select your current course or class.';
    if (!values.stream) nextErrors.stream = 'Select your stream.';
    if (!values.year) nextErrors.year = 'Select your year or semester.';
    if (!values.institution.trim()) nextErrors.institution = 'Enter your institution name.';
    if (!values.marks.trim()) nextErrors.marks = 'Enter your marks or CGPA.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }
    navigate('/financial-details');
  };

  return (
    <ApplicationShell
      asideText="Course, stream, and marks define scholarship fit more than almost any other input in the application."
      asideTitle="Build your academic profile."
      backLabel="Back to personal details"
      backTo="/personal-details"
      currentStep="academic"
      highlights={[
        'Academic details are reused in both review and dashboard cards.',
        'Marks and stream are major ranking signals for merit-based programs.',
        'This page mirrors the structure from the original academic form.',
      ]}
      metrics={[
        { label: 'Strong-fit programs', value: '12' },
        { label: 'Average match score', value: '88%' },
      ]}
      subtitle="Tell us what you study and how you are performing so recommendations can become more accurate."
      title="Academic details"
    >
      <form className="stack-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label className="form-field">
            <span>Current course or class</span>
            <select
              className="input"
              onChange={(event) => updateSection('academic', { course: event.target.value })}
              value={values.course}
            >
              <option value="">Select your course or class</option>
              {courseOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {errors.course ? <small className="form-error">{errors.course}</small> : null}
          </label>

          <label className="form-field">
            <span>Stream or field of study</span>
            <select
              className="input"
              onChange={(event) => updateSection('academic', { stream: event.target.value })}
              value={values.stream}
            >
              <option value="">Select your stream</option>
              {streamOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {errors.stream ? <small className="form-error">{errors.stream}</small> : null}
          </label>
        </div>

        <div className="form-grid">
          <label className="form-field">
            <span>Year or semester</span>
            <select
              className="input"
              onChange={(event) => updateSection('academic', { year: event.target.value })}
              value={values.year}
            >
              <option value="">Select year or semester</option>
              {yearOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {errors.year ? <small className="form-error">{errors.year}</small> : null}
          </label>

          <label className="form-field">
            <span>Marks or CGPA</span>
            <input
              className="input"
              onChange={(event) => updateSection('academic', { marks: event.target.value })}
              placeholder="Enter marks or CGPA"
              type="text"
              value={values.marks}
            />
            {errors.marks ? <small className="form-error">{errors.marks}</small> : null}
          </label>
        </div>

        <label className="form-field">
          <span>Name of school or college</span>
          <input
            className="input"
            onChange={(event) => updateSection('academic', { institution: event.target.value })}
            placeholder="Enter institution name"
            type="text"
            value={values.institution}
          />
          {errors.institution ? <small className="form-error">{errors.institution}</small> : null}
        </label>

        <div className="button-row">
          <button className="button button--ghost" onClick={() => navigate('/personal-details')} type="button">
            Back
          </button>
          <button className="button button--primary" type="submit">
            Continue to financial details
          </button>
        </div>
      </form>
    </ApplicationShell>
  );
}
