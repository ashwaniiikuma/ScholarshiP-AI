
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PortalPage, SectionCard, StatTile, StatusPill } from '../components/PortalChrome';
import { quickActions } from '../data/mockData';
import { useAppContext } from '../context/AppContext';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [applicationItems, setApplicationItems] = useState([]);

  const {
    activityFeed,
    profileCompletion,
    state,
    setSelectedProgram,
    loadRealUserProfile,
    loadRecommendedScholarships,
    loadExpiringDeadlines
  } = useAppContext();

// Ab yeh dono live variables bina kisi error ke declare ho jayenge
  const recommendedPrograms = state.recommendedProgramsData?.length > 0 
    ? state.recommendedProgramsData 
    : [];

  const deadlineItems = state.deadlineItemsData?.length > 0 
    ? state.deadlineItemsData 
    : [];

  // Teeno functions ko run karne wala tumhara ekdam sahi useEffect:
  useEffect(() => {
    if (loadRealUserProfile) {
      loadRealUserProfile();
    }
    if (loadRecommendedScholarships) {
      loadRecommendedScholarships();
    }
    if (loadExpiringDeadlines) {
      loadExpiringDeadlines();
    }
  }, []);

  useEffect(() => {
  const fetchMyApplications = async () => {
    try {
      // Jo token login ke baad localStorage me save hota hai, use uthaya
      const token = localStorage.getItem('token'); 

      const response = await axios.get('http://localhost:5000/api/applications/my-applications', {
        headers: {
          // Pranjal ke 'auth' middleware ke hisab se token header bheja
          'x-auth-token': token 
        }
      });

      // Backend se aaya data (response.data) state me set kar diya
      setApplicationItems(response.data);
    } catch (error) {
      console.error("My Applications fetch karne me lafda hua:", error);
    }
  };

  fetchMyApplications();
}, []); // Empty array taaki page load hote hi sirf ek baar chale

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
      title={`Welcome back, ${state.profile?.name ? state.profile.name.split(' ')[0]: 'student'}`}
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
                  key={program._id || program.id} // MongoDB ki id _id hoti hai
                  onClick={() => {
                    setSelectedProgram(program._id || program.id);
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
                  {/* ✅ program.match ki jagah program.percentage kar diya */}
                  <StatusPill tone="positive">{program.percentage}% match</StatusPill> 
                </button>
              ))}
            </div>
          </SectionCard>
          

<SectionCard title="My applications" subtitle="Current pipeline">
  <div className="stack-list">
    {/* Agar backend se abhi tak koi application nahi aayi toh loader ya empty state dikhane ke liye */}
    {applicationItems.length === 0 ? (
      <p style={{ padding: '15px', color: '#666', textAlign: 'center' }}>
        No applications found.
      </p>
    ) : (
      applicationItems.map((item) => (
        // 1. key ko item.id se badal kar item._id kiya (MongoDB schema ke liye)
        <div className="selection-card selection-card--static" key={item._id}>
          <div>
            {/* 2. Pranjal ke populate ke hisab se title aur amount ab scholarship object se aayenge */}
            <strong>{item.scholarship?.title || "Scholarship Program"}</strong>
            <p>{item.scholarship?.amount || "Amount under processing"}</p>
          </div>
          
          {/* 3. Status Pill ka color dynamic kiya (agar status 'Approved' ho toh positive, warna warning) */}
          <StatusPill tone={item.status === 'Approved' ? 'positive' : 'warning'}>
            {item.status || "Under review"}
          </StatusPill>
        </div>
      ))
    )}
  </div>
</SectionCard>
        </div>

        <div className="stack-column">
          <SectionCard subtitle="Time-sensitive items" title="Upcoming deadlines">
            <div className="stack-list">
              {deadlineItems.map((item) => (
                <div className="selection-card selection-card--static" key={item._id || item.id}>
                  <div>
                  <strong>{item.title || item.name || "UP Post-Matric Scholarship"}</strong>
          
          {/* 2. ISO Date (2026-07-10T...) ko readable banane ke liye .split('T')[0] lagaya hai */}
          <p>{item.deadline ? item.deadline.split('T')[0] : "2026-07-10"}</p>
                  </div>
                  <StatusPill
                    tone={item.daysLeft <= 3? 'danger' : item.tone === 'soon' ? 'warning' : 'neutral'}
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
