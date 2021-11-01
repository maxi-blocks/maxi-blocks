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
		path: 'M4.9,12.6c0,0,1.8,0,2.4,0c3.2,0.1,2.9,1.2,5.9,1.200ms2.9-1.2,5.9-1.2V2c-2.9,0-2.9,1.2-5.9,1.2S10.2,2,7.3,2H4.9v20',
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
		}
		return (
			document.documentElement ||
			document.body.parentNode ||
			document.body
		).scrollTop;
	}

	animateItem(el, displace) {
		if (typeof window.orientation !== 'undefined') {
			return;
		}
		const scrollPosition = this.setPosition();
		el.style.transform = `translate3d(0px, ${
			scrollPosition / displace
		}px, 0px)`;
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

function startCounter() {
	const interval = setInterval(() => {
		count += 1;

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
				`${parseInt((count / 360) * circumference)} ${circumference}`
			);
	}, frameDuration);
}

// Motion Effects
const motionElements = document.querySelectorAll('.maxi-motion-effect');
motionElements.forEach(function (elem) {
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

			const count = startCountValue;

			if (startAnimation === 'view-scroll') {
				const waypoint = new Waypoint({
					element: numberCounterElem,
					handler() {
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
				const script = document.createElement('script');
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

// Motion Effects
const className = 'maxi-container-motion';
const elements = Array.from(
	document.getElementsByClassName('maxi-block-motion')
);

const setTransform = (el, transform) => {
	const oldTransform = el.style.transform;
	el.style.transform = transform;
	el.style.WebkitTransform = transform;
	// el.style.transform = oldTransform
	// 	? `${oldTransform} ${transform}`
	// 	: transform;
	// el.style.WebkitTransform = oldTransform
	// 	? `${oldTransform} ${transform}`
	// 	: transform;
};

const setOpacity = (el, opacity) => {
	el.style.opacity = opacity;
};

const setBlur = (el, blur) => {
	el.style.filter = `blur(${blur})`;
};

const setVertical = (el, direction, value) => {
	if (direction === 'up') el.style.top = value;
	else el.style.bottom = value;
};

const setHorizontal = (el, direction, value) => {
	if (direction === 'left') el.style.left = value;
	else el.style.right = value;
};

const applyStyle = (el, type, value, direction) => {
	console.log('applyStyle');
	console.log(type, value);
	switch (type) {
		case 'rotate':
			setTransform(el, `rotate(${value}deg)`);
			break;
		case 'fade':
			setOpacity(el, `${value}%`);
			break;
		case 'blur':
			setBlur(el, `${value}px`);
			break;
		case 'vertical':
			setVertical(el, direction, `${value}px`);
			break;
		case 'horizontal':
			setHorizontal(el, direction, `${value}px`);
			break;
		default:
			break;
	}

	return null;
};

const getGeneralMotionSetting = (data, element) => {
	const response = {};

	const dataMotionVerticalArray = data.trim().split(' ');

	response.viewportTop = parseInt(dataMotionVerticalArray[4]);
	response.viewportMid = parseInt(dataMotionVerticalArray[3]);
	response.viewportBottom = parseInt(dataMotionVerticalArray[2]);

	response.viewportMidPercent = Math.round(
		(element.offsetHeight / 100) * response.viewportMid
	);
	response.viewportTopPercent = Math.round(
		(element.offsetHeight / 100) * response.viewportTop
	);
	response.viewportBottomPercent = Math.round(
		(element.offsetHeight / 100) * response.viewportTop
	);

	response.speedValue = parseFloat(dataMotionVerticalArray[0]) || 200;

	const easingValue = dataMotionVerticalArray[1] || 'ease';
	response.easingValue = easingValue;

	console.log('response: ');
	console.log(response);

	return response;
};

const setTransition = (element, motionType) => {
	let transition = '';
	if (motionType.includes('vertical')) {
		transition += '';
	}
	return null;
};

const getMotionData = (el, type) => {
	return el.getAttribute(`data-motion-${type}-general`);
};

const getParent = el => {
	return (
		el.parentNode.closest('.maxi-container-block') ||
		el.parentNode.closest('article')
	);
};

const startingTransform = (element, type) => {
	const dataMotion = getMotionData(element, type);

	if (!dataMotion) return null;

	const parent = getParent(element);

	const {
		viewportTop,
		viewportMid,
		viewportBottom,
		viewportTopPercent,
		viewportMidPercent,
		viewportBottomPercent,
		speedValue,
		easingValue,
	} = getGeneralMotionSetting(dataMotion, parent);

	const dataMotionArray = dataMotion.trim().split(' ');

	const start = parseInt(dataMotionArray[5]);
	const mid = parseInt(dataMotionArray[6]);
	const end = parseInt(dataMotionArray[7]);

	applyStyle(element, type, start);

	return null;
};

let oldValue = 0;
let newValue = 0;

const getScrollDirection = () => {
	newValue = window.pageYOffset;
	if (oldValue < newValue) {
		oldValue = newValue;
		return 'down';
	}
	if (oldValue >= newValue) {
		oldValue = newValue;
		return 'up';
	}

	return 0;
};

let newMidUp = 0;
let newEndUp = 0;
let newMidDown = 0;
let newEndDown = 0;

const scrollTransform = (element, type) => {
	const dataMotion = getMotionData(element, type);

	if (!dataMotion) return;

	const {
		viewportTop,
		viewportMid,
		viewportBottom,
		viewportTopPercent,
		viewportMidPercent,
		viewportBottomPercent,
		speedValue,
		easingValue,
	} = getGeneralMotionSetting(dataMotion, element);

	const dataMotionArray = dataMotion.trim().split(' ');

	const start = parseInt(dataMotionArray[5]);
	const mid = parseInt(dataMotionArray[6]);
	const end = parseInt(dataMotionArray[7]);

	element.style.transition = `all ${speedValue}ms ${easingValue}`;

	const rect = element.getBoundingClientRect();
	const windowHeight = window.innerHeight;
	const windowHalfHeight = windowHeight / 2;
	const elementHeight = element.offsetHeight;
	const elementHalfHeight = elementHeight / 2;

	const elementTopInViewCoordinate = Math.round(rect.top - windowHalfHeight);

	const elementBottomInViewCoordinate = Math.round(
		rect.bottom - windowHalfHeight
	);

	const elementMidInViewCoordinate =
		elementTopInViewCoordinate + elementHalfHeight;

	console.log(`Top: ${elementTopInViewCoordinate}`);
	console.log(`Mid: ${elementMidInViewCoordinate}`);
	console.log(`Bottom: ${elementBottomInViewCoordinate}`);

	const scrollDirection = getScrollDirection();

	if (scrollDirection === 'down' && elementTopInViewCoordinate <= 0) {
		newEndUp = 0;
		newMidUp = 0;
		if (elementMidInViewCoordinate >= 0) {
			// from starting to middle
			console.log('Down - To Mid');
			const stepMid =
				Math.abs(
					(Math.abs(start) - Math.abs(mid)) / elementHalfHeight
				) * 4;

			if (start < mid) newMidDown += stepMid;
			else newMidDown -= stepMid;

			const finalStartMid =
				Math.abs(Math.trunc(start + newMidDown)) < Math.abs(mid)
					? Math.trunc(start + newMidDown)
					: mid;

			console.log(`finalStartMid ${finalStartMid}`);

			applyStyle(element, type, finalStartMid);
		} else {
			console.log('Down - To End');
			const stepEnd =
				Math.abs((Math.abs(end) - Math.abs(mid)) / elementHalfHeight) *
				4;

			if (mid < end) newEndDown += stepEnd;
			else newEndDown -= stepEnd;

			const finalMidEnd =
				Math.abs(Math.trunc(newEndDown + mid)) < Math.abs(end)
					? Math.trunc(newEndDown + mid)
					: end;

			console.log(`finalMidEnd ${finalMidEnd}`);

			applyStyle(element, type, finalMidEnd);
		}
	}
	if (scrollDirection === 'up' && elementBottomInViewCoordinate >= 0) {
		newEndDown = 0;
		newMidDown = 0;
		if (elementMidInViewCoordinate <= 0) {
			console.log('Up - To Mid');
			const stepEnd =
				Math.abs((Math.abs(end) - Math.abs(mid)) / elementHalfHeight) *
				4;

			if (end < mid) newEndUp += stepEnd;
			else newEndUp -= stepEnd;

			const finalMidEnd =
				Math.abs(Math.trunc(newEndUp + end)) < Math.abs(mid)
					? Math.trunc(newEndUp + end)
					: mid;

			console.log(`finalMidEnd: ${finalMidEnd}`);

			applyStyle(element, type, finalMidEnd);
		} else {
			console.log('Up - To Start');
			const stepMid =
				Math.abs(
					(Math.abs(mid) - Math.abs(start)) / elementHalfHeight
				) * 4;

			if (mid > start) newMidUp -= stepMid;
			else newMidUp += stepMid;

			console.log(stepMid);
			console.log(newMidUp);

			const finalMidStart =
				Math.abs(Math.trunc(newMidUp + mid)) < Math.abs(start)
					? Math.trunc(newMidUp + mid)
					: start;

			console.log(`finalStartMid: ${finalMidStart}`);

			applyStyle(element, type, finalMidStart);
		}
	}

	const style = window.getComputedStyle(element);
};

elements.forEach(function maxiMotion(element, index) {
	const motionType = element.getAttribute('data-motion-type');

	console.log(motionType);

	if (motionType.includes('vertical')) {
		// motion data format date-motion-vertical=
		// 'speed(0) ease(1) viewport-bottom(2) viewport-middle(3) viewport-top(4) direction(5) offset-starting(6) offset-middle(7) offset-end(8)'
		const dataMotionVertical = element.getAttribute(
			'data-motion-vertical-general'
		);

		if (!dataMotionVertical) return;

		const parent = getParent(element);

		const {
			viewportTop,
			viewportMid,
			viewportBottom,
			viewportTopPercent,
			viewportMidPercent,
			viewportBottomPercent,
			speedValue,
			easingValue,
		} = getGeneralMotionSetting(dataMotionVertical, parent);

		element.parentNode
			.closest('.maxi-container-block')
			.classList.add(className);

		const parentHeight =
			parent.offsetHeight - (viewportBottomPercent + viewportTopPercent);
		const windowHeight = window.innerHeight;
		const style = window.getComputedStyle(element);
		let transform = parseInt(style.getPropertyValue('top'), 10) * 2;

		element.setAttribute('transform', transform);

		let transformSize = transform / (parentHeight + windowHeight);

		element.setAttribute('transform-size', transformSize);

		// element.style.transition = `all ${speedValue}ms ${easingValue}`;

		const dataMotionVerticalArray = dataMotionVertical.trim().split(' ');
		const direction = parseInt(dataMotionVerticalArray[5]);

		if (direction === 'up') {
			element.style.transform = 'translate(0px, 0px)';
			element.classList.remove('motion-direction-scroll-down');
			element.classList.add('motion-direction-scroll-up');
		} else if (direction === 'down') {
			element.style.transform = 'translate(0px, 0px)';
			element.classList.remove('motion-direction-scroll-up');
			element.classList.add('motion-direction-scroll-down');
		}

		transform = Math.abs(parseInt(style.getPropertyValue('top'), 10)) * 2;

		const offsetTop = parseInt(dataMotionVerticalArray[8]);
		const offsetBottom = parseInt(dataMotionVerticalArray[7]);

		if (offsetTop) {
			if (element.classList.contains('motion-direction-scroll-up')) {
				element.style.top = `${offsetTop * 100}px`;
			} else if (
				element.classList.contains('motion-direction-scroll-down')
			) {
				element.style.top = `-${offsetTop * 100}px`;
			}

			transform =
				Math.abs(parseInt(style.getPropertyValue('top'), 10)) * 2;
		}
		if (offsetBottom) {
			transform =
				Math.abs(parseInt(style.getPropertyValue('top'), 10)) +
				offsetBottom * 100;
			transform = 'rotateX(90deg)';
		}

		element.setAttribute('transform', transform);
		transformSize = transform / (parentHeight + windowHeight);
		element.setAttribute('transform-size', transformSize);
	}

	if (
		motionType.includes('rotate') ||
		motionType.includes('fade') ||
		motionType.includes('blur') ||
		motionType.includes('scale')
	) {
		startingTransform(element, motionType);
	}
});

let currentTransformSize = 0;
let elementScrollSize = 0;

// eslint-disable-next-line @wordpress/no-global-event-listener
window.addEventListener('scroll', () => {
	elements.forEach(function motionOnScroll(element, index) {
		const motionType = element.getAttribute('data-motion-type');
		// 'speed(0) ease(1) viewport-bottom(2) viewport-middle(3) viewport-top(4) direction(5) offset-starting(6) offset-middle(7) offset-end(8)'
		if (motionType.includes('vertical')) {
			const dataMotionVertical = element.getAttribute(
				'data-motion-vertical-general'
			);

			if (!dataMotionVertical) return;

			const dataMotionVerticalArray = dataMotionVertical
				.trim()
				.split(' ');

			const viewportTop = parseInt(dataMotionVerticalArray[4]);
			const viewportMid = parseInt(dataMotionVerticalArray[3]);
			const viewportBottom = parseInt(dataMotionVerticalArray[2]);

			const parent = getParent(element);

			const viewportMidPercent =
				(parent.offsetHeight / 100) * viewportMid;
			const viewportTopPercent =
				parent.offsetHeight - (parent.offsetHeight / 100) * viewportTop;
			const viewportBottomPercent =
				(parent.offsetHeight / 100) * viewportBottom;

			const offsetTop = parseInt(dataMotionVerticalArray[8]);
			const offsetMid = parseInt(dataMotionVerticalArray[7]);
			const offsetBottom = parseInt(dataMotionVerticalArray[6]);

			const topPos = element.parentNode.closest(
				'.maxi-container-block'
			).offsetTop;
			const { scrollTop } = document.documentElement;
			const parentHeight =
				parent.offsetHeight -
				(viewportBottomPercent + viewportTopPercent);
			const windowHeight = window.innerHeight;

			if (
				scrollTop + windowHeight >= topPos + viewportTopPercent &&
				scrollTop <= topPos + parentHeight + viewportTopPercent
			) {
				let elementViewSize =
					scrollTop + windowHeight - (topPos + viewportTopPercent);

				let transformSizeAttr = element.getAttribute('transform-size');

				elementScrollSize = elementViewSize * transformSizeAttr;

				if (viewportMid) {
					if (elementViewSize <= viewportMidPercent) {
						if (offsetBottom || (offsetTop && offsetBottom)) {
							transformSizeAttr =
								(element.getAttribute('transform') -
									offsetBottom * 100) /
								viewportMidPercent;
						} else if (offsetTop) {
							transformSizeAttr =
								(offsetTop * 100) / viewportMidPercent;
						} else {
							transformSizeAttr =
								element.getAttribute('transform') /
								2 /
								viewportMidPercent;
						}

						currentTransformSize = element.getAttribute(
							'transform-size-current'
						);

						elementScrollSize = elementViewSize * transformSizeAttr;
						element.setAttribute(
							'transform-size-current',
							elementScrollSize
						);
					} else {
						if (offsetBottom || (offsetBottom && offsetTop)) {
							transformSizeAttr =
								(offsetBottom * 100) /
								(Math.abs(parentHeight - viewportMidPercent) +
									windowHeight);
						} else if (offsetTop) {
							transformSizeAttr =
								(element.getAttribute('transform') -
									offsetTop * 100) /
								(Math.abs(parentHeight - viewportMidPercent) +
									windowHeight);
						} else {
							const style = window.getComputedStyle(element);
							transformSizeAttr =
								Math.abs(
									parseInt(style.getPropertyValue('top'), 10)
								) /
								(parentHeight -
									viewportMidPercent +
									windowHeight);
						}

						elementScrollSize =
							parseInt(currentTransformSize) +
							Math.abs(
								elementViewSize -
									(viewportMidPercent - viewportTopPercent)
							) *
								transformSizeAttr;
					}
				}

				if (offsetMid) {
					if (
						elementViewSize <=
						parentHeight +
							(viewportBottomPercent + viewportTopPercent)
					) {
						elementViewSize = scrollTop + windowHeight - topPos;
						if (offsetBottom || (offsetTop && offsetBottom)) {
							transformSizeAttr =
								(element.getAttribute('transform') -
									offsetBottom * 100 -
									offsetMid) /
								(parentHeight +
									viewportBottomPercent +
									viewportTopPercent);
						} else if (offsetTop) {
							transformSizeAttr =
								(offsetTop * 100 - offsetMid) /
								(parentHeight +
									(viewportBottomPercent +
										viewportTopPercent));
						} else {
							transformSizeAttr =
								(element.getAttribute('transform') / 2 -
									offsetMid) /
								(parentHeight +
									viewportBottomPercent +
									viewportTopPercent);
						}

						currentTransformSize = element.getAttribute(
							'transform-size-current'
						);

						elementScrollSize = elementViewSize * transformSizeAttr;
						element.setAttribute(
							'transform-size-current',
							elementScrollSize
						);
					} else {
						if (offsetBottom || (offsetBottom && offsetTop)) {
							transformSizeAttr =
								Math.abs(
									element.getAttribute('transform') -
										parseInt(currentTransformSize)
								) /
								Math.abs(
									parentHeight +
										(viewportBottomPercent +
											viewportTopPercent) -
										viewportMidPercent
								);
						} else if (offsetTop) {
							transformSizeAttr =
								Math.abs(
									element.getAttribute('transform') -
										(offsetTop - offsetMid)
								) /
								(parentHeight +
									(viewportBottomPercent +
										viewportTopPercent));
						} else {
							transformSizeAttr =
								Math.abs(
									element.getAttribute('transform') -
										(element.getAttribute('transform') / 2 -
											offsetMid)
								) /
								(parentHeight +
									(viewportBottomPercent +
										viewportTopPercent));
						}

						elementScrollSize =
							parseInt(currentTransformSize) +
							(elementViewSize -
								(parentHeight +
									(viewportBottomPercent +
										viewportTopPercent))) *
								transformSizeAttr;
					}
				}

				if (element.classList.contains('motion-direction-scroll-up')) {
					console.log(`BUG: translateY( -${elementScrollSize}px)`);
					setTransform(
						element,
						`translateY( -${elementScrollSize}px)`
					);
				} else if (
					element.classList.contains('motion-direction-scroll-down')
				) {
					setTransform(element, `translateY(${elementScrollSize}px)`);
				} else {
					setTransform(
						element,
						`translateY( -${elementScrollSize}px)`
					);
				}
			}
		} // vertical motion ends

		if (
			motionType.includes('rotate') ||
			motionType.includes('fade') ||
			motionType.includes('blur') ||
			motionType.includes('scale')
		) {
			scrollTransform(element, motionType);
		}
	});
});

// End Scroll Function
