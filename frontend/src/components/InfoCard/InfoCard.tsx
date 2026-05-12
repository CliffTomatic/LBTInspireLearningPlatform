import './InfoCard.css';

export type InfoCardProps = {
    title?: string;
    description?: string;
    imageUrl?: string;
    alt?: string;
};

function InfoCard({ title, description, imageUrl, alt }: InfoCardProps) {
    return (
        <article className="info-card">
            {imageUrl && (
                <img
                    className="info-card__image"
                    src={imageUrl}
                    alt={alt ?? ''}
                />
            )}
            {title && <h2 className="info-card__title">{title}</h2>}
            {description && (
                <p className="info-card__description">{description}</p>
            )}
        </article>
    );
}

export default InfoCard;