/* eslint-disable no-undef */

const videoEvents = () => {
	const videoBLocks = document.querySelectorAll('.maxi-video-block');
	videoBLocks.forEach(video => {
		if (video.classList.contains('maxi-video-block--youtube')) {
			if (!isScriptMounted('maxi-youtube-sdk')) insertYoutubeScript();
			return;
		}

		const videoID = video?.id;
		let videoData;

		if (typeof maxiVideo[0][videoID] === 'string') {
			try {
				videoData = JSON.parse(maxiVideo[0][videoID]);
			} catch (e) {
				console.error('Invalid JSON string', e);
				videoData = null;
			}
		} else if (
			typeof maxiVideo[0][videoID] === 'object' &&
			maxiVideo[0][videoID] !== null
		) {
			videoData = maxiVideo[0][videoID];
		} else {
			videoData = null;
		}

		const { videoType } = videoData;
		const videoEnd = videoData.endTime;

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

		const { embedUrl } = videoData;

		if (videoData.playerType === 'popup') {
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
			maxiVideo[0][videoID] !== undefined
				? JSON.parse(maxiVideo[0][videoID])
				: null;

		const popupContent =
			videoData.playerType === 'popup' && insertPopup(video);
		const iframe =
			videoData.playerType === 'popup'
				? popupContent.querySelector('iframe')
				: video.querySelector('iframe');

		iframe.id = `${videoID}-iframe`;
		iframe.src = videoData.embedUrl;

		const player = new window.YT.Player(iframe, {
			events: {
				onStateChange: handleStateChange,
			},
		});

		function handleStateChange(state) {
			const { isLoop, startTime } = videoData;

			if (state.data === window.YT.PlayerState.ENDED && isLoop) {
				player.seekTo(startTime || 0);
			}
		}

		if (videoData.playerType === 'popup') {
			popupEvents(video, popupContent, '', () => player.pauseVideo());
		}
	});
};

function handleVimeoVideos() {
	const vimeoVideos = document.querySelectorAll('.maxi-video-block--vimeo');
	vimeoVideos.forEach(video => {
		const videoID = video.id;

		let videoData;

		if (typeof maxiVideo[0][videoID] === 'string') {
			try {
				videoData = JSON.parse(maxiVideo[0][videoID]);
			} catch (e) {
				console.error('Invalid JSON string', e);
				videoData = null;
			}
		} else if (
			typeof maxiVideo[0][videoID] === 'object' &&
			maxiVideo[0][videoID] !== null
		) {
			videoData = maxiVideo[0][videoID];
		} else {
			videoData = null;
		}

		const popupContent =
			videoData.playerType === 'popup' && insertPopup(video);
		const player =
			videoData.playerType === 'popup'
				? popupContent.querySelector('iframe')
				: video.querySelector('iframe');

		player.src = videoData.embedUrl;
		const vimeoPlayer = new window.Vimeo.Player(player);
		const { endTime } = videoData;
		const { startTime } = videoData;
		const { isLoop } = videoData;

		vimeoPlayer.on('timeupdate', data => {
			if (data.seconds > +endTime) {
				if (isLoop) vimeoPlayer.setCurrentTime(startTime || '0');
				else vimeoPlayer.pause();
			}
		});

		if (videoData.playerType === 'popup') {
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
