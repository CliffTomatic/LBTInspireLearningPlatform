import './AboutUsPage.css';
import { Link } from 'react-router-dom';
import InfoCard, { type InfoCardProps } from '../../components/InfoCard/InfoCard';

const aboutPillars: InfoCardProps[] = [
    {
        title: 'Our Vision',
        description:
            'Our vision is a community where everyone has access to free, inclusive tech training that builds the skills and confidence needed to thrive in the digital world.',
        imageUrl: '/assets/thumbnails/Video_1_Thumbnail.png',
        alt: '',
    },
    {
        title: 'Our Goal',
        description:
            'Provide an 8-hour digital skills training program for 7,500 residents of Los Angeles County.',
        imageUrl: '/assets/thumbnails/Video_1_Thumbnail.png',
        alt: '',
    },
    {
        title: 'Our Mission',
        description:
            'Our mission is to make technology training accessible for residents, strengthening our community through learning and connection.',
        imageUrl: '/assets/thumbnails/Video_1_Thumbnail.png',
        alt: '',
    },
];

function AboutUsPage() {
    return (
        <main className="about-page">
            <section className="about-page__hero" aria-label="About LearnBasicTech hero image" />

            <section className="about-page__intro">
                <div className="page-container about-page__intro-grid">
                    <h1 className="about-page__headline">About LearnBasicTech</h1>
                    <p className="about-page__description">
                        We are LearnBasicTech (LBT); an initiative that help delete the digital divide as a part of the DTD initiative started by the Internal Service Department (ISD) of Los Angeles County.
                        <br /><br />
                        Our objective is to provide and monitor an 8-hour digital skills training program for 7,500 residents of Los Angeles County. Our Mission is to empower users with the fundamental knowledge of Digital Skills.
                    </p>
                </div>
            </section>

            <section className="about-page__pillars">
                <div className="page-container about-page__pillars-grid">
                    {aboutPillars.map((pillar) => (
                        <InfoCard key={pillar.title} {...pillar} />
                    ))}
                </div>
            </section>

            <section className="about-page__impact">
                <div className="page-container about-page__impact-layout">
                    <div className="about-page__impact-content">
                        <h2 className="about-page__impact-title">Delete The Divide</h2>
                        <p className="about-page__impact-copy">
                            Delete The Divide is an initiative led by the County of Los Angeles to empower youth, young adults, and small businesses in underserved communities who are adversely impacted by the digital divide. Partnerships have been established with public, private, academic, and community-based organizations to unify efforts in ensuring that members have direct access, training, and support services in modern technologies. The coalition of partners will provide existing programs, services and resources to connect youth, young adults and small businesses to opportunities in technology that enable pathways to personal development and economic growth.
                        </p>
                        <Link className="about-page__impact-cta" to="/courses">
                            Learn More
                        </Link>
                    </div>

                    <img
                        className="about-page__impact-image"
                        src="/assets/thumbnails/Video_1_Thumbnail.png"
                        alt=""
                    />
                </div>
            </section>
        </main>
    );
}

export default AboutUsPage;
