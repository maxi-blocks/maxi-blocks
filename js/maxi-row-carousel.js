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

		// Get all direct column children
		const columns = Array.from(
			this._container.querySelectorAll(':scope > .maxi-column-block')
		);

		if (columns.length === 0) {
			return;
		}

		// Read trigger width (global, non-breakpoint setting)
		const triggerWidthAttr = this._container.dataset.carouselTriggerWidth;
		this.triggerWidth =
			triggerWidthAttr && triggerWidthAttr !== ''
				? parseInt(triggerWidthAttr, 10)
				: null;
		// Track current breakpoint
		this.lastBreakpoint = this.getCurrentBreakpoint();

		/**
		 * Feature flag for fade transition support
		 * When true, carousel uses fade transitions instead of slide transitions
		 * @type {boolean}
		 */
		this.isFadeTransition = false;

		// Read breakpoint-specific configuration
		this.loadBreakpointSettings();

		// Check if carousel should be active based on trigger width
		if (!this.shouldCarouselBeActive()) {
			// Don't create carousel structure, just set up resize handler
			this.carouselActive = false;
			this.onResize = this.handleResize.bind(this);
			window.addEventListener('resize', this.onResize);
			// Store columns for later use
			this._originalColumns = columns;
			return;
		}

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

		/**
		 * Offset in pixels of the first real element when loop clones are prepended
		 * Used to calculate proper positioning in loop mode
		 * @type {number}
		 */
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
		this.onColumnNext = this.columnNext.bind(this);
		this.onColumnPrev = this.columnPrev.bind(this);
		this.onTransitionEnd = this.transitionEnd.bind(this);

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

	getCurrentBreakpoint() {
		const width = window.innerWidth;
		const breakpoints = {
			xs: 479,
			s: 767,
			m: 1023,
			l: 1279,
			xl: 1535,
			xxl: 1919,
		};

		let detectedBP = 'general';
		for (const [bp, maxWidth] of Object.entries(breakpoints)) {
			if (width <= maxWidth) {
				detectedBP = bp;
				break;
			}
		}

		return detectedBP;
	}

	getBreakpointSetting(settingName, defaultValue) {
		const currentBP = this.getCurrentBreakpoint();

		// Define breakpoint hierarchy from smallest to largest (excluding xxl for fallback)
		const breakpointHierarchy = ['xs', 's', 'm', 'l', 'xl'];
		const currentIndex = breakpointHierarchy.indexOf(currentBP);

		// Create fallback order based on current breakpoint
		let fallbackOrder;
		if (currentBP === 'xxl') {
			// xxl only checks itself and general
			fallbackOrder = ['xxl', 'general'];
		} else if (currentBP === 'general') {
			// general only checks itself
			fallbackOrder = ['general'];
		} else {
			// Other breakpoints: current BP → larger BPs (up to xl) → general
			fallbackOrder = [
				...breakpointHierarchy.slice(currentIndex),
				'general',
			];
		}

		// Try current breakpoint first, then fall back through larger breakpoints to general
		for (const bp of fallbackOrder) {
			const attrName = `carousel${
				settingName.charAt(0).toUpperCase() + settingName.slice(1)
			}${bp.charAt(0).toUpperCase() + bp.slice(1)}`;
			const value = this._container.dataset[attrName];

			if (value !== undefined && value !== '') {
				return value;
			}
		}

		return defaultValue;
	}

	loadBreakpointSettings() {
		// Load breakpoint-specific settings
		this.slidesPerView =
			parseInt(this.getBreakpointSetting('slidesPerView', '1'), 10) || 1;
		this.carouselColumnGap =
			parseInt(this.getBreakpointSetting('columnGap', '0'), 10) || 0;
		this.peekOffset =
			parseInt(this.getBreakpointSetting('peekOffset', '0'), 10) || 0;
		this.heightOffset =
			parseInt(this.getBreakpointSetting('heightOffset', '0'), 10) || 0;
		this.isLoop = this.getBreakpointSetting('loop', 'false') === 'true';
		this.isAutoplay =
			this.getBreakpointSetting('autoplay', 'false') === 'true';
		this.hoverPause =
			this.getBreakpointSetting('hoverPause', 'false') === 'true';
		this.interactionPause =
			this.getBreakpointSetting('interactionPause', 'false') === 'true';
		this.autoplaySpeed =
			(parseFloat(this.getBreakpointSetting('autoplaySpeed', '2.5')) ||
				2.5) * 1000;
		this.transitionSpeed =
			(parseFloat(this.getBreakpointSetting('transitionSpeed', '0.5')) ||
				0.5) * 1000;

		// Load fade transition setting (currently disabled, reserved for future feature)
		// this.isFadeTransition = this.getBreakpointSetting('fadeTransition', 'false') === 'true';
	}

	shouldCarouselBeActive() {
		// If no trigger width is set, carousel is always active
		if (!this.triggerWidth) {
			return true;
		}

		// Check if current screen width is at or below trigger width
		return window.innerWidth <= this.triggerWidth;
	}

	handleResize() {
		const shouldBeActive = this.shouldCarouselBeActive();
		const currentBP = this.getCurrentBreakpoint();
		const breakpointChanged = this.lastBreakpoint !== currentBP;

		// Update last breakpoint
		this.lastBreakpoint = currentBP;

		if (shouldBeActive && !this.carouselActive) {
			// Need to activate carousel - create structure and initialize
			const columns =
				this._originalColumns ||
				Array.from(
					this._container.querySelectorAll(
						':scope > .maxi-column-block'
					)
				);

			if (columns.length === 0) {
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

			// Load breakpoint-specific settings
			this.loadBreakpointSettings();

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
				this.autoplayInterval = setInterval(() => {
					if (!isPaused()) this.columnNext();
				}, this.autoplaySpeed);
			}

			// Initialize carousel (init() will call navEvents() and wrapperEvents())
			this.init();

			// Force a recalculation of heights after the browser has laid out the DOM
			// This fixes the scrollbar issue when activating carousel on resize
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					if (this.carouselActive && this._tracker && this._wrapper) {
						this.setColumnWidths();
					}
				});
			});
		} else if (!shouldBeActive && this.carouselActive) {
			// Need to deactivate carousel
			this.deactivateCarousel();
		} else if (shouldBeActive && this.carouselActive) {
			// Carousel is active and should stay active

			// If breakpoint changed, reload settings and regenerate elements
			if (breakpointChanged) {
				this.loadBreakpointSettings();

				// Regenerate dots based on new slidesPerView
				if (this._dotsContainer) {
					this.generateDots();
				}

				// Remove old clones and recreate them based on new settings
				const existingClones = this._wrapper.querySelectorAll(
					'.carousel-item-clone'
				);
				existingClones.forEach(clone => clone.remove());
				this.realFirstElOffset = 0;

				if (this.isLoop) {
					const numberOfClones =
						this.peekOffset > 0
							? this.slidesPerView + 1
							: Math.max(this.slidesPerView, 1);
					this.insertColumnClones(numberOfClones);
				}

				// Reset to first slide
				this.currentColumn = 0;
			}

			// Recalculate widths
			this.setColumnWidths();
			this.columnAction(false); // Update position without animation
			this.updateArrowStates();
		}
	}

	deactivateCarousel() {
		this.carouselActive = false;

		// Stop autoplay if it's running
		if (this.autoplayInterval) {
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

			// Remove the tracker (contains wrapper only)
			this._tracker.remove();

			// Remove the nav (now a direct child of container)
			const nav = this._container.querySelector(
				'.maxi-row-carousel__nav'
			);
			if (nav) nav.remove();

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

		// Check if arrows should be shown for current breakpoint
		const arrowStatus = this.getBreakpointSetting('arrowStatus', 'true');
		const showArrows = arrowStatus === 'true' || arrowStatus === true;

		// Check if dots should be shown for current breakpoint
		const dotStatus = this.getBreakpointSetting('dotStatus', 'true');
		const showDots = dotStatus === 'true' || dotStatus === true;

		// Create arrows if enabled and icon content exists
		const arrowFirstContent = this._container.getAttribute(
			'data-arrow-first-icon'
		);
		const arrowSecondContent = this._container.getAttribute(
			'data-arrow-second-icon'
		);

		if (showArrows && arrowFirstContent) {
			const prevArrow = document.createElement('span');
			prevArrow.className =
				'maxi-row-carousel__arrow maxi-row-carousel__arrow--prev';
			prevArrow.innerHTML = arrowFirstContent;
			nav.appendChild(prevArrow);
			this._arrowPrev = prevArrow;
		}

		if (showArrows && arrowSecondContent) {
			const nextArrow = document.createElement('span');
			nextArrow.className =
				'maxi-row-carousel__arrow maxi-row-carousel__arrow--next';
			nextArrow.innerHTML = arrowSecondContent;
			nav.appendChild(nextArrow);
			this._arrowNext = nextArrow;
		}

		// Create dots container if enabled
		if (showDots) {
			const dotsContainer = document.createElement('div');
			dotsContainer.className = 'maxi-row-carousel__dots';
			nav.appendChild(dotsContainer);
		}

		// Assemble structure
		// Note: wrapper goes inside tracker, but nav is added as direct child of container
		// This prevents arrows from being clipped by tracker's overflow:hidden when positioned outside
		tracker.appendChild(wrapper);

		// Add to container
		this._container.appendChild(tracker);
		// Add nav as direct child of container (not inside tracker) to prevent overflow clipping of arrows
		this._container.appendChild(nav);

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
		// For fade transitions, position stays fixed at realFirstElOffset
		if (this.isFadeTransition) {
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
		const { transform } = this._wrapper.style;

		// Return 0 if transform is not set, empty, or 'none'
		if (!transform || transform === 'none') {
			return 0;
		}

		// Match translateX with optional sign and decimals: translateX(-123.45px)
		const match = transform.match(/translateX\((-?\d+(?:\.\d+)?)px\)/);

		// Return the absolute value of the matched number, or 0 if no match
		return match ? Math.abs(parseFloat(match[1])) : 0;
	}

	set wrapperTranslate(translate) {
		this._wrapper.style.transform = `translateX(-${translate}px)`;
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

		// Calculate required height based on all content bounds including absolutely positioned elements
		let maxHeight = 0;
		const columnHeights = [];

		// Function to get the maximum bottom position of all elements within a container
		const getMaxContentHeight = (element, index) => {
			let maxBottom = element.scrollHeight; // Start with scrollHeight as baseline

			// Check all descendant elements including deeply nested ones
			const allElements = element.querySelectorAll('*');
			allElements.forEach(child => {
				const style = window.getComputedStyle(child);
				const { position } = style;

				// For absolutely or fixed positioned elements, check their actual bounds
				if (position === 'absolute' || position === 'fixed') {
					const rect = child.getBoundingClientRect();
					const parentRect = element.getBoundingClientRect();
					const bottom = rect.bottom - parentRect.top;
					if (bottom > maxBottom) {
						maxBottom = bottom;
					}
				} else {
					// For normal flow elements, use offsetTop + offsetHeight
					let { offsetParent } = child;
					let totalOffset = child.offsetTop;

					// Walk up the offsetParent chain until we reach the column element
					while (
						offsetParent &&
						offsetParent !== element &&
						element.contains(offsetParent)
					) {
						totalOffset += offsetParent.offsetTop;
						offsetParent = offsetParent.offsetParent;
					}

					const bottom = totalOffset + child.offsetHeight;
					if (bottom > maxBottom) {
						maxBottom = bottom;
					}
				}
			});

			const finalHeight = Math.ceil(maxBottom);
			columnHeights.push({ index, height: finalHeight });
			return finalHeight;
		};

		// Check all real columns
		this._columns.forEach((column, index) => {
			const contentHeight = getMaxContentHeight(column._column, index);
			if (contentHeight > maxHeight) {
				maxHeight = contentHeight;
			}
		});

		// Also check clones
		clones.forEach((clone, index) => {
			const contentHeight = getMaxContentHeight(clone, `clone-${index}`);
			if (contentHeight > maxHeight) {
				maxHeight = contentHeight;
			}
		});

		// Set explicit height on tracker and wrapper with user-configurable offset
		if (maxHeight > 0) {
			// Add user-configured height offset plus buffer to prevent scrollbars
			const finalHeight = maxHeight + this.heightOffset + 20;
			this._tracker.style.height = `${finalHeight}px`;
			this._wrapper.style.height = `${finalHeight}px`;
		}

		// Sync nav container position and size with tracker
		this.syncNavWithTracker();
	}

	syncNavWithTracker() {
		// Get nav element
		const nav = this._container.querySelector('.maxi-row-carousel__nav');
		if (!nav || !this._tracker) return;

		// Get tracker's position and size relative to the row container
		const trackerRect = this._tracker.getBoundingClientRect();
		const containerRect = this._container.getBoundingClientRect();

		// Calculate offset of tracker within container
		const offsetLeft = trackerRect.left - containerRect.left;
		const offsetTop = trackerRect.top - containerRect.top;

		// Position nav to match tracker's position and size
		nav.style.left = `${offsetLeft}px`;
		nav.style.top = `${offsetTop}px`;
		nav.style.width = `${trackerRect.width}px`;
		nav.style.height = `${trackerRect.height}px`;
	}

	init() {
		if (this.numberOfColumns === 0) return;

		// Check if carousel should be active based on trigger width
		this.carouselActive = this.shouldCarouselBeActive();

		// Only initialize carousel if it should be active
		if (!this.carouselActive) {
			return; // Don't do anything, keep normal row layout
		}

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

		// Init styles - set initial transform for loop positioning
		if (this.isLoop) {
			this.wrapperTranslate = this.realFirstElOffset;
		}

		// Set first column as active by passing its ID (0)
		this._columns[0].isActive = 0;

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
		const activeDotIconContent =
			this._container.getAttribute('data-active-dot-icon') ||
			dotIconContent;

		// Create dots based on number of slides, not columns
		for (let i = 0; i < this.numberOfSlides; i++) {
			const dot = document.createElement('span');
			const isActive = i === 0;
			dot.className = `maxi-row-carousel__dot maxi-row-carousel__dot--${i}${
				isActive ? ' maxi-row-carousel__dot--active' : ''
			}`;
			// Use active icon for active dot, normal icon for others
			const iconToUse = isActive ? activeDotIconContent : dotIconContent;
			if (iconToUse) {
				// Create icon wrapper for styling
				const iconWrapper = document.createElement('div');
				iconWrapper.className = 'maxi-navigation-dot-icon-block__icon';
				iconWrapper.innerHTML = iconToUse;
				dot.appendChild(iconWrapper);
			}
			// Click on dot navigates to that slide (index * slidesPerView)
			// Don't add click listener to active dot - it's already active
			if (!isActive) {
				dot.addEventListener('click', () =>
					this.exactColumn(i * this.slidesPerView)
				);
				dot._hasClickListener = true;
			}
			this._dotsContainer.appendChild(dot);
		}
		this._dots = this._dotsContainer.querySelectorAll(
			'.maxi-row-carousel__dot'
		);
	}

	navEvents() {
		if (this._arrowNext) {
			this._arrowNext.addEventListener('click', this.onColumnNext);
		}
		if (this._arrowPrev) {
			this._arrowPrev.addEventListener('click', this.onColumnPrev);
		}

		// Note: Dot click events are handled in generateDots()
	}

	wrapperEvents() {
		this._wrapper.addEventListener('mousedown', this.onDragStart);
		this._wrapper.addEventListener('touchstart', this.onDragStart);
		this._wrapper.addEventListener('touchmove', this.onDragAction);
		this._wrapper.addEventListener('touchend', this.onDragEnd);
		this._wrapper.addEventListener('transitionend', this.onTransitionEnd);
		this._wrapper.addEventListener('animationend', this.onTransitionEnd);
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

		const dotIconContent =
			this._container.getAttribute('data-dot-icon') || '';
		const activeDotIconContent =
			this._container.getAttribute('data-active-dot-icon') ||
			dotIconContent;

		this._dots.forEach((dot, i) => {
			const wasActive = dot.classList.contains(
				'maxi-row-carousel__dot--active'
			);
			const isActive = i === slideIndex;
			dot.classList.toggle('maxi-row-carousel__dot--active', isActive);

			// Update icon based on active state
			const iconWrapper = dot.querySelector(
				'.maxi-navigation-dot-icon-block__icon'
			);
			if (iconWrapper) {
				iconWrapper.innerHTML = isActive
					? activeDotIconContent
					: dotIconContent;
			}

			// Add/remove click listener based on active state
			// If dot became inactive, ensure it has a click listener
			if (wasActive && !isActive && !dot._hasClickListener) {
				dot.addEventListener('click', () =>
					this.exactColumn(i * this.slidesPerView)
				);
				dot._hasClickListener = true;
			}
		});
	}

	columnNext() {
		// If loop is disabled, prevent going beyond last slide
		if (!this.isLoop) {
			const maxColumn = this.numberOfColumns - this.slidesPerView;
			if (this.currentColumn >= maxColumn) {
				return; // Already at the end
			}
		}

		this.currentColumn += this.slidesPerView;
		this.columnAction();
		this.updateArrowStates();
	}

	columnPrev() {
		// If loop is disabled, prevent going before first slide
		if (!this.isLoop) {
			if (this.currentColumn <= 0) {
				return; // Already at the beginning
			}
		}

		this.currentColumn -= this.slidesPerView;
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
			if (this._arrowPrev) this._arrowPrev.style.display = '';
			if (this._arrowNext) this._arrowNext.style.display = '';
			return;
		}

		// Hide/show arrows based on position
		if (this._arrowPrev) {
			this._arrowPrev.style.display =
				this.currentColumn <= 0 ? 'none' : '';
		}
		if (this._arrowNext) {
			const maxColumn = this.numberOfColumns - this.slidesPerView;
			this._arrowNext.style.display =
				this.currentColumn >= maxColumn ? 'none' : '';
		}
	}

	loop() {
		// When we've scrolled past the last real column (into front clones)
		if (this.currentColumn >= this.numberOfColumns) {
			// Calculate how many slides we went past the end
			const overshoot = this.currentColumn - this.numberOfColumns;
			// Align to slide boundaries: if we went 1 column past, and slidesPerView is 3,
			// we want to end up at column 0 (start of first slide), not column 1
			const slideOffset =
				Math.floor(overshoot / this.slidesPerView) * this.slidesPerView;
			this.currentColumn = slideOffset;
			this.setActiveDot(this.currentColumn);
			// Instantly jump back to the real first column without animation
			this.columnAction(false);
		}
		// When we've scrolled before the first real column (into back clones)
		if (this.currentColumn < 0) {
			// Calculate how many slides we went before the start
			const undershoot = Math.abs(this.currentColumn);
			// Calculate how many complete slides fit before we reach the position
			const slidesBack = Math.ceil(undershoot / this.slidesPerView);
			// Find the last complete slide position
			const lastSlideStart =
				Math.floor((this.numberOfColumns - 1) / this.slidesPerView) *
				this.slidesPerView;
			// Go back that many slides from the last slide
			this.currentColumn = Math.max(
				0,
				lastSlideStart - (slidesBack - 1) * this.slidesPerView
			);
			this.setActiveDot(this.currentColumn);
			// Instantly jump to the real last column(s) without animation
			this.columnAction(false);
		}
	}

	transitionEnd() {
		if (this.isLoop) this.loop();
	}

	dragStart(e) {
		// Disable drag for fade transitions
		if (this.isFadeTransition) return;

		const event = e.type.includes('mouse') ? e : e.touches[0];
		this.initPosition = event.clientX;

		if (e.type.includes('mouse')) {
			this._wrapper.addEventListener('mousemove', this.onDragAction);
			this._wrapper.addEventListener('mouseup', this.onDragEnd);
			this._wrapper.addEventListener('mouseleave', this.onDragEnd);
		}
	}

	dragAction(e) {
		// Disable drag for fade transitions
		if (this.isFadeTransition) return;

		const event = e.type.includes('mouse') ? e : e.touches[0];
		this.dragPosition = event.clientX;
		const movement = this.initPosition - this.dragPosition;

		this._wrapper.style.transition = 'none';

		// Calculate new position
		let newPosition = this.activeColumnPosition + movement;

		// If loop is disabled, constrain position to valid boundaries
		if (!this.isLoop) {
			const minPosition = this.realFirstElOffset;
			const maxColumn = this.numberOfColumns - this.slidesPerView;

			// Calculate max position based on maxColumn
			const firstColumnWidth = this._columns[0]?.size?.width || 0;
			const columnsWidth = firstColumnWidth * maxColumn;
			const totalGaps = this.carouselColumnGap * maxColumn;
			const maxPosition =
				columnsWidth + totalGaps + this.realFirstElOffset;

			// Constrain the position
			newPosition = Math.max(
				minPosition,
				Math.min(newPosition, maxPosition)
			);
		}

		this.wrapperTranslate = newPosition;

		this.isInteracting = true;
	}

	dragEnd() {
		// Disable drag for fade transitions
		if (this.isFadeTransition) return;

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

	/**
	 * Destroy carousel instance and clean up
	 */
	destroy() {
		// Stop autoplay
		if (this.autoplayInterval) {
			clearInterval(this.autoplayInterval);
			this.autoplayInterval = null;
		}

		// Remove event listeners
		if (this._wrapper) {
			this._wrapper.removeEventListener('mousedown', this.onDragStart);
			this._wrapper.removeEventListener('touchstart', this.onDragStart);
			this._wrapper.removeEventListener('mousemove', this.onDragAction);
			this._wrapper.removeEventListener('mouseup', this.onDragEnd);
			this._wrapper.removeEventListener('mouseleave', this.onDragEnd);
			this._wrapper.removeEventListener('touchmove', this.onDragAction);
			this._wrapper.removeEventListener('touchend', this.onDragEnd);
			this._wrapper.removeEventListener(
				'transitionend',
				this.onTransitionEnd
			);
			this._wrapper.removeEventListener(
				'animationend',
				this.onTransitionEnd
			);
		}

		if (this._container) {
			this._container.removeEventListener('mouseenter', this.onHover);
			this._container.removeEventListener('mouseleave', this.onHoverEnd);
		}

		if (this._arrowNext) {
			this._arrowNext.removeEventListener('click', this.onColumnNext);
		}

		if (this._arrowPrev) {
			this._arrowPrev.removeEventListener('click', this.onColumnPrev);
		}

		if (this.onResize) {
			window.removeEventListener('resize', this.onResize);
		}

		// Remove carousel structure if it exists
		if (this.carouselActive && this._container) {
			// Find the wrapper
			const wrapper = this._container.querySelector(
				'.maxi-row-carousel__wrapper'
			);
			const tracker = this._container.querySelector(
				'.maxi-row-carousel__tracker'
			);
			const nav = this._container.querySelector(
				'.maxi-row-carousel__nav'
			);

			// Move columns back to container
			if (wrapper) {
				const columns = Array.from(
					wrapper.querySelectorAll(':scope > .maxi-column-block')
				);
				columns.forEach(column => {
					// Remove carousel classes
					column.classList.remove('carousel-item--active');
					column.removeAttribute('data-carousel-active');
					// Move back to container
					this._container.appendChild(column);
				});
			}

			// Remove carousel elements
			if (wrapper) wrapper.remove();
			if (tracker) tracker.remove();
			if (nav) nav.remove();
		}

		// Clear references
		this._container = null;
		this._wrapper = null;
		this._tracker = null;
		this._columns = null;
		this._arrowNext = null;
		this._arrowPrev = null;
		this._dotsContainer = null;

		// Clear bound handler references
		this.onDragStart = null;
		this.onDragAction = null;
		this.onDragEnd = null;
		this.onHover = null;
		this.onHoverEnd = null;
		this.onColumnNext = null;
		this.onColumnPrev = null;
		this.onTransitionEnd = null;
	}
}

// Expose MaxiRowCarousel globally for editor preview
window.MaxiRowCarousel = MaxiRowCarousel;

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
	// Find all rows with carousel enabled
	const carouselRows = Array.from(
		document.querySelectorAll('.maxi-row-block')
	).filter(row => {
		// Check if carousel is enabled (global status attribute)
		const attr = row.getAttribute('data-carousel-status');
		return attr === 'true' || attr === true;
	});

	carouselRows.forEach(row => {
		new MaxiRowCarousel(row);
	});
});
