import type { CourseSection } from '../../../types/Course';
// import type { LearnSection } from "../../../types/Learn";
import { Link } from 'react-router-dom';
import './SectionCard.css';

type SectionCardProps = {
    section: CourseSection;
    courseSlug: string;
};

function SectionCard({ section, courseSlug }: SectionCardProps) {
    return (
        <Link
            className="section-card"
            to={`/learn/${courseSlug}/${section.slug}`}
        >
            <div className="section-card__main">
                <span className="section-card__title">{section.title}</span>
                <span className="section-card__type">{section.type}</span>
            </div>

            {/*{
                TODO: Disable Card if learner has not completed the previous
                 one yet.
            } */}
            <span className="section-card__status">
                {section.isCompleted ? '✓' : ''}
            </span>
        </Link>
    );
}

export default SectionCard;
