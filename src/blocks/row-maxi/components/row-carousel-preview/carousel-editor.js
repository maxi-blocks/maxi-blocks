/* eslint-disable max-classes-per-file */
/* eslint-disable no-new */

/**
 * Editor-specific Row Carousel
 * Handles the different DOM structure in Gutenberg editor
 */

class RowCarouselColumnEditor {
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

class MaxiRowCarouselEditor {
	constructor(el) {
		this._container = el;

		// Get all direct column children - in editor they're wrapped in maxi-block__resizer
		// Look for columns within resizers
		// In editor, the resizer DIV itself has the maxi-column-block class
		const columns = Array.from(
			this._container.querySelectorAll(
				':scope > .maxi-block__resizer.maxi-column-block'
			)
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

		// Read breakpoint-specific configuration
		this.loadBreakpointSettings();

		// Check if carousel should be active based on trigger width
		if (!this.shouldCarouselBeActive()) {
			this.carouselActive = false;
			this.onResize = this.handleResize.bind(this);
			window.addEventListener('resize', this.onResize);
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

		// Columns (slides) - in editor, resizers ARE the columns
		this._columns = Array.from(
			this._wrapper.querySelectorAll(
				':scope > .maxi-block__resizer.maxi-column-block'
			)
		).map((column, i) => new RowCarouselColumnEditor(column, i));

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
		// Store distinct bound references for hover handlers
		this.onHoverStart = this.onHover.bind(this, false);
		this.onHoverEnd = this.onHover.bind(this, true);
		this.exactColumn = this.exactColumn.bind(this);
		this.onResize = this.handleResize.bind(this);
		// Store bound references for navigation handlers
		this._boundColumnNext = this.columnNext.bind(this);
		this._boundColumnPrev = this.columnPrev.bind(this);

		// Set up hover event listeners using distinct bound references
		this._container.addEventListener('mouseenter', this.onHoverStart);
		this._container.addEventListener('mouseleave', this.onHoverEnd);

		// Set up MutationObserver to ensure active class persists
		// This is needed because editor may remove it when child blocks are hovered
		this._classObserver = new MutationObserver(mutations => {
			mutations.forEach(mutation => {
				if (
					mutation.type === 'attributes' &&
					mutation.attributeName === 'class' &&
					this.carouselActive &&
					!this._container.classList.contains(
						'maxi-row-carousel--active'
					)
				) {
					this._container.classList.add('maxi-row-carousel--active');
				}
			});
		});

		// Observe class attribute changes
		this._classObserver.observe(this._container, {
			attributes: true,
			attributeFilter: ['class'],
		});

		// Start carousel
		this.init();

		// Add resize listener
		window.addEventListener('resize', this.onResize);

		this.carouselActive = true;

		// Mark as initialized
		this._container.setAttribute('data-carousel-initialized', 'true');
	}

	// Copy all methods from the original MaxiRowCarousel class
	// (These are the same as in maxi-row-carousel.js)

	/**
	 * Get current breakpoint based on editor device type or window width
	 * In editor, we use the MaxiBlocks store device type
	 * @returns {string} Current breakpoint
	 */
	// eslint-disable-next-line class-methods-use-this
	getCurrentBreakpoint() {
		// Try to get device type from MaxiBlocks store (editor context)
		if (typeof wp !== 'undefined' && wp.data && wp.data.select) {
			try {
				const deviceType = wp.data
					.select('maxiBlocks')
					?.receiveMaxiDeviceType();
				if (deviceType && deviceType !== 'general') {
					return deviceType;
				}
			} catch (error) {
				// Silently fail and use window width fallback
			}
		}

		// Fallback to window width
		const width = window.innerWidth;
		if (width >= 1920) return 'xxl';
		if (width >= 1366) return 'xl';
		if (width >= 1024) return 'l';
		if (width >= 768) return 'm';
		if (width >= 480) return 's';
		return 'xs';
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
		const bp = this.lastBreakpoint;

		this.slidesPerView = parseInt(
			this._container.dataset[
				`carouselSlidesPerView${
					bp.charAt(0).toUpperCase() + bp.slice(1)
				}`
			] ||
				this._container.dataset.carouselSlidesPerViewGeneral ||
				'1',
			10
		);

		this.columnGap = parseInt(
			this._container.dataset[
				`carouselColumnGap${bp.charAt(0).toUpperCase() + bp.slice(1)}`
			] ||
				this._container.dataset.carouselColumnGapGeneral ||
				'0',
			10
		);

		this.peekOffset = parseInt(
			this._container.dataset[
				`carouselPeekOffset${bp.charAt(0).toUpperCase() + bp.slice(1)}`
			] ||
				this._container.dataset.carouselPeekOffsetGeneral ||
				'0',
			10
		);

		this.heightOffset = parseInt(
			this._container.dataset[
				`carouselHeightOffset${
					bp.charAt(0).toUpperCase() + bp.slice(1)
				}`
			] ||
				this._container.dataset.carouselHeightOffsetGeneral ||
				'0',
			10
		);

		const loopValue =
			this._container.dataset[
				`carouselLoop${bp.charAt(0).toUpperCase() + bp.slice(1)}`
			] ||
			this._container.dataset.carouselLoopGeneral ||
			'false';
		this.loop = loopValue === 'true' || loopValue === true;

		const autoplayValue =
			this._container.dataset[
				`carouselAutoplay${bp.charAt(0).toUpperCase() + bp.slice(1)}`
			] ||
			this._container.dataset.carouselAutoplayGeneral ||
			'false';
		this.autoplay = autoplayValue === 'true' || autoplayValue === true;

		this.autoplaySpeed = parseFloat(
			this._container.dataset[
				`carouselAutoplaySpeed${
					bp.charAt(0).toUpperCase() + bp.slice(1)
				}`
			] ||
				this._container.dataset.carouselAutoplaySpeedGeneral ||
				'2.5'
		);

		const pauseOnHoverValue =
			this._container.dataset[
				`carouselHoverPause${bp.charAt(0).toUpperCase() + bp.slice(1)}`
			] ||
			this._container.dataset.carouselHoverPauseGeneral ||
			'false';
		this.pauseOnHover =
			pauseOnHoverValue === 'true' || pauseOnHoverValue === true;

		const pauseOnInteractionValue =
			this._container.dataset[
				`carouselInteractionPause${
					bp.charAt(0).toUpperCase() + bp.slice(1)
				}`
			] ||
			this._container.dataset.carouselInteractionPauseGeneral ||
			'false';
		this.pauseOnInteraction =
			pauseOnInteractionValue === 'true' ||
			pauseOnInteractionValue === true;

		this.transition =
			this._container.dataset[
				`carouselTransition${bp.charAt(0).toUpperCase() + bp.slice(1)}`
			] ||
			this._container.dataset.carouselTransitionGeneral ||
			'slide';

		this.transitionSpeed = parseFloat(
			this._container.dataset[
				`carouselTransitionSpeed${
					bp.charAt(0).toUpperCase() + bp.slice(1)
				}`
			] ||
				this._container.dataset.carouselTransitionSpeedGeneral ||
				'0.5'
		);
	}

	shouldCarouselBeActive() {
		if (!this.triggerWidth) return true;
		return window.innerWidth >= this.triggerWidth;
	}

	createCarouselStructure(columns) {
		// Create wrapper
		const wrapper = document.createElement('div');
		wrapper.className = 'maxi-row-carousel__wrapper';

		// Create tracker
		const tracker = document.createElement('div');
		tracker.className = 'maxi-row-carousel__tracker';

		// Move columns into wrapper - in editor, we move the maxi-block__resizer divs
		// which ARE the column blocks
		const columnResizers = Array.from(
			this._container.querySelectorAll(
				':scope > .maxi-block__resizer.maxi-column-block'
			)
		);

		columnResizers.forEach(resizer => {
			wrapper.appendChild(resizer);
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

			// Create icon wrapper for styling
			const iconWrapper = document.createElement('div');
			iconWrapper.className =
				'maxi-navigation-arrow-first-icon-block__icon';
			iconWrapper.innerHTML = arrowFirstContent;

			prevArrow.appendChild(iconWrapper);
			nav.appendChild(prevArrow);
			this._prevArrow = prevArrow;
		}

		if (showArrows && arrowSecondContent) {
			const nextArrow = document.createElement('span');
			nextArrow.className =
				'maxi-row-carousel__arrow maxi-row-carousel__arrow--next';

			// Create icon wrapper for styling
			const iconWrapper = document.createElement('div');
			iconWrapper.className =
				'maxi-navigation-arrow-second-icon-block__icon';
			iconWrapper.innerHTML = arrowSecondContent;

			nextArrow.appendChild(iconWrapper);
			nav.appendChild(nextArrow);
			this._nextArrow = nextArrow;
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

		// Stack children vertically so pagination doesn't steal horizontal
		// space from tracker's margin:auto centering
		this._container.style.flexDirection = 'column';

		// Add tracker to container
		this._container.appendChild(tracker);
		// Add nav as direct child of container (not inside tracker) to prevent overflow clipping of arrows
		this._container.appendChild(nav);

		// Move CL pagination to the end so it appears below the carousel
		const pagination = this._container.querySelector('.maxi-pagination');
		if (pagination) {
			this._container.appendChild(pagination);
		}
	}

	init() {
		this.currentColumn = 0;
		this._columns[this.currentColumn].isActive = this.currentColumn;

		// Set transition attribute
		this._container.setAttribute('data-transition', this.transition);

		// Add active class to enable carousel CSS
		this._container.classList.add('maxi-row-carousel--active');

		// Set column widths, tracker width, and wrapper width
		this.setColumnWidths();
		this.columnAction();
		this.updateDots();

		// Update arrow states based on initial position
		this.updateArrowStates();

		// Set up navigation events
		this.navEvents();

		if (this.autoplay) {
			this.startAutoplay();
		}

		// Set up drag events
		this._wrapper.addEventListener('mousedown', this.onDragStart);
		this._wrapper.addEventListener('touchstart', this.onDragStart, {
			passive: false,
		});
	}

	/**
	 * Set column widths and tracker width
	 * This method is critical for proper carousel display
	 */
	setColumnWidths() {
		if (this._columns.length === 0) return;

		// Get the actual width of each column from the ORIGINAL row
		// In editor, columns are wrapped in .maxi-block__resizer
		const firstColumn = this._columns[0]._column;
		const firstColumnWidth = firstColumn.getBoundingClientRect().width;
		const carouselGap = this.columnGap || 0;

		// Calculate tracker width (the visible viewport):
		// - Show slidesPerView columns at their original width
		// - Add gaps BETWEEN visible columns (slidesPerView - 1 gaps)
		// - Add peek offset to show a bit of the next column
		const trackerWidth =
			firstColumnWidth * this.slidesPerView +
			carouselGap * (this.slidesPerView - 1) +
			this.peekOffset;

		// Set tracker width
		this._tracker.style.width = `${trackerWidth}px`;

		// Set each column to its original width explicitly
		this._columns.forEach(column => {
			column._column.style.width = `${firstColumnWidth}px`;
			column._column.style.minWidth = `${firstColumnWidth}px`;
			column._column.style.flexBasis = `${firstColumnWidth}px`;
		});

		// Set wrapper gap to the carousel gap (overrides row's gap)
		this._wrapper.style.columnGap = `${carouselGap}px`;

		// Calculate wrapper width to contain all columns with gaps
		const totalChildren = this._columns.length;
		const wrapperWidth =
			firstColumnWidth * totalChildren +
			carouselGap * (totalChildren - 1);
		this._wrapper.style.width = `${wrapperWidth}px`;
		this._wrapper.style.transition = `transform ${this.transitionSpeed}s ease`;

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

		// Check all columns
		this._columns.forEach((column, index) => {
			const contentHeight = getMaxContentHeight(column._column, index);
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

		// Use offsetLeft/offsetTop which give position relative to the
		// offset parent's padding edge — matching absolute positioning reference
		nav.style.left = `${this._tracker.offsetLeft}px`;
		nav.style.top = `${this._tracker.offsetTop}px`;
		nav.style.width = `${this._tracker.offsetWidth}px`;
		nav.style.height = `${this._tracker.offsetHeight}px`;
	}

	columnAction() {
		this.slideTo(this.currentColumn);
	}

	slideTo(index, skipTransition = false) {
		const column = this._columns[index];
		if (!column) return;

		if (skipTransition) {
			this._wrapper.style.transition = 'none';
		}

		const offset = this.calculateOffset(index);
		this._wrapper.style.transform = `translateX(-${offset}px)`;

		if (skipTransition) {
			// Force reflow so browser commits the no-transition state
			void this._wrapper.offsetHeight;
			this._wrapper.style.transition = `transform ${this.transitionSpeed}s ease`;
		}

		// Get the active column's id and pass it to each column's isActive setter
		const activeColumnId = column._id;
		this._columns.forEach(col => {
			col.isActive = activeColumnId;
		});

		this.updateDots();
	}

	calculateOffset(index) {
		let offset = this.peekOffset;

		for (let i = 0; i < index; i++) {
			// In editor, _column IS the resizer
			const el = this._columns[i]._column;
			if (el) {
				offset += el.offsetWidth + this.columnGap;
			}
		}

		return offset;
	}

	columnNext(isUserInteraction = true) {
		const maxColumn = Math.max(
			0,
			this._columns.length - this.slidesPerView
		);

		let didWrap = false;

		// If loop is disabled, prevent going beyond last valid position
		if (!this.loop) {
			if (this.currentColumn >= maxColumn) {
				return; // Already at the end
			}
			this.currentColumn = Math.min(this.currentColumn + this.slidesPerView, maxColumn);
		} else {
			const nextColumn = this.currentColumn + this.slidesPerView;
			if (nextColumn > maxColumn) {
				// Wrap around - skip transition to avoid backward scroll
				didWrap = true;
				this.currentColumn = 0;
			} else {
				this.currentColumn = nextColumn;
			}
		}

		if (didWrap) {
			this.slideTo(this.currentColumn, true);
		} else {
			this.columnAction();
		}
		this.updateArrowStates();

		if (isUserInteraction && this.pauseOnInteraction && this.autoplay) {
			this.stopAutoplay();
		}
	}

	columnPrev(isUserInteraction = true) {
		const maxColumn = Math.max(
			0,
			this._columns.length - this.slidesPerView
		);

		let didWrap = false;

		// If loop is disabled, prevent going before first slide
		if (!this.loop) {
			if (this.currentColumn <= 0) {
				return; // Already at the beginning
			}
			this.currentColumn -= this.slidesPerView;
		} else {
			const prevColumn = this.currentColumn - this.slidesPerView;
			if (prevColumn < 0) {
				// Wrap around
				didWrap = true;
				this.currentColumn = maxColumn;
			} else {
				this.currentColumn = prevColumn;
			}
		}

		if (didWrap) {
			this.slideTo(this.currentColumn, true);
		} else {
			this.columnAction();
		}
		this.updateArrowStates();

		if (isUserInteraction && this.pauseOnInteraction && this.autoplay) {
			this.stopAutoplay();
		}
	}

	exactColumn(index) {
		this.currentColumn = index;
		this.columnAction();
		this.updateArrowStates();

		if (this.pauseOnInteraction && this.autoplay) {
			this.stopAutoplay();
		}
	}

	get numberOfSlides() {
		return Math.ceil(this._columns.length / this.slidesPerView);
	}

	updateDots() {
		if (!this._dotsContainer) return;

		// Clear existing dots
		this._dotsContainer.innerHTML = '';

		// Get dot icon content
		const dotIconContent =
			this._container.getAttribute('data-dot-icon') || '';
		const activeDotIconContent =
			this._container.getAttribute('data-active-dot-icon') ||
			dotIconContent;

		// Calculate current slide index based on current column
		const currentSlide = Math.floor(
			this.currentColumn / this.slidesPerView
		);

		// Create dots based on number of slides, not columns
		for (let i = 0; i < this.numberOfSlides; i++) {
			const dot = document.createElement('span');
			dot.className = 'maxi-row-carousel__dot';
			const isActive = i === currentSlide;
			if (isActive) {
				dot.classList.add('maxi-row-carousel__dot--active');
			}

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
			}
			this._dotsContainer.appendChild(dot);
		}
	}

	/**
	 * Set up navigation arrow event listeners
	 */
	navEvents() {
		if (this._arrowNext) {
			this._arrowNext.addEventListener('click', this._boundColumnNext);
		}
		if (this._arrowPrev) {
			this._arrowPrev.addEventListener('click', this._boundColumnPrev);
		}
	}

	/**
	 * Update arrow visibility based on current position and loop setting
	 */
	updateArrowStates() {
		if (this.loop) {
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
			const maxColumn = Math.max(
				0,
				this._columns.length - this.slidesPerView
			);
			this._arrowNext.style.display =
				this.currentColumn >= maxColumn ? 'none' : '';
		}
	}

	startAutoplay() {
		if (this.autoplayInterval) return;

		this.autoplayInterval = setInterval(() => {
			if (
				!this.isInteracting &&
				(!this.pauseOnHover || !this.isHovering)
			) {
				this.columnNext(false);
			}
		}, this.autoplaySpeed * 1000);
	}

	stopAutoplay() {
		if (this.autoplayInterval) {
			clearInterval(this.autoplayInterval);
			this.autoplayInterval = null;
		}
	}

	/**
	 * Force check for breakpoint changes
	 * Useful in editor when device type changes without window resize
	 */
	checkBreakpoint() {
		const currentBP = this.getCurrentBreakpoint();
		const breakpointChanged = this.lastBreakpoint !== currentBP;

		if (breakpointChanged) {
			this.lastBreakpoint = currentBP;

			if (this.carouselActive) {
				// Store old slides per view to check if it changed
				const oldSlidesPerView = this.slidesPerView;

				// Load new breakpoint settings
				this.loadBreakpointSettings();

				// If slides per view changed, we need to validate current position
				if (oldSlidesPerView !== this.slidesPerView) {
					// Ensure current column is valid for new slidesPerView
					const maxColumn = this._columns.length - this.slidesPerView;
					if (this.currentColumn > maxColumn) {
						this.currentColumn = Math.max(0, maxColumn);
					}
				}

				// Update transition attribute if it changed
				this._container.setAttribute(
					'data-transition',
					this.transition
				);

				// Recalculate widths and positions
				this.setColumnWidths();
				this.columnAction();

				// Update navigation
				this.updateDots();
				this.updateArrowStates();

				// Update autoplay if needed
				if (this.autoplay && !this.autoplayInterval) {
					this.startAutoplay();
				} else if (!this.autoplay && this.autoplayInterval) {
					this.stopAutoplay();
				}
			}
		}
	}

	handleResize() {
		const shouldBeActive = this.shouldCarouselBeActive();
		const currentBP = this.getCurrentBreakpoint();
		const breakpointChanged = this.lastBreakpoint !== currentBP;

		this.lastBreakpoint = currentBP;

		if (breakpointChanged && this.carouselActive) {
			// Store old slides per view to check if it changed
			const oldSlidesPerView = this.slidesPerView;

			this.loadBreakpointSettings();

			// If slides per view changed, validate current position
			if (oldSlidesPerView !== this.slidesPerView) {
				const maxColumn = this._columns.length - this.slidesPerView;
				if (this.currentColumn > maxColumn) {
					this.currentColumn = Math.max(0, maxColumn);
				}
			}

			this.setColumnWidths();
			this.columnAction();
			this.updateDots();
			this.updateArrowStates();
		}

		if (shouldBeActive && !this.carouselActive) {
			// Activate carousel
			const columns =
				this._originalColumns ||
				Array.from(
					this._container.querySelectorAll(
						':scope > .maxi-block__resizer.maxi-column-block'
					)
				);

			if (columns.length === 0) return;

			this.createCarouselStructure(columns);
			this.loadBreakpointSettings();

			this._tracker = this._container.querySelector(
				'.maxi-row-carousel__tracker'
			);
			this._wrapper = this._container.querySelector(
				'.maxi-row-carousel__wrapper'
			);
			this._columns = Array.from(
				this._wrapper.querySelectorAll(
					':scope > .maxi-block__resizer.maxi-column-block'
				)
			).map((column, i) => new RowCarouselColumnEditor(column, i));
			this._arrowNext = this._container.querySelector(
				'.maxi-row-carousel__arrow--next'
			);
			this._arrowPrev = this._container.querySelector(
				'.maxi-row-carousel__arrow--prev'
			);
			this._dotsContainer = this._container.querySelector(
				'.maxi-row-carousel__dots'
			);

			this.init();
			this.carouselActive = true;

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
			// Deactivate carousel but keep resize listener for reactivation
			this.destroy({ keepResizeListener: true });
		}
	}

	dragStart(e) {
		if (this.transition === 'fade') return;

		// Don't call preventDefault here - allow clicks to propagate for block selection
		// preventDefault will be called in dragAction when actual movement occurs

		const clientX =
			e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
		this.initPosition = clientX;
		this.isDragging = false; // Track if actual drag has started

		this._wrapper.addEventListener('mousemove', this.onDragAction);
		this._wrapper.addEventListener('mouseup', this.onDragEnd);
		this._wrapper.addEventListener('mouseleave', this.onDragEnd);
		this._wrapper.addEventListener('touchmove', this.onDragAction);
		this._wrapper.addEventListener('touchend', this.onDragEnd);

		this.isInteracting = true;
	}

	dragAction(e) {
		if (this.transition === 'fade') return;

		const clientX =
			e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
		this.dragPosition = clientX;

		const movement = this.initPosition - this.dragPosition;

		// Only start actual drag if movement exceeds threshold (5px)
		// This allows clicks to pass through for block selection
		if (!this.isDragging && Math.abs(movement) > 5) {
			this.isDragging = true;
			e.preventDefault(); // Now prevent default since we're actually dragging
		}

		// Only move the carousel if we're actually dragging
		if (!this.isDragging) return;

		const currentOffset = this.calculateOffset(this.currentColumn);
		let newOffset = currentOffset + movement;

		// If loop is disabled, constrain offset to valid boundaries
		if (!this.loop) {
			const minOffset = 0;
			const maxColumn = this._columns.length - this.slidesPerView;
			const maxOffset = this.calculateOffset(maxColumn);

			// Constrain the offset
			newOffset = Math.max(minOffset, Math.min(newOffset, maxOffset));
		}

		this._wrapper.style.transform = `translateX(-${newOffset}px)`;
	}

	dragEnd() {
		if (this.transition === 'fade') return;

		this.endPosition = this.dragPosition;

		// Only perform navigation if actual drag occurred
		if (this.isDragging && this.endPosition) {
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
		this._wrapper.removeEventListener('touchmove', this.onDragAction);
		this._wrapper.removeEventListener('touchend', this.onDragEnd);

		setTimeout(() => {
			this.isInteracting = false;
			this.isDragging = false;
			this.initPosition = 0;
			this.dragPosition = 0;
			this.endPosition = 0;
		}, 100);
	}

	onHover(isLeaving) {
		this.isHovering = !isLeaving;

		// Ensure active class persists on hover (editor might remove it during re-renders)
		if (
			this.carouselActive &&
			!this._container.classList.contains('maxi-row-carousel--active')
		) {
			this._container.classList.add('maxi-row-carousel--active');
		}
	}

	/**
	 * Destroy carousel instance and clean up
	 */
	destroy({ keepResizeListener = false } = {}) {
		// Stop autoplay
		if (this.autoplayInterval) {
			clearInterval(this.autoplayInterval);
			this.autoplayInterval = null;
		}

		// Disconnect MutationObserver
		if (this._classObserver) {
			this._classObserver.disconnect();
			this._classObserver = null;
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
		}

		if (this._container) {
			this._container.removeEventListener(
				'mouseenter',
				this.onHoverStart
			);
			this._container.removeEventListener('mouseleave', this.onHoverEnd);
		}

		if (this._arrowNext) {
			this._arrowNext.removeEventListener('click', this._boundColumnNext);
		}

		if (this._arrowPrev) {
			this._arrowPrev.removeEventListener('click', this._boundColumnPrev);
		}

		if (!keepResizeListener && this.onResize) {
			window.removeEventListener('resize', this.onResize);
		}

		// Remove carousel structure if it exists
		if (this.carouselActive && this._container) {
			const wrapper = this._container.querySelector(
				'.maxi-row-carousel__wrapper'
			);
			const tracker = this._container.querySelector(
				'.maxi-row-carousel__tracker'
			);
			const nav = this._container.querySelector(
				'.maxi-row-carousel__nav'
			);

			// Move column resizers back to container
			if (wrapper) {
				const columnResizers = Array.from(
					wrapper.querySelectorAll(
						':scope > .maxi-block__resizer.maxi-column-block'
					)
				);
				columnResizers.forEach(resizer => {
					// Remove carousel classes and inline styles
					// In editor, resizer IS the column
					resizer.classList.remove('carousel-item--active');
					resizer.removeAttribute('data-carousel-active');

					// Remove inline styles
					resizer.style.width = '';
					resizer.style.minWidth = '';
					resizer.style.flexBasis = '';
					resizer.style.marginRight = '';
					resizer.style.opacity = '';

					// Move back to container
					this._container.appendChild(resizer);
				});
			}

			// Remove carousel elements
			if (wrapper) wrapper.remove();
			if (tracker) tracker.remove();
			if (nav) nav.remove();

			// Move CL pagination back to the end (after columns)
			const pagination =
				this._container.querySelector('.maxi-pagination');
			if (pagination) {
				this._container.appendChild(pagination);
			}
		}

		// Remove active class and initialized flag
		if (this._container) {
			this._container.classList.remove('maxi-row-carousel--active');
			this._container.removeAttribute('data-carousel-initialized');
			this._container.removeAttribute('data-transition');
			this._container.style.flexDirection = '';
		}

		// Clear references
		if (!keepResizeListener) {
			this._container = null;
		}
		this._wrapper = null;
		this._tracker = null;
		this._columns = null;
		this._arrowNext = null;
		this._arrowPrev = null;
		this._dotsContainer = null;
		this.carouselActive = false;
	}
}

// Expose MaxiRowCarouselEditor globally for editor preview
window.MaxiRowCarouselEditor = MaxiRowCarouselEditor;

// Module-scoped observer reference for cleanup
let fseIframeObserver = null;

// Also expose in FSE iframe if it exists
const exposeFSEIframe = () => {
	const fseIframe = document.querySelector(
		'iframe[name="editor-canvas"].edit-site-visual-editor__editor-canvas'
	);
	if (fseIframe?.contentWindow) {
		fseIframe.contentWindow.MaxiRowCarouselEditor = MaxiRowCarouselEditor;

		// Disconnect observer after successfully exposing to iframe
		if (fseIframeObserver) {
			fseIframeObserver.disconnect();
			fseIframeObserver = null;
		}

		return true;
	}
	return false;
};

// Try immediately
const iframeFound = exposeFSEIframe();

// Only watch for FSE iframe if it wasn't found immediately
if (!iframeFound && typeof MutationObserver !== 'undefined') {
	fseIframeObserver = new MutationObserver(() => {
		exposeFSEIframe();
	});

	// Observe only the editor region instead of entire document.body for better performance
	const editorRegion =
		document.querySelector('.edit-site-visual-editor') || document.body;
	fseIframeObserver.observe(editorRegion, { childList: true, subtree: true });

	// Clean up observer on window unload to prevent memory leaks
	window.addEventListener('beforeunload', () => {
		if (fseIframeObserver) {
			fseIframeObserver.disconnect();
			fseIframeObserver = null;
		}
	});
}
