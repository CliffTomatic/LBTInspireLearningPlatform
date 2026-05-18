import EventCard from '../../components/EventCard/EventCard';
import { mockEvents } from '../../data/events';
import './EventsPage.css';

function EventsPage() {
    return (
        <section className="events">
            <div className="events__hero">
                <div className="events__hero-content">
                    <h1 className="events__hero-title events__heading">Join Our In Person Trainings</h1>
                    <p className="events__hero-subtitle">
                        Join our recurring in-person sessions to learn and enhance your fundamental tech and digital skills.
                    </p>
                    <div className="events__hero-actions">
                        <button className="events__hero-btn events__hero-btn--primary">Sign Up</button>
                        <button className="events__hero-btn events__hero-btn--secondary">Locations</button>
                    </div>
                </div>
            </div>
            <div className="page-container">
                <div className="events__header">
                    <h2 className="events__heading events__content-heading">Weekly In-Person Trainings</h2>
                    <p className="events__content-subtitle">
                        Our in-person training sessions offer direct instruction and provide access to instructors who are available to assist with any questions you may have. <br />
                        Training Includes: Computer Basics, Internet Basics, App Basics, Smartphone Basics, Security Basics, & More! <br />
                        Take advantage of this opportunity to boost your digital skills!
                    </p>
                    <h2 className="events__heading events__content-heading">May Events</h2>
                </div>
                <div className="events__list">
                    {mockEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
                <div className="events__section">
                    <h2 className="events__heading events__section-title">Find the Closest Event to You!</h2>
                    <div className="events__map-placeholder" role="img" aria-label="Map widget placeholder">
                        Map widget placeholder
                    </div>
                </div>
                <div className="events__section events__section--education">
                    <p className="events__education-kicker">LEARN BASIC TECH</p>
                    <h2 className="events__heading events__section-title events__section-title--education">Open a World of Education</h2>
                    <div className="events__education-grid">
                        <div className="events__education-column">
                            <article className="events__education-card">
                                <h3 className="events__education-card-title">Choose Your Pace</h3>
                                <p className="events__education-card-body">
                                    Our courses are designed for flexibility, allowing you to learn and build digital skills at your own pace.
                                </p>
                            </article>
                            <article className="events__education-card">
                                <h3 className="events__education-card-title">Boost Your Skills</h3>
                                <p className="events__education-card-body">
                                    Our courses offer an opportunity to acquire new technical and digital skills for FREE! Accessible to anyone with an internet connection and a desire to learn.
                                </p>
                            </article>
                        </div>
                        <div className="events__education-image-column">
                            <img
                                className="events__education-image"
                                src="/assets/thumbnails/placeholder.png"
                                alt="Tablet displaying educational content"
                            />
                        </div>
                        <div className="events__education-column">
                            <article className="events__education-card">
                                <h3 className="events__education-card-title">Online Courses</h3>
                                <p className="events__education-card-body">
                                    Our courses are available online in an interactive platform including games and self-assessments that provide ways test your knowledge.
                                </p>
                            </article>
                            <article className="events__education-card">
                                <h3 className="events__education-card-title">In Person Trainings</h3>
                                <p className="events__education-card-body">
                                    Our in-person trainings offer direct instruction on our course topics and allow you to ask questions in real time.
                                </p>
                            </article>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default EventsPage;
