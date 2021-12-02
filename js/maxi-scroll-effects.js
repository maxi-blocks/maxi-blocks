const setTransform = (el, transform, type) => {
	const oldTransform = el.style.transform;

	if (oldTransform == null) {
		el.style.transform = transform;
		el.style.WebkitTransform = transform;
		return null;
	}

	const oldTransformArray = oldTransform.split(') ');

	oldTransformArray.map((transform, key) => {
		if (transform.includes(type)) oldTransformArray.splice(key, 1);
		return null;
	});

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

const getScrollSetting = (data, element) => {
	const response = {};

	const dataScrollArray = data.trim().split(' ');

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

	response.viewportTop = getViewportValue(dataScrollArray[3]);
	response.viewportTopPercent = Math.round(
		(element.offsetHeight / 100) * response.viewportTop
	);

	response.speedValue = parseFloat(dataScrollArray[0]) || 200;
	response.delayValue = parseFloat(dataScrollArray[1]) || 0;
	response.easingValue = dataScrollArray[2] || 'ease';

	response.reverseScroll = dataScrollArray[4] || true;

	response.start = parseInt(dataScrollArray[5]);
	response.mid = parseInt(dataScrollArray[6]);
	response.end = parseInt(dataScrollArray[7]);

	return response;
};

const getScrollData = (el, type) => {
	return el.getAttribute(`data-scroll-effect-${type}-general`);
};

const getParent = el => {
	return (
		el.parentNode.closest('.maxi-container-block') ||
		el.parentNode.closest('article')
	);
};

const startingTransform = (element, type) => {
	const dataScroll = getScrollData(element, type);
	if (!dataScroll) return null;

	const parent = getParent(element);
	const { start } = getScrollSetting(dataScroll, parent);

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
	const dataScroll = getScrollData(element, type);

	if (!dataScroll) return;

	const { viewportTopPercent, start, mid, end, reverseScroll } =
		getScrollSetting(dataScroll, element);

	const rect = element.getBoundingClientRect();
	const windowHeight = window.innerHeight;
	const windowHalfHeight = windowHeight / 2;
	const elementHeight = element.offsetHeight;
	const elementHalfHeight = elementHeight / 2;

	let elementTopInViewCoordinate = Math.round(rect.top - windowHalfHeight);
	const elementBottomInViewCoordinate = Math.round(
		rect.bottom - windowHalfHeight
	);
	const elementMidInViewCoordinate = Math.round(
		elementTopInViewCoordinate + elementHalfHeight
	);

	// Top shift
	const topShiftPx =
		viewportTopPercent -
		Math.abs(elementTopInViewCoordinate - elementBottomInViewCoordinate);

	if (topShiftPx !== 0) elementTopInViewCoordinate -= topShiftPx;

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
		reverseScroll === 'true' &&
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

const scrollScroll = () => {
	const elements = Array.from(
		document.getElementsByClassName('maxi-scroll-effect')
	);

	elements.forEach(function scrollOnScroll(element, index) {
		const scrollType = element?.getAttribute('data-scroll-effect-type');

		const scrollTypeArray = scrollType?.trim()?.split(' ');

		scrollTypeArray?.map(type => {
			scrollTransform(element, type);
			return null;
		});
	});
};

const startingScroll = () => {
	const elements = Array.from(
		document.getElementsByClassName('maxi-scroll-effect')
	);

	elements.forEach(function maxiScroll(element, index) {
		const scrollType = element?.getAttribute('data-scroll-effect-type');
		const scrollTypeArray = scrollType?.trim()?.split(' ');
		const parent = getParent(element);
		let transition = '';

		scrollTypeArray?.map(type => {
			const dataScroll = getScrollData(element, type);
			const { speedValue, easingValue, delayValue } = getScrollSetting(
				dataScroll,
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
					transition += `filter ${speedValue}ms ${easingValue} ${delayValue}ms, `;
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

// eslint-disable-next-line @wordpress/no-global-event-listener
document.addEventListener('DOMContentLoaded', function scrollsOnLoad(event) {
	// Scroll effects
	startingScroll();
});

// eslint-disable-next-line @wordpress/no-global-event-listener
window.addEventListener('scroll', () => scrollScroll());
