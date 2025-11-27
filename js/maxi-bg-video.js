// Background Video Actions
const videoBg = () => {
	const videoPlayerElements = document.querySelectorAll(
		'.maxi-background-displayer__video-player'
	);
	videoPlayerElements.forEach(videoPlayerElement => {
		if (videoPlayerElement) {
			const videoEnd = videoPlayerElement.getAttribute('data-end');
			const videoType = videoPlayerElement.getAttribute('data-type');

			// Recreate iframe with correct referrer policy for restrictive sites
			if (videoType === 'youtube' || videoType === 'vimeo') {
				const iframe = videoPlayerElement.querySelector('iframe');
				if (iframe && !iframe.getAttribute('data-maxi-fixed')) {
					const iframeWrapper = iframe.parentElement;
					const originalSrc = iframe.src;
					const originalTitle = iframe.title;
					const originalStyle = iframe.getAttribute('style');

					// Create new iframe with referrerPolicy set before src
					const newIframe = document.createElement('iframe');
					newIframe.title = originalTitle;
					newIframe.frameBorder = '0';
					newIframe.allow = 'autoplay';
					newIframe.allowFullscreen = true;
					newIframe.referrerPolicy =
						'strict-origin-when-cross-origin';
					newIframe.setAttribute('data-maxi-fixed', 'true');
					if (originalStyle)
						newIframe.setAttribute('style', originalStyle);

					// Replace old iframe
					iframeWrapper.replaceChild(newIframe, iframe);
					// Set src after referrerPolicy is set
					newIframe.src = originalSrc;
				}
			}

			// Make youtube & vimeo videos cover the container
			if (videoType === 'youtube' || videoType === 'vimeo') {
				const setVideoSize = () => {
					const iframeElement =
						videoPlayerElement.querySelector('iframe');
					const reduceBorder = videoPlayerElement.classList.contains(
						'maxi-background-displayer__video-player--no-border'
					);
					const elWidth = videoPlayerElement.offsetWidth;
					const elHeight = videoPlayerElement.offsetHeight;

					const proportion = reduceBorder ? 2.4 : 1.77;

					const hasBorder = elWidth / elHeight < proportion;

					// Avoids Y axis black border
					if (hasBorder) {
						const landscapeProportion =
							proportion - elWidth / elHeight + 1;
						const portraitProportion =
							proportion + (elHeight / elWidth - 1) * 2;

						const newScale =
							landscapeProportion < proportion
								? landscapeProportion
								: portraitProportion;

						iframeElement.style.transform = `translate(-50%, -50%) scale(${
							newScale * 1.033
						})`; // increase of 33% to ensure
					} else iframeElement.style.transform = null;

					const isLandscape = elWidth > elHeight * 1.77;

					const newHeight = isLandscape ? elWidth / 1.77 : elHeight;

					iframeElement.style.height = `${newHeight}px`; // 1.77 is the aspect ratio 16:9
				};

				window.addEventListener('resize', setVideoSize);
				setVideoSize();
			}

			if (videoType === 'vimeo' && videoEnd) {
				const scriptsArray = Array.from(window.document.scripts);

				const vimeoIsMounted = scriptsArray.findIndex(
					script => script.getAttribute('id') === 'maxi-vimeo-sdk'
				);

				if (vimeoIsMounted === -1) {
					const script = document.createElement('script');
					script.src = 'https://player.vimeo.com/api/player.js';
					script.id = 'maxi-vimeo-sdk';
					script.async = true;
					script.onload = () => {
						// Cleanup onload handler
						script.onload = null;

						// Pause all vimeo videos on the page at the endTime
						// eslint-disable-next-line no-undef
						containerElements.forEach(elem => {
							const videoPlayerElement = elem.querySelector(
								'.maxi-background-displayer__video-player'
							);
							const videoEnd =
								videoPlayerElement.getAttribute('data-end');
							const videoType =
								videoPlayerElement.getAttribute('data-type');

							if (videoType === 'vimeo' && videoEnd) {
								// eslint-disable-next-line no-undef
								const player = new Vimeo.Player(
									videoPlayerElement.querySelector('iframe')
								);

								// eslint-disable-next-line func-names
								player.on('timeupdate', function (data) {
									if (data.seconds > videoEnd) {
										player.pause();
									}
								});
							}
						});
					};
					document.body.appendChild(script);
				}
			}
		}
	});
};

window.addEventListener('load', videoBg);
