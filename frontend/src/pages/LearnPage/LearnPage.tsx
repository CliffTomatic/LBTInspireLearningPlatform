import { useParams } from "react-router-dom";

import LearnSidebar from "../../components/Learn/LearnSidebar/LearnSidebar";
import "./LearnPage.css";

function LearnPage() {
    const { courseSlug } = useParams();

    return (
        <section className="learn-page">
            <div className="learn-page__content">

                <div className="learn-page__layout">
                    <LearnSidebar courseSlug={courseSlug} progressPercent={26} courseTitle="{courseSlug}" />

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