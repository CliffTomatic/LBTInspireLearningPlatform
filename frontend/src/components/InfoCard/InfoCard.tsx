import './InfoCard.css';

export type InfoCardProps = {
    title?: string;
    description?: string;
    imageUrl?: string;
    alt?: string;
    imageMode?: 'default' | 'icon';
    titleSize?: 'default' | 'large' | 'display';
    showFrame?: boolean;
    cardClassName?: string;
};

function InfoCard({
    title,
    description,
    imageUrl,
    alt,
    imageMode = 'default',
    titleSize = 'default',
    showFrame = true,
    cardClassName,
}: InfoCardProps) {
    const cardClassNames = [
        'info-card',
        imageMode === 'icon' ? 'info-card--icon-image' : '',
        titleSize === 'large' ? 'info-card--title-large' : '',
        titleSize === 'display' ? 'info-card--title-display' : '',
        !showFrame ? 'info-card--no-frame' : '',
        cardClassName ?? '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <article className={cardClassNames}>
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
