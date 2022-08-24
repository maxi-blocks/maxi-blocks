/* eslint-disable max-classes-per-file */

class Slide {
	constructor(el, id) {
		this._slide = el;
		this._id = id;

		this.isActive = 0;

		this.size = this._slide.getBoundingClientRect();
	}

	get isActive() {
		return this._isActive;
	}

	set isActive(activeSlideId) {
		this._isActive = this._id === activeSlideId;
		this._slide.classList.toggle('slider-item--active', this._isActive);
	}

	get size() {
		return this._size;
	}

	set size(size) {
		this._size = size;
	}
}
class MaxiSlider {
	constructor(el) {
		this._container = el;
		this._wrapper = this._container.querySelector(
			'.maxi-slider-block__wrapper'
		);

		// Slides
		this._slides = Array.from(
			this._wrapper.getElementsByClassName('maxi-slide-block')
		).map((slide, i) => new Slide(slide, i));

		this.isLoop = this._container.dataset.infiniteLoop === 'true';
		this.isAutoplay = this._container.dataset.autoplay === 'true';
		this.hoverPause = this._container.dataset.hoverPause === 'true';
		this.interactionPause =
			this._container.dataset.interactionPause === 'true';
		this.autoplaySpeed = this._container.dataset.autoplaySpeed;
		this.transition = this._container.dataset.transition;
		this.transitionSpeed = this._container.dataset.transitionSpeed;

		// Navigation
		this._arrowNext = this._container.querySelector(
			'.maxi-slider-block__arrow--next'
		);
		this._arrowPrev = this._container.querySelector(
			'.maxi-slider-block__arrow--prev'
		);
		this._dots = this._container.querySelectorAll(
			'.maxi-slider-block__dot'
		);

		// States
		this.currentSlide = 0;
		this.initPosition;
		this.dragPosition;
		this.endPosition;
		this.realFirstElOffset = 0;

		this.isInteracting = false;
		this.isHovering = false;

		// Binded methods
		this.onDragStart = this.dragStart.bind(this);
		this.onDragAction = this.dragAction.bind(this);
		this.onDragEnd = this.dragEnd.bind(this);
		this.onHover = this.onHover.bind(this);
		this.onHoverEnd = this.onHoverEnd.bind(this);
		this.exactSlide = this.exactSlide.bind(this);

		this._container.addEventListener('mouseenter', this.onHover);
		this._container.addEventListener('mouseleave', this.onHoverEnd);

		const isPaused = () => {
			if (this.hoverPause && this.isHovering) return true;
			if (this.interactionPause && this.isInteracting) return true;

			return false;
		};

		if (this.isAutoplay) {
			setInterval(() => {
				if (!isPaused()) this.slideNext();
			}, this.autoplaySpeed);
		}

		this.init();
	}

	get currentSlide() {
		return this._currentSlide;
	}

	set currentSlide(slide) {
		this._currentSlide = slide;
	}

	get activeSlidePosition() {
		if (this._currentSlide < 0)
			return (
				this.realFirstElOffset -
				this._slides
					.slice(this.currentSlide)
					.map(slide => slide.size.width)
					?.reduce((acc, cur) => acc + cur)
			);

		return this.currentSlide === 0
			? this.realFirstElOffset
			: this._slides
					.slice(0, this.currentSlide)
					.map(slide => slide.size.width)
					?.reduce((acc, cur) => acc + cur) +
					this.realFirstElOffset || this.realFirstElOffset;
	}

	get wrapperTranslate() {
		return +this._wrapper.style.transform
			.replace('translateX(', '')
			.replace('-', '')
			.replace(')', '')
			.replace('px', '');
	}

	set wrapperTranslate(translate) {
		this._wrapper.style.transform = `translateX(-${translate}px)`;
	}

	init() {
		if (this.isLoop) {
			this.insertSlideClones(2);
		}

		// Init styles
		this.wrapperTranslate = this.realFirstElOffset;

		this.navEvents();
		this.wrapperEvents();
	}

	navEvents() {
		this._arrowNext.addEventListener('click', this.slideNext.bind(this));
		this._arrowPrev.addEventListener('click', this.slidePrev.bind(this));

		this._dots.forEach((dot, currentSlide) => {
			dot.addEventListener('click', () => this.exactSlide(currentSlide));
		});
	}

	wrapperEvents() {
		this._wrapper.addEventListener('mousedown', this.onDragStart);
		this._wrapper.addEventListener('touchstart', this.onDragStart);
		this._wrapper.addEventListener('touchmove', this.onDragAction);
		this._wrapper.addEventListener('touchend', this.onDragEnd);
		this._wrapper.addEventListener(
			'transitionend',
			this.transitionEnd.bind(this)
		);
		this._wrapper.addEventListener(
			'animationend',
			this.transitionEnd.bind(this)
		);
	}

	insertSlideClones(numberOfClones) {
		for (let i = 0; i < numberOfClones; i += 1) {
			const frontClone = this.getSlideClone(i);
			const backClone = this.getSlideClone(this._slides.length - 1 - i);
			this._wrapper.append(frontClone);
			this._wrapper.prepend(backClone);
			this.realFirstElOffset += backClone.getBoundingClientRect().width;
			this.lastSlideTranslate += backClone.getBoundingClientRect().width;
		}
	}

	getSlideClone(slideIndex) {
		const clone = this._slides[slideIndex]._slide.cloneNode(true);
		clone.classList.add('maxi-slide-block--clone');
		return clone;
	}

	dragStart(e) {
		e = e || window.event;
		e.preventDefault();

		this._wrapper.style.transition = '';
		this._wrapper.style.animation = '';

		this.isInteracting = true;
		this._wrapper.classList.add('maxi-slider-interaction');

		if (e.type === 'touchstart') {
			this.initPosition = e.touches[0].clientX;
		} else {
			this.initPosition = e.clientX;
			document.addEventListener('mousemove', this.onDragAction);
			document.addEventListener('mouseup', this.onDragEnd);
		}

		this.dragPosition = this.initPosition;
	}

	dragAction(e) {
		e = e || window.event;

		let dragMove;

		if (
			this.currentSlide + 1 >= this._slides.length &&
			this.dragPosition < this.initPosition &&
			this.isLoop
		) {
			this.currentSlide -= this._slides.length;
			this.sliderAction(false);
		} else if (
			this.currentSlide <= 0 &&
			this.dragPosition > this.initPosition &&
			this.isLoop
		) {
			this.currentSlide += this._slides.length;
			this.sliderAction(false);
		}

		if (e.type === 'touchmove') {
			dragMove = this.dragPosition - e.touches[0].clientX;
			this.dragPosition = e.touches[0].clientX;
		} else {
			dragMove = this.dragPosition - e.clientX;
			this.dragPosition = e.clientX;
		}

		if (this.transition !== 'fade') this.wrapperTranslate += dragMove;
	}

	dragEnd(e) {
		if (e.type === 'touchend') {
			this.endPosition = this.dragPosition;
		} else {
			this.endPosition = e.clientX;
		}

		if (this.endPosition - this.initPosition < -100) {
			this.slideNext();
		} else if (this.endPosition - this.initPosition > 100) {
			this.slidePrev();
		} else {
			this.exactSlide(this.currentSlide);
		}

		this.isInteracting = false;
		this._wrapper.classList.remove('maxi-slider-interaction');

		document.removeEventListener('mousemove', this.onDragAction);
		document.removeEventListener('mouseup', this.onDragEnd);
	}

	setActiveDot(dotNumber) {
		const dots = this._container.querySelectorAll(
			' .maxi-slider-block__dot'
		);

		[].forEach.call(dots, function removeActiveClass(el) {
			el.classList.remove('maxi-slider-block__dot--active');
		});

		const activeDot = this._container.querySelectorAll(
			` .maxi-slider-block__dot--${dotNumber}`
		)[0];

		activeDot?.classList.add('maxi-slider-block__dot--active');
	}

	slideNext() {
		if (this.currentSlide + 1 < this._slides.length || this.isLoop) {
			this.exactSlide(this.currentSlide + 1);
		} else {
			this.exactSlide(this.currentSlide);
		}
	}

	slidePrev() {
		if (this.currentSlide - 1 >= 0 || this.isLoop) {
			this.exactSlide(this.currentSlide - 1);
		} else {
			this.exactSlide(this.currentSlide);
		}
	}

	exactSlide(slideNumber) {
		const changedSlide = this.currentSlide !== slideNumber;

		if (changedSlide) {
			this.currentSlide = slideNumber;
			this.setActiveDot(slideNumber);
		}

		// For fade, animation should fire only when changing slide
		const addAnimation = this.transition !== 'fade' || changedSlide;
		this.sliderAction(addAnimation);
	}

	getSliderEffect() {
		let effect = '';

		switch (this.transition) {
			case 'slide':
				effect += 'transform';
				break;
			case 'fade':
				effect += 'maxiFade';
				break;
			default:
				effect += 'maxiSlide';
		}

		effect += ` ${this.transitionSpeed / 1000}s ease-out`;

		return effect;
	}

	sliderAction(withTransition = true) {
		// Update active slide
		this._slides.forEach(slide => (slide.isActive = this.currentSlide));

		// Move the slider
		if (withTransition) {
			if (this.transition !== 'slide')
				this._wrapper.style.animation = this.getSliderEffect();
			else this._wrapper.style.transition = this.getSliderEffect();
		}

		this.wrapperTranslate = this.activeSlidePosition;
	}

	onHover() {
		this.isHovering = true;
		this._wrapper.classList.add('maxi-slider-hovered');
	}

	onHoverEnd() {
		this.isHovering = false;
		this._wrapper.classList.remove('maxi-slider-hovered');
	}

	loop() {
		if (this.currentSlide >= this._slides.length) {
			this.currentSlide = 0;
			this.setActiveDot(this.currentSlide);
			this.sliderAction(false);
		}
		if (this.currentSlide < 0) {
			this.currentSlide = this._slides.length - 1;
			this.setActiveDot(this.currentSlide);
			this.sliderAction(false);
		}
	}

	transitionEnd() {
		this._wrapper.style.transition = '';
		this._wrapper.style.animation = '';
		if (this.isLoop) this.loop();
	}
}

document.addEventListener(
	'DOMContentLoaded',
	() =>
		Array.from(
			document.getElementsByClassName('maxi-slider-block')
		).forEach(slider => new MaxiSlider(slider)),
	false
);
