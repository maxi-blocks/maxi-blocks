const videoEvents = () => {
	const videoBLocks = document.querySelectorAll('.maxi-video-block');
	videoBLocks.forEach(video => {
		const videoID = video.id;

		const videoData =
			maxiVideo[0][videoID] !== undefined ? maxiVideo[0][videoID] : null;

		const player = video.querySelector('.maxi-video-block__video-player');

		if (videoData['isLightbox']) {
			const wrapper = video.querySelector(
				'.maxi-video-block__popup-wrapper'
			);
			const closeButton = video.querySelector(
				'.maxi-video-block__close-button'
			);
			const playButton = video.querySelector(
				'.maxi-video-block__play-button'
			);
			const thumbnail = video.querySelector(
				'.maxi-video-block__thumbnail'
			);

			const openVideo = e => {
				wrapper.style.display = 'flex';
				player.src = videoData['embedUrl'];
			};

			const closeVideo = e => {
				if (e.target !== e.currentTarget && e.currentTarget === wrapper)
					return;
				wrapper.style.display = 'none';
				player.src = '';
			};

			thumbnail.addEventListener('click', openVideo);
			playButton.addEventListener('click', openVideo);
			closeButton.addEventListener('click', closeVideo);
			wrapper.addEventListener('click', closeVideo);
		}

		const videoType = videoData['videoType'];
		const videoEnd = videoData['endTime'];
		console.log(videoType, videoEnd);
		if (videoType === 'vimeo' && videoEnd) {
			const scriptsArray = Array.from(window.document.scripts);

			const vimeoIsMounted = scriptsArray.findIndex(
				script => script.getAttribute('id') === 'maxi-vimeo-sdk'
			);
			console.log(vimeoIsMounted);
			if (vimeoIsMounted === -1) {
				console.log('imhere');
				const script = document.createElement('script');
				script.src = 'https://player.vimeo.com/api/player.js';
				script.id = 'maxi-vimeo-sdk';
				script.async = true;
				script.onload = () => {
					// Cleanup onload handler
					script.onload = null;

					const vimeoPlayer = new Vimeo.Player(player);

					// eslint-disable-next-line func-names
					vimeoPlayer.on('timeupdate', function (data) {
						if (data.seconds > videoEnd) {
							vimeoPlayer.pause();
						}
					});
				};
				document.body.appendChild(script);
			}
		}
	});
};

window.addEventListener('load', videoEvents);
