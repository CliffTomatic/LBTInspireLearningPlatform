import VideoCard from "../VideoCard/VideoCard";
import "./VideoCarousel.css";

// Mock data, to be removed when assets are added.
type Video = {
  id: number;
  title: string;
  description: string;
  thumbnailURL: string;
};
const videos: Video[] = [
  {
    id: 1,
    title: "Test Video One",
    description: "Description of Video One",
    thumbnailURL: "../public/assets/thumbnails/Video_1_Thumbnail.png",
  },
  {
    id: 2,
    title: "Test Video Two",
    description: "Description of Video Two",
    thumbnailURL: "../public/assets/thumbnails/Video_1_Thumbnail.png",
  },
];

function VideoCarousel() {
  return (
    <>
      <h2 className="video-carousel__title">Recommended Courses</h2>

      <section className="video-carousel">
        <div className="video-carousel__track">
          {videos.map((video) => (
            <VideoCard
              id={video.id}
              title={video.title}
              description={video.description}
              thumbnailURL={video.thumbnailURL}
            />
          ))}
        </div>
      </section>
    </>
  );
}

export default VideoCarousel;
