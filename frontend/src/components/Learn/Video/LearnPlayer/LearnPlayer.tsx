import VideoPlayer from '../VideoPlayer/VideoPlayer';
import type { Course, CourseSection } from '../../../../types/Course';
import './LearnPlayer.css';

type LearnPlayerProps = {
    course: Course;
    section: CourseSection;
};

function LearnPlayer({ course, section }: LearnPlayerProps) {
    // Validate Section Video
    if (section.type === 'video' && !section.videoUrl) {
        return <p>Video not found for this section.</p>;
    }
    // Tell TS videoUrl will never be undefined
    if (!section.videoUrl) {
        return <p>Video not found for this section.</p>;
    }

    return (
        <section className="learn-player">
            <div className="learn-player__header">
                <p className="learn-player__course-title">{course.title}</p>
                <h1 className="learn-player__section-title">{section.title}</h1>
            </div>

            <VideoPlayer
                sectionSlug={section.slug}
                thumbnailUrl={section.thumbnailUrl}
                videoUrl={section.videoUrl}
            />
        </section>
    );
}

export default LearnPlayer;
