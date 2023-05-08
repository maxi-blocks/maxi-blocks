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

		const { _vt: videoType } = videoData;
		const videoEnd = videoData._et;

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
			return;
		}

		const { _eu: embedUrl } = videoData;

		if (videoData._pt === 'popup') {
			const popupContent = insertPopup(video);
			popupEvents(video, popupContent, embedUrl);
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

		const popupContent = insertPopup(video);
		const iframe =
			videoData._pt === 'popup'
				? popupContent.querySelector('iframe')
				: video.querySelector('iframe');

		iframe.id = `${videoID}-iframe`;
		iframe.src = videoData._eu;

		const player = new YT.Player(iframe, {
			events: {
				onStateChange: handleStateChange,
			},
		});

		function handleStateChange(state) {
			const { _il: isLoop, _sti: startTime } = videoData;

			if (state.data === YT.PlayerState.ENDED && isLoop) {
				player.seekTo(startTime || 0);
			}
		}

		if (videoData._pt === 'popup') {
			popupEvents(video, popupContent, '', () => player.pauseVideo());
		}
	});
};

function handleVimeoVideos() {
	const vimeoVideos = document.querySelectorAll('.maxi-video-block--vimeo');
	vimeoVideos.forEach(video => {
		const videoID = video.id;

		const videoData =
			maxiVideo[0][videoID] !== undefined ? maxiVideo[0][videoID] : null;

		const popupContent = insertPopup(video);
		const player =
			videoData._pt === 'popup'
				? popupContent.querySelector('iframe')
				: video.querySelector('iframe');

		player.src = videoData._eu;
		const vimeoPlayer = new Vimeo.Player(player);
		const { _et: endTime } = videoData;
		const { _sti: startTime } = videoData;
		const { _il: isLoop } = videoData;

		vimeoPlayer.on('timeupdate', function (data) {
			if (data.seconds > +endTime) {
				if (isLoop) vimeoPlayer.setCurrentTime(startTime || '0');
				else vimeoPlayer.pause();
			}
		});

		if (videoData._pt === 'popup') {
			popupEvents(video, popupContent, '', () => vimeoPlayer.pause());
		}
	});
}

function insertPopup(video) {
	const popupContent = video
		.querySelector('.maxi-video-block__popup-wrapper')
		.cloneNode(true);
	const uniqueID = video.id;
	const popupSlot = document.getElementById('maxi-popup-slot');

	const createPopup = () => {
		const popup = document.createElement('div');
		popup.id = `popup-${uniqueID}`;
		popup.appendChild(popupContent);

		return popup;
	};

	if (!popupSlot) {
		const popupSlot = document.createElement('div');
		popupSlot.id = 'maxi-popup-slot';
		popupSlot.style.zIndex = '999999';

		popupSlot.appendChild(createPopup());

		const body = document.querySelector('body');
		body.appendChild(popupSlot);
	} else {
		popupSlot.appendChild(createPopup());
	}

	return popupContent;
}

function popupEvents(video, popupContent, embedUrl, pauseVideo = null) {
	const overlay = video.querySelector('.maxi-video-block__overlay');
	const player = popupContent.querySelector(
		'.maxi-video-block__video-player'
	);

	const openVideo = () => {
		popupContent.style.display = 'flex';
		if (!pauseVideo) player.src = embedUrl;
	};

	const closeVideo = e => {
		if (e.target.classList.contains('maxi-video-block__video-player'))
			return;
		popupContent.style.display = 'none';
		if (pauseVideo) {
			pauseVideo();
		} else {
			player.src = '';
		}
	};

	document.addEventListener('keydown', e => {
		if (popupContent.style.display === 'flex') {
			if (e.key === 'Escape') {
				closeVideo(e);
			}
		}
	});

	overlay.addEventListener('click', openVideo);
	popupContent.addEventListener('click', closeVideo);
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

window.onYouTubeIframeAPIReady = () => {
	handleYoutubeVideos();
};

window.addEventListener('load', videoEvents);
