import './HeroBanner.css';

type HeroBannerProps = {
    onLoginClick: () => void;
};

export default function HeroBanner({ onLoginClick }: HeroBannerProps) {
    return (
        <section className="hero-banner">
            <div className="hero-banner__overlay"></div>

            <div className="hero-banner__content page-container">
                <div className="hero-banner__text-content">
                    <span className="hero-banner__eyebrow">
                        LearnBasicTech Pulse
                    </span>

                    <h1 className="hero-banner__title">
                        Welcome to LearnBasicTech
                    </h1>

                    <p className="hero-banner__description">
                        Learn essential digital skills through guided video
                        courses, ebooks, and interactive learning experiences.
                    </p>

                    <div className="hero-banner__actions">
                        <button
                            type="button"
                            className="hero-banner__primary-button"
                            onClick={onLoginClick}
                        >
                            Sign in
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
