const videoEvents = () => {
	const videoBLocks = document.querySelectorAll('.maxi-video-block');
	videoBLocks.forEach(video => {
		const videoID = video.id;

		const videoData =
			maxiVideo[0][videoID] !== undefined ? maxiVideo[0][videoID] : null;

		if (videoData['video-is-lightbox']) {
			const wrapper = video.querySelector(
				'.maxi-video-block__popup-wrapper'
			);
			const closeButton = video.querySelector(
				'.maxi-video-block__close-button'
			);
			const iframe = video.querySelector('iframe');

			const openVideo = e => {
				if (e.target !== e.currentTarget) return;
				wrapper.style.display = 'flex';
				iframe.src = videoData['embedUrl'];
			};

			const closeVideo = e => {
				if (e.target !== e.currentTarget) return;
				wrapper.style.display = 'none';
				iframe.src = '';
			};

			video.addEventListener('click', openVideo);
			closeButton.addEventListener('click', closeVideo);
			wrapper.addEventListener('click', closeVideo);
		} else {
			const iframe = video.querySelector('iframe');
			iframe.src = videoData['embedUrl'];
		}
	});
};

window.addEventListener('load', videoEvents);
