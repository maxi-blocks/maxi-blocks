const videoEvents = () => {
	const videoBLocks = document.querySelectorAll('.maxi-video-block');
	videoBLocks.forEach(video => {
		if (video.classList.contains('maxi-video-block--youtube')) {
			if (!isScriptMounted('maxi-youtube-sdk')) insertYoutubeScript();
			return;
		}

		const videoID = video.id;

		const videoData =
			maxiVideo[0][videoID] !== undefined ? maxiVideo[0][videoID] : null;

		const player = video.querySelector('.maxi-video-block__video-player');
		const videoType = videoData['videoType'];
		const embedUrl = videoData['embedUrl'];

		if (videoData['playerType'] === 'popup') {
			popupEvents(player, video, videoType, embedUrl);
		}

		const videoEnd = videoData['endTime'];

		if (videoType === 'vimeo' && videoEnd) {
			if (!isScriptMounted('maxi-vimeo-sdk')) {
				const script = document.createElement('script');
				script.src = 'https://player.vimeo.com/api/player.js';
				script.id = 'maxi-vimeo-sdk';
				script.async = true;
				script.onload = () => {
					// Cleanup onload handler
					script.onload = null;

					handleVimeoVideos();
				};
				document.body.appendChild(script);
			}
		}
	});
};

const handleYoutubeVideos = () => {
	const youtubeVideos = document.querySelectorAll(
		'.maxi-video-block--youtube'
	);
	youtubeVideos.forEach(video => {
		const videoID = video.id;

		const videoData =
			maxiVideo[0][videoID] !== undefined ? maxiVideo[0][videoID] : null;

		const iframe = video.querySelector('iframe');
		iframe.id = `${videoID}-iframe`;
		iframe.src = videoData['embedUrl'];

		const player = new YT.Player(iframe.id, {
			events: {
				onStateChange: handleStateChange,
			},
		});

		function handleStateChange(state) {
			const { isLoop, startTime } = videoData;

			if (state.data === YT.PlayerState.ENDED && isLoop) {
				player.seekTo(startTime || 0);
			}
		}

		if (videoData['playerType'] === 'popup') {
			popupEvents(player, video, 'youtube');
		}
	});
};

function handleVimeoVideos() {
	const vimeoVideos = document.querySelectorAll('.maxi-video-block--vimeo');
	vimeoVideos.forEach(video => {
		const videoID = video.id;

		const videoData =
			maxiVideo[0][videoID] !== undefined ? maxiVideo[0][videoID] : null;

		const player = video.querySelector('iframe');

		player.src = videoData['embedUrl'];
		const vimeoPlayer = new Vimeo.Player(player);
		const endTime = videoData['endTime'];
		const startTime = videoData['startTime'];
		const isLoop = videoData['isLoop'];

		vimeoPlayer.on('timeupdate', function (data) {
			if (data.seconds > +endTime) {
				if (isLoop) vimeoPlayer.setCurrentTime(startTime || '0');
				else vimeoPlayer.pause();
			}
		});
	});
}

function popupEvents(player, video, type, embedUrl) {
	const wrapper = video.querySelector('.maxi-video-block__popup-wrapper');
	const playButton = video.querySelector('.maxi-video-block__play-button');
	const overlay = video.querySelector('.maxi-video-block__overlay');

	const openVideo = () => {
		wrapper.style.display = 'flex';
		if (type !== 'youtube') player.src = embedUrl;
	};

	const closeVideo = e => {
		if (e.target.classList.contains('maxi-video-block__video-player'))
			return;
		wrapper.style.display = 'none';
		if (type === 'youtube') {
			player.pauseVideo();
		} else {
			player.src = '';
		}
	};

	overlay.addEventListener('click', openVideo);
	playButton.addEventListener('click', openVideo);
	wrapper.addEventListener('click', closeVideo);
}

function isScriptMounted(id) {
	const scriptsArray = Array.from(window.document.scripts);

	const mountedId = scriptsArray.findIndex(
		script => script.getAttribute('id') === id
	);

	return mountedId !== -1;
}

function insertYoutubeScript() {
	const script = document.createElement('script');
	script.src = 'https://www.youtube.com/iframe_api';
	script.id = 'maxi-youtube-sdk';
	document.body.appendChild(script);
}

function onYouTubeIframeAPIReady() {
	handleYoutubeVideos();
}

window.addEventListener('load', videoEvents);
