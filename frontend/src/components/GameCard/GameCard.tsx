import './GameCard.css';
import { Link } from 'react-router-dom';

export type GameCardProps = {
    title: string;
    description: string;
    imageUrl: string;
    imageAlt: string;
    gamePageHref?: string;
};

function GameCard({
    title,
    description,
    imageUrl,
    imageAlt,
    gamePageHref = '/games',
}: GameCardProps) {
    return (
        <article className="game-card">
            <img className="game-card__image" src={imageUrl} alt={imageAlt} />
            <div className="game-card__content">
                <h3 className="game-card__title">{title}</h3>
                <p className="game-card__description">{description}</p>
                <Link className="game-card__button" to={gamePageHref}>
                    Game Page
                </Link>
            </div>
        </article>
    );
}

export default GameCard;
