import { Link } from 'react-router-dom';

import './HowToPlayCard.css';

export type HowToPlayCardProps = {
    title: string;
    videoSrc: string;
    gamePageHref?: string;
};

function HowToPlayCard({
    title,
    videoSrc,
    gamePageHref = '/games',
}: HowToPlayCardProps) {
    return (
        <article className="how-to-play-card">
            <h3 className="how-to-play-card__title">{title}</h3>
            <video
                className="how-to-play-card__video"
                controls
                preload="metadata"
                muted
            >
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <Link className="how-to-play-card__button" to={gamePageHref}>
                Game Page
            </Link>
        </article>
    );
}

export default HowToPlayCard;
