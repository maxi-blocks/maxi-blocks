class ScrollEffects {
	constructor() {
		this.scrollData = this.getElements();
		this.init();
		this.oldValue = 0;
	}

	init() {
		this.startingEffect();

		// eslint-disable-next-line @wordpress/no-global-event-listener
		document.addEventListener('DOMContentLoaded', [
			this.getElements.bind(this),
			this.startingEffect.bind(this),
		]);

		// eslint-disable-next-line @wordpress/no-global-event-listener
		window.addEventListener('scroll', this.effectsOnScroll.bind(this));
	}

	getElements = () => {
		const response = {};
		const elements = Array.from(
			document.querySelectorAll('[data-scroll-effect-type]')
		);

		elements.forEach(element => {
			const { id } = element;
			response[id] = {};
			const scrollType = element?.getAttribute('data-scroll-effect-type');
			const scrollTypeArray = scrollType?.trim()?.split(' ');

			scrollTypeArray.forEach(type => {
				response[id][type] = this.getScrollData(element, type);
			});
		});

		return response;
	};

	setTransform = (el, transform, type) => {
		const oldTransform = el.style.transform;

		if (oldTransform == null) {
			el.style.transform = transform;
			el.style.WebkitTransform = transform;
			return null;
		}

		const oldTransformArray = oldTransform.split(' ');

		if (el.dataset.scrollEffectType.includes(type)) {
			const transformProperty = transform.split('(')[0]; // Get the property name (e.g., translateX, translateY, rotate)
			let propertyExists = false;

			const newTransformArray = oldTransformArray.map(oldTransform => {
				const property = oldTransform.split('(')[0];
				if (property === transformProperty) {
					propertyExists = true;
					return transform;
				}
				return oldTransform;
			});

			if (!propertyExists) {
				newTransformArray.push(transform);
			}

			el.style.transform = newTransformArray.join(' ');
			el.style.WebkitTransform = newTransformArray.join(' ');
		}

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
				this.setTransform(el, `translateY(${value}px)`, 'vertical');
				break;
			case 'horizontal':
				this.setTransform(el, `translateX(${value}px)`, 'horizontal');
				break;
			default:
				break;
		}

		return null;
	}

	getScrollSetting = data => {
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

		response.speedValue = parseFloat(dataScrollArray[0]) || 200;
		response.delayValue = parseFloat(dataScrollArray[1]) || 0;
		response.easingValue = dataScrollArray[2] || 'ease';
		response.trigger = getTriggerValue(dataScrollArray[3]);
		response.reverseScroll = dataScrollArray[4] || true;
		response.start = parseInt(dataScrollArray[5]);
		response.mid = parseInt(dataScrollArray[6]);
		response.end = parseInt(dataScrollArray[7]);

		return response;
	};

	getScrollData = (el, type) => {
		return el.getAttribute(`data-scroll-effect-${type}-general`);
	};

	startingTransform(element, type) {
		const dataScroll = this.getScrollData(element, type);
		if (!dataScroll || !element) return null;

		const { start } = this.getScrollSetting(dataScroll);

		this.applyStyle(element, type, start);

		return null;
	}

	getScrollDirection = () => {
		const newValue = window.pageYOffset;
		let currentDirection = '';

		if (this.oldValue <= newValue) {
			currentDirection = 'down';
		} else {
			currentDirection = 'up';
		}

		this.oldValue = newValue;

		return currentDirection;
	};

	scrollTransform = (element, type, scrollDirection) => {
		const dataScroll = this.getScrollData(element, type);

		if (!dataScroll) return;

		const { trigger, start, mid, end, reverseScroll } =
			this.getScrollSetting(dataScroll);

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

		if (scrollDirection === 'down' && elementTopInCoordinate <= 0) {
			if (elementMidInCoordinate >= 0) {
				// from starting to middle
				this.applyStyle(element, type, mid);
			} else {
				// from middle to the end
				this.applyStyle(element, type, end);
			}
		}
		if (
			reverseScroll === 'true' &&
			scrollDirection === 'up' &&
			elementBottomInCoordinate >= 0
		) {
			if (elementMidInCoordinate <= 0) {
				this.applyStyle(element, type, mid);
			} else {
				this.applyStyle(element, type, start);
			}
		}
	};

	effectsOnScroll = () => {
		const scrollDirection = this.getScrollDirection();
		Object.entries(this.scrollData).forEach(([id, effect]) => {
			const element = document.getElementById(id);
			Object.entries(effect).forEach(([type]) => {
				this.scrollTransform(element, type, scrollDirection);
			});
		});
	};

	// eslint-disable-next-line class-methods-use-this
	startingEffect() {
		Object.entries(this.scrollData).forEach(([id, effect]) => {
			let transition = '';
			const element = document.getElementById(id);
			Object.entries(effect).forEach(([type, data]) => {
				const { speedValue, easingValue, delayValue } =
					this.getScrollSetting(data);

				switch (type) {
					case 'vertical':
						transition = `transform ${speedValue}ms ${easingValue} ${delayValue}ms, `;
						break;
					case 'horizontal':
						transition = `transform ${speedValue}ms ${easingValue} ${delayValue}ms, `;
						break;
					case 'rotate':
						transition = `transform ${speedValue}ms ${easingValue} ${delayValue}ms, `;
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
window.addEventListener('DOMContentLoaded', () => {
	// eslint-disable-next-line no-new
	new ScrollEffects();
});
