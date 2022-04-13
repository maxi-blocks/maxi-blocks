console.log('MaxiSlider in da house!');

class MaxiSlider {
	constructor(el) {
		this._container = el;
		this._wrapper = this._container.querySelector(
			'.maxi-slider-block__wrapper'
		);

		// Sliders
		this._slides = Array.from(
			this._wrapper.getElementsByClassName('maxi-slide-block')
		).map((slide, i) => new Slide(slide, i));

		// Navigation
		this._arrowNext = this._container.querySelector(
			'.maxi-slider-block__arrow--next'
		);
		this._arrowPrev = this._container.querySelector(
			'.maxi-slider-block__arrow--prev'
		);

		// States
		this.currentSlide = 0;
		this.initPosition;
		this.dragPosition;
		this.endPosition;

		// Binded methods
		this.onDragStart = this.dragStart.bind(this);
		this.onDragAction = this.dragAction.bind(this);
		this.onDragEnd = this.dragEnd.bind(this);

		this.init();
	}

	get currentSlide() {
		return this._currentSlide;
	}

	set currentSlide(slide) {
		this._currentSlide = slide;
	}

	get activeSlidePosition() {
		return this.currentSlide === 0
			? 0
			: this._slides
					.slice(0, this.currentSlide)
					.map(slide => slide.size.width)
					?.reduce((acc, cur) => acc + cur) || 0;
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
		// Init styles
		this.wrapperTranslate = '0px';

		this.navEvents();
		this.wrapperEvents();
	}

	navEvents() {
		this._arrowNext.addEventListener('click', this.slideNext.bind(this));
		this._arrowPrev.addEventListener('click', this.slidePrev.bind(this));
	}

	wrapperEvents() {
		this._wrapper.addEventListener('mousedown', this.onDragStart);
		this._wrapper.addEventListener('touchstart', this.onDragStart);
		this._wrapper.addEventListener('touchmove', this.onDragAction);
		this._wrapper.addEventListener('touchend', this.onDragEnd);
	}

	dragStart(e) {
		e = e || window.event;
		e.preventDefault();

		if (e.type == 'touchstart') {
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

		if (e.type == 'touchmove') {
			dragMove = this.dragPosition - e.touches[0].clientX;
			this.dragPosition = e.touches[0].clientX;
		} else {
			dragMove = this.dragPosition - e.clientX;
			this.dragPosition = e.clientX;
		}

		this.wrapperTranslate = this.wrapperTranslate + dragMove;
	}

	dragEnd(e) {
		if (e.type == 'touchend') {
			this.endPosition = this.dragPosition;
		} else {
			this.endPosition = e.clientX;
		}

		if (this.endPosition - this.initPosition < -100) {
			this.slideNext();
		} else if (this.endPosition - this.initPosition > 100) {
			this.slidePrev();
		} else {
			this.sliderAction();
		}

		document.removeEventListener('mousemove', this.onDragAction);
		document.removeEventListener('mouseup', this.onDragEnd);
	}

	slideNext() {
		if (this.currentSlide + 1 < this._slides.length) {
			// Update current slide
			this.currentSlide = this.currentSlide + 1;

			this.sliderAction();
		}
	}

	slidePrev() {
		if (this.currentSlide - 1 >= 0) {
			// Update current slide
			this.currentSlide = this.currentSlide - 1;

			this.sliderAction();
		}
	}

	sliderAction() {
		// Update active slide
		this._slides.forEach(slide => (slide.isActive = this.currentSlide));

		// Move the slider
		this.wrapperTranslate = this.activeSlidePosition;
	}
}

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

document.addEventListener(
	'DOMContentLoaded',
	() =>
		Array.from(
			document.getElementsByClassName('maxi-slider-block')
		).forEach(slider => new MaxiSlider(slider)),
	false
);
