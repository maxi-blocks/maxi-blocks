class ScrollEffects {
	constructor() {
		this.init();
	}

	init() {
		this.startingEffect();
		this.effectsOnScroll();

		// eslint-disable-next-line @wordpress/no-global-event-listener
		document.addEventListener(
			'DOMContentLoaded',
			this.startingEffect.bind(this)
		);

		// eslint-disable-next-line @wordpress/no-global-event-listener
		window.addEventListener('scroll', this.effectsOnScroll.bind(this));
	}

	setTransform = (el, transform, type) => {
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

	setOpacity = (el, opacity) => {
		el.style.opacity = opacity;
	};

	setBlur = (el, blur) => {
		el.style.filter = `blur(${blur})`;
	};

	setVertical = (el, value) => {
		el.style.top = `${value}px`;
	};

	setHorizontal = (el, value) => {
		el.style.left = `${value}px`;
	};

	applyStyle(el, type, value) {
		switch (type) {
			case 'rotate':
				this.setTransform(el, `rotate(${value}deg)`, 'rotate');
				break;
			case 'fade':
				this.setOpacity(el, `${value}%`);
				break;
			case 'scale':
				this.setTransform(
					el,
					`scale3d(${value}%, ${value}%, ${value}%)`,
					'scale'
				);
				break;
			case 'blur':
				this.setBlur(el, `${value}px`);
				break;
			case 'vertical':
				this.setVertical(el, value);
				break;
			case 'horizontal':
				this.setHorizontal(el, value);
				break;
			default:
				break;
		}

		return null;
	}

	getScrollSetting = (data, element) => {
		const response = {};

		const dataScrollArray = data.trim().split(' ');

		const getTriggerValue = viewport => {
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

		response.trigger = getTriggerValue(dataScrollArray[3]);

		response.triggerPx = Math.round(
			(element.offsetHeight / 100) * response.trigger
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

	getScrollData = (el, type) => {
		return el.getAttribute(`data-scroll-effect-${type}-general`);
	};

	getParent = el => {
		if (el)
			return (
				el.parentNode.closest('.maxi-container-block') ||
				el.parentNode.closest('article')
			);
		return null;
	};

	startingTransform(element, type) {
		const dataScroll = this.getScrollData(element, type);
		if (!dataScroll || !element) return null;

		const parent = this.getParent(element);
		const { start } = this.getScrollSetting(dataScroll, parent);

		this.applyStyle(element, type, start);

		return null;
	}

	getScrollDirection = () => {
		let oldValue = 0;
		const newValue = window.pageYOffset;
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

	scrollTransform = (element, type) => {
		let newMidUp = 0;
		let newEndUp = 0;
		let newMidDown = 0;
		let newEndDown = 0;
		const dataScroll = this.getScrollData(element, type);

		if (!dataScroll) return;

		const { trigger, start, mid, end, reverseScroll } =
			this.getScrollSetting(dataScroll, element);

		const rect = element.getBoundingClientRect();
		const windowHeight = window.innerHeight;
		const windowHalfHeight = windowHeight / 2;
		const elementHeight = element.offsetHeight;
		const elementHalfHeight = elementHeight / 2;

		// Top shift
		let topShiftPx = 0; // top

		switch (trigger) {
			case 50: // mid
				topShiftPx = windowHalfHeight;
				break;
			case 0: // bottom
				topShiftPx = windowHeight;
				break;
			default:
				break;
		}

		let elementTopInCoordinate = Math.round(rect.top);
		let elementBottomInCoordinate = Math.round(rect.bottom);

		if (topShiftPx !== 0) {
			elementTopInCoordinate -= topShiftPx;
			elementBottomInCoordinate -= topShiftPx;
		}

		const elementMidInCoordinate = Math.round(
			elementTopInCoordinate + elementHalfHeight
		);

		const scrollDirection = this.getScrollDirection();

		if (scrollDirection === 'down' && elementTopInCoordinate <= 0) {
			newEndUp = 0;
			newMidUp = 0;
			if (elementMidInCoordinate >= 0) {
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

				this.applyStyle(element, type, finalStartMid);
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

				this.applyStyle(element, type, finalMidEnd);
			}
		}
		if (
			reverseScroll === 'true' &&
			scrollDirection === 'up' &&
			elementBottomInCoordinate >= 0
		) {
			newEndDown = 0;
			newMidDown = 0;
			if (elementMidInCoordinate <= 0) {
				const stepEnd = Math.abs(
					(Math.abs(end) - Math.abs(mid)) / elementHalfHeight
				);

				if (end < mid) newEndUp += stepEnd;
				else newEndUp -= stepEnd;

				const finalMidEnd =
					Math.abs(Math.trunc(newEndUp + end)) < mid
						? Math.trunc(newEndUp + end)
						: mid;

				this.applyStyle(element, type, finalMidEnd);
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

				this.applyStyle(element, type, finalMidStart);
			}
		}
	};

	effectsOnScroll = () => {
		const elements = Array.from(
			document.querySelectorAll('[data-scroll-effect-type]')
		);

		elements.forEach((element, index) => {
			const scrollType = element?.getAttribute('data-scroll-effect-type');

			const scrollTypeArray = scrollType?.trim()?.split(' ');

			scrollTypeArray?.forEach(type => {
				this.scrollTransform(element, type);
			});
		});
	};

	// eslint-disable-next-line class-methods-use-this
	startingEffect() {
		const elements = Array.from(
			document.querySelectorAll('[data-scroll-effect-type]')
		);

		elements.forEach(element => {
			const scrollType = element?.getAttribute('data-scroll-effect-type');
			const scrollTypeArray = scrollType?.trim()?.split(' ');
			const parent = this.getParent(element);
			let transition = '';

			scrollTypeArray?.forEach(type => {
				const dataScroll = this.getScrollData(element, type);
				const { speedValue, easingValue, delayValue } =
					this.getScrollSetting(dataScroll, parent);

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
				this.startingTransform(element, type);
			});

			if (transition !== '')
				element.style.transition = transition.substring(
					0,
					transition.length - 2
				);
		});
	}
}

// eslint-disable-next-line @wordpress/no-global-event-listener
window.addEventListener('scroll', () => {
	// eslint-disable-next-line no-new
	new ScrollEffects();
});
