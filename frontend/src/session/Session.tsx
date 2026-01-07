import type { session } from '../model/sessionModel';
import { FaIdBadge, FaBook, FaClock, FaCalendarAlt } from 'react-icons/fa';

interface SessionProps {
  session: session;
}

const Session = ({ session }: SessionProps) => {
  return (
    <div className="session-details-grid">
      <div className="detail-item">
        <span className="detail-label"><FaIdBadge /> Session ID</span>
        <span className="detail-value">{session.sessionId}</span>
      </div>
      <div className="detail-item">
        <span className="detail-label"><FaBook /> Deck</span>
        <span className="detail-value">{session.deckTitle}</span>
      </div>
      <div className="detail-item">
        <span className="detail-label"><FaClock /> Time Limit</span>
        <span className="detail-value">{session.timeLimitSeconds}s</span>
      </div>
      <div className="detail-item">
        <span className="detail-label"><FaCalendarAlt /> Started At</span>
        <span className="detail-value">{new Date(session.startedAt).toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default Session;