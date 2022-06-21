const videoValidation = url =>
	url.match(
		/https?:\/\/.*\.(?:mp4|webm|ogg)|(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(&\S+)?/
	);

export default videoValidation;
