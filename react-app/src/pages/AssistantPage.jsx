import { useEffect, useRef, useState } from 'react';
import { PortalPage, SectionCard } from '../components/PortalChrome';
import { useAppContext } from '../context/AppContext';

export default function AssistantPage() {
  const {
    assistantQuickReplies,
    resetAssistantConversation,
    selectedProgram,
    sendAssistantMessage,
    state,
  } = useAppContext();
  const [draft, setDraft] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) {
      return;
    }
    element.scrollTop = element.scrollHeight;
  }, [state.assistantMessages]);

  const handleSubmit = (event) => {
    event.preventDefault();
    sendAssistantMessage(draft);
    setDraft('');
  };

  return (
    <PortalPage
      actions={
        <button className="button button--ghost" onClick={resetAssistantConversation} type="button">
          Reset conversation
        </button>
      }
      eyebrow="AI assistant"
      fullWidth
      subtitle="The original AI assistant page is now a React chat surface backed by shared application context and deterministic replies."
      title="Scholarship guidance"
    >
      <div className="assistant-layout">
        <SectionCard className="assistant-side" subtitle="Context-aware suggestions" title="Assistant overview">
          <p className="body-copy">
            The assistant knows your selected program, current financial profile, and common document blockers. Right now it is biased toward {selectedProgram.title} because it has the highest fit score.
          </p>

          <div className="assistant-side__stack">
            <div className="assistant-note">
              <strong>Best current fit</strong>
              <p>{selectedProgram.title}</p>
            </div>
            <div className="assistant-note">
              <strong>Current deadline</strong>
              <p>{selectedProgram.deadline}</p>
            </div>
            <div className="assistant-note">
              <strong>Document focus</strong>
              <p>Income certificate and latest marksheet</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard className="assistant-chat" title="Conversation">
          <div className="chat-log" ref={scrollRef}>
            {state.assistantMessages.map((message) => (
              <div
                className={`chat-bubble chat-bubble--${message.role}`}
                key={message.id}
              >
                <span className="chat-bubble__label">{message.role === 'bot' ? 'AI' : 'You'}</span>
                <p>{message.content}</p>
              </div>
            ))}
          </div>

          <div className="chip-row chip-row--spaced">
            {assistantQuickReplies.map((item) => (
              <button
                className="chip-button"
                key={item}
                onClick={() => sendAssistantMessage(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>

          <form className="chat-form" onSubmit={handleSubmit}>
            <input
              className="input"
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask about deadlines, documents, eligibility, or next steps"
              type="text"
              value={draft}
            />
            <button className="button button--primary" disabled={!draft.trim()} type="submit">
              Send
            </button>
          </form>
        </SectionCard>
      </div>
    </PortalPage>
  );
}
