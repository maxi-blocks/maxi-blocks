class ScrollEffects {
	constructor() {
		const oldScrollData = this.getElements();
		this.isOldScroll = Object.keys(oldScrollData).length > 0;

		// eslint-disable-next-line no-undef
		const rawScrollData = maxiScrollEffects?.[0];

		this.scrollData =
			!this.isOldScroll && rawScrollData
				? Object.entries(rawScrollData).reduce(
						(acc, [uniqueID, json]) => {
							const scrollData = JSON.parse(json);
							delete scrollData.scroll_effects;
							acc[uniqueID] = scrollData;
							return acc;
						},
						{}
				  )
				: oldScrollData;

		this.init();
		this.oldValue = 0;
	}

	init() {
		this.startingEffect();

		document.addEventListener('DOMContentLoaded', [
			this.getElements.bind(this),
			this.startingEffect.bind(this),
		]);

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
				response[id][type] = this.getScrollData(element, type, true);
			});
		});

		return response;
	};

	setTransform = (el, newTransform, type) => {
		const currentTransform = el.style.transform || '';

		// Splitting the current transform into individual transformations (e.g., "translateX(100px)" and "rotate(45deg)")
		const transformParts = currentTransform.match(/(\w+\([^)]+\))/g) || [];

		if (!this.isOldScroll || el.dataset.scrollEffectType.includes(type)) {
			const newTransformProperty = newTransform.split('(')[0]; // e.g., "translateX"

			const existingPropertyIndex = transformParts.findIndex(part =>
				part.startsWith(newTransformProperty)
			);

			if (existingPropertyIndex !== -1) {
				// Replace the existing transform property
				transformParts[existingPropertyIndex] = newTransform;
			} else {
				// Add the new transform property
				transformParts.push(newTransform);
			}

			const updatedTransform = transformParts.join(' ');
			el.style.transform = updatedTransform;
			el.style.WebkitTransform = updatedTransform;
		}

		return null;
	};

	static setOpacity = (el, opacity) => {
		el.style.opacity = opacity;
	};

	static setBlur = (el, blur) => {
		el.style.filter = `blur(${blur})`;
	};

	static setVertical = (el, value) => {
		el.style.top = `${value}px`;
	};

	static setHorizontal = (el, value) => {
		el.style.left = `${value}px`;
	};

	applyStyle(el, type, value) {
		switch (type) {
			case 'rotate':
				this.setTransform(el, `rotate(${value}deg)`, 'rotate');
				break;
			case 'fade':
				this.constructor.setOpacity(el, `${value}%`);
				break;
			case 'scale':
				this.setTransform(
					el,
					`scale3d(${value}%, ${value}%, ${value}%)`,
					'scale'
				);
				break;
			case 'blur':
				this.constructor.setBlur(el, `${value}px`);
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

	static getScrollSetting = (data, type = 'rotate') => {
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

		if (typeof data === 'object') {
			return {
				speedValue: data[`scroll-${type}-speed-general`] || 200,
				delayValue: data[`scroll-${type}-delay-general`] || 0,
				easingValue: data[`scroll-${type}-easing-general`] || 'ease',
				trigger: getTriggerValue(
					data[`scroll-${type}-viewport-top-general`]
				),
				reverseScroll:
					data[`scroll-${type}-status-reverse-general`] || true,
				// TODO: check why two types in name
				zones: data[`scroll-${type}-${type}-zones-general`],
			};
		}

		/**
		 * Old scroll
		 */
		if (typeof data === 'string') {
			const dataScrollArray = data.trim().split(' ');

			const response = {
				speedValue: parseFloat(dataScrollArray[0]) || 200,
				delayValue: parseFloat(dataScrollArray[1]) || 0,
				easingValue: dataScrollArray[2] || 'ease',
				trigger: getTriggerValue(dataScrollArray[3]),
				reverseScroll: dataScrollArray[4] || true,
				zones: {
					0: parseInt(dataScrollArray[5]),
					50: parseInt(dataScrollArray[6]),
					100: parseInt(dataScrollArray[7]),
				},
			};

			return response;
		}

		return null;
	};

	getScrollData = (el, type, isOldScroll = this.isOldScroll) => {
		if (!isOldScroll) {
			return this.scrollData[el.id][type];
		}

		return el.getAttribute(`data-scroll-effect-${type}-general`);
	};

	startingTransform(element, type) {
		const dataScroll = this.getScrollData(element, type);
		if (!dataScroll || !element) return null;

		const { zones } = this.constructor.getScrollSetting(dataScroll);

		this.applyStyle(element, type, zones[0]);

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

		const { trigger, zones, reverseScroll } =
			this.constructor.getScrollSetting(dataScroll);

		const rect = element.getBoundingClientRect();
		const windowHeight = window.innerHeight;
		const windowHalfHeight = windowHeight / 2;
		const elementHeight = element.offsetHeight;

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

		if (scrollDirection === 'down' && elementTopInCoordinate <= 0) {
			Object.entries(zones)
				.sort((a, b) => b[0] - a[0])
				.forEach(([zone, value]) => {
					if (
						elementTopInCoordinate + elementHeight * (zone / 100) >=
						0
					) {
						this.applyStyle(element, type, value);
					}
				});
		}

		if (
			(reverseScroll === true || reverseScroll === 'true') &&
			scrollDirection === 'up' &&
			elementBottomInCoordinate >= 0
		) {
			Object.entries(zones).forEach(([zone, value]) => {
				if (
					elementTopInCoordinate + elementHeight * (zone / 100) <=
					0
				) {
					this.applyStyle(element, type, value);
				}
			});
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

	static getTransition(type, speedValue, easingValue, delayValue) {
		let transition = '';

		switch (type) {
			case 'vertical':
			case 'horizontal':
			case 'rotate':
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

		return transition;
	}

	startingEffect() {
		Object.entries(this.scrollData).forEach(([id, effect]) => {
			let transition = '';
			const element = document.getElementById(id);
			Object.entries(effect).forEach(([type, data]) => {
				const { speedValue, easingValue, delayValue } =
					this.constructor.getScrollSetting(data);

				transition += this.constructor.getTransition(
					type,
					speedValue,
					easingValue,
					delayValue
				);

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

window.addEventListener('DOMContentLoaded', () => {
	// eslint-disable-next-line no-new
	new ScrollEffects();
});
