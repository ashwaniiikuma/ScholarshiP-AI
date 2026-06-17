import { Link, useNavigate } from 'react-router-dom';
import { PortalPage, SectionCard, StatTile, StatusPill } from '../components/PortalChrome';
import { quickActions } from '../data/mockData';
import { useAppContext } from '../context/AppContext';

export default function DashboardPage() {
  const navigate = useNavigate();
  const {
    activityFeed,
    applicationItems,
    deadlineItems,
    profileCompletion,
    recommendedPrograms,
    state,
    setSelectedProgram,
  } = useAppContext();

  return (
    <PortalPage
      actions={
        <>
          <button className="button button--ghost" onClick={() => navigate('/assistant')} type="button">
            Ask assistant
          </button>
          <button className="button button--primary" onClick={() => navigate('/review-submit')} type="button">
            Review application
          </button>
        </>
      }
      eyebrow="Student dashboard"
      subtitle="A routed React dashboard that consolidates the legacy dashboard, program view, and application progress signals."
      title={`Welcome back, ${state.profile.name.split(' ')[0]}`}
    >
      <div className="dashboard-grid">
        <div className="stack-column">
          <SectionCard title="Profile completion" subtitle="Keep the core application ready">
            <div className="completion-panel">
              <div className="completion-panel__copy">
                <strong>{profileCompletion}% complete</strong>
                <p>
                  Academic details are saved. The remaining improvement is mostly document readiness and final review.
                </p>
              </div>
              <div className="progress-track">
                <div className="progress-track__fill" style={{ width: `${profileCompletion}%` }} />
              </div>
            </div>
          </SectionCard>

          <div className="stat-row">
            <StatTile detail="Best-fit programs" label="Matched" value="12" />
            <StatTile detail="Started or submitted" label="Applications" value="3" />
            <StatTile detail="Tracked reminders" label="Deadlines" value="5" />
          </div>

          <SectionCard
            action={<Link className="text-link" to="/programs/sbi-scholarship">Open details</Link>}
            subtitle="Ranked from the shared profile state"
            title="Recommended programs"
          >
            <div className="stack-list">
              {recommendedPrograms.map((program) => (
                <button
                  className="selection-card"
                  key={program.id}
                  onClick={() => {
                    setSelectedProgram(program.id);
                    navigate('/programs/sbi-scholarship');
                  }}
                  type="button"
                >
                  <div>
                    <strong>{program.title}</strong>
                    <p>{program.summary}</p>
                      <small>
                        {program.amount} / {program.deadline}
                      </small>
                  </div>
                  <StatusPill tone="positive">{program.match}% match</StatusPill>
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="My applications" subtitle="Current pipeline">
            <div className="stack-list">
              {applicationItems.map((item) => (
                <div className="selection-card selection-card--static" key={item.id}>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.amount}</p>
                  </div>
                  <StatusPill tone={item.tone === 'positive' ? 'positive' : 'warning'}>
                    {item.status}
                  </StatusPill>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="stack-column">
          <SectionCard subtitle="Time-sensitive items" title="Upcoming deadlines">
            <div className="stack-list">
              {deadlineItems.map((item) => (
                <div className="selection-card selection-card--static" key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.date}</p>
                  </div>
                  <StatusPill
                    tone={item.tone === 'urgent' ? 'danger' : item.tone === 'soon' ? 'warning' : 'neutral'}
                  >
                    {item.daysLeft} days left
                  </StatusPill>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard subtitle="What happened recently" title="Activity feed">
            <div className="timeline-list">
              {activityFeed.map((item) => (
                <div className="timeline-item" key={item.id}>
                  <span className="timeline-item__dot" />
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard subtitle="Portal shortcuts" title="Quick actions">
            <div className="quick-action-grid">
              {quickActions.map((item) => (
                <Link className="quick-action-card" key={item.href} to={item.href}>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </Link>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </PortalPage>
  );
}
