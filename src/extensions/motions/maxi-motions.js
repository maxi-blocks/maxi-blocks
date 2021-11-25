/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const setTransform = (el, transform, type) => {
	const oldTransform = el.style.transform;

	if (oldTransform == null) {
		el.style.transform = transform;
		el.style.WebkitTransform = transform;
		return null;
	}

	const oldTransformArray = oldTransform.split(') ');

	// console.log('oldTransformArray');
	// console.log(oldTransformArray);

	oldTransformArray.map((transform, key) => {
		if (transform.includes(type)) oldTransformArray.splice(key, 1);
		return null;
	});

	// console.log(`transform: ${transform}`);

	el.style.transform = oldTransformArray.join(' ') + transform;
	el.style.WebkitTransform = oldTransformArray.join(' ') + transform;
	return null;
};

const setOpacity = (el, opacity) => {
	el.style.opacity = opacity;
};

const setBlur = (el, blur) => {
	el.style.filter = `blur(${blur})`;
};

const setVertical = (el, value) => {
	el.style.top = `${value}px`;
};

const setHorizontal = (el, value) => {
	el.style.left = `${value}px`;
};

const applyStyle = (el, type, value) => {
	switch (type) {
		case 'rotate':
			setTransform(el, `rotate(${value}deg)`, 'rotate');
			break;
		case 'fade':
			setOpacity(el, `${value}%`);
			break;
		case 'scale':
			setTransform(
				el,
				`scale3d(${value}%, ${value}%, ${value}%)`,
				'scale'
			);
			break;
		case 'blur':
			setBlur(el, `${value}px`);
			break;
		case 'vertical':
			setVertical(el, value);
			break;
		case 'horizontal':
			setHorizontal(el, value);
			break;
		default:
			break;
	}

	return null;
};

const getMotionSetting = (data, element) => {
	const response = {};

	const dataMotionArray = data.trim().split(' ');

	const getViewportValue = viewport => {
		switch (viewport) {
			case 'top':
				return 100;
			case 'mid':
				return 50;
			case 'bottom':
				return 0;
			default:
				return 0;
		}
	};

	response.viewportTop = getViewportValue(dataMotionArray[5]);
	response.viewportMid = getViewportValue(dataMotionArray[4]);
	response.viewportBottom = getViewportValue(dataMotionArray[3]);

	response.viewportMidPercent = Math.round(
		(element.offsetHeight / 100) * response.viewportMid
	);
	response.viewportTopPercent = Math.round(
		(element.offsetHeight / 100) * response.viewportTop
	);
	response.viewportBottomPercent = Math.round(
		(element.offsetHeight / 100) * response.viewportTop
	);

	response.speedValue = parseFloat(dataMotionArray[0]) || 200;

	response.delayValue = parseFloat(dataMotionArray[1]) || 0;

	response.reverseMotion = dataMotionArray[6] || true;

	response.start = parseInt(dataMotionArray[7]);
	response.mid = parseInt(dataMotionArray[8]);
	response.end = parseInt(dataMotionArray[9]);

	response.easingValue = dataMotionArray[2] || 'ease';

	return response;
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
	const { start } = getMotionSetting(dataMotion, parent);

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
		viewportTopPercent,
		viewportMidPercent,
		viewportBottomPercent,
		start,
		mid,
		end,
		reverseMotion,
	} = getMotionSetting(dataMotion, element);

	console.log('viewportTopPercent');
	console.log(viewportTopPercent);

	console.log('viewportMidPercent');
	console.log(viewportMidPercent);

	console.log('viewportBottomPercent');
	console.log(viewportBottomPercent);

	const rect = element.getBoundingClientRect();
	const windowHeight = window.innerHeight;
	const windowHalfHeight = windowHeight / 2;
	const elementHeight = element.offsetHeight;
	const elementHalfHeight = elementHeight / 2;

	let elementTopInViewCoordinate = Math.round(rect.top - windowHalfHeight);
	let elementBottomInViewCoordinate = Math.round(
		rect.bottom - windowHalfHeight
	);
	let elementMidInViewCoordinate = Math.round(
		elementTopInViewCoordinate + elementHalfHeight
	);

	// console.log('elementTopInViewCoordinate');
	// console.log(elementTopInViewCoordinate);

	// console.log('elementBottomInViewCoordinate');
	// console.log(elementBottomInViewCoordinate);

	// console.log('elementMidInViewCoordinate');
	// console.log(elementMidInViewCoordinate);

	// Top shift
	const topShiftPx =
		viewportTopPercent -
		Math.abs(elementTopInViewCoordinate - elementBottomInViewCoordinate);

	// console.log(' topShiftPx ');
	// console.log(topShiftPx);

	if (topShiftPx !== 0) elementTopInViewCoordinate -= topShiftPx;

	// Mid shift
	const midShiftPx =
		viewportMidPercent -
		Math.abs(elementTopInViewCoordinate - elementMidInViewCoordinate);

	// console.log(' midShiftPx ');
	// console.log(midShiftPx);

	if (midShiftPx !== 0) elementMidInViewCoordinate -= midShiftPx;

	// Bottom shift
	const bottomShiftPx =
		viewportBottomPercent -
		Math.abs(elementBottomInViewCoordinate - elementTopInViewCoordinate);

	// console.log(' bottomShiftPx ');
	// console.log(bottomShiftPx);

	if (bottomShiftPx !== 0) elementBottomInViewCoordinate -= bottomShiftPx;

	// console.log('elementTopInViewCoordinate after');
	// console.log(elementTopInViewCoordinate);

	// console.log('elementBottomInViewCoordinate after');
	// console.log(elementBottomInViewCoordinate);

	// console.log('elementMidInViewCoordinate after');
	// console.log(elementMidInViewCoordinate);

	const scrollDirection = getScrollDirection();

	if (scrollDirection === 'down' && elementTopInViewCoordinate <= 0) {
		newEndUp = 0;
		newMidUp = 0;
		if (elementMidInViewCoordinate >= 0) {
			// from starting to middle
			const stepMid = Math.abs(
				(Math.abs(start) - Math.abs(mid)) / elementHalfHeight
			);

			if (start < mid) newMidDown += stepMid;
			else newMidDown -= stepMid;

			const finalStartMid =
				Math.abs(Math.trunc(start + newMidDown)) < mid
					? Math.trunc(start + newMidDown)
					: mid;

			applyStyle(element, type, finalStartMid);
		} else {
			const stepEnd = Math.abs(
				(Math.abs(end) - Math.abs(mid)) / elementHalfHeight
			);

			if (mid < end) newEndDown += stepEnd;
			else newEndDown -= stepEnd;

			const finalMidEnd =
				Math.abs(Math.trunc(newEndDown + mid)) < end
					? Math.trunc(newEndDown + mid)
					: end;

			applyStyle(element, type, finalMidEnd);
		}
	}
	if (
		reverseMotion === 'true' &&
		scrollDirection === 'up' &&
		elementBottomInViewCoordinate >= 0
	) {
		newEndDown = 0;
		newMidDown = 0;
		if (elementMidInViewCoordinate <= 0) {
			const stepEnd = Math.abs(
				(Math.abs(end) - Math.abs(mid)) / elementHalfHeight
			);

			if (end < mid) newEndUp += stepEnd;
			else newEndUp -= stepEnd;

			const finalMidEnd =
				Math.abs(Math.trunc(newEndUp + end)) < mid
					? Math.trunc(newEndUp + end)
					: mid;

			applyStyle(element, type, finalMidEnd);
		} else {
			const stepMid = Math.abs(
				(Math.abs(mid) - Math.abs(start)) / elementHalfHeight
			);

			if (mid > start) newMidUp -= stepMid;
			else newMidUp += stepMid;

			const finalMidStart =
				Math.abs(Math.trunc(newMidUp + mid)) < start
					? Math.trunc(newMidUp + mid)
					: start;

			applyStyle(element, type, finalMidStart);
		}
	}
};

export const startingMotion = () => {
	const elements = Array.from(
		document.getElementsByClassName('maxi-block-motion')
	);

	elements.forEach(function maxiMotion(element, index) {
		const motionType = element.getAttribute('data-motion-type');
		const motionTypeArray = motionType?.trim().split(' ');
		const parent = getParent(element);
		let transition = '';

		motionTypeArray?.map(type => {
			const dataMotion = getMotionData(element, type);
			const { speedValue, easingValue, delayValue } = getMotionSetting(
				dataMotion,
				parent
			);

			switch (type) {
				case 'vertical':
					transition += `top ${speedValue}ms ${easingValue} ${delayValue}ms, `;
					break;
				case 'horizontal':
					transition += `left ${speedValue}ms ${easingValue} ${delayValue}ms, `;
					break;
				case 'rotate':
					transition += `transform ${speedValue}ms ${easingValue} ${delayValue}ms, `;
					break;
				case 'scale':
					transition += `transform ${speedValue}ms ${easingValue} ${delayValue}ms, `;
					break;
				case 'fade':
					transition += `opacity ${speedValue}ms ${easingValue} ${delayValue}ms, `;
					break;
				case 'blur':
					transition += `filter ${speedValue}ms ${easingValue} ${delayValue}s, `;
					break;
				default:
					break;
			}
			startingTransform(element, type);
			return null;
		});

		if (transition !== '')
			element.style.transition = transition.substring(
				0,
				transition.length - 2
			);
	});
};

export const scrollMotion = () => {
	const elements = Array.from(
		document.getElementsByClassName('maxi-block-motion')
	);

	elements.forEach(function motionOnScroll(element, index) {
		const motionType = element.getAttribute('data-motion-type');

		const motionTypeArray = motionType?.trim().split(' ');

		motionTypeArray?.map(type => {
			scrollTransform(element, type);
			return null;
		});
	});
};

export const addMotion = () => {
	startingMotion();

	// eslint-disable-next-line @wordpress/no-global-event-listener
	window.addEventListener('scroll', () => scrollMotion());

	// eslint-disable-next-line @wordpress/no-global-event-listener
	window.addEventListener('load', () => {
		document
			.getElementsByClassName('interface-interface-skeleton__content')[0]
			.addEventListener('scroll', () => scrollMotion());
	});
};

export const removeMotion = uniqueID => {
	const el = document.querySelectorAll(
		`.maxi-block--backend[uniqueid='${uniqueID}']`
	)[0];
	if (!isEmpty(el)) {
		el.classList.remove('maxi-block-motion');
		el.style.removeProperty('top');
		el.style.removeProperty('left');
		el.style.removeProperty('filter');
		el.style.removeProperty('transform');
		el.style.removeProperty('transition');
		el.style.removeProperty('opacity');
	}
};
