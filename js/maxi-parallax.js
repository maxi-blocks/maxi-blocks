// Parallax
class Parallax {
	constructor(el, speed) {
		this.wrapperEl = el;
		this.imgEl = el.querySelector('img');

		if (!this.imgEl) {
			return;
		}

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
		// eslint-disable-next-line no-unused-expressions
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

	// eslint-disable-next-line class-methods-use-this
	getBoundingClientRect(element) {
		if (!element?.getBoundingClientRect()) return null;
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

// parallax Effects
window.addEventListener('DOMContentLoaded', () => {
	// eslint-disable-next-line no-undef
	if (!maxiParallax?.[0]) return;

	const parallaxElements = document.querySelectorAll(
		'.maxi-block:has(> .maxi-background-displayer .maxi-background-displayer__parallax)'
	);

	parallaxElements.forEach(elem => {
		const parallaxID = elem.id;

		// eslint-disable-next-line no-undef
		const parallaxData = JSON.parse(maxiParallax[0][parallaxID])
			?.parallax?.[parallaxID];

		if (!parallaxData) return;

		// Parallax Effect
		parallaxData.forEach(layer => {
			const {
				id,
				'background-image-parallax-speed': parallaxSpeed,
				'background-image-parallax-direction': parallaxDirection,
			} = layer;

			const parallaxElem = document.querySelector(
				`#${parallaxID} > .maxi-background-displayer > .maxi-background-displayer__${id}`
			);

			const direction = parallaxDirection === 'up' ? 1 : -1;
			const speed = parallaxSpeed / 10 + direction;

			// eslint-disable-next-line no-new
			new Parallax(parallaxElem, speed);
		});
	});
});
