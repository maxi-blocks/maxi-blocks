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

var script = document.createElement('script');
const apiKey = 'AIzaSyBW3BXol38RXkWnc49Zrgvw0pVZA9ISC1E';
script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
script.async = true;

window.initMap = function () {
	const uluru = { lat: 51.506, lng: -0.184 };
	const map = new google.maps.Map(document.getElementById('map'), {
		zoom: 15,
		center: uluru,
	});
	const contentString =
		'<div id="content">' +
		'<div id="siteNotice">' +
		'</div>' +
		'<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
		'<div id="bodyContent">' +
		'<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
		'sandstone rock formation in the southern part of the ' +
		'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) ' +
		'south west of the nearest large town, Alice Springs; 450&#160;km ' +
		'(280&#160;mi) by road. Kata Tjuta and Uluru are the two major ' +
		'features of the Uluru - Kata Tjuta National Park. Uluru is ' +
		'sacred to the Pitjantjatjara and Yankunytjatjara, the ' +
		'Aboriginal people of the area. It has many springs, waterholes, ' +
		'rock caves and ancient paintings. Uluru is listed as a World ' +
		'Heritage Site.</p>' +
		'<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
		'https://en.wikipedia.org/w/index.php?title=Uluru</a> ' +
		'(last visited June 22, 2009).</p>' +
		'</div>' +
		'</div>';
	const infowindow = new google.maps.InfoWindow({
		content: contentString,
	});
	const marker = new google.maps.Marker({
		position: uluru,
		map,
		title: 'Uluru (Ayers Rock)',
	});
	marker.addListener('click', () => {
		infowindow.open(map, marker);
	});
};

// Append the 'script' element to 'head'
document.head.appendChild(script);

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
		// Hover
		if (
			'hover-basic-effect-type' in motionData &&
			'hover-text-effect-type' in motionData
		) {
			const hoverElem = document.querySelector(
				`#${motionID} .maxi-image-block__image`
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
		if ('parallax-status' in motionData) {
			const parallaxElem = document.querySelector(
				`#${motionID} > .maxi-background-displayer > .maxi-background-displayer__images`
			);
			const parallaxStatus = motionData['parallax-status'];
			const parallaxSpeed = motionData['parallax-speed'];
			const parallaxDirection = motionData['parallax-direction'];

			if (parallaxStatus) {
				window.addEventListener('scroll', () => {
					new Parallax(
						parallaxElem,
						parallaxDirection === 'up'
							? -parallaxSpeed
							: parallaxSpeed
					);
				});
			}
		}

		// Entrance Animation
		if (
			'entrance-type' in motionData &&
			motionData['entrance-type'] !== 'none'
		) {
			const entranceElem = document.querySelector(`#${motionID}`);

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
