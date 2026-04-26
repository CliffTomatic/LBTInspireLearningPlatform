import "./VideoCard.css"

type Video = {
    id: number;
    title: string;
    description: string;
    thumbnailURL: string;
};

function VideoCard(video: Video) {
    return (
    <div className="video-card">
        <img src={video.thumbnailURL} alt="Thumbnail Image" className="video-card__thumbnail" />
        <div className="video-card__content">
            <h1 className="video-card__title">{video.title}</h1>
            <h2 className="video-card__description">{video.description}</h2>
            <button className="video-card__button">Watch</button>
        </div>
    </div>
    );
}

export default VideoCard;