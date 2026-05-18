import './AboutUsPage.css';
import { Link } from 'react-router-dom';
import InfoCard, {
    type InfoCardProps,
} from '../../components/InfoCard/InfoCard';

const aboutPillars: InfoCardProps[] = [
    {
        title: 'Our Vision',
        description:
            'Our vision is a community where everyone has access to free, inclusive tech training that builds the skills and confidence needed to thrive in the digital world.',
        imageUrl: '/assets/thumbnails/placeholder.png',
        alt: '',
    },
    {
        title: 'Our Goal',
        description:
            'Provide an 8-hour digital skills training program for 7,500 residents of Los Angeles County.',
        imageUrl: '/assets/thumbnails/placeholder.png',
        alt: '',
    },
    {
        title: 'Our Mission',
        description:
            'Our mission is to make technology training accessible for residents, strengthening our community through learning and connection.',
        imageUrl: '/assets/thumbnails/placeholder.png',
        alt: '',
    },
];

const digitalDivideCards: InfoCardProps[] = [
    {
        title: 'Did you Know?',
        description:
            'The digital divide affects low income and undeserved communities',
        titleSize: 'display',
        showFrame: false,
    },
    {
        title: '132,985',
        description: 'Households without computers',
        imageUrl: '/assets/thumbnails/placeholder.png',
        alt: 'Laptop icon',
        imageMode: 'icon',
        titleSize: 'large',
    },
    {
        title: '278,250',
        description: 'With no internet subscriptions',
        imageUrl: '/assets/thumbnails/placeholder.png',
        alt: 'WiFi icon',
        imageMode: 'icon',
        titleSize: 'large',
    },
    {
        title: '376,101',
        description: 'Households with only cell phones for internet access',
        imageUrl: '/assets/thumbnails/placeholder.png',
        alt: 'Phone icon',
        imageMode: 'icon',
        titleSize: 'large',
    },
];

const coalitionCards: InfoCardProps[] = [
    {
        title: 'Los Angeles County',
        description:
            'On October 2020, amid the pandemic, the LA County Board of Supervisors unanimously directed the Internal Services Department to lead the response to the digital inequity.',
        imageUrl: '/assets/thumbnails/placeholder.png',
        alt: 'Los Angeles County',
    },
    {
        title: 'California Public Utilities Commission',
        description:
            'Funding for this project has been provided in part through a grant by the Broadband Adoption Account of the California Advanced Services Fund, a program administered by the California Public Utilities Commission.',
        imageUrl: '/assets/thumbnails/placeholder.png',
        alt: 'California Public Utilities Commission',
    },
    {
        title: 'Internal Services Department',
        description:
            'The Internal Services Department (ISD) is the backbone of Los Angeles County, leading the charge against digital inequity through the launch of the Delete the Divide initiative, which gave rise to LearnBasicTech.org.',
        imageUrl: '/assets/thumbnails/placeholder.png',
        alt: 'Internal Services Department',
    },
    {
        title: 'Delete The Divide',
        description:
            'Delete The Divide, a Los Angeles County initiative that promotes digital equity via partnerships, infrastructure, and technology for communities and small business and launched LearnBasicTech.org.',
        imageUrl: '/assets/thumbnails/placeholder.png',
        alt: 'Delete The Divide',
    },
];

function AboutUsPage() {
    return (
        <main className="about-page">
            <section
                className="about-page__hero"
                aria-label="About LearnBasicTech hero image"
            />

            <section className="about-page__section about-page__section--intro">
                <div className="page-container about-page__grid about-page__grid--intro">
                    <h1 className="about-page__headline">
                        About LearnBasicTech
                    </h1>
                    <p className="about-page__description">
                        We are LearnBasicTech (LBT); an initiative that help
                        delete the digital divide as a part of the DTD
                        initiative started by the Internal Service Department
                        (ISD) of Los Angeles County.
                        <br />
                        <br />
                        Our objective is to provide and monitor an 8-hour
                        digital skills training program for 7,500 residents of
                        Los Angeles County. Our Mission is to empower users with
                        the fundamental knowledge of Digital Skills.
                    </p>
                </div>
            </section>

            <section className="about-page__section about-page__section--cards">
                <div className="page-container about-page__grid about-page__grid--3">
                    {aboutPillars.map((pillar) => (
                        <InfoCard key={pillar.title} {...pillar} />
                    ))}
                </div>
            </section>

            <section className="about-page__section about-page__section--cards">
                <div className="page-container about-page__split about-page__split--media">
                    <div className="about-page__dtd-content">
                        <img
                            className="about-page__dtd-logo"
                            src="/assets/thumbnails/placeholder.png"
                            alt="Delete The Divide"
                        />
                        <p className="about-page__dtd-text">
                            Delete The Divide is an initiative led by the County
                            of Los Angeles to empower youth, young adults, and
                            small businesses in underserved communities who are
                            adversely impacted by the digital divide.
                            Partnerships have been established with public,
                            private, academic, and community-based organizations
                            to unify efforts in ensuring that members have
                            direct access, training, and support services in
                            modern technologies. The coalition of partners will
                            provide existing programs, services and resources to
                            connect youth, young adults and small businesses to
                            opportunities in technology that enable pathways to
                            personal development and economic growth.
                        </p>
                        <Link className="about-page__button" to="/courses">
                            Learn More
                        </Link>
                    </div>

                    <img
                        className="about-page__dtd-image"
                        src="/assets/thumbnails/Video_1_Thumbnail.png"
                        alt=""
                    />
                </div>
            </section>

            <section className="about-page__section about-page__section--intro">
                <div className="page-container about-page__grid about-page__grid--intro">
                    <h1 className="about-page__headline">
                        What is the Digital Divide?
                    </h1>
                    <p className="about-page__description">
                        The digital divide refers to the gap between individuals
                        who have access to modern information and communication
                        technology and those who do not. This divide can impact
                        education, employment, and overall quality of life.
                    </p>
                </div>
            </section>

            <div className="about-page__separator">
                <div className="page-container">
                    <div
                        className="about-page__separator-line"
                        aria-hidden="true"
                    />
                </div>
            </div>

            <section className="about-page__section about-page__section--cards-tight">
                <div className="page-container about-page__grid about-page__grid--feature">
                    {digitalDivideCards.map((card) => (
                        <InfoCard key={card.title} {...card} />
                    ))}
                </div>
            </section>

            <section className="about-page__section about-page__section--source">
                <div className="page-container">
                    <p className="about-page__stats-source-text">
                        (Source: 2023 American Community Survey 5-Year Estimates
                        for Los Angeles County)
                    </p>
                </div>
            </section>

            <section className="about-page__section about-page__section--heading">
                <div className="page-container">
                    <h2 className="about-page__coalition-heading">
                        The Coalition
                    </h2>
                </div>
            </section>

            <section className="about-page__section about-page__section--cards">
                <div className="page-container about-page__grid about-page__grid--4">
                    {coalitionCards.map((card) => (
                        <InfoCard key={card.title} {...card} />
                    ))}
                </div>
            </section>

            <section className="about-page__section about-page__section--cta">
                <div className="page-container">
                    <h2 className="about-page__signup-heading">
                        Haven&apos;t signed up yet?
                    </h2>
                    <div className="about-page__split about-page__split--cta">
                        <p className="about-page__signup-text">
                            This is the perfect place to start. <br />
                            Choose any of our courses and start learning new
                            skills.
                        </p>
                        <Link className="about-page__button" to="/">
                            Get Started Now!
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default AboutUsPage;
