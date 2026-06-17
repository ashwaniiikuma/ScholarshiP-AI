import { useNavigate } from 'react-router-dom';
import { PortalPage, SectionCard, StatTile, StatusPill } from '../components/PortalChrome';
import { programs } from '../data/mockData';
import { useAppContext } from '../context/AppContext';

export default function ProgramPage() {
  const navigate = useNavigate();
  const { selectedProgram, setSelectedProgram, state } = useAppContext();

  return (
    <PortalPage
      actions={
        <>
          <button className="button button--ghost" onClick={() => navigate('/assistant')} type="button">
            Check eligibility
          </button>
          <button
            className="button button--primary"
            onClick={() =>
              navigate(state.applicationStatus === 'submitted' ? '/dashboard' : '/personal-details')
            }
            type="button"
          >
            {state.applicationStatus === 'submitted' ? 'Open dashboard' : 'Apply now'}
          </button>
        </>
      }
      eyebrow="Scholarship profile"
      subtitle="A React route version of the standalone scholarship detail page, now connected to shared application state."
      title={selectedProgram.title}
    >
      <div className="two-column-layout">
        <div className="stack-column">
          <SectionCard subtitle={selectedProgram.provider} title="Program overview">
            <div className="program-hero">
              <div>
                <StatusPill tone="positive">{selectedProgram.match}% match</StatusPill>
                <p className="program-summary">{selectedProgram.highlight}</p>
              </div>

              <div className="stat-row">
                <StatTile detail="Award amount" label="Funding" value={selectedProgram.amount} />
                <StatTile detail="Closing date" label="Deadline" value={selectedProgram.deadline} />
                <StatTile detail="Available seats" label="Capacity" value={selectedProgram.seats} />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="About the scholarship">
            <p className="body-copy">{selectedProgram.description}</p>
          </SectionCard>

          <SectionCard title="Eligibility criteria">
            <ul className="bullet-list">
              {selectedProgram.eligibility.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Required documents">
            <div className="badge-grid">
              {selectedProgram.documents.map((item) => (
                <span className="document-chip" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="stack-column">
          <SectionCard subtitle="Quick switch" title="Related programs">
            <div className="stack-list">
              {programs.map((program) => (
                <button
                  className={`selection-card${program.id === selectedProgram.id ? ' is-selected' : ''}`}
                  key={program.id}
                  onClick={() => setSelectedProgram(program.id)}
                  type="button"
                >
                  <div>
                    <strong>{program.title}</strong>
                    <p>{program.amount}</p>
                  </div>
                  <StatusPill tone={program.id === selectedProgram.id ? 'positive' : 'neutral'}>
                    {program.match}% match
                  </StatusPill>
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard subtitle="Frequently asked" title="Application notes">
            <div className="faq-list">
              {selectedProgram.faq.map((item) => (
                <div className="faq-item" key={item.question}>
                  <strong>{item.question}</strong>
                  <p>{item.answer}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard subtitle="Suggested next step" title="Recommendation">
            <p className="body-copy">
              Your current profile has the strongest alignment with {selectedProgram.title}. If your income certificate is ready, move straight to review and submit.
            </p>
          </SectionCard>
        </div>
      </div>
    </PortalPage>
  );
}
