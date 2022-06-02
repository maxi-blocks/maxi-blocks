const videoEvents = () => {
	const videoBLocks = document.querySelectorAll('.maxi-video-block');
	videoBLocks.forEach(video => {
		const videoID = video.id;

		const videoData =
			maxiVideo[0][videoID] !== undefined ? maxiVideo[0][videoID] : null;

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
			const player = video.querySelector(
				'.maxi-video-block__video-player'
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
	});
};

window.addEventListener('load', videoEvents);
