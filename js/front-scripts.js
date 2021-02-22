// GSAP PLugins
gsap.registerPlugin(ScrollTrigger);

const getDeviceType = () => {
	const ua = navigator.userAgent;
	if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
		return 'tablet';
	}
	if (
		/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
			ua
		)
	) {
		return 'mobile';
	}
	return 'desktop';
};
// Motion Effects
const motionElems = document.querySelectorAll('.maxi-motion-effect');
motionElems.forEach(function (elem) {
	if (!maxi_custom_data.custom_data) return;

	const motionID = elem.getAttribute('data-motion-id');

	const motionData =
		maxi_custom_data.custom_data[motionID] !== undefined
			? maxi_custom_data.custom_data[motionID]
			: null;

	if (motionData !== null) {
		// Shape Divider
		const shapeDividerTimeline = gsap.timeline({
			scrollTrigger: {
				trigger: `.maxi-motion-effect-${motionID} > .maxi-shape-divider`,
				start: '-150',
				scrub: true,
				markers: false,
				onEnter: self => {
					self.trigger = elem;
				},
			},
		});
		if (motionData['shape-divider-top-effects-status']) {
			shapeDividerTimeline.to(
				`.maxi-motion-effect-${motionID} > .maxi-shape-divider.maxi-shape-divider__top`,
				{
					height: 0,
					duration: 1,
					ease: 'power1.out',
				}
			);
		}
		if (motionData['shape-divider-bottom-effects-status']) {
			shapeDividerTimeline.to(
				`.maxi-motion-effect-${motionID} > .maxi-shape-divider.maxi-shape-divider__bottom`,
				{
					height: 0,
					duration: 1,
					ease: 'power1.out',
				}
			);
		}

		// Parallax Effect
		if ('parallax-status' in motionData) {
			const parallaxElem = document.querySelector(
				`.maxi-motion-effect-${motionID} > .maxi-background-displayer > .maxi-background-displayer__images`
			);
			const parallaxStatus = motionData['parallax-status'];
			const parallaxSpeed = motionData['parallax-speed'];
			const parallaxDirection = motionData['parallax-direction'];

			const getBackgroundPosition = () => {
				if (parallaxDirection === 'up')
					return '50% ' + -window.innerHeight / parallaxSpeed + 'px';
				if (parallaxDirection === 'down')
					return '50% ' + -window.innerHeight * parallaxSpeed + 'px';
			};

			if (parallaxStatus) {
				gsap.to(parallaxElem, {
					backgroundPosition: getBackgroundPosition(),
					ease: 'none',
					scrollTrigger: {
						trigger: parallaxElem,
						scrub: true,
					},
				});
			}
		}

		// Entrance Animation
		if ('entrance-type' in motionData) {
			const entranceElem = document.querySelector(
				'.maxi-motion-effect-' + motionID + ''
			);

			const entranceType = motionData['entrance-type'];
			const entranceDuration =
				motionData['entrance-duration'] === ''
					? 1
					: motionData['entrance-duration'];
			const entranceDelay =
				motionData['entrance-delay'] === ''
					? 1
					: motionData['entrance-delay'];

			if (entranceType !== '') {
				entranceElem.style.opacity = '0';

				var waypoint = new Waypoint({
					element: entranceElem,
					handler: function () {
						entranceElem.style.opacity = '1';
						entranceElem.style.setProperty(
							'--animate-duration',
							'' + entranceDuration + 's'
						);
						entranceElem.style.setProperty(
							'animation-delay',
							'' + entranceDelay + 's'
						);
						entranceElem.classList.add(
							'animate__animated',
							'animate__' + entranceType + ''
						);
					},
					offset: '100%',
				});
			}
		}

		// Motion Effects
		const interactionStatus = motionData['motion-status'];
		const motionMobileStatus = motionData['motion-mobile-status'];
		const motionTabletStatus = motionData['motion-tablet-status'];
		const xAxis = motionData['motion-transform-origin-x'];
		const yAxis = motionData['motion-transform-origin-y'];

		if (
			!!interactionStatus &&
			((!!motionMobileStatus && getDeviceType() === 'mobile') ||
				(!!motionTabletStatus && getDeviceType() === 'tablet') ||
				getDeviceType() === 'desktop')
		) {
			Object.entries(motionData['motion-time-line']).forEach(
				([key, value], index, array) => {
					let actions = {};
					value.forEach(act => {
						switch (act.type) {
							case 'move':
								actions = {
									...actions,
									x:
										act.settings.unit !== ''
											? `${act.settings.x}${act.settings.unitX}`
											: act.settings.x,
									y:
										act.settings.unit !== ''
											? `${act.settings.y}${act.settings.unitY}`
											: act.settings.y,
									z:
										act.settings.unit !== ''
											? `${act.settings.z}${act.settings.unitZ}`
											: act.settings.z,
									transformPerspective: 1000,
									transformStyle: 'preserve-3d',
									transformOrigin: `${xAxis} ${yAxis}`,
								};
								break;
							case 'rotate':
								actions = {
									...actions,
									rotationX: act.settings.x,
									rotationY: act.settings.y,
									rotationZ: act.settings.z,
									transformPerspective: 1000,
									transformStyle: 'preserve-3d',
									transformOrigin: `${xAxis} ${yAxis}`,
								};
								break;

							case 'scale':
								actions = {
									...actions,
									scaleX: act.settings.x,
									scaleY: act.settings.y,
									scaleZ: act.settings.z,
									transformPerspective: 1000,
									transformStyle: 'preserve-3d',
									transformOrigin: `${xAxis} ${yAxis}`,
								};
								break;
							case 'skew':
								actions = {
									...actions,
									skewX: act.settings.x,
									skewY: act.settings.y,
									transformOrigin: `${xAxis} ${yAxis}`,
								};
								break;
							case 'opacity':
								actions = {
									...actions,
									autoAlpha: act.settings.opacity,
								};
								break;
							case 'blur':
								actions = {
									...actions,
									webkitFilter:
										'blur(' + act.settings.blur + 'px)',
									filter: 'blur(' + act.settings.blur + 'px)',
								};
								break;
							default:
								return;
						}
					});

					const startTime = Number(key);
					const endTime = !!array[index + 1]
						? Number(array[index + 1][0])
						: null;

					endTime !== null &&
						ScrollTrigger.create({
							trigger: document.body,
							start: `${startTime}% ${startTime}%`,
							end: `${endTime}% ${endTime}%`,
							animation: gsap
								.timeline({
									paused: true,
									reversed: true,
								})
								.to(
									'.maxi-motion-effect-' + motionID + '',
									actions
								),
							scrub: true,
							markers: false,
						});
				}
			);
		}
	}
});

// Background Video Actions
const containerElems = document.querySelectorAll('.maxi-container-block');
containerElems.forEach(function (elem) {
	const videoPlayerElement = elem.querySelector(
		'.maxi-background-displayer__video-player'
	);

	if (videoPlayerElement) {
		const videoEnd = videoPlayerElement.getAttribute('data-end');
		const videoType = videoPlayerElement.getAttribute('data-type');

		// Make youtube & vimeo videos cover the container
		if (videoType === 'youtube' || videoType === 'vimeo') {
			const iframeElement = videoPlayerElement.querySelector('iframe');
			const iframeWidth = videoPlayerElement.offsetWidth;
			iframeElement.style.height = `${iframeWidth / 1.77}px`; // 1.77 is the aspect ratio 16:9
		}

		if (videoType === 'vimeo' && videoEnd) {
			const scriptsArray = Array.from(window.document.scripts);

			const vimeoIsMounted = scriptsArray.findIndex(
				script => script.getAttribute('id') === 'maxi-vimeo-sdk'
			);

			if (vimeoIsMounted === -1) {
				let script = document.createElement('script');
				script.src = 'https://player.vimeo.com/api/player.js';
				script.id = 'maxi-vimeo-sdk';
				script.async = true;
				script.onload = () => {
					// Cleanup onload handler
					script.onload = null;

					// Pause all vimeo videos on the page at the endTime
					containerElems.forEach(function (elem) {
						const videoPlayerElement = elem.querySelector(
							'.maxi-background-displayer__video-player'
						);
						const videoEnd = videoPlayerElement.getAttribute(
							'data-end'
						);
						const videoType = videoPlayerElement.getAttribute(
							'data-type'
						);

						if (videoType === 'vimeo' && videoEnd) {
							const player = new Vimeo.Player(
								videoPlayerElement.querySelector('iframe')
							);

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
