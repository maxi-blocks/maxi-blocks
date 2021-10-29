// Default Map Markers
const defaultMarkers = {
	'marker-icon-1': {
		path: 'M 20.20,9.70 C 20.20,5.20 16.50,1.50 12.00,1.50 7.50,1.50 3.80,5.10 3.80,9.70 3.80,16.70 12.00,22.60 12.00,22.60 12.00,22.60 20.20,16.70 20.20,9.70 Z M 12.00,6.10 C 13.90,6.10 15.50,7.70 15.50,9.60 15.50,11.50 13.90,13.10 12.00,13.10 10.10,13.10 8.50,11.50 8.50,9.60 8.50,7.70 10.10,6.10 12.00,6.10 Z',
	},
	'marker-icon-2': {
		path: 'M18.1,16.2l-5.5,5.5c-0.3,0.3-0.9,0.3-1.2,0l-5.5-5.5C2.6,12.8,2.6,7.4,5.9,4l0,0C9.3,0.6,14.7,0.6,18,4l0,0C21.4,7.4,21.4,12.8,18.1,16.2z',
	},
	'marker-icon-3': {
		path: 'M20,10c0,3.5-2.2,6.5-5.4,7.6L12,22l-2.6-4.4C6.2,16.5,4,13.4,4,10c0-4.4,3.6-8,8-8S20,5.6,20,10z M12,7 c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S13.7,7,12,7z',
	},
	'marker-icon-4': {
		path: 'M4.9,12.6c0,0,1.8,0,2.4,0c3.2,0.1,2.9,1.2,5.9,1.2s2.9-1.2,5.9-1.2V2c-2.9,0-2.9,1.2-5.9,1.2S10.2,2,7.3,2H4.9v20',
	},
	'marker-icon-5': {
		path: 'M 4.00,22.30 C 4.00,22.30 4.00,22.30 4.00,22.30 4.00,22.30 9.20,22.30 9.20,22.30 9.20,22.30 9.20,22.30 9.20,22.30M 20.00,1.70 C 20.00,1.70 6.60,1.70 6.60,1.70 6.60,1.70 6.70,13.10 6.70,13.10 6.70,13.10 20.00,13.10 20.00,13.10 20.00,13.10 15.10,7.40 15.10,7.40 15.10,7.40 20.00,1.70 20.00,1.70 Z M 6.60,1.70 C 6.60,1.70 6.60,22.30 6.60,22.30',
	},
};

// Parallax
class Parallax {
	constructor(el, displace) {
		this.animateItem(el, displace);
	}

	setPosition() {
		if (window.pageYOffset !== undefined) {
			return window.pageYOffset;
		} else {
			return (
				document.documentElement ||
				document.body.parentNode ||
				document.body
			).scrollTop;
		}
	}
	animateItem(el, displace) {
		if (typeof window.orientation !== 'undefined') {
			return;
		}
		const scrollPosition = this.setPosition();
		el.style.transform =
			'translate3d(0px, ' + scrollPosition / displace + 'px, 0px)';
	}
}

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

// Map
window.onload = () => {
	if (google_map_api_options.google_api_key !== '') {
		const script = document.createElement('script');
		script.src = `https://maps.googleapis.com/maps/api/js?key=${google_map_api_options.google_api_key}&callback=initMap`;
		script.async = true;
		script.defer = true;

		document.head.appendChild(script);
	}
};

window.initMap = function () {
	Object.values(maxi_custom_data.custom_data).map(item => {
		const el = document.getElementById(`map-container-${item.uniqueID}`);

		if (el) {
			const mapCordinate = {
				lat: +item['map-latitude'],
				lng: +item['map-longitude'],
			};

			const map = new google.maps.Map(
				document.getElementById(`map-container-${item.uniqueID}`),
				{
					zoom: item['map-zoom'],
					center: mapCordinate,
				}
			);

			const contentTitleString = `<h6 class="map-marker-info-window__title">${item['map-marker-text']}</h6>`;
			const contentAddressString = `<p class="map-marker-info-window__address">${item['map-marker-address']}</p>`;
			const contentString = `<div class="map-marker-info-window">${
				item['map-marker-text'] !== '' ? contentTitleString : ''
			}${
				item['map-marker-address'] !== '' ? contentAddressString : ''
			}</div>`;

			const infowindow = new google.maps.InfoWindow({
				content: contentString,
			});

			const marker = new google.maps.Marker({
				position: mapCordinate,
				map,
				icon: {
					...defaultMarkers[`marker-icon-${item['map-marker']}`],
					fillColor: item['map-marker-fill-color'],
					fillOpacity: item['map-marker-opacity'],
					strokeWeight: 2,
					strokeColor: item['map-marker-stroke-color'],
					rotation: 0,
					scale: item['map-marker-scale'],
				},
			});

			marker.addListener('click', () => {
				(item['map-marker-text'] !== '' ||
					item['map-marker-address'] !== '') &&
					infowindow.open(map, marker);
			});
		}
	});
};

// Motion Effects
const motionElems = document.querySelectorAll('.maxi-motion-effect');
motionElems.forEach(function (elem) {
	if (!maxi_custom_data.custom_data) return;

	const motionID = elem.id;

	const motionData =
		maxi_custom_data.custom_data[motionID] !== undefined
			? maxi_custom_data.custom_data[motionID]
			: null;

	if (motionData !== null) {
		// Number Counter
		if ('number-counter-status' in motionData) {
			const numberCounterElem = document.querySelector(
				`#${motionID} .maxi-number-counter__box`
			);
			const numberCounterElemText = document.querySelector(
				`#${motionID} .maxi-number-counter__box .maxi-number-counter__box__text`
			);
			const numberCounterElemCircle = document.querySelector(
				`#${motionID} .maxi-number-counter__box .maxi-number-counter__box__circle`
			);

			const radius = 90;
			const circumference = 2 * Math.PI * radius;
			const startCountValue = Math.ceil(
				(motionData['number-counter-start'] * 360) / 100
			);
			const endCountValue = Math.ceil(
				(motionData['number-counter-end'] * 360) / 100
			);
			const countDuration = motionData['number-counter-duration'];
			const countPercentageSign =
				motionData['number-counter-percentage-sign-status'];
			const startAnimation = motionData['number-counter-start-animation'];

			const frameDuration = countDuration / 60;

			let count = startCountValue;

			function startCounter() {
				const interval = setInterval(() => {
					count = count + 1;

					if (count >= endCountValue) {
						count = endCountValue;
						clearInterval(interval);
					}

					numberCounterElemText.innerHTML = `${parseInt(
						(count / 360) * 100
					)}<sup>${countPercentageSign ? '%' : ''}</sup>`;

					numberCounterElemCircle &&
						numberCounterElemCircle.setAttribute(
							'stroke-dasharray',
							`${parseInt(
								(count / 360) * circumference
							)} ${circumference}`
						);
				}, frameDuration);
			}

			if (startAnimation === 'view-scroll') {
				let waypoint = new Waypoint({
					element: numberCounterElem,
					handler: function () {
						startCounter();
					},
					offset: '100%',
				});
			} else {
				startCounter();
			}
		}

		// Hover
		if (
			'hover-basic-effect-type' in motionData &&
			'hover-text-effect-type' in motionData
		) {
			const hoverElem =
				document.querySelector(
					`#${motionID} .maxi-image-block-wrapper .maxi-image-block__image`
				) ||
				document.querySelector(
					`#${motionID} .maxi-image-block-wrapper svg`
				);

			hoverElem.addEventListener('mouseenter', e => {
				if (
					motionData['hover-type'] === 'text' ||
					motionData['hover-basic-effect-type'] === 'zoom-in' ||
					motionData['hover-basic-effect-type'] === 'zoom-out' ||
					motionData['hover-basic-effect-type'] === 'slide' ||
					motionData['hover-basic-effect-type'] === 'rotate' ||
					motionData['hover-basic-effect-type'] === 'blur' ||
					motionData['hover-basic-effect-type'] === 'sepia' ||
					motionData['hover-basic-effect-type'] === 'clear-sepia' ||
					motionData['hover-basic-effect-type'] === 'grey-scale' ||
					motionData['hover-basic-effect-type'] ===
						'clear-greay-scale'
				) {
					e.target.style.transitionDuration = `${motionData['hover-transition-duration']}s`;
					e.target.style.transitionTimingFunction = `
					${
						motionData['hover-transition-easing'] !== 'cubic-bezier'
							? motionData['hover-transition-easing']
							: motionData['hover-transition-easing-cubic-bezier']
							? `cubic-bezier(${motionData[
									'hover-transition-easing-cubic-bezier'
							  ].join()})`
							: 'easing'
					}
					`;
				}

				if (motionData['hover-type'] === 'basic') {
					if (motionData['hover-basic-effect-type'] === 'zoom-in')
						e.target.style.transform = `scale(${motionData['hover-basic-zoom-in-value']})`;
					else if (motionData['hover-basic-effect-type'] === 'rotate')
						e.target.style.transform = `rotate(${motionData['hover-basic-rotate-value']}deg)`;
					else if (
						motionData['hover-basic-effect-type'] === 'zoom-out'
					)
						e.target.style.transform = 'scale(1)';
					else if (motionData['hover-basic-effect-type'] === 'slide')
						e.target.style.marginLeft = `${motionData['hover-basic-slide-value']}px`;
					else if (motionData['hover-basic-effect-type'] === 'blur')
						e.target.style.filter = `blur(${motionData['hover-basic-blur-value']}px)`;
					else {
						e.target.style.transform = '';
						e.target.style.marginLeft = '';
						e.target.style.filter = '';
					}
				}
			});

			hoverElem.addEventListener('mouseleave', e => {
				if (motionData['hover-type'] === 'basic') {
					if (motionData['hover-basic-effect-type'] === 'zoom-in')
						e.target.style.transform = 'scale(1)';
					else if (motionData['hover-basic-effect-type'] === 'rotate')
						e.target.style.transform = 'rotate(0)';
					else if (
						motionData['hover-basic-effect-type'] === 'zoom-out'
					)
						e.target.style.transform = `scale(${motionData['hover-basic-zoom-out-value']})`;
					else if (motionData['hover-basic-effect-type'] === 'slide')
						e.target.style.marginLeft = 0;
					else if (motionData['hover-basic-effect-type'] === 'blur')
						e.target.style.filter = 'blur(0)';
					else {
						e.target.style.transform = '';
						e.target.style.marginLeft = '';
						e.target.style.filter = '';
					}
				}
			});
		}

		// Shape Divider
		if (motionData['shape-divider-top-status']) {
			const shapeDividerTopHeight =
				motionData['shape-divider-bottom-height'];
			const shapeDividerTopHeightUnit =
				motionData['shape-divider-top-height-unit'];
			const target = document.querySelector(
				`#${motionID} > .maxi-shape-divider.maxi-shape-divider__top`
			);

			window.addEventListener('scroll', () => {
				if (target.getBoundingClientRect().top < 100) {
					target.style.height = 0;
				} else {
					target.style.height = `${shapeDividerTopHeight}${shapeDividerTopHeightUnit}`;
				}
			});
		}

		if (motionData['shape-divider-bottom-status']) {
			const shapeDividerBottomHeight =
				motionData['shape-divider-bottom-height'];
			const shapeDividerBottomHeightUnit =
				motionData['shape-divider-bottom-height-unit'];
			const target = document.querySelector(
				`#${motionID} > .maxi-shape-divider.maxi-shape-divider__bottom`
			);
			window.addEventListener('scroll', () => {
				if (target.getBoundingClientRect().top < 100) {
					target.style.height = 0;
				} else {
					target.style.height = `${shapeDividerBottomHeight}${shapeDividerBottomHeightUnit}`;
				}
			});
		}

		// Parallax Effect
		if ('bgParallaxLayers' in motionData) {
			motionData.bgParallaxLayers.forEach(layer => {
				const {
					id,
					'background-image-parallax-speed': parallaxSpeed,
					'background-image-parallax-direction': parallaxDirection,
				} = layer;

				const parallaxElem = document.querySelector(
					`#${motionID} > .maxi-background-displayer > .maxi-background-displayer__${id}`
				);

				window.addEventListener('scroll', () => {
					new Parallax(
						parallaxElem,
						parallaxDirection === 'up'
							? -parallaxSpeed
							: parallaxSpeed
					);
				});
			});
		}

		// Motion Effects
		const interactionStatus = motionData['motion-status'];
		const motionMobileStatus = motionData['motion-mobile-status'];
		const motionTabletStatus = motionData['motion-tablet-status'];
		const xAxis = motionData['motion-transform-origin-x'];
		const yAxis = motionData['motion-transform-origin-y'];

		/*
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
								.to(`#${motionID}`, actions),
							scrub: true,
							markers: false,
						});
				}
			);
		}
		*/
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
						const videoEnd =
							videoPlayerElement.getAttribute('data-end');
						const videoType =
							videoPlayerElement.getAttribute('data-type');

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
