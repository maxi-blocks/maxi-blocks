/**
 * External dependencies
 */
import { useEffect, useRef } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import './carousel-editor';

/**
 * Add carousel data attributes to the row block element
 * @param {HTMLElement} rowBlock   - The row block element
 * @param {Object}      attributes - The block attributes
 */
const addCarouselDataAttributes = (rowBlock, attributes) => {
	const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

	// Add global carousel status
	rowBlock.setAttribute('data-carousel-status', 'true');

	// Add breakpoint-specific settings
	breakpoints.forEach(bp => {
		const slidesPerView = attributes[`row-carousel-slides-per-view-${bp}`];
		if (slidesPerView !== undefined) {
			rowBlock.setAttribute(
				`data-carousel-slides-per-view-${bp}`,
				slidesPerView
			);
		}

		const columnGap = attributes[`row-carousel-column-gap-${bp}`];
		if (columnGap !== undefined) {
			rowBlock.setAttribute(`data-carousel-column-gap-${bp}`, columnGap);
		}

		const peekOffset = attributes[`row-carousel-peek-offset-${bp}`];
		if (peekOffset !== undefined) {
			rowBlock.setAttribute(
				`data-carousel-peek-offset-${bp}`,
				peekOffset
			);
		}

		const heightOffset = attributes[`row-carousel-height-offset-${bp}`];
		if (heightOffset !== undefined) {
			rowBlock.setAttribute(
				`data-carousel-height-offset-${bp}`,
				heightOffset
			);
		}

		const loop = attributes[`row-carousel-loop-${bp}`];
		if (loop !== undefined) {
			rowBlock.setAttribute(`data-carousel-loop-${bp}`, loop);
		}

		const autoplay = attributes[`row-carousel-autoplay-${bp}`];
		if (autoplay !== undefined) {
			rowBlock.setAttribute(`data-carousel-autoplay-${bp}`, autoplay);
		}

		const autoplaySpeed = attributes[`row-carousel-autoplay-speed-${bp}`];
		if (autoplaySpeed !== undefined) {
			rowBlock.setAttribute(
				`data-carousel-autoplay-speed-${bp}`,
				autoplaySpeed
			);
		}

		const pauseOnHover = attributes[`row-carousel-pause-on-hover-${bp}`];
		if (pauseOnHover !== undefined) {
			rowBlock.setAttribute(
				`data-carousel-hover-pause-${bp}`,
				pauseOnHover
			);
		}

		const pauseOnInteraction =
			attributes[`row-carousel-pause-on-interaction-${bp}`];
		if (pauseOnInteraction !== undefined) {
			rowBlock.setAttribute(
				`data-carousel-interaction-pause-${bp}`,
				pauseOnInteraction
			);
		}

		const transition = attributes[`row-carousel-transition-${bp}`];
		if (transition !== undefined) {
			rowBlock.setAttribute(`data-carousel-transition-${bp}`, transition);
		}

		const transitionSpeed =
			attributes[`row-carousel-transition-speed-${bp}`];
		if (transitionSpeed !== undefined) {
			rowBlock.setAttribute(
				`data-carousel-transition-speed-${bp}`,
				transitionSpeed
			);
		}

		const alignment = attributes[`row-carousel-alignment-${bp}`];
		if (alignment) {
			rowBlock.setAttribute(`data-carousel-alignment-${bp}`, alignment);
		}
	});

	// Add global carousel configuration
	const triggerWidth = attributes['row-carousel-trigger-width'];
	if (triggerWidth) {
		rowBlock.setAttribute('data-carousel-trigger-width', triggerWidth);
	}

	// Add arrow/dot status (breakpoint-specific)
	// Note: using "carousel" prefix to match getBreakpointSetting() in JavaScript
	breakpoints.forEach(bp => {
		const arrowStatus = attributes[`navigation-arrow-both-status-${bp}`];
		if (arrowStatus !== undefined) {
			rowBlock.setAttribute(
				`data-carousel-arrow-status-${bp}`,
				arrowStatus
			);
		}

		const dotStatus = attributes[`navigation-dot-status-${bp}`];
		if (dotStatus !== undefined) {
			rowBlock.setAttribute(`data-carousel-dot-status-${bp}`, dotStatus);
		}
	});

	// Add arrow/dot icon content for JavaScript to use (with defaults)
	rowBlock.setAttribute(
		'data-arrow-first-icon',
		attributes['navigation-arrow-first-icon-content'] ||
			'<svg class="arrow-left-line-maxi-svg" width="64px" height="64px" viewBox="0 0 24 24" fill="none" data-stroke stroke="#081219" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"><path d="M8.85 19l-7-7 7-7m-7 7h20.3"/></svg>'
	);

	rowBlock.setAttribute(
		'data-arrow-second-icon',
		attributes['navigation-arrow-second-icon-content'] ||
			'<svg class="arrow-right-line-maxi-svg" width="64px" height="64px" viewBox="0 0 24 24" fill="none" data-stroke stroke="#081219" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"><path d="M15.15 5l7 7-7 7m7-7H1.85"/></svg>'
	);

	const dotIconContent =
		attributes['navigation-dot-icon-content'] ||
		'<svg class="circle-2-shape-maxi-svg__3" width="64px" height="64px" viewBox="0 0 36.1 36.1"><circle cx="18" cy="18" r="17.2" data-fill fill="var(--maxi-light-icon-fill,rgba(var(--maxi-light-color-5,0,0,0),1))"/></svg>';

	rowBlock.setAttribute('data-dot-icon', dotIconContent);

	// Active dot uses the same icon as normal dot (styling is different, not the icon)
	rowBlock.setAttribute('data-active-dot-icon', dotIconContent);
};

/**
 * Row Carousel Preview Component
 * Initializes the MaxiRowCarousel script in the editor when preview is enabled
 */
const RowCarouselPreview = ({ clientId, attributes, isPreviewEnabled }) => {
	const carouselInstanceRef = useRef(null);
	const containerRef = useRef(null);
	const attributesRef = useRef(attributes);

	// Update attributes ref when they change
	attributesRef.current = attributes;

	// Get current device type from MaxiBlocks store
	const deviceType = useSelect(select => {
		const maxiStore = select('maxiBlocks');
		return maxiStore?.receiveMaxiDeviceType?.() || 'general';
	}, []);

	// Main effect for mounting/unmounting carousel
	useEffect(() => {
		if (!isPreviewEnabled) {
			// Clean up carousel if preview is disabled
			if (carouselInstanceRef.current) {
				// Call destroy method if it exists
				if (typeof carouselInstanceRef.current.destroy === 'function') {
					carouselInstanceRef.current.destroy();
				}

				carouselInstanceRef.current = null;
			}
			return;
		}

		// Initialize carousel with fade transition
		const initializeCarousel = () => {
			// Helper function to find block in main document or FSE iframe
			const findBlockElement = () => {
				// Try main document first
				let blockElement = document.querySelector(
					`[data-block="${clientId}"]`
				);

				// If not found, check FSE iframe
				if (!blockElement) {
					const fseIframe = document.querySelector(
						'iframe[name="editor-canvas"].edit-site-visual-editor__editor-canvas'
					);
					if (fseIframe?.contentDocument) {
						blockElement = fseIframe.contentDocument.querySelector(
							`[data-block="${clientId}"]`
						);
					}
				}

				return blockElement;
			};

			const blockElement = findBlockElement();

			if (!blockElement) {
				// eslint-disable-next-line no-console
				console.warn(
					'RowCarouselPreview: Block element not found',
					clientId
				);
				return;
			}

			// The blockElement might BE the maxi-row-block or contain it
			const rowBlock = blockElement.classList.contains('maxi-row-block')
				? blockElement
				: blockElement.querySelector('.maxi-row-block');

			if (!rowBlock) {
				// eslint-disable-next-line no-console
				console.warn(
					'RowCarouselPreview: Row block container not found'
				);
				return;
			}

			containerRef.current = rowBlock;

			// Add carousel data attributes to the row block
			addCarouselDataAttributes(rowBlock, attributesRef.current);

			// Get the appropriate window object (main or iframe)
			const targetWindow = rowBlock.ownerDocument.defaultView || window;

			// Check if MaxiRowCarouselEditor class is available
			if (typeof targetWindow.MaxiRowCarouselEditor === 'undefined') {
				// If not available in target window, try to copy from main window
				if (typeof window.MaxiRowCarouselEditor !== 'undefined') {
					targetWindow.MaxiRowCarouselEditor =
						window.MaxiRowCarouselEditor;
				} else {
					// eslint-disable-next-line no-console
					console.warn(
						'RowCarouselPreview: MaxiRowCarouselEditor class not found'
					);
					return;
				}
			}

			// Function to create carousel after cleanup
			const createCarousel = () => {
				try {
					carouselInstanceRef.current =
						new targetWindow.MaxiRowCarouselEditor(rowBlock);

					// Fade back in
					setTimeout(() => {
						rowBlock.style.setProperty('opacity', '1', 'important');
					}, 50);

					// Remove transition after fade in completes
					setTimeout(() => {
						rowBlock.style.removeProperty('transition');
						rowBlock.style.removeProperty('opacity');
					}, 350);
				} catch (error) {
					// Reset opacity on error
					rowBlock.style.removeProperty('transition');
					rowBlock.style.removeProperty('opacity');

					// eslint-disable-next-line no-console
					console.warn(
						'RowCarouselPreview: Error creating carousel instance',
						error
					);
				}
			};

			// If there's an existing instance, fade out before destroying
			if (carouselInstanceRef.current) {
				// Add transition and fade out with !important to override any other styles
				rowBlock.style.setProperty(
					'transition',
					'opacity 0.3s ease-in-out',
					'important'
				);
				rowBlock.style.setProperty('opacity', '0.3', 'important');

				// Wait for fade out, then destroy and recreate
				setTimeout(() => {
					if (
						carouselInstanceRef.current &&
						typeof carouselInstanceRef.current.destroy ===
							'function'
					) {
						carouselInstanceRef.current.destroy();
					}
					carouselInstanceRef.current = null;

					// Create new instance
					createCarousel();
				}, 300);
			} else {
				// No existing instance, just create
				createCarousel();
			}
		};

		// Small delay to ensure DOM is ready
		setTimeout(initializeCarousel, 100);

		// Cleanup on unmount
		// eslint-disable-next-line consistent-return
		return () => {
			if (carouselInstanceRef.current) {
				if (typeof carouselInstanceRef.current.destroy === 'function') {
					carouselInstanceRef.current.destroy();
				}
				carouselInstanceRef.current = null;
			}
		};
	}, [isPreviewEnabled, clientId]);

	// Separate effect to handle attribute updates with fade transition
	useEffect(() => {
		// Only update if carousel is already initialized and preview is enabled
		if (
			!isPreviewEnabled ||
			!carouselInstanceRef.current ||
			!containerRef.current
		) {
			return;
		}

		const rowBlock = containerRef.current;

		// Fade out
		rowBlock.style.setProperty(
			'transition',
			'opacity 0.3s ease-in-out',
			'important'
		);
		rowBlock.style.setProperty('opacity', '0.3', 'important');

		// After fade out, update and fade in
		setTimeout(() => {
			// Update data attributes
			addCarouselDataAttributes(rowBlock, attributesRef.current);

			// Destroy and recreate carousel
			if (typeof carouselInstanceRef.current.destroy === 'function') {
				carouselInstanceRef.current.destroy();
			}

			try {
				carouselInstanceRef.current = new window.MaxiRowCarouselEditor(
					rowBlock
				);

				// Force breakpoint check after recreation (for responsive device type changes)
				if (
					typeof carouselInstanceRef.current.checkBreakpoint ===
					'function'
				) {
					setTimeout(() => {
						carouselInstanceRef.current.checkBreakpoint();
					}, 100);
				}
			} catch (error) {
				// eslint-disable-next-line no-console
				console.warn(
					'RowCarouselPreview: Error recreating carousel',
					error
				);
			}

			// Fade back in
			setTimeout(() => {
				rowBlock.style.setProperty('opacity', '1', 'important');

				// Clean up styles after fade in
				setTimeout(() => {
					rowBlock.style.removeProperty('transition');
					rowBlock.style.removeProperty('opacity');
				}, 300);
			}, 50);
		}, 300);
	}, [attributes, isPreviewEnabled]);

	// Effect to handle device type (breakpoint) changes
	useEffect(() => {
		// Only update if carousel is initialized and preview is enabled
		if (
			!isPreviewEnabled ||
			!carouselInstanceRef.current ||
			!containerRef.current
		) {
			return;
		}

		// Trigger breakpoint check on the carousel
		if (typeof carouselInstanceRef.current.checkBreakpoint === 'function') {
			carouselInstanceRef.current.checkBreakpoint();
		}
	}, [deviceType, isPreviewEnabled]);

	// This component doesn't render anything visible
	return null;
};

export default RowCarouselPreview;
