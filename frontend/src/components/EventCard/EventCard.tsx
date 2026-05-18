import './EventCard.css';

export type EventStatus = 'active' | 'canceled' | 'postponed';

export type Event = {
    id: number;
    dates: string;       // e.g. "May 1 & 8, 2026"
    time: string;        // e.g. "10:00AM – 2:00PM"
    locationName: string; // e.g. "Hawthorne Library"
    address: string;     // e.g. "12700 Grevillea Ave, Hawthorne, CA 90250"
    level: string;       // e.g. "Intermediate"
    imageUrl: string;
    registrationUrl?: string;
    status?: EventStatus; // defaults to 'active' when omitted
};

const STATUS_LABELS: Record<EventStatus, string> = {
    active: '',
    canceled: 'Canceled',
    postponed: 'Postponed',
};

type EventCardProps = {
    event: Event;
};

function EventCard({ event }: EventCardProps) {
    const status = event.status ?? 'active';

    return (
        <div className="event-card">
            <div className="event-card__image-wrapper">
                <img
                    src={event.imageUrl}
                    alt={event.locationName}
                    className="event-card__image"
                />
            </div>
            <div className="event-card__details">
                <div className="event-card__dates">{event.dates}</div>
                <div className="event-card__meta">
                    <span className="event-card__meta-item event-card__meta-item--time">
                        {event.time}
                    </span>
                    <span className="event-card__meta-item event-card__meta-item--location">
                        {event.locationName}
                    </span>
                    <span className="event-card__meta-item">
                        <span className="event-card__meta-icon">📍</span>
                        {event.address}
                    </span>
                    <span className="event-card__meta-item">
                        <span className="event-card__meta-icon">📚</span>
                        {event.level}
                    </span>
                </div>
                {status === 'active' ? (
                    <a
                        href={event.registrationUrl ?? '#'}
                        target={event.registrationUrl ? '_blank' : undefined}
                        rel="noreferrer"
                        className="event-card__button"
                    >
                        Pre-Register
                    </a>
                ) : (
                    <span className={`event-card__status-tag event-card__status-tag--${status}`}>
                        {STATUS_LABELS[status]}
                    </span>
                )}
            </div>
        </div>
    );
}

export default EventCard;
