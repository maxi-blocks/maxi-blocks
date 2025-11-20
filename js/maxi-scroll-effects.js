class ScrollEffects {
	constructor() {
		this.breakpointsObj = {
			xxl: 1921,
			xl: 1920,
			l: 1366,
			m: 1024,
			s: 768,
			xs: 480,
		};
		this.breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
		this.breakpoint = this.getCurrentBreakpoint();

		const oldScrollData = this.getElements();

		// eslint-disable-next-line no-undef
		const rawScrollData = maxiScrollEffects?.[0];
		const newScrollData =
			rawScrollData &&
			Object.entries(rawScrollData).reduce((acc, [uniqueID, json]) => {
				const scrollData = JSON.parse(json);
				delete scrollData.scroll_effects;
				acc[uniqueID] = scrollData;
				return acc;
			}, {});

		this.isOldScroll = Object.values(newScrollData).every(
			item => Object.keys(item).length === 0
		);

		this.scrollData = !this.isOldScroll ? newScrollData : oldScrollData;
		this.startData = {};
		this.isBorderStylesAppliedData = {};

		this.init();
		this.oldValue = 0;
		this.scrollEndTimer = null;
		this.lastScrollY = 0;
	}

	init() {
		this.startingEffect();

		// Use 'load' event instead of DOMContentLoaded because:
		// 1. DOMContentLoaded already fired (this code runs on DOMContentLoaded)
		// 2. Browser scrolls to anchor AFTER DOMContentLoaded
		window.addEventListener('load', () => {
			this.getElements();
			this.startingEffect();
		});

		// Recalculate positions when clicking anchor links on the same page
		window.addEventListener('hashchange', () => {
			requestAnimationFrame(() => {
				this.startingEffect();
			});
		});

		window.addEventListener('scroll', () => {
			this.effectsOnScroll();

			// Detect scroll end to recalculate positions after anchor jumps
			clearTimeout(this.scrollEndTimer);
			this.scrollEndTimer = setTimeout(() => {
				const scrollDelta = Math.abs(window.scrollY - this.lastScrollY);
				// If scroll jumped more than 100px, likely an anchor click
				if (scrollDelta > 100) {
					this.startingEffect();
				}
				this.lastScrollY = window.scrollY;
			}, 150);
		});

		window.addEventListener('resize', this.handleResize.bind(this));
	}

	getCurrentBreakpoint() {
		const winWidth = window.innerWidth;

		if (winWidth > this.breakpointsObj.xl) return 'xxl';

		let currentBreakpoint;

		['xl', 'l', 'm', 's', 'xs'].forEach(breakpoint => {
			if (this.breakpointsObj[breakpoint] >= winWidth) {
				currentBreakpoint = breakpoint;
			}
		});

		return currentBreakpoint;
	}

	handleResize = () => {
		const newBreakpoint = this.getCurrentBreakpoint();

		if (newBreakpoint !== this.breakpoint) {
			this.breakpoint = newBreakpoint;
			this.startingEffect();
		}
	};

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

	applyStyle(el, type, value, unit) {
		switch (type) {
			case 'rotate':
				this.setTransform(el, `rotate(${value}deg)`, 'rotate');
				break;
			case 'rotateX':
				this.setTransform(el, `rotateX(${value}deg)`, 'rotateX');
				break;
			case 'rotateY':
				this.setTransform(el, `rotateY(${value}deg)`, 'rotateY');
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
			case 'scaleX':
				this.setTransform(el, `scaleX(${value}%)`, 'scaleX');
				break;
			case 'scaleY':
				this.setTransform(el, `scaleY(${value}%)`, 'scaleY');
				break;
			case 'blur':
				this.constructor.setBlur(el, `${value}${unit}`);
				break;
			case 'vertical':
				this.setTransform(
					el,
					`translateY(${value}${unit})`,
					'vertical'
				);
				break;
			case 'horizontal':
				this.setTransform(
					el,
					`translateX(${value}${unit})`,
					'horizontal'
				);
				break;
			default:
				break;
		}

		return null;
	}

	getLastBreakpointAttribute = (obj, key, currentBreakpoint) => {
		return obj[
			`${key}-${[...this.breakpoints]
				.splice(0, this.breakpoints.indexOf(currentBreakpoint) + 1)
				.reverse()
				.find(breakpoint => `${key}-${breakpoint}` in obj)}`
		];
	};

	getScrollSetting = (data, type) => {
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
			const getZones = () => {
				const zones = this.getLastBreakpointAttribute(
					data,
					`scroll-${type}-zones`,
					this.breakpoint
				) || {
					0: 0,
					100: 0,
				};

				if (!zones[0]) zones[0] = 0;

				return zones;
			};

			return {
				status: this.getLastBreakpointAttribute(
					data,
					`scroll-${type}-status`,
					this.breakpoint
				),
				speedValue:
					this.getLastBreakpointAttribute(
						data,
						`scroll-${type}-speed`,
						this.breakpoint
					) || 200,
				delayValue:
					this.getLastBreakpointAttribute(
						data,
						`scroll-${type}-delay`,
						this.breakpoint
					) || 0,
				easingValue:
					this.getLastBreakpointAttribute(
						data,
						`scroll-${type}-easing`,
						this.breakpoint
					) || 'ease',
				trigger: getTriggerValue(
					this.getLastBreakpointAttribute(
						data,
						`scroll-${type}-viewport-top`,
						this.breakpoint
					)
				),
				reverseScroll:
					this.getLastBreakpointAttribute(
						data,
						`scroll-${type}-status-reverse`,
						this.breakpoint
					) || true,
				zones: getZones(),
				isBlockZone:
					this.getLastBreakpointAttribute(
						data,
						`scroll-${type}-is-block-zone`,
						this.breakpoint
					) || false,
				unit:
					this.getLastBreakpointAttribute(
						data,
						`scroll-${type}-unit`,
						this.breakpoint
					) || 'px',
			};
		}

		/**
		 * Old scroll support
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
				isBlockZone: true,
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

		const { status, zones, unit } = this.getScrollSetting(dataScroll, type);

		if (status) this.applyStyle(element, type, zones[0], unit);

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

		const { status, trigger, zones, isBlockZone, unit, reverseScroll } =
			this.getScrollSetting(dataScroll, type);

		if (!status) return;

		const windowHeight = window.innerHeight;
		const windowHalfHeight = windowHeight / 2;
		const { top, height } = this.startData[element.id];

		let elementTopInCoordinate = top;

		let elementTopInPercent = 0;

		if (isBlockZone) {
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

			if (topShiftPx !== 0) {
				elementTopInCoordinate -= topShiftPx;
			}
			elementTopInPercent = Math.round(
				((window.scrollY - elementTopInCoordinate) / height) * 100
			);
		} else {
			elementTopInPercent = Math.round(
				((window.scrollY - top + windowHeight) / windowHeight) * 100
			);
		}

		if (
			(scrollDirection === 'down' ||
				((reverseScroll === true || reverseScroll === 'true') &&
					scrollDirection === 'up')) &&
			((elementTopInPercent >= 0 && elementTopInPercent <= 100) ||
				!this.isBorderStylesAppliedData[element.id])
		) {
			this.isBorderStylesAppliedData[element.id] =
				elementTopInPercent > 100 || elementTopInPercent < 0;
			for (const [zone, value] of Object.entries(zones).sort(
				(a, b) => b[0] - a[0]
			)) {
				if (elementTopInPercent >= zone) {
					this.applyStyle(element, type, value, unit);
					break;
				}
			}
		}
	};

	effectsOnScroll = () => {
		const scrollDirection = this.getScrollDirection();
		Object.entries(this.scrollData).forEach(([id, effect]) => {
			const element = document.getElementById(id);
			if (!element) return;

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
			case 'rotateX':
			case 'rotateY':
			case 'scale':
			case 'scaleX':
			case 'scaleY':
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

			if (!element) return;

			const rects = element.getBoundingClientRect();

			this.startData[id] = {
				top: Math.round(rects.top + window.scrollY),
				height: Math.round(rects.height),
			};
			this.isBorderStylesAppliedData[id] = false;

			Object.entries(effect).forEach(([type, data]) => {
				const { status, speedValue, easingValue, delayValue } =
					this.getScrollSetting(data, type);

				if (!status) return;

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
