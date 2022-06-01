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
			const iframe = video.querySelector('iframe');

			const openVideo = e => {
				wrapper.style.display = 'flex';
				iframe.src = videoData['embedUrl'];
			};

			const closeVideo = e => {
				wrapper.style.display = 'none';
				iframe.src = '';
			};

			thumbnail.addEventListener('click', openVideo);
			playButton.addEventListener('click', openVideo);
			closeButton.addEventListener('click', closeVideo);
			wrapper.addEventListener('click', closeVideo);
		}
	});
};

window.addEventListener('load', videoEvents);
