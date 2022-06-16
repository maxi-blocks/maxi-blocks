const videoUrlRegex =
	/(https?:\/\/)(www.)?((youtube\.com|youtu\.be)\/(watch[?]v=)?([a-zA-Z0-9_-]{11}))|https?:\/\/(www.)?vimeo.com\/([0-9])|https?:\/\/.*\.(?:mp4|webm|ogg)$/g;

export default videoUrlRegex;
