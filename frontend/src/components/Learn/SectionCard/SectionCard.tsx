import type { CourseSection } from '../../../types/Course';
// import type { LearnSection } from "../../../types/Learn";
import { Link } from 'react-router-dom';
import './SectionCard.css';

type SectionCardProps = {
    section: CourseSection;
    courseSlug: string;
    isCompleted?: boolean;
};

function SectionCard({ section, courseSlug, isCompleted }: SectionCardProps) {
    return (
        <Link
            className="section-card"
            to={`/learn/${courseSlug}/${section.slug}`}
        >
            <div className="section-card__main">
                <span className="section-card__title">{section.title}</span>
                <span className="section-card__type">{section.type}</span>
            </div>

            <span
                className={`section-card__status ${
                    isCompleted ? 'section-card__status--completed' : ''
                }`}
                aria-label={
                    isCompleted ? 'Completed section' : 'Incomplete section'
                }
            >
                {isCompleted ? '✓' : ''}
            </span>
        </Link>
    );
}

export default SectionCard;
