import './VideoPlayer.css';

type VideoPlayerProps = {
    sectionSlug: string;
    thumbnailUrl?: string;
    videoUrl: string;
};

function VideoPlayer({
    sectionSlug,
    thumbnailUrl,
    videoUrl,
}: VideoPlayerProps) {
    return (
        <div className="video-player">
            <video
                className="video-player__media"
                controls
                preload="metadata"
                poster={thumbnailUrl}
            >
                <source src={videoUrl} type="video/mp4" />
            </video>

            {/* Temp so TS doesn't throw "not used" */}
            <p className="video-player__section-slug">{sectionSlug}</p>
        </div>
    );
}

export default VideoPlayer;
