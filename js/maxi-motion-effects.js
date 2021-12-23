// Parallax
class Parallax {
	constructor(el, speed) {
		this.wrapperEl = el;
		this.imgEl = el.querySelector('img');

		this.getIsMobile();
		this.getWinValues();
		this.getOptions(speed);

		this.init();
	}

	getIsMobile() {
		this.isMobile =
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent
			);
	}

	getDeviceHeight() {
		this.deviceHelper;

		if (!this.deviceHelper && document.body) {
			this.deviceHelper = document.createElement('div');
			this.deviceHelper.style.cssText =
				'position: fixed; top: -9999px; left: 0; height: 100vh; width: 0;';
			document.body.appendChild(this.deviceHelper);
		}

		return (
			(this.deviceHelper ? this.deviceHelper.clientHeight : 0) ||
			window.innerHeight ||
			document.documentElement.clientHeight
		);
	}

	getWinValues() {
		this.winValues = {
			width: window.innerWidth || document.documentElement.clientWidth,
			height: this.isMobile
				? this.getDeviceHeight()
				: window.innerHeight || document.documentElement.clientHeight,
			y: window.pageYOffset,
		};
	}

	getBoundingClientRect(element) {
		const { top, right, bottom, left, width, height, x, y } =
			element.getBoundingClientRect();

		return { top, right, bottom, left, width, height, x, y };
	}

	getOptions(speed) {
		const wrapperRect = this.getBoundingClientRect(this.wrapperEl);
		const imgRect = this.getBoundingClientRect(this.imgEl);

		this.options = {
			general: {
				...this.options?.general,
				...(speed && { speed }),
			},
			wrapper: {
				...wrapperRect,
				styles: this.getWrapperStyles(wrapperRect),
			},
			img: {
				...imgRect,
				styles: this.getImgStyles(wrapperRect),
			},
		};
	}

	getWrapperStyles(wrapperRect) {
		if (!this.options) return null;

		const { width, height } = wrapperRect ?? this.options.wrapper;

		return `
		 clip: rect(0 ${width}px ${height}px 0);
		 clip: rect(0, ${width}px, ${height}px, 0);
	 `.trim();
	}

	getImgStyles(wrapperRect) {
		if (!this.options) return null;

		const { height: winHeight } = this.winValues;
		const { speed } = this.options.general;
		const {
			height: rawHeight,
			width,
			left,
			top,
		} = wrapperRect ?? this.options.wrapper;

		// Scroll distance
		let scrollDist = 0;

		if (speed < 0) {
			scrollDist = speed * Math.max(rawHeight, winHeight);

			if (winHeight < rawHeight) {
				scrollDist -= speed * (rawHeight - winHeight);
			}
		} else {
			scrollDist = speed * (rawHeight + winHeight);
		}

		// Height
		let height = rawHeight;

		if (speed > 1) {
			height = Math.abs(scrollDist - winHeight);
		} else if (speed < 0) {
			height = scrollDist / speed + Math.abs(scrollDist);
		} else {
			height += (winHeight - rawHeight) * (1 - speed);
		}

		scrollDist /= 2;

		// Margin top
		const marginTop = (winHeight - height) / 2;

		// Transform
		const fromViewportCenter =
			1 - 2 * ((winHeight - top) / (winHeight + rawHeight));
		const positionY = scrollDist * fromViewportCenter;

		return `
		 height: ${height}px;
		 margin-top: ${marginTop}px;
		 left: ${left}px;
		 width: ${width}px;
		 transform: translate3d(0,${positionY}px,0);
	 `.trim();
	}

	getIsInViewport() {
		const {
			wrapper: { bottom, right, top, left },
		} = this.options;
		const { height: winHeight, width: winWidth } = this.winValues;

		return (
			bottom >= 0 && right >= 0 && top <= winHeight && left <= winWidth
		);
	}

	init() {
		this.onResize();
		this.onScroll();

		window.addEventListener('resize', this.onResize.bind(this));
		window.addEventListener('orientationchange', this.onResize.bind(this));
		window.addEventListener('scroll', this.onScroll.bind(this));
	}

	onResize() {
		this.getOptions();
		this.getIsMobile();
		this.getWinValues();

		if (this.getIsInViewport()) {
			this.wrapperClip();
			this.imgStyles();
		}
	}

	onScroll() {
		this.getOptions();
		this.getIsMobile();
		this.getWinValues();

		if (this.getIsInViewport()) {
			this.imgStyles();
		}
	}

	wrapperClip() {
		this.wrapperEl.style.cssText = this.options.wrapper.styles;
	}

	imgStyles() {
		this.imgEl.style.cssText = this.options.img.styles;
	}
}

// Motion Effects
const motions = () => {
	const motionElements = document.querySelectorAll('.maxi-motion-effect');
	motionElements.forEach(elem => {
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
						motionData['hover-basic-effect-type'] ===
							'clear-sepia' ||
						motionData['hover-basic-effect-type'] ===
							'grey-scale' ||
						motionData['hover-basic-effect-type'] ===
							'clear-grey-scale'
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
						else if (
							motionData['hover-basic-effect-type'] === 'rotate'
						)
							e.target.style.transform = `rotate(${motionData['hover-basic-rotate-value']}deg)`;
						else if (
							motionData['hover-basic-effect-type'] === 'zoom-out'
						)
							e.target.style.transform = 'scale(1)';
						else if (
							motionData['hover-basic-effect-type'] === 'slide'
						)
							e.target.style.marginLeft = `${motionData['hover-basic-slide-value']}px`;
						else if (
							motionData['hover-basic-effect-type'] === 'blur'
						)
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
						else if (
							motionData['hover-basic-effect-type'] === 'rotate'
						)
							e.target.style.transform = 'rotate(0)';
						else if (
							motionData['hover-basic-effect-type'] === 'zoom-out'
						)
							e.target.style.transform = `scale(${motionData['hover-basic-zoom-out-value']})`;
						else if (
							motionData['hover-basic-effect-type'] === 'slide'
						)
							e.target.style.marginLeft = 0;
						else if (
							motionData['hover-basic-effect-type'] === 'blur'
						)
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
			if (
				motionData['shape-divider-top-effects-status'] &&
				motionData['shape-divider-top-status']
			) {
				const shapeDividerTopHeight =
					motionData['shape-divider-top-height'];
				const shapeDividerTopHeightUnit =
					motionData['shape-divider-top-height-unit'];
				const target = document.querySelector(
					`#${motionID} > .maxi-shape-divider.maxi-shape-divider__top`
				);

				// eslint-disable-next-line @wordpress/no-global-event-listener
				window.addEventListener('scroll', () => {
					if (target.getBoundingClientRect().top < 100) {
						target.style.height = 0;
					} else {
						target.style.height = `${shapeDividerTopHeight}${shapeDividerTopHeightUnit}`;
					}
				});
			}

			if (
				motionData['shape-divider-bottom-effects-status'] &&
				motionData['shape-divider-bottom-status']
			) {
				const shapeDividerBottomHeight =
					motionData['shape-divider-bottom-height'];
				const shapeDividerBottomHeightUnit =
					motionData['shape-divider-bottom-height-unit'];
				const target = document.querySelector(
					`#${motionID} > .maxi-shape-divider.maxi-shape-divider__bottom`
				);
				// eslint-disable-next-line @wordpress/no-global-event-listener
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
						'background-image-parallax-direction':
							parallaxDirection,
					} = layer;

					const parallaxElem = document.querySelector(
						`#${motionID} > .maxi-background-displayer > .maxi-background-displayer__${id}`
					);

					const direction = parallaxDirection === 'up' ? 1 : -1;
					const speed = parallaxSpeed / 10 + direction;

					// eslint-disable-next-line @wordpress/no-global-event-listener
					window.addEventListener('scroll', () => {
						// eslint-disable-next-line no-new
						new Parallax(parallaxElem, speed);
					});
				});
			}
		}
	});
};

// eslint-disable-next-line @wordpress/no-global-event-listener
window.addEventListener('load', motions);
