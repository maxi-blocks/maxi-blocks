/**
 * WordPress dependencies
 */
import { select, dispatch, subscribe, resolveSelect } from '@wordpress/data';
// TODO: https://github.com/maxi-blocks/maxi-blocks/issues/5806
// import { setDefaultBlockName } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { updateSCOnEditor } from '@extensions/style-cards';
import {
	getIsSiteEditor,
	getIsTemplatePart,
	getIsTemplatesListOpened,
	getSiteEditorIframeBody,
	getSiteEditorIframe,
} from '@extensions/fse';
import getWinBreakpoint from './getWinBreakpoint';
import initHighlightHiddenBlocks from './highlightHiddenBlocks';
import getEditorWrapper from './getEditorWrapper';
import { setScreenSize } from '@extensions/styles';
import { authConnect, getMaxiCookieKey } from '@editor/auth';
import {
	showHideHamburgerNavigation,
	removeNavigationHoverUnderline,
} from '@editor/style-cards/utils';
// TODO: https://github.com/maxi-blocks/maxi-blocks/issues/5806
// import isPostEditor from './isPostEditor';
import './disableDragging'; // Disable WordPress 6.8 default dragging for Maxi blocks

/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * General
 *
 */
// Adds window.process to fix browserslist error when using
// postcss and autofixer on the controls of style store
window.process = window.process || {};
window.process.env = window.process.env || {};
window.process.env.BROWSERSLIST_DISABLE_CACHE = false;

wp.domReady(() => {
	const getScrollbarWidth = () => {
		// Create a temporary div
		const outer = document.createElement('div');
		outer.style.visibility = 'hidden';
		outer.style.overflow = 'scroll';
		outer.style.msOverflowStyle = 'scrollbar';
		document.body.appendChild(outer);

		// Create an inner div
		const inner = document.createElement('div');
		outer.appendChild(inner);

		// Calculate the width difference
		const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

		// Remove the temporary elements
		outer.parentNode.removeChild(outer);

		return scrollbarWidth;
	};

	const updateScrollbarWidth = () => {
		document.documentElement.style.setProperty(
			'--maxi-blocks-scrollbar-width',
			`${getScrollbarWidth()}px`
		);
	};

	// Initial set of scrollbar width
	updateScrollbarWidth();

	// Initialize List View highlight for hidden Maxi blocks
	const cleanupHighlightHiddenBlocks = initHighlightHiddenBlocks();

	const changeHandlesDisplay = (display, wrapper) =>
		Array.from(
			wrapper.querySelectorAll('.resizable-editor__drag-handle')
		).forEach(handle => {
			handle.style.display = display;
		});

	const changeSiteEditorWidth = (width = '') => {
		const editSiteVisualEditor = document.querySelector(
			'.edit-site-visual-editor'
		);
		if (editSiteVisualEditor) {
			editSiteVisualEditor.style.width = width;
		}

		const editorVisualEditor = document.querySelector(
			'.editor-visual-editor'
		);
		if (editorVisualEditor) {
			editorVisualEditor.style.width = width || '';
		}
	};

	const templatePartResizeObserver = new ResizeObserver(entries => {
		if (getIsTemplatesListOpened()) return;

		setTimeout(() => {
			const editorWrapper = entries[0].target;
			if (!editorWrapper) return;

			editorWrapper.style.maxWidth = 'initial';
			const { width } = editorWrapper.getBoundingClientRect();

			const { setMaxiDeviceType } = dispatch('maxiBlocks');
			const responsiveMenu = document.querySelector(
				'.components-dropdown-menu__menu .components-menu-items-choice'
			);

			if (!responsiveMenu) {
				setMaxiDeviceType({
					width,
					changeSize: false,
				});
			}

			const { receiveMaxiDeviceType, receiveBaseBreakpoint } =
				select('maxiBlocks');
			const deviceType = receiveMaxiDeviceType();
			const baseBreakpoint = receiveBaseBreakpoint();

			const breakpoints = ['xxl', 'xl', 'l', 'm', 's', 'xs'];

			// Hiding handles if current breakpoint smaller than baseBreakpoint,
			// because resizing is broken in this case
			if (
				baseBreakpoint &&
				deviceType &&
				deviceType !== 'general' &&
				breakpoints.indexOf(baseBreakpoint) >
					breakpoints.indexOf(deviceType)
			) {
				changeSiteEditorWidth('fit-content');
				changeHandlesDisplay('none', editorWrapper);
			} else {
				changeSiteEditorWidth();
				changeHandlesDisplay('inline-block', editorWrapper);
			}
		}, 150);
	});

	const resizeObserverSelector = '.interface-interface-skeleton__body';

	const setBaseBreakpoint = () => {
		const resizeObserverTarget = document.querySelector(
			resizeObserverSelector
		);
		if (resizeObserverTarget) {
			const { width, height } = document
				.querySelector(resizeObserverSelector)
				.getBoundingClientRect();
			dispatch('maxiBlocks').setEditorContentSize({ width, height });
		}
	};

	const resizeObserver = new ResizeObserver(() => {
		setBaseBreakpoint();

		// Update scrollbar width on resize
		updateScrollbarWidth();

		// On changing the canvas editor size, we must update the winBreakpoint
		// to add the necessary attributes to display styles. The observer can't
		// rely on the next element cause it disappears when selecting 's' or 'xs'
		// due to the appearance of the iframe.
		const editorWrapper = document.querySelector('.editor-styles-wrapper');

		if (editorWrapper) {
			const { width: winWidth } = editorWrapper.getBoundingClientRect();

			const deviceType = getWinBreakpoint(winWidth);
			const baseWinBreakpoint =
				select('maxiBlocks').receiveBaseBreakpoint();

			if (deviceType === baseWinBreakpoint || isNil(baseWinBreakpoint))
				setScreenSize('general', false);
			else if (!['xs', 's'].includes(deviceType))
				setScreenSize(deviceType, false);
		}
	});

	/**
	 * Block margin css
	 * Some themes contain a margin on each block that centers it in the editor.
	 * As Maxi removes that margin, we need to add it back to the block in order
	 * to keep a good UX.
	 */
	const blockMarginObserver = new ResizeObserver(() => {
		const rawWrapper = getEditorWrapper();
		const editorWrapper = rawWrapper?.contentDocument ?? rawWrapper;
		const blockContainer =
			editorWrapper?.querySelector('.is-root-container');

		if (!blockContainer) return;

		const editorWidth = editorWrapper?.offsetWidth ?? null;

		const fullWidthElement = document.createElement('div');
		fullWidthElement.style.minWidth = '100%';
		blockContainer.appendChild(fullWidthElement);
		const fullWidthElementWidth = fullWidthElement.offsetWidth;
		blockContainer.removeChild(fullWidthElement);

		const blockMargin = (editorWidth - fullWidthElementWidth) / 2;

		dispatch('maxiBlocks/styles').saveBlockMarginValue(blockMargin);
	});

	const isSiteEditor = getIsSiteEditor();

	let isNewEditorContentObserver = true;
	let isNewObserver = true;
	let isSCLoaded = false;
	let id = null;

	const editorContentUnsubscribe = subscribe(() => {
		const resizeObserverTarget = document.querySelector(
			resizeObserverSelector
		);
		if (!resizeObserverTarget) {
			isNewEditorContentObserver = true;
		}

		if (isSiteEditor) {
			const currentId = select('core/edit-site').getEditedPostId();
			const isTemplatesListOpened = getIsTemplatesListOpened();
			const siteEditorIframeBody = getSiteEditorIframeBody();

			if (
				!isTemplatesListOpened &&
				isNewEditorContentObserver &&
				siteEditorIframeBody
			) {
				if (!getIsTemplatePart())
					setTimeout(() => {
						dispatch('maxiBlocks').setMaxiDeviceType({
							deviceType: 'general',
						});
					}, 150);

				isNewEditorContentObserver = false;
				resizeObserver.observe(resizeObserverTarget);
				setBaseBreakpoint();
			} else if (
				(isTemplatesListOpened || id !== currentId) &&
				!isNewEditorContentObserver
			) {
				isNewEditorContentObserver = true;
				resizeObserver.disconnect();
				// Do not cleanup highlight here; editor is switching templates, not tearing down
			}

			// Need to add 'maxi-blocks--active' class to the FSE iframe body
			// because gutenberg is filtering the iframe classList
			// https://github.com/WordPress/gutenberg/blob/trunk/packages/block-editor/src/components/iframe/index.js#L213-L220
			if (siteEditorIframeBody) {
				// Add 'maxi-blocks--active' class if not already present
				if (
					!siteEditorIframeBody.classList.contains(
						'maxi-blocks--active'
					)
				) {
					siteEditorIframeBody.classList.add('maxi-blocks--active');
				}

				// Get the 'branch-' class from the page's body
				const branchClass =
					document.body.className.match(/\bbranch-\S+/);

				if (
					branchClass &&
					!siteEditorIframeBody.classList.contains(branchClass[0])
				) {
					// Add the 'branch-' class to siteEditorIframeBody.classList
					siteEditorIframeBody.classList.add(branchClass[0]);
				}
			}
			if ((getIsTemplatesListOpened() || id !== currentId) && isSCLoaded)
				isSCLoaded = false;

			// Adding the SC styles after switching between the templates
			if (siteEditorIframeBody && !isSCLoaded) {
				isSCLoaded = true;
				setTimeout(() => {
					const SC = select(
						'maxiBlocks/style-cards'
					).receiveMaxiActiveStyleCard();
					if (SC) {
						updateSCOnEditor(SC.value);
					} else {
						isSCLoaded = false;
					}
				}, 150);
			}

			if (getIsTemplatePart()) {
				const resizableBox =
					document.querySelector(
						'.edit-site-visual-editor .components-resizable-box__container'
					) ||
					document.querySelector(
						'.editor-visual-editor .components-resizable-box__container'
					);
				const isTemplatesListOpened = getIsTemplatesListOpened();

				if (
					!isTemplatesListOpened &&
					isNewObserver &&
					getSiteEditorIframeBody() &&
					resizableBox
				) {
					isNewObserver = false;
					templatePartResizeObserver.observe(resizableBox);
				} else if (
					(isTemplatesListOpened || id !== currentId) &&
					!isNewObserver
				) {
					isNewObserver = true;
					templatePartResizeObserver.disconnect();
				}
			}

			id = currentId;
		} else {
			if (!resizeObserverTarget) return;

			[resizeObserverTarget, document.body].forEach(
				element => element && resizeObserver.observe(element)
			);

			// Block margin value
			const rawWrapper = getEditorWrapper();
			const editorWrapper = rawWrapper?.contentDocument ?? rawWrapper;
			const blockContainer =
				editorWrapper?.querySelector('.is-root-container');

			if (blockContainer) blockMarginObserver.observe(blockContainer);

			editorContentUnsubscribe();
			// Keep highlight active during normal editor lifecycle
		}
	});

	// Also cleanup on window unload/navigation just in case
	window.addEventListener('beforeunload', () => {
		if (typeof cleanupHighlightHiddenBlocks === 'function')
			cleanupHighlightHiddenBlocks();
	});

	// authentication for maxi pro
	const maxiCookie = getMaxiCookieKey();

	if (maxiCookie) {
		const { receiveMaxiProStatus } = resolveSelect('maxiBlocks/pro');
		const { email } = maxiCookie;
		receiveMaxiProStatus().then(data => {
			if (typeof data === 'string') {
				const dataObj = JSON.parse(data);
				if (dataObj?.status === 'no') authConnect();
				else authConnect(false, email);
			}
		});
	}

	const hideMaxiReusableBlocksPreview = () => {
		const observer = new MutationObserver(mutationsList => {
			for (const mutation of mutationsList) {
				if (mutation.addedNodes.length > 0) {
					const preview = document.querySelector(
						'.block-editor-inserter__preview-container'
					);
					if (preview) {
						preview.style.display = 'none'; // Hide the preview
					}
				}
			}
		});

		observer.observe(document.body, { childList: true, subtree: true });
	};

	const waitForBlockTypeItems = () => {
		return new Promise(resolve => {
			const observer = new MutationObserver(mutationsList => {
				for (const mutation of mutationsList) {
					if (mutation.addedNodes.length > 0) {
						const blockTypeItems = document.querySelectorAll(
							'.block-editor-block-types-list__list-item.is-synced'
						);
						if (blockTypeItems.length > 0) {
							observer.disconnect();
							resolve(blockTypeItems);
						}
					}
				}
			});

			observer.observe(document.body, { childList: true, subtree: true });
		});
	};

	waitForBlockTypeItems().then(blockTypeItems => {
		blockTypeItems.forEach(item => {
			item.addEventListener('mouseenter', hideMaxiReusableBlocksPreview);
			item.addEventListener('touchstart', hideMaxiReusableBlocksPreview);
		});
	});

	const getDocumentContext = () => {
		return new Promise(resolve => {
			if (getIsSiteEditor()) {
				const waitForIframe = () => {
					const iframe = getSiteEditorIframe(); // Adjust this line to however you can get the iframe element itself
					if (iframe) {
						if (
							iframe.contentDocument &&
							iframe.contentDocument.body
						) {
							// If the iframe is already loaded, resolve immediately
							resolve(iframe.contentDocument);
						} else {
							// Wait for the iframe to load
							iframe.addEventListener('load', () => {
								resolve(iframe.contentDocument.body);
							});
						}
					} else {
						setTimeout(waitForIframe, 100); // Check for iframe every 100ms
					}
				};
				waitForIframe();
			} else {
				resolve(document);
			}
		});
	};

	const waitForMenuBlocks = () => {
		return new Promise(resolve => {
			getDocumentContext().then(docContext => {
				const observer = new MutationObserver(mutationsList => {
					for (const mutation of mutationsList) {
						if (mutation.addedNodes.length > 0) {
							const hamburgerNavigation =
								docContext.querySelector(
									'.maxi-container-block .wp-block-navigation__responsive-container-open'
								);
							const menuNavigation = docContext.querySelector(
								'.maxi-container-block .wp-block-navigation__responsive-container'
							);

							if (hamburgerNavigation || menuNavigation) {
								const grandparentElement = hamburgerNavigation
									? hamburgerNavigation.closest(
											'.maxi-container-block'
									  )
									: null;
								const grandparentClasses = grandparentElement
									? grandparentElement.classList
									: [];
								let blockStyle = '';

								if (grandparentClasses.contains('maxi-light')) {
									blockStyle = 'light';
								} else if (
									grandparentClasses.contains('maxi-dark')
								) {
									blockStyle = 'dark';
								}
								observer.disconnect();
								resolve([
									hamburgerNavigation,
									menuNavigation,
									blockStyle,
								]);
							}
						}
					}
				});

				observer.observe(docContext, {
					childList: true,
					subtree: true,
				});
			});
		});
	};

	waitForMenuBlocks().then(response => {
		const activeSC = select(
			'maxiBlocks/style-cards'
		).receiveMaxiActiveStyleCard();
		const blockStyle = response[2];
		let overwriteMobile = false;
		let alwaysShowMobile = false;
		let removeUnderlineHover = false;
		let showMobileFrom = 767;
		if (blockStyle !== '') {
			overwriteMobile =
				activeSC?.value?.[blockStyle]?.styleCard?.navigation?.[
					'overwrite-mobile'
				] || false;
			alwaysShowMobile =
				activeSC?.value?.[blockStyle]?.styleCard?.navigation?.[
					'always-show-mobile'
				] || false;
			if (overwriteMobile && alwaysShowMobile) {
				showHideHamburgerNavigation('show');
			} else if (overwriteMobile && !alwaysShowMobile) {
				showMobileFrom =
					activeSC?.value?.[blockStyle]?.styleCard?.navigation?.[
						'show-mobile-down-from'
					];
				showHideHamburgerNavigation(showMobileFrom);
			} else {
				showHideHamburgerNavigation('hide');
			}
			removeUnderlineHover =
				activeSC?.value?.[blockStyle]?.styleCard?.navigation?.[
					'remove-hover-underline'
				] || false;

			removeNavigationHoverUnderline(removeUnderlineHover);
		}
	});

	// TODO: https://github.com/maxi-blocks/maxi-blocks/issues/5806
	// setTimeout(() => {
	// 	if (isPostEditor()) {
	// 		setDefaultBlockName('maxi-blocks/text-maxi');
	// 	} else {
	// 		setDefaultBlockName('maxi-blocks/container-maxi');
	// 	}
	// }, 100);
});
