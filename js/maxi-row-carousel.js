/* eslint-disable max-classes-per-file */
/* eslint-disable no-new */

class RowCarouselColumn {
	constructor(el, id) {
		this._column = el;
		this._id = id;

		this.isActive = 0;

		this.size = this._column.getBoundingClientRect();
	}

	get isActive() {
		return this._isActive;
	}

	set isActive(activeColumnId) {
		this._isActive = this._id === activeColumnId;
		this._column.classList.toggle('carousel-item--active', this._isActive);
		this._column.setAttribute(
			'data-carousel-active',
			this._isActive.toString()
		);
	}

	get size() {
		return this._size;
	}

	set size(size) {
		this._size = size;
	}
}

class MaxiRowCarousel {
	constructor(el) {
		this._container = el;

		// Check if carousel should be active for current breakpoint
		if (!this.isCarouselEnabledForCurrentBreakpoint()) {
			return;
		}

		// Get all direct column children
		const columns = Array.from(
			this._container.querySelectorAll(':scope > .maxi-column-block')
		);

		if (columns.length === 0) {
			return;
		}

		// Create carousel structure
		this.createCarouselStructure(columns);

		// Now get the created elements
		this._tracker = this._container.querySelector(
			'.maxi-row-carousel__tracker'
		);
		this._wrapper = this._container.querySelector(
			'.maxi-row-carousel__wrapper'
		);

		// Columns (slides)
		this._columns = Array.from(
			this._wrapper.querySelectorAll(':scope > .maxi-column-block')
		).map((column, i) => new RowCarouselColumn(column, i));

		// Configuration from data attributes
		this.slidesPerView =
			parseInt(this._container.dataset.carouselSlidesPerView, 10) || 1;
		this.isLoop = this._container.dataset.carouselLoop === 'true';
		this.isAutoplay = this._container.dataset.carouselAutoplay === 'true';
		this.hoverPause = this._container.dataset.carouselHoverPause === 'true';
		this.interactionPause =
			this._container.dataset.carouselInteractionPause === 'true';
		this.autoplaySpeed =
			parseInt(this._container.dataset.carouselAutoplaySpeed, 10) || 2500;
		this.transition = this._container.dataset.carouselTransition || 'slide';
		this.transitionSpeed =
			parseInt(this._container.dataset.carouselTransitionSpeed, 10) ||
			500;

		// eslint-disable-next-line no-console
		console.log('MaxiRowCarousel: slidesPerView =', this.slidesPerView);

		// Navigation
		this._arrowNext = this._container.querySelector(
			'.maxi-row-carousel__arrow--next'
		);
		this._arrowPrev = this._container.querySelector(
			'.maxi-row-carousel__arrow--prev'
		);
		this._dotsContainer = this._container.querySelector(
			'.maxi-row-carousel__dots'
		);

		// States
		this.currentColumn = 0;
		this.initPosition = 0;
		this.dragPosition = 0;
		this.endPosition = 0;
		this.realFirstElOffset = 0;

		this.isInteracting = false;
		this.isHovering = false;

		// Bind methods
		this.onDragStart = this.dragStart.bind(this);
		this.onDragAction = this.dragAction.bind(this);
		this.onDragEnd = this.dragEnd.bind(this);
		this.onHoverEnd = this.onHover.bind(this, true);
		this.onHover = this.onHover.bind(this, false);
		this.exactColumn = this.exactColumn.bind(this);

		this._container.addEventListener('mouseenter', this.onHover);
		this._container.addEventListener('mouseleave', this.onHoverEnd);

		// Handle window resize to recalculate column widths
		window.addEventListener('resize', () => {
			this.setColumnWidths();
		});

		const isPaused = () => {
			if (this.hoverPause && this.isHovering) return true;
			if (this.interactionPause && this.isInteracting) return true;

			return false;
		};

		if (this.isAutoplay) {
			setInterval(() => {
				if (!isPaused()) this.columnNext();
			}, this.autoplaySpeed);
		}

		this.init();
	}

	createCarouselStructure(columns) {
		// Create tracker
		const tracker = document.createElement('div');
		tracker.className = 'maxi-row-carousel__tracker';

		// Create wrapper
		const wrapper = document.createElement('div');
		wrapper.className = 'maxi-row-carousel__wrapper';

		// Move all columns into wrapper
		columns.forEach(column => {
			wrapper.appendChild(column);
		});

		// Create navigation container
		const nav = document.createElement('div');
		nav.className = 'maxi-row-carousel__nav';

		// Create arrows if icon content exists
		const arrowFirstContent = this._container.getAttribute(
			'data-arrow-first-icon'
		);
		const arrowSecondContent = this._container.getAttribute(
			'data-arrow-second-icon'
		);

		if (arrowFirstContent) {
			const prevArrow = document.createElement('span');
			prevArrow.className =
				'maxi-row-carousel__arrow maxi-row-carousel__arrow--prev';
			prevArrow.innerHTML = arrowFirstContent;
			nav.appendChild(prevArrow);
		}

		if (arrowSecondContent) {
			const nextArrow = document.createElement('span');
			nextArrow.className =
				'maxi-row-carousel__arrow maxi-row-carousel__arrow--next';
			nextArrow.innerHTML = arrowSecondContent;
			nav.appendChild(nextArrow);
		}

		// Create dots container
		const dotsContainer = document.createElement('div');
		dotsContainer.className = 'maxi-row-carousel__dots';
		nav.appendChild(dotsContainer);

		// Assemble structure
		tracker.appendChild(wrapper);
		tracker.appendChild(nav);

		// Add to container
		this._container.appendChild(tracker);

		// Mark container as carousel-initialized
		this._container.setAttribute('data-carousel-initialized', 'true');
	}

	get numberOfColumns() {
		return this._columns.length;
	}

	get currentColumn() {
		return this._currentColumn;
	}

	set currentColumn(column) {
		this._currentColumn = column;
	}

	get activeColumnPosition() {
		// For fade transitions, return realFirstElOffset
		if (this.transition === 'fade') {
			return this.realFirstElOffset;
		}

		// For slide transitions, calculate position
		if (this._currentColumn < 0) {
			return (
				this.realFirstElOffset -
				(this._columns
					.slice(this.currentColumn)
					.map(column => column.size.width)
					?.reduce((acc, cur) => acc + cur) ?? 0)
			);
		}

		return this.currentColumn === 0
			? this.realFirstElOffset
			: (this._columns
					.slice(0, this.currentColumn)
					.map(column => column.size.width)
					?.reduce((acc, cur) => acc + cur) ?? 0) +
					this.realFirstElOffset;
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

	isCarouselEnabledForCurrentBreakpoint() {
		const width = window.innerWidth;
		const breakpoints = {
			xs: 479,
			s: 767,
			m: 1023,
			l: 1279,
			xl: 1535,
			xxl: 1919,
		};

		// Determine current breakpoint
		let currentBP = 'general';
		for (const [bp, maxWidth] of Object.entries(breakpoints)) {
			if (width <= maxWidth) {
				currentBP = bp;
				break;
			}
		}

		// Check if carousel enabled for this breakpoint
		const attr = this._container.getAttribute(`data-carousel-${currentBP}`);
		const isEnabled = attr === 'true' || attr === true;

		console.log(
			'MaxiRowCarousel: Checking breakpoint',
			currentBP,
			'width:',
			width,
			'enabled:',
			isEnabled
		);

		return isEnabled;
	}

	setColumnWidths() {
		if (this.numberOfColumns === 0) return;

		// Get the actual width of the first column (they should all be the same)
		// This preserves the original column widths from the row pattern
		const firstColumnWidth =
			this._columns[0]._column.getBoundingClientRect().width;

		// Set tracker width to show exactly slidesPerView columns (this is the "viewport")
		const trackerWidth = firstColumnWidth * this.slidesPerView;
		this._tracker.style.width = `${trackerWidth}px`;

		// Set wrapper width to contain ALL columns at their full size
		// The wrapper will slide within the tracker
		const wrapperWidth = firstColumnWidth * this.numberOfColumns;
		this._wrapper.style.width = `${wrapperWidth}px`;

		// Columns keep their original widths - no changes needed

		// eslint-disable-next-line no-console
		console.log(
			'MaxiRowCarousel: Column width:',
			`${firstColumnWidth}px`,
			'Tracker (viewport) width:',
			`${trackerWidth}px`,
			'Wrapper (total) width:',
			`${wrapperWidth}px`,
			'slidesPerView:',
			this.slidesPerView,
			'Total columns:',
			this.numberOfColumns
		);
	}

	init() {
		if (this.numberOfColumns === 0) return;

		// Set column widths
		this.setColumnWidths();

		// Set transition attribute
		this._container.setAttribute('data-transition', this.transition);

		// Generate dots if container exists
		if (this._dotsContainer) {
			this.generateDots();
		}

		if (this.isLoop) this.insertColumnClones(2);

		// Init styles - but only set transform for slide transitions, not fade
		if (this.transition !== 'fade') {
			this.wrapperTranslate = this.realFirstElOffset;
		}

		this.navEvents();
		this.wrapperEvents();

		// Set first column as active
		this._columns[0].isActive = true;
	}

	get numberOfSlides() {
		return Math.ceil(this.numberOfColumns / this.slidesPerView);
	}

	generateDots() {
		this._dotsContainer.innerHTML = '';
		const dotIconContent =
			this._container.getAttribute('data-dot-icon') || '';

		// Create dots based on number of slides, not columns
		for (let i = 0; i < this.numberOfSlides; i++) {
			const dot = document.createElement('span');
			dot.className = `maxi-row-carousel__dot maxi-row-carousel__dot--${i}${
				i === 0 ? ' maxi-row-carousel__dot--active' : ''
			}`;
			if (dotIconContent) {
				dot.innerHTML = dotIconContent;
			}
			// Click on dot navigates to that slide (index * slidesPerView)
			dot.addEventListener('click', () =>
				this.exactColumn(i * this.slidesPerView)
			);
			this._dotsContainer.appendChild(dot);
		}
		this._dots = this._dotsContainer.querySelectorAll(
			'.maxi-row-carousel__dot'
		);
	}

	navEvents() {
		if (this._arrowNext) {
			this._arrowNext.addEventListener(
				'click',
				this.columnNext.bind(this)
			);
		}
		if (this._arrowPrev) {
			this._arrowPrev.addEventListener(
				'click',
				this.columnPrev.bind(this)
			);
		}

		if (this._dots) {
			this._dots.forEach((dot, currentColumn) => {
				dot.addEventListener('click', () =>
					this.exactColumn(currentColumn)
				);
			});
		}
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

	insertColumnClones(numberOfClones) {
		for (let i = 0; i < numberOfClones; i += 1) {
			const frontClone = this.getColumnClone(i);
			const backClone = this.getColumnClone(this.numberOfColumns - 1 - i);
			this._wrapper.append(frontClone);
			this._wrapper.prepend(backClone);
			this.realFirstElOffset += backClone.getBoundingClientRect().width;
		}
	}

	getColumnClone(index) {
		const columnClone = this._columns[index]._column.cloneNode(true);
		columnClone.classList.add('carousel-item-clone');

		// Remove IDs from clone and all its descendants to avoid duplicate IDs
		if (columnClone.id) {
			columnClone.removeAttribute('id');
		}
		columnClone.querySelectorAll('[id]').forEach(el => {
			el.removeAttribute('id');
		});

		return columnClone;
	}

	columnAction(withAnimation = true) {
		this._wrapper.style.transition = withAnimation
			? `all ${this.transitionSpeed}ms ease`
			: 'none';

		this.wrapperTranslate = this.activeColumnPosition;

		this._columns.forEach(column => {
			column.isActive = this.currentColumn;
		});

		this.setActiveDot(this.currentColumn);
	}

	setActiveDot(columnIndex) {
		if (!this._dots) return;

		// Calculate slide index from column index
		const slideIndex = Math.floor(columnIndex / this.slidesPerView);

		this._dots.forEach((dot, i) => {
			dot.classList.toggle(
				'maxi-row-carousel__dot--active',
				i === slideIndex
			);
		});
	}

	columnNext() {
		this.currentColumn += this.slidesPerView;
		this.columnAction();
	}

	columnPrev() {
		this.currentColumn -= this.slidesPerView;
		this.columnAction();
	}

	exactColumn(column) {
		this.currentColumn = column;
		this.columnAction();
	}

	loop() {
		if (this.currentColumn >= this.numberOfColumns) {
			this.currentColumn = 0;
			this.setActiveDot(this.currentColumn);
			this.columnAction(false);
		}
		if (this.currentColumn < 0) {
			this.currentColumn = this.numberOfColumns - 1;
			this.setActiveDot(this.currentColumn);
			this.columnAction(false);
		}
	}

	transitionEnd() {
		if (this.isLoop) this.loop();
	}

	dragStart(e) {
		if (this.transition === 'fade') return;

		const event = e.type.includes('mouse') ? e : e.touches[0];
		this.initPosition = event.clientX;

		if (e.type.includes('mouse')) {
			this._wrapper.addEventListener('mousemove', this.onDragAction);
			this._wrapper.addEventListener('mouseup', this.onDragEnd);
			this._wrapper.addEventListener('mouseleave', this.onDragEnd);
		}
	}

	dragAction(e) {
		if (this.transition === 'fade') return;

		const event = e.type.includes('mouse') ? e : e.touches[0];
		this.dragPosition = event.clientX;
		const movement = this.initPosition - this.dragPosition;

		this._wrapper.style.transition = 'none';
		this.wrapperTranslate = this.activeColumnPosition + movement;

		this.isInteracting = true;
	}

	dragEnd() {
		if (this.transition === 'fade') return;

		this.endPosition = this.dragPosition;

		if (this.endPosition) {
			const movement = this.initPosition - this.endPosition;
			const threshold = 75;

			if (movement > threshold && this.endPosition) {
				this.columnNext();
			} else if (movement < -threshold && this.endPosition) {
				this.columnPrev();
			} else {
				this.columnAction();
			}
		}

		this._wrapper.removeEventListener('mousemove', this.onDragAction);
		this._wrapper.removeEventListener('mouseup', this.onDragEnd);
		this._wrapper.removeEventListener('mouseleave', this.onDragEnd);

		setTimeout(() => {
			this.isInteracting = false;
			this.initPosition = 0;
			this.dragPosition = 0;
			this.endPosition = 0;
		}, 100);
	}

	onHover(isLeaving) {
		this.isHovering = !isLeaving;
	}
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
	// Find all rows with carousel enabled
	const carouselRows = Array.from(
		document.querySelectorAll('.maxi-row-block')
	).filter(row => {
		// Check if any breakpoint has carousel enabled
		const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
		const hasCarousel = breakpoints.some(bp => {
			const attr = row.getAttribute(`data-carousel-${bp}`);
			return attr === 'true' || attr === true;
		});
		return hasCarousel;
	});

	console.log(
		'MaxiRowCarousel: Found rows with carousel:',
		carouselRows.length
	);

	carouselRows.forEach(row => {
		console.log('MaxiRowCarousel: Initializing carousel for row', row);
		new MaxiRowCarousel(row);
	});
});
