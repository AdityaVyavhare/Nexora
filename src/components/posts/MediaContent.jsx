import ImagePost from "./ImagePost";
import VideoPost from "./VideoPost";
import AudioPost from "./AudioPost";
import PDFPost from "./PDFPost";
import FilePost from "./FilePost";
import TextPost from "./TextPost";

const MediaContent = ({ type, media, text }) => {
  switch (type) {
    case "image":
      return <ImagePost media={media} />;
    case "video":
      return <VideoPost media={media} />;
    case "audio":
      return <AudioPost media={media} />;
    case "pdf":
      return <PDFPost media={media} />;
    case "file":
      return <FilePost media={media} />;
    case "text":
    default:
      return <TextPost text={text} />;
  }
};

export default MediaContent;
