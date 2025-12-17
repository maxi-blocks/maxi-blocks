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

		// eslint-disable-next-line no-console
		console.log('MaxiRowCarousel: Constructor called', {
			windowWidth: window.innerWidth,
		});

		// Check if carousel should be active for current breakpoint
		const isEnabledForBP = this.isCarouselEnabledForCurrentBreakpoint();
		// eslint-disable-next-line no-console
		console.log('MaxiRowCarousel: Breakpoint check', {
			isEnabledForBP,
		});

		if (!isEnabledForBP) {
			// eslint-disable-next-line no-console
			console.log(
				'MaxiRowCarousel: Carousel disabled for this breakpoint, exiting'
			);
			return;
		}

		// Get all direct column children
		const columns = Array.from(
			this._container.querySelectorAll(':scope > .maxi-column-block')
		);

		if (columns.length === 0) {
			return;
		}

		// Read configuration from data attributes BEFORE checking trigger width
		this.slidesPerView =
			parseInt(this._container.dataset.carouselSlidesPerView, 10) || 1;
		this.carouselColumnGap =
			parseInt(this._container.dataset.carouselColumnGap, 10) || 0;
		this.peekOffset =
			parseInt(this._container.dataset.carouselPeekOffset, 10) || 0;
		const triggerWidthAttr = this._container.dataset.carouselTriggerWidth;
		this.triggerWidth =
			triggerWidthAttr && triggerWidthAttr !== ''
				? parseInt(triggerWidthAttr, 10)
				: null;
		// eslint-disable-next-line no-console
		console.log('MaxiRowCarousel: Trigger width attr', {
			raw: triggerWidthAttr,
			parsed: this.triggerWidth,
		});

		// Check if carousel should be active based on trigger width
		if (!this.shouldCarouselBeActive()) {
			// eslint-disable-next-line no-console
			console.log(
				'MaxiRowCarousel: Not activating carousel on init, will wait for resize'
			);
			// Don't create carousel structure, just set up resize handler
			this.carouselActive = false;
			this.onResize = this.handleResize.bind(this);
			window.addEventListener('resize', this.onResize);
			// Store columns for later use
			this._originalColumns = columns;
			return;
		}

		// eslint-disable-next-line no-console
		console.log('MaxiRowCarousel: Activating carousel on init');

		// Create carousel structure only if carousel should be active
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

		this.isLoop = this._container.dataset.carouselLoop === 'true';
		this.isAutoplay = this._container.dataset.carouselAutoplay === 'true';
		this.hoverPause = this._container.dataset.carouselHoverPause === 'true';
		this.interactionPause =
			this._container.dataset.carouselInteractionPause === 'true';
		// Convert seconds to milliseconds
		this.autoplaySpeed =
			(parseFloat(this._container.dataset.carouselAutoplaySpeed) || 2.5) *
			1000;
		this.transition = this._container.dataset.carouselTransition || 'slide';
		// Convert seconds to milliseconds
		this.transitionSpeed =
			(parseFloat(this._container.dataset.carouselTransitionSpeed) ||
				0.5) * 1000;

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

		// Handle window resize to check trigger width and recalculate
		this.onResize = this.handleResize.bind(this);
		window.addEventListener('resize', this.onResize);

		const isPaused = () => {
			if (this.hoverPause && this.isHovering) return true;
			if (this.interactionPause && this.isInteracting) return true;

			return false;
		};

		if (this.isAutoplay) {
			this.autoplayInterval = setInterval(() => {
				if (!isPaused()) this.columnNext();
			}, this.autoplaySpeed);
		}

		this.init();
	}

	shouldCarouselBeActive() {
		// If no trigger width is set, carousel is always active
		if (!this.triggerWidth) {
			// eslint-disable-next-line no-console
			console.log('MaxiRowCarousel: No trigger width, always active');
			return true;
		}

		const shouldBeActive = window.innerWidth <= this.triggerWidth;
		// eslint-disable-next-line no-console
		console.log('MaxiRowCarousel: Trigger width check', {
			triggerWidth: this.triggerWidth,
			windowWidth: window.innerWidth,
			shouldBeActive,
		});

		// Check if current screen width is at or below trigger width
		return shouldBeActive;
	}

	handleResize() {
		const shouldBeActive = this.shouldCarouselBeActive();

		// eslint-disable-next-line no-console
		console.log('MaxiRowCarousel: handleResize', {
			shouldBeActive,
			carouselActive: this.carouselActive,
			hasTracker: !!this._tracker,
			hasWrapper: !!this._wrapper,
			hasColumns: !!this._columns,
		});

		if (shouldBeActive && !this.carouselActive) {
			// eslint-disable-next-line no-console
			console.log('MaxiRowCarousel: Activating carousel on resize');

			// Need to activate carousel - create structure and initialize
			const columns =
				this._originalColumns ||
				Array.from(
					this._container.querySelectorAll(
						':scope > .maxi-column-block'
					)
				);

			if (columns.length === 0) {
				// eslint-disable-next-line no-console
				console.log('MaxiRowCarousel: No columns found!');
				return;
			}

			// Create carousel structure
			this.createCarouselStructure(columns);

			// Get the created elements
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

			// Read additional config that wasn't read in constructor
			this.isLoop = this._container.dataset.carouselLoop === 'true';
			this.isAutoplay =
				this._container.dataset.carouselAutoplay === 'true';
			this.hoverPause =
				this._container.dataset.carouselHoverPause === 'true';
			this.interactionPause =
				this._container.dataset.carouselInteractionPause === 'true';
			this.autoplaySpeed =
				(parseFloat(this._container.dataset.carouselAutoplaySpeed) ||
					2.5) * 1000;
			this.transition =
				this._container.dataset.carouselTransition || 'slide';
			this.transitionSpeed =
				(parseFloat(this._container.dataset.carouselTransitionSpeed) ||
					0.5) * 1000;

			// Get navigation elements
			this._arrowNext = this._container.querySelector(
				'.maxi-row-carousel__arrow--next'
			);
			this._arrowPrev = this._container.querySelector(
				'.maxi-row-carousel__arrow--prev'
			);
			this._dotsContainer = this._container.querySelector(
				'.maxi-row-carousel__dots'
			);

			// Initialize states
			this.currentColumn = 0;
			this.initPosition = 0;
			this.dragPosition = 0;
			this.endPosition = 0;
			this.realFirstElOffset = 0;
			this.isInteracting = false;
			this.isHovering = false;

			// Bind methods if not already bound
			if (!this.onDragStart) {
				this.onDragStart = this.dragStart.bind(this);
				this.onDragAction = this.dragAction.bind(this);
				this.onDragEnd = this.dragEnd.bind(this);
				this.onHoverEnd = this.onHover.bind(this, true);
				this.onHover = this.onHover.bind(this, false);
				this.exactColumn = this.exactColumn.bind(this);
			}

			// Set up hover event listeners
			this._container.addEventListener('mouseenter', this.onHover);
			this._container.addEventListener('mouseleave', this.onHoverEnd);

			// Set up autoplay if enabled
			const isPaused = () => {
				if (this.hoverPause && this.isHovering) return true;
				if (this.interactionPause && this.isInteracting) return true;
				return false;
			};

			if (this.isAutoplay) {
				// eslint-disable-next-line no-console
				console.log(
					'MaxiRowCarousel: Starting autoplay on resize activation'
				);
				this.autoplayInterval = setInterval(() => {
					if (!isPaused()) this.columnNext();
				}, this.autoplaySpeed);
			}

			// Initialize carousel (init() will call navEvents() and wrapperEvents())
			this.init();
		} else if (!shouldBeActive && this.carouselActive) {
			// eslint-disable-next-line no-console
			console.log('MaxiRowCarousel: Deactivating carousel on resize');
			// Need to deactivate carousel
			this.deactivateCarousel();
		} else if (shouldBeActive && this.carouselActive) {
			// eslint-disable-next-line no-console
			console.log(
				'MaxiRowCarousel: Recalculating carousel widths on resize'
			);
			// Carousel is active and should stay active, recalculate widths
			this.setColumnWidths();
			this.columnAction(false); // Update position without animation
		}
	}

	deactivateCarousel() {
		// eslint-disable-next-line no-console
		console.log(
			'MaxiRowCarousel: deactivateCarousel - removing carousel structure'
		);

		this.carouselActive = false;

		// Stop autoplay if it's running
		if (this.autoplayInterval) {
			// eslint-disable-next-line no-console
			console.log('MaxiRowCarousel: Clearing autoplay interval');
			clearInterval(this.autoplayInterval);
			this.autoplayInterval = null;
		}

		// Remove hover event listeners
		if (this.onHover && this.onHoverEnd) {
			this._container.removeEventListener('mouseenter', this.onHover);
			this._container.removeEventListener('mouseleave', this.onHoverEnd);
		}

		// Remove active class to disable carousel CSS
		this._container.classList.remove('maxi-row-carousel--active');
		this._container.removeAttribute('data-carousel-initialized');

		// Move columns back to container and remove carousel structure
		if (this._wrapper && this._tracker) {
			// Get all real columns (not clones)
			const realColumns = Array.from(
				this._wrapper.querySelectorAll(
					':scope > .maxi-column-block:not(.carousel-item-clone)'
				)
			);

			// Reset column styles
			realColumns.forEach(column => {
				column.style.width = '';
				column.style.minWidth = '';
				column.style.flexBasis = '';
			});

			// Move columns back to container
			realColumns.forEach(column => {
				this._container.appendChild(column);
			});

			// Remove the tracker (which contains wrapper, nav, etc.)
			this._tracker.remove();

			// Clear references
			this._tracker = null;
			this._wrapper = null;
			this._arrowNext = null;
			this._arrowPrev = null;
			this._dotsContainer = null;
			this._dots = null;
		}
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
			this._prevArrow = prevArrow;
		}

		if (arrowSecondContent) {
			const nextArrow = document.createElement('span');
			nextArrow.className =
				'maxi-row-carousel__arrow maxi-row-carousel__arrow--next';
			nextArrow.innerHTML = arrowSecondContent;
			nav.appendChild(nextArrow);
			this._nextArrow = nextArrow;
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

		if (this.currentColumn === 0) {
			return this.realFirstElOffset;
		}

		// Get the first column width for calculations
		const firstColumnWidth = this._columns[0]?.size?.width || 0;

		// For slide transitions, calculate position based on currentColumn
		// Each column has the same width, and gaps between them
		const columnsToScroll = Math.min(
			this.currentColumn,
			this.numberOfColumns
		);
		const columnsWidth = firstColumnWidth * columnsToScroll;
		const totalGaps = this.carouselColumnGap * columnsToScroll;
		const position = columnsWidth + totalGaps + this.realFirstElOffset;

		return position;
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
		let attr = this._container.getAttribute(`data-carousel-${currentBP}`);

		// If breakpoint-specific attribute doesn't exist, fall back to general
		if (attr === null && currentBP !== 'general') {
			attr = this._container.getAttribute('data-carousel-general');
		}

		const isEnabled = attr === 'true' || attr === true;

		// eslint-disable-next-line no-console
		console.log('MaxiRowCarousel: isCarouselEnabledForCurrentBreakpoint', {
			width,
			currentBP,
			attr,
			isEnabled,
		});

		return isEnabled;
	}

	setColumnWidths() {
		if (this.numberOfColumns === 0) return;

		// Get the actual width of each column from the ORIGINAL row
		const firstColumn = this._columns[0]._column;
		const firstColumnWidth = firstColumn.getBoundingClientRect().width;
		const carouselGap = this.carouselColumnGap;

		// Calculate tracker width (the visible viewport):
		// - Show slidesPerView columns at their original width
		// - Add gaps BETWEEN visible columns (slidesPerView - 1 gaps)
		// - Add peek offset to show a bit of the next column
		const trackerWidth =
			firstColumnWidth * this.slidesPerView +
			carouselGap * (this.slidesPerView - 1) +
			this.peekOffset;
		this._tracker.style.width = `${trackerWidth}px`;

		// Set each column to its original width explicitly
		this._columns.forEach(column => {
			column._column.style.width = `${firstColumnWidth}px`;
			column._column.style.minWidth = `${firstColumnWidth}px`;
			column._column.style.flexBasis = `${firstColumnWidth}px`;
		});

		// Also set widths for cloned columns
		const clones = this._wrapper.querySelectorAll('.carousel-item-clone');
		clones.forEach(clone => {
			clone.style.width = `${firstColumnWidth}px`;
			clone.style.minWidth = `${firstColumnWidth}px`;
			clone.style.flexBasis = `${firstColumnWidth}px`;
		});

		// Set wrapper gap to the carousel gap (overrides row's gap)
		this._wrapper.style.columnGap = `${carouselGap}px`;

		// Calculate wrapper width to contain all columns (real + clones) with gaps
		const totalChildren = this._wrapper.children.length;
		const wrapperWidth =
			firstColumnWidth * totalChildren +
			carouselGap * (totalChildren - 1);
		this._wrapper.style.width = `${wrapperWidth}px`;
	}

	init() {
		if (this.numberOfColumns === 0) return;

		// Check if carousel should be active based on trigger width
		this.carouselActive = this.shouldCarouselBeActive();

		// Only initialize carousel if it should be active
		if (!this.carouselActive) {
			return; // Don't do anything, keep normal row layout
		}

		// Set transition attribute
		this._container.setAttribute('data-transition', this.transition);

		// Add active class to enable carousel CSS
		this._container.classList.add('maxi-row-carousel--active');

		// Generate dots if container exists
		if (this._dotsContainer) {
			this.generateDots();
		}

		// Create enough clones to support slidesPerView BEFORE setting widths
		// Add extra clone if peek offset is set to ensure we always have content visible
		if (this.isLoop) {
			const numberOfClones =
				this.peekOffset > 0
					? this.slidesPerView + 1
					: Math.max(this.slidesPerView, 1);
			this.insertColumnClones(numberOfClones);
		}

		// Set column widths AFTER creating clones so clones get widths too
		this.setColumnWidths();

		// Init styles - but only set transform for slide transitions, not fade
		if (this.transition !== 'fade') {
			this.wrapperTranslate = this.realFirstElOffset;
		}

		// Set first column as active
		this._columns[0].isActive = true;

		// Update arrow states based on initial position
		this.updateArrowStates();

		this.navEvents();
		this.wrapperEvents();
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
		// Get original column width BEFORE adding clones
		const firstColumn = this._columns[0]._column;
		const columnWidth = firstColumn.getBoundingClientRect().width;

		for (let i = 0; i < numberOfClones; i += 1) {
			const frontClone = this.getColumnClone(i);
			const backClone = this.getColumnClone(this.numberOfColumns - 1 - i);
			this._wrapper.append(frontClone);
			this._wrapper.prepend(backClone);
			// Add the column width plus gap to offset
			this.realFirstElOffset += columnWidth + this.carouselColumnGap;
		}
	}

	getColumnClone(index) {
		const columnClone = this._columns[index]._column.cloneNode(true);
		columnClone.classList.add('carousel-item-clone');

		// Keep IDs on clones so they maintain their styles
		// Duplicate IDs are acceptable for styling purposes

		return columnClone;
	}

	columnAction(withAnimation = true) {
		this._wrapper.style.transition = withAnimation
			? `all ${this.transitionSpeed}ms ease`
			: 'none';

		const translateValue = this.activeColumnPosition;
		// eslint-disable-next-line no-console
		console.log('MaxiRowCarousel: columnAction', {
			currentColumn: this.currentColumn,
			translateValue,
			withAnimation,
		});

		this.wrapperTranslate = translateValue;

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
		// eslint-disable-next-line no-console
		console.log('MaxiRowCarousel: columnNext', {
			currentColumn: this.currentColumn,
			numberOfColumns: this.numberOfColumns,
			slidesPerView: this.slidesPerView,
			isLoop: this.isLoop,
		});

		// If loop is disabled, prevent going beyond last slide
		if (!this.isLoop) {
			const maxColumn = this.numberOfColumns - this.slidesPerView;
			if (this.currentColumn >= maxColumn) {
				// eslint-disable-next-line no-console
				console.log('MaxiRowCarousel: At end, not moving');
				return; // Already at the end
			}
		}
		this.currentColumn += this.slidesPerView;
		// eslint-disable-next-line no-console
		console.log('MaxiRowCarousel: New currentColumn:', this.currentColumn);
		this.columnAction();
		this.updateArrowStates();
	}

	columnPrev() {
		// eslint-disable-next-line no-console
		console.log('MaxiRowCarousel: columnPrev', {
			currentColumn: this.currentColumn,
			numberOfColumns: this.numberOfColumns,
			slidesPerView: this.slidesPerView,
			isLoop: this.isLoop,
		});

		// If loop is disabled, prevent going before first slide
		if (!this.isLoop) {
			if (this.currentColumn <= 0) {
				// eslint-disable-next-line no-console
				console.log('MaxiRowCarousel: At beginning, not moving');
				return; // Already at the beginning
			}
		}
		this.currentColumn -= this.slidesPerView;
		// eslint-disable-next-line no-console
		console.log('MaxiRowCarousel: New currentColumn:', this.currentColumn);
		this.columnAction();
		this.updateArrowStates();
	}

	exactColumn(column) {
		this.currentColumn = column;
		this.columnAction();
		this.updateArrowStates();
	}

	updateArrowStates() {
		if (this.isLoop) {
			// If loop is enabled, always show both arrows
			if (this._prevArrow) this._prevArrow.style.display = '';
			if (this._nextArrow) this._nextArrow.style.display = '';
			return;
		}

		// Hide/show arrows based on position
		if (this._prevArrow) {
			this._prevArrow.style.display =
				this.currentColumn <= 0 ? 'none' : '';
		}
		if (this._nextArrow) {
			const maxColumn = this.numberOfColumns - this.slidesPerView;
			this._nextArrow.style.display =
				this.currentColumn >= maxColumn ? 'none' : '';
		}
	}

	loop() {
		// When we've scrolled past the last real column (into front clones)
		if (this.currentColumn >= this.numberOfColumns) {
			this.currentColumn %= this.numberOfColumns;
			this.setActiveDot(this.currentColumn);
			// Instantly jump back to the real first column without animation
			this.columnAction(false);
		}
		// When we've scrolled before the first real column (into back clones)
		if (this.currentColumn < 0) {
			this.currentColumn =
				this.numberOfColumns +
				(this.currentColumn % this.numberOfColumns);
			this.setActiveDot(this.currentColumn);
			// Instantly jump to the real last column(s) without animation
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

	carouselRows.forEach(row => {
		new MaxiRowCarousel(row);
	});
});
