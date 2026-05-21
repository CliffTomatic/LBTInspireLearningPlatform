import './ConnectPage.css';

export default function ConnectPage() {
    return (
        <div className="connect-page">
            <div className="connect-page__container">
                <h1 className="connect-page__title">
                    Need Help? Connect with us!
                </h1>

                <div className="connect-page__split">
                    <div className="connect-page__content">
                        <p className="connect-page__content-text">
                            Whether you're interested to learn more about
                            LearnBasicTech or needing help navigating the site,
                            call us this number:{' '}
                            <span className="connect-page__contact-highlight">
                                562-417-2469
                            </span>{' '}
                            or email us:{' '}
                            <span className="connect-page__contact-highlight">
                                info@learnbasictech.org
                            </span>
                            .
                            <br />
                            We're open 7am - 5pm Monday through Friday.
                            <br />
                            <span className="connect-page__topic-intro">
                                We can help answering general questions on:
                            </span>
                        </p>

                        <ul className="connect-page__topics">
                            <li>Sign up for online or in-person trainings.</li>
                            <li>Certifications</li>
                            <li>Information about LearnBasicTech program</li>
                        </ul>
                    </div>

                    <div className="connect-page__image-wrapper">
                        <img
                            className="connect-page__image"
                            src="/assets/thumbnails/placeholder.png"
                            alt="Connect with us"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
