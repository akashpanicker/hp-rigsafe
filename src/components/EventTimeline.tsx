import React from 'react';

export interface TimelineEvent {
  id: string;
  minutesAgo: number;
  type: 'critical' | 'warning';
  description: string;
}

interface EventTimelineProps {
  events: TimelineEvent[];
  rangeMinutes: number;
  selectedEventId?: string;
  onEventClick: (event: TimelineEvent) => void;
}

const EventTimeline: React.FC<EventTimelineProps> = ({
  events,
  rangeMinutes,
  selectedEventId,
  onEventClick
}) => {
  const now = Date.now();
  const scalePoints = 8;

  const formatScaleLabel = (minutesAgo: number): string => {
    const date = new Date(now - minutesAgo * 60_000);

    if (rangeMinutes >= 24 * 60) {
      return date.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const scaleLabels = Array.from({ length: scalePoints }, (_, index) => {
    const ratio = index / (scalePoints - 1);
    const minutesAgo = rangeMinutes * (1 - ratio);
    return formatScaleLabel(minutesAgo);
  });

  return (
    <div className="event-timeline">
      <div className="event-timeline__track-container">
        <div className="event-timeline__track">
          {events.map((event) => (
            <button
              key={event.id}
              className={`event-marker event-marker--${event.type} ${selectedEventId === event.id ? 'event-marker--selected' : ''}`}
              style={{ left: `${Math.max(0, Math.min(100, (1 - event.minutesAgo / rangeMinutes) * 100))}%` }}
              onClick={() => onEventClick(event)}
              title={event.description}
            >
              <span className="event-marker__dot"></span>
            </button>
          ))}
        </div>
      </div>
      <div className="event-timeline__scale">
        {scaleLabels.map((label, index) => (
          <span key={`${label}-${index}`}>{label}</span>
        ))}
      </div>
    </div>
  );
};

export default EventTimeline;
