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

		// eslint-disable-next-line no-console
		console.log('MaxiRowCarouselEditor: Constructor called', {
			container: this._container,
		});

		// Get all direct column children - in editor they're wrapped in maxi-block__resizer
		// We need to look for .maxi-block__resizer > .maxi-column-block

		// First, let's check what direct children we have
		const directChildren = Array.from(this._container.children);
		// eslint-disable-next-line no-console
		console.log('MaxiRowCarouselEditor: Direct children', {
			count: directChildren.length,
			children: directChildren.map(el => ({
				tagName: el.tagName,
				className: el.className,
			})),
		});

		// Look for resizer wrappers
		const resizers = Array.from(
			this._container.querySelectorAll(':scope > .maxi-block__resizer')
		);
		// eslint-disable-next-line no-console
		console.log('MaxiRowCarouselEditor: Found resizers', {
			count: resizers.length,
			resizers,
		});

		// Look for columns within resizers
		// In editor, the resizer DIV itself has the maxi-column-block class
		const columns = Array.from(
			this._container.querySelectorAll(
				':scope > .maxi-block__resizer.maxi-column-block'
			)
		);

		// eslint-disable-next-line no-console
		console.log('MaxiRowCarouselEditor: Found columns', {
			count: columns.length,
			columns,
		});

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
			// eslint-disable-next-line no-console
			console.log(
				'MaxiRowCarouselEditor: Carousel should not be active yet'
			);
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

		// eslint-disable-next-line no-console
		console.log('MaxiRowCarouselEditor: Columns mapped', {
			columns: this._columns,
		});

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
		this.onResize = this.handleResize.bind(this);

		// Set up hover event listeners
		this._container.addEventListener('mouseenter', this.onHover);
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
					// eslint-disable-next-line no-console
					console.log(
						'MaxiRowCarouselEditor: Re-applying active class'
					);
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

		// eslint-disable-next-line no-console
		console.log('MaxiRowCarouselEditor: Initialization complete');
	}

	// Copy all methods from the original MaxiRowCarousel class
	// (These are the same as in maxi-row-carousel.js)

	getCurrentBreakpoint() {
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
		// eslint-disable-next-line no-console
		console.log('MaxiRowCarouselEditor: Creating carousel structure');

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
		tracker.appendChild(wrapper);
		tracker.appendChild(nav);

		// Add tracker to container
		this._container.appendChild(tracker);

		// eslint-disable-next-line no-console
		console.log('MaxiRowCarouselEditor: Structure created', {
			tracker,
			wrapper,
			nav,
			columnResizerCount: columnResizers.length,
			showArrows,
			showDots,
		});
	}

	init() {
		this.currentColumn = 0;
		this._columns[this.currentColumn].isActive = this.currentColumn;

		// Set transition attribute
		this._container.setAttribute('data-transition', this.transition);

		// Add active class to enable carousel CSS
		this._container.classList.add('maxi-row-carousel--active');

		this.setColumnSizes();
		this.setWrapperSize();
		this.columnAction();
		this.updateDots();

		if (this.autoplay) {
			this.startAutoplay();
		}

		// Set up drag events
		this._wrapper.addEventListener('mousedown', this.onDragStart);
		this._wrapper.addEventListener('touchstart', this.onDragStart, {
			passive: true,
		});
	}

	setColumnSizes() {
		const containerWidth = this._container.offsetWidth;
		const totalGap = this.columnGap * (this.slidesPerView - 1);
		const availableWidth = containerWidth - totalGap - this.peekOffset * 2;
		const columnWidth = availableWidth / this.slidesPerView;

		this._columns.forEach((column, index) => {
			// In editor, column._column IS the resizer div
			const el = column._column;
			if (el) {
				el.style.width = `${columnWidth}px`;
				el.style.minWidth = `${columnWidth}px`;
				el.style.marginRight =
					index < this._columns.length - 1
						? `${this.columnGap}px`
						: '0px';
			}
		});
	}

	setWrapperSize() {
		if (!this._wrapper) return;

		const containerWidth = this._container.offsetWidth;
		const totalWidth = this._columns.reduce((acc, column) => {
			const el = column._column.closest('.maxi-block__resizer');
			return acc + (el ? el.offsetWidth + this.columnGap : 0);
		}, 0);

		this._wrapper.style.width = `${totalWidth}px`;
		this._wrapper.style.transition = `transform ${this.transitionSpeed}s ease`;
	}

	columnAction() {
		if (this.transition === 'fade') {
			this.fadeTo(this.currentColumn);
		} else {
			this.slideTo(this.currentColumn);
		}
	}

	slideTo(index) {
		const column = this._columns[index];
		if (!column) return;

		const offset = this.calculateOffset(index);
		this._wrapper.style.transform = `translateX(-${offset}px)`;

		this._columns.forEach((col, i) => {
			col.isActive = i === index;
		});

		this.updateDots();
	}

	fadeTo(index) {
		this._columns.forEach((col, i) => {
			col.isActive = i === index;
			// In editor, _column IS the resizer
			const el = col._column;
			if (el) {
				el.style.opacity = i === index ? '1' : '0';
				el.style.transition = `opacity ${this.transitionSpeed}s ease`;
			}
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

	columnNext() {
		if (this.currentColumn < this._columns.length - 1) {
			this.currentColumn += 1;
		} else if (this.loop) {
			this.currentColumn = 0;
		}

		this.columnAction();

		if (this.pauseOnInteraction && this.autoplay) {
			this.stopAutoplay();
		}
	}

	columnPrev() {
		if (this.currentColumn > 0) {
			this.currentColumn -= 1;
		} else if (this.loop) {
			this.currentColumn = this._columns.length - 1;
		}

		this.columnAction();

		if (this.pauseOnInteraction && this.autoplay) {
			this.stopAutoplay();
		}
	}

	exactColumn(index) {
		this.currentColumn = index;
		this.columnAction();

		if (this.pauseOnInteraction && this.autoplay) {
			this.stopAutoplay();
		}
	}

	updateDots() {
		if (!this._dotsContainer) return;

		// Clear existing dots
		this._dotsContainer.innerHTML = '';

		// Get dot icon content
		const dotIconContent =
			this._container.getAttribute('data-dot-icon') || '';

		// Create dots
		this._columns.forEach((column, index) => {
			const dot = document.createElement('span');
			dot.className = 'maxi-row-carousel__dot';
			if (index === this.currentColumn) {
				dot.classList.add('maxi-row-carousel__dot--active');
			}

			if (dotIconContent) {
				// Create icon wrapper for styling
				const iconWrapper = document.createElement('div');
				iconWrapper.className = 'maxi-navigation-dot-icon-block__icon';
				iconWrapper.innerHTML = dotIconContent;
				dot.appendChild(iconWrapper);
			}

			dot.addEventListener('click', () => this.exactColumn(index));
			this._dotsContainer.appendChild(dot);
		});
	}

	startAutoplay() {
		if (this.autoplayInterval) return;

		this.autoplayInterval = setInterval(() => {
			if (
				!this.isInteracting &&
				(!this.pauseOnHover || !this.isHovering)
			) {
				this.columnNext();
			}
		}, this.autoplaySpeed * 1000);
	}

	stopAutoplay() {
		if (this.autoplayInterval) {
			clearInterval(this.autoplayInterval);
			this.autoplayInterval = null;
		}
	}

	handleResize() {
		const shouldBeActive = this.shouldCarouselBeActive();
		const currentBP = this.getCurrentBreakpoint();
		const breakpointChanged = this.lastBreakpoint !== currentBP;

		this.lastBreakpoint = currentBP;

		if (breakpointChanged && this.carouselActive) {
			this.loadBreakpointSettings();
			this.setColumnSizes();
			this.setWrapperSize();
			this.columnAction();
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

			this.init();
			this.carouselActive = true;
		} else if (!shouldBeActive && this.carouselActive) {
			// Deactivate carousel
			this.destroy();
		}
	}

	dragStart(e) {
		if (this.transition === 'fade') return;

		e.preventDefault();

		const clientX =
			e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
		this.initPosition = clientX;

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
		const currentOffset = this.calculateOffset(this.currentColumn);
		const newOffset = currentOffset + movement;

		this._wrapper.style.transform = `translateX(-${newOffset}px)`;
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
		this._wrapper.removeEventListener('touchmove', this.onDragAction);
		this._wrapper.removeEventListener('touchend', this.onDragEnd);

		setTimeout(() => {
			this.isInteracting = false;
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
	destroy() {
		// eslint-disable-next-line no-console
		console.log('MaxiRowCarouselEditor: destroy() called');

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
			this._container.removeEventListener('mouseenter', this.onHover);
			this._container.removeEventListener('mouseleave', this.onHoverEnd);
		}

		if (this._arrowNext) {
			this._arrowNext.removeEventListener('click', this.columnNext);
		}

		if (this._arrowPrev) {
			this._arrowPrev.removeEventListener('click', this.columnPrev);
		}

		if (this.onResize) {
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
			const arrows = this._container.querySelectorAll(
				'.maxi-row-carousel__arrow'
			);
			const dots = this._container.querySelector(
				'.maxi-row-carousel__dots'
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
					resizer.style.marginRight = '';
					resizer.style.opacity = '';

					// Move back to container
					this._container.appendChild(resizer);
				});
			}

			// Remove carousel elements
			if (wrapper) wrapper.remove();
			if (tracker) tracker.remove();
			arrows.forEach(arrow => arrow.remove());
			if (dots) dots.remove();
		}

		// Remove active class and initialized flag
		this._container.classList.remove('maxi-row-carousel--active');
		this._container.removeAttribute('data-carousel-initialized');
		this._container.removeAttribute('data-transition');

		// Clear references
		this._container = null;
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
