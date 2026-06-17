import { Link, useNavigate } from 'react-router-dom';
import { ApplicationShell } from '../components/ApplicationShell';
import { useAppContext } from '../context/AppContext';

function ReviewCard({ title, editHref, items }) {
  return (
    <div className="review-card">
      <div className="review-card__head">
        <div>
          <h3>{title}</h3>
        </div>
        <Link className="button button--ghost button--small" to={editHref}>
          Edit
        </Link>
      </div>

      <div className="review-grid">
        {items.map((item) => (
          <div className="review-item" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReviewSubmitPage() {
  const navigate = useNavigate();
  const { state, submitApplication, toggleDeclaration, profileCompletion } = useAppContext();

  const personalItems = [
    { label: 'Full name', value: state.personal.fullName },
    { label: 'Date of birth', value: state.personal.dob || 'Not set' },
    { label: 'Gender', value: state.personal.gender },
    { label: 'Location', value: `${state.personal.city}, ${state.personal.state}` },
  ];

  const academicItems = [
    { label: 'Course', value: state.academic.course },
    { label: 'Stream', value: state.academic.stream },
    { label: 'Year or semester', value: state.academic.year },
    { label: 'CGPA / marks', value: state.academic.marks },
  ];

  const financialItems = [
    { label: 'Annual income', value: state.financial.incomeRange },
    { label: 'Category', value: state.financial.category },
    { label: 'Hostel resident', value: state.financial.hostelResident },
    { label: 'Certificate', value: state.financial.certificateName || 'Pending upload' },
  ];

  const handleSubmit = () => {
    if (!state.declarationAccepted) {
      return;
    }

    submitApplication();
    navigate('/dashboard');
  };

  return (
    <ApplicationShell
      asideText="This is the final checkpoint before the application enters the dashboard as a submitted profile."
      asideTitle="One last review before submission."
      backLabel="Back to financial details"
      backTo="/financial-details"
      currentStep="review"
      highlights={[
        'All edits still route back to the original step pages.',
        'Submitted status becomes visible in dashboard and notifications.',
        'Profile completion is currently calculated from live form state.',
      ]}
      metrics={[
        { label: 'Profile completion', value: `${profileCompletion}%` },
        { label: 'Best match award', value: 'Rs 60,000' },
      ]}
      subtitle="Check the consolidated summary and submit once the declaration is confirmed."
      title="Review and submit"
    >
      <div className="stack-form">
        <ReviewCard editHref="/personal-details" items={personalItems} title="Personal details" />
        <ReviewCard editHref="/academic-details" items={academicItems} title="Academic details" />
        <ReviewCard editHref="/financial-details" items={financialItems} title="Financial details" />

        <label className="checkbox-panel">
          <input checked={state.declarationAccepted} onChange={toggleDeclaration} type="checkbox" />
          <span>
            I confirm that the information provided is accurate and I agree to the platform terms and privacy policy.
          </span>
        </label>

        <div className="button-row">
          <button className="button button--ghost" onClick={() => navigate('/financial-details')} type="button">
            Back
          </button>
          <button
            className="button button--success"
            disabled={!state.declarationAccepted}
            onClick={handleSubmit}
            type="button"
          >
            Submit profile
          </button>
        </div>
      </div>
    </ApplicationShell>
  );
}
