import './BlogsPage.css';
import BlogCards from '../../components/BlogCards/BlogCards';
import { blogs } from '../../data/blogs';
import { useState } from 'react';

const faqs = [
    {
        id: 1,
        question: 'What is LearnBasicTech?',
        answer: 'LearnBasicTech is a guide to understanding the basics of technology. We provide free resources and courses that can be used to improve your digital skills. We host weekly events in Los Angeles County to educate patrons about the importance of technology as we aim to delete the technological divide in Los Angeles.',
    },
    {
        id: 2,
        question: 'How do I attend an in-person event?',
        answer: 'Flyers will be posted to LearnBasicTech social media accounts, the LearnBasicTech website and mentioned at the local hosting libraries. We aim to have events at reoccurring locations, making it easier for patrons to commute to their weekly lessons.',
    },
    {
        id: 3,
        question: 'Are there any requirements for me to join?',
        answer: 'At LearnBasicTech, there are no requirements for you to join as we hope to improve every individuals technological understanding and skills. Signing up can be done by clicking a few buttons or by attending events. More events will be hosted soon around Los Angeles County.',
    },
];

function BlogsPage() {
    const initialVisibleCount = blogs.length >= 6 ? 6 : blogs.length;
    const [visibleBlogCount, setVisibleBlogCount] =
        useState(initialVisibleCount);
    const [expandedFaqs, setExpandedFaqs] = useState<Record<number, boolean>>(
        Object.fromEntries(faqs.map((faq) => [faq.id, true])) as Record<
            number,
            boolean
        >,
    );

    const toggleFaq = (id: number) => {
        setExpandedFaqs((current) => ({
            ...current,
            [id]: !current[id],
        }));
    };

    const scrollToSection = (sectionId: string) => {
        const section = document.getElementById(sectionId);
        if (!section) {
            return;
        }

        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    const loadMoreBlogs = () => {
        setVisibleBlogCount((currentCount) =>
            Math.min(currentCount + 6, blogs.length),
        );
    };

    const visibleBlogs = blogs.slice(0, visibleBlogCount);
    const hasMoreBlogs = visibleBlogCount < blogs.length;

    return (
        <main className="blogs-page">
            <section className="blogs-hero" aria-labelledby="blogs-hero-title">
                <div className="blogs-hero__overlay" />
                <div className="blogs-hero__content page-container">
                    <h1
                        id="blogs-hero-title"
                        className="blogs-hero__heading-main"
                    >
                        LearnBasicTech
                    </h1>
                    <p className="blogs-hero__heading-sub">Blog</p>
                    <p className="blogs-hero__subtitle">
                        Unlock Digital Skills with LearnBasicTech
                    </p>
                    <div
                        className="blogs-hero__actions"
                        aria-label="Blog category buttons"
                    >
                        <button
                            className="blogs-button blogs-button--hero"
                            type="button"
                            onClick={() =>
                                scrollToSection('latest-stories-section')
                            }
                        >
                            LearnBasicBlog
                        </button>
                        <button
                            className="blogs-button blogs-button--hero"
                            type="button"
                            onClick={() => scrollToSection('faq-section')}
                        >
                            FAQ&apos;s
                        </button>
                        <button
                            className="blogs-button blogs-button--hero"
                            type="button"
                        >
                            Upcoming Events
                        </button>
                    </div>
                </div>
            </section>

            <section
                id="latest-stories-section"
                className="blogs-latest page-container"
                aria-labelledby="latest-stories-title"
            >
                <h2
                    id="latest-stories-title"
                    className="blogs-section-heading blogs-section-heading--left blogs-latest__heading"
                >
                    Latest Stories
                </h2>
                <div className="blogs-latest__grid" role="list">
                    {visibleBlogs.map((post) => (
                        <BlogCards key={post.id} post={post} />
                    ))}
                </div>
                {hasMoreBlogs && (
                    <div className="blogs-latest__actions">
                        <button
                            type="button"
                            className="blogs-button blogs-button--load-more blogs-latest__load-more"
                            onClick={loadMoreBlogs}
                        >
                            Load more
                        </button>
                    </div>
                )}
            </section>

            <section
                id="faq-section"
                className="blogs-faq page-container"
                aria-labelledby="blogs-faq-title"
            >
                <h2
                    id="blogs-faq-title"
                    className="blogs-section-heading blogs-faq__heading"
                >
                    Frequently Asked Questions
                </h2>
                <div className="blogs-faq__list">
                    {faqs.map((faq) => {
                        const isExpanded = expandedFaqs[faq.id];
                        return (
                            <article key={faq.id} className="blogs-faq__card">
                                <button
                                    type="button"
                                    className="blogs-faq__question-row"
                                    onClick={() => toggleFaq(faq.id)}
                                    aria-expanded={isExpanded}
                                    aria-controls={`faq-answer-${faq.id}`}
                                >
                                    <span className="blogs-faq__question">
                                        {faq.question}
                                    </span>
                                    <span
                                        className={`blogs-faq__arrow ${isExpanded ? 'is-expanded' : ''}`}
                                        aria-hidden="true"
                                    >
                                        ▾
                                    </span>
                                </button>
                                {isExpanded && (
                                    <p
                                        id={`faq-answer-${faq.id}`}
                                        className="blogs-faq__answer"
                                    >
                                        {faq.answer}
                                    </p>
                                )}
                            </article>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}

export default BlogsPage;
