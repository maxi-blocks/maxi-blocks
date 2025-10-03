/* eslint-disable no-undef */

window.addEventListener('load', videoEvents);

function videoEvents() {
	const videoBLocks = document.querySelectorAll('.maxi-video-block');
	videoBLocks.forEach(video => {
		if (video.classList.contains('maxi-video-block--youtube')) {
			if (!isScriptMounted('maxi-youtube-sdk')) insertYoutubeScript();
			return;
		}

		const videoID = video?.id;
		const videoData = getVideoData(videoID);

		if (!videoData) return;

		const { videoType, endTime, embedUrl, playerType } = videoData;

		if (videoType === 'vimeo' && endTime) {
			if (!isScriptMounted('maxi-vimeo-sdk')) {
				loadScript(
					'https://player.vimeo.com/api/player.js',
					'maxi-vimeo-sdk',
					handleVimeoVideos
				);
			}
			return;
		}

		if (playerType === 'popup') {
			const popupContent = insertPopup(video);
			popupEvents(video, popupContent, embedUrl);
		}
	});
}

function getVideoData(videoID) {
	try {
		if (typeof maxiVideo[0][videoID] === 'string') {
			return JSON.parse(maxiVideo[0][videoID]);
		}
		if (
			typeof maxiVideo[0][videoID] === 'object' &&
			maxiVideo[0][videoID] !== null
		) {
			return maxiVideo[0][videoID];
		}
	} catch (e) {
		console.error('Invalid JSON string', e);
	}
	return null;
}

function handleYoutubeVideos() {
	const youtubeVideos = document.querySelectorAll(
		'.maxi-video-block--youtube'
	);
	youtubeVideos.forEach(video => {
		const videoID = video.id;
		const videoData = getVideoData(videoID);

		if (!videoData) return;

		const { playerType, embedUrl, isLoop, startTime } = videoData;
		const popupContent = playerType === 'popup' && insertPopup(video);
		const iframe =
			playerType === 'popup'
				? popupContent.querySelector('iframe')
				: video.querySelector('iframe');

		iframe.id = `${videoID}-iframe`;
		iframe.src = embedUrl;

		const player = new window.YT.Player(iframe, {
			events: {
				onStateChange: state =>
					handleYoutubeStateChange(state, player, isLoop, startTime),
			},
		});

		if (playerType === 'popup') {
			popupEvents(video, popupContent, '', () => player.pauseVideo());
		}
	});
}

function handleYoutubeStateChange(state, player, videoData) {
	const { isLoop, startTime } = videoData;
	if (state.data === window.YT.PlayerState.ENDED && isLoop) {
		player.seekTo(startTime || 0);
	}
}

function handleVimeoVideos() {
	const vimeoVideos = document.querySelectorAll('.maxi-video-block--vimeo');
	vimeoVideos.forEach(video => {
		const videoID = video.id;
		const videoData = getVideoData(videoID);

		if (!videoData) return;

		const { playerType, embedUrl, endTime, startTime, isLoop } = videoData;
		const popupContent = playerType === 'popup' && insertPopup(video);
		const player =
			playerType === 'popup'
				? popupContent.querySelector('iframe')
				: video.querySelector('iframe');

		player.src = embedUrl;
		const vimeoPlayer = new window.Vimeo.Player(player);

		vimeoPlayer.on('timeupdate', data => {
			if (data.seconds > +endTime) {
				if (isLoop) vimeoPlayer.setCurrentTime(startTime || '0');
				else vimeoPlayer.pause();
			}
		});

		if (playerType === 'popup') {
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
		const newPopupSlot = document.createElement('div');
		newPopupSlot.id = 'maxi-popup-slot';
		newPopupSlot.style.zIndex = '999999';
		newPopupSlot.appendChild(createPopup());
		document.body.appendChild(newPopupSlot);
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
		triggerPopupAnimation(popupContent);
		if (!pauseVideo) player.src = embedUrl;
	};

	const closeVideo = e => {
		if (e.target.classList.contains('maxi-video-block__video-player'))
			return;
		popupContent.style.display = 'none';
		if (pauseVideo) pauseVideo();
		else player.src = '';
	};

	document.addEventListener('keydown', e => {
		if (popupContent.style.display === 'flex' && e.key === 'Escape') {
			closeVideo(e);
		}
	});

	overlay.addEventListener('click', openVideo);
	popupContent.addEventListener('click', closeVideo);
}

function triggerPopupAnimation(popupContent) {
	const popupContainer = popupContent.querySelector(
		'.maxi-video-block__video-container'
	);

	if (!popupContainer) return;

	const animationClass = Array.from(popupContainer.classList).find(
		className =>
			className.startsWith(
				'maxi-video-block__video-container--popup--zoom-'
			)
	);

	if (!animationClass) return;

	popupContainer.classList.remove(animationClass);

	// Force reflow to allow the animation class to be reapplied and replay the animation
	void popupContainer.offsetWidth;

	popupContainer.classList.add(animationClass);
}

function isScriptMounted(id) {
	return !!document.getElementById(id);
}

function insertYoutubeScript() {
	if (!isScriptMounted('maxi-youtube-sdk')) {
		loadScript('https://www.youtube.com/iframe_api', 'maxi-youtube-sdk');
	}
}

function loadScript(src, id) {
	const script = document.createElement('script');
	script.src = src;
	script.id = id;
	script.defer = true;
	document.body.appendChild(script);
}

window.onYouTubeIframeAPIReady = handleYoutubeVideos;
