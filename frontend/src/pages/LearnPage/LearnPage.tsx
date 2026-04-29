import { useParams } from "react-router-dom";
import "./LearnPage.css";

function LearnPage() {
    const { courseSlug } = useParams();

    return (
        <section className="learn-page">
            <div className="learn-page__content page-container">
                <div className="learn-page__header">
                    <p className="learn-page__eyebrow">Now learning</p>
                    <h1 className="learn-page__title">{courseSlug}</h1>
                </div>

                <div className="learn-page__layout">
                    <aside className="learn-page__sidebar">
                        Lesson Sidebar
                    </aside>

                    <div className="learn-page__main">
                        <div className="learn-page__video-placeholder">
                            Video Player
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default LearnPage;