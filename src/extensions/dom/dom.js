/**
 * WordPress dependencies
 */
import { select, dispatch, subscribe } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getPageFonts, loadFonts } from '../text/fonts';
import { updateSCOnEditor } from '../style-cards';
import {
	getIsSiteEditor,
	getIsTemplatePart,
	getIsTemplatesListOpened,
	getSiteEditorIframeBody,
} from '../fse';
import getWinBreakpoint from './getWinBreakpoint';
import { setScreenSize } from '../styles';

/**
 * External dependencies
 */
import { isEmpty, isNil } from 'lodash';

/**
 * General
 *
 */
// Adds window.process to fix browserslist error when using
// postcss and autofixer on the controls of style store
window.process = window.process || {};
window.process.env = window.process.env || {};
window.process.env.BROWSERSLIST_DISABLE_CACHE = false;

const allowedBlocks = [
	'maxi-blocks/row-maxi',
	'maxi-blocks/column-maxi',
	'maxi-blocks/button-maxi',
	'maxi-blocks/text-maxi',
	'maxi-blocks/divider-maxi',
	'maxi-blocks/map-maxi',
	'maxi-blocks/image-maxi',
	'maxi-blocks/container-maxi',
	'maxi-blocks/group-maxi',
	'maxi-blocks/number-counter-maxi',
	'maxi-blocks/svg-icon-maxi',
	'maxi-blocks/slider-maxi',
	'maxi-blocks/slide-maxi',
	'maxi-blocks/accordion-maxi',
	'maxi-blocks/pane-maxi',
	'maxi-blocks/video-maxi',
	'maxi-blocks/search-maxi',
];

wp.domReady(() => {
	const observerSubscribe = subscribe(() => {
		const targetNode =
			document.querySelector('.edit-post-layout') ||
			document.querySelector('.edit-site');

		if (targetNode) {
			/**
			 * Mutation Observer for:
			 * - Add special classes on Settings Sidebar
			 * - Hide original WP toolbar on selected Maxi Blocks
			 */
			const config = {
				attributes: true,
				childList: true,
				subtree: true,
			};

			const observer = new MutationObserver(mutationsList => {
				for (const mutation of mutationsList) {
					// Sidebar and Toolbar
					if (
						mutation.type === 'childList' &&
						!!mutation.target.classList
					) {
						const blockNames =
							select(
								'core/block-editor'
							).getMultiSelectedBlocks();

						const selectedBlocks =
							!isEmpty(blockNames) &&
							blockNames.every(item => {
								return item.name === blockNames[0].name;
							});

						const blockName = select(
							'core/block-editor'
						).getBlockName(
							select(
								'core/block-editor'
							).getSelectedBlockClientId()
						);
						const editPostSidebarNode = document.querySelector(
							'.interface-complementary-area'
						);
						const blockEditorBlockInspectorNode =
							document.querySelector(
								'.block-editor-block-inspector'
							);
						const blockToolbarUniversal = document.querySelector(
							'.block-editor-block-toolbar'
						);
						const blockToolbarEditor = document.querySelector(
							'.block-editor-block-list__block-popover'
						);

						if (
							!isEmpty(blockNames) &&
							selectedBlocks &&
							allowedBlocks.includes(blockNames[0].name)
						) {
							if (editPostSidebarNode)
								editPostSidebarNode.classList.add(
									'maxi-sidebar'
								);
							if (blockEditorBlockInspectorNode)
								blockEditorBlockInspectorNode.classList.add(
									'maxi-controls'
								);
						} else {
							if (editPostSidebarNode)
								editPostSidebarNode.classList.remove(
									'maxi-sidebar'
								);
							if (blockEditorBlockInspectorNode)
								blockEditorBlockInspectorNode.classList.remove(
									'maxi-controls'
								);
						}

						if (isEmpty(blockNames)) {
							if (
								!!blockName &&
								allowedBlocks.includes(blockName)
							) {
								if (editPostSidebarNode)
									editPostSidebarNode.classList.add(
										'maxi-sidebar'
									);
								if (blockEditorBlockInspectorNode)
									blockEditorBlockInspectorNode.classList.add(
										'maxi-controls'
									);
								if (blockToolbarUniversal)
									blockToolbarUniversal.style.display =
										'none';
								if (blockToolbarEditor)
									blockToolbarEditor.style.display = 'none';
							} else {
								if (editPostSidebarNode)
									editPostSidebarNode.classList.remove(
										'maxi-sidebar'
									);
								if (blockEditorBlockInspectorNode)
									blockEditorBlockInspectorNode.classList.remove(
										'maxi-controls'
									);
								if (blockToolbarUniversal)
									blockToolbarUniversal.style.display = null;
								if (blockToolbarEditor)
									blockToolbarEditor.style.display = null;
							}
						}

						const editorWrapper =
							document.querySelector(
								'.edit-post-visual-editor'
							) ||
							document.querySelector('.edit-site-visual-editor');

						[editorWrapper, getSiteEditorIframeBody()].forEach(
							wrapper => {
								if (
									wrapper &&
									!wrapper
										.getAttributeNames()
										.includes('maxi-blocks-responsive')
								) {
									const { receiveBaseBreakpoint } =
										select('maxiBlocks');

									const baseBreakpoint =
										receiveBaseBreakpoint();

									wrapper.setAttribute(
										'maxi-blocks-responsive',
										baseBreakpoint
									);
								}
							}
						);
					}

					if (
						mutation.type === 'attributes' &&
						mutation.target.classList.contains(
							'edit-post-visual-editor'
						) &&
						mutation.target.classList.contains(
							'editor-styles-wrapper'
						)
					) {
						// Responsive editor
						const responsiveWidth = mutation.target.getAttribute(
							'maxi-blocks-responsive-width'
						);
						const isMaxiPreview =
							mutation.target.getAttribute('is-maxi-preview');
						const breakpoint = mutation.target.getAttribute(
							'maxi-blocks-responsive'
						);

						if (!isMaxiPreview) {
							mutation.target.style = null;
						} else if (['s', 'xs'].includes(breakpoint)) {
							mutation.target.style.width = 'fit-content';
						} else if (
							mutation.target.style.width !==
							`${responsiveWidth}px`
						) {
							mutation.target.style.width = `${responsiveWidth}px`;
						}
					}

					// Responsive iframe
					if (
						mutation.type === 'attributes' &&
						(mutation.target.classList.contains(
							'is-tablet-preview'
						) ||
							mutation.target.classList.contains(
								'is-mobile-preview'
							))
					) {
						const iframe = mutation.target.querySelector(
							'iframe[name="editor-canvas"]'
						);
						const iframeDocument = iframe.contentDocument;
						const editorWrapper = iframeDocument.body;

						const postEditor = mutation.target.closest(
							'.edit-post-visual-editor'
						);
						const responsiveWidth = postEditor.getAttribute(
							'maxi-blocks-responsive-width'
						);
						const isMaxiPreview =
							postEditor.getAttribute('is-maxi-preview');

						if (isMaxiPreview) {
							mutation.target.style.width = `${responsiveWidth}px`;
							mutation.target.style.boxSizing = 'content-box';
						}

						if (editorWrapper) {
							editorWrapper.setAttribute(
								'maxi-blocks-responsive',
								mutation.target.classList.contains(
									'is-tablet-preview'
								)
									? 's'
									: 'xs'
							);

							if (
								iframe &&
								!iframeDocument.body.classList.contains(
									'maxi-blocks--active'
								)
							) {
								// Iframe needs Maxi classes and attributes
								iframeDocument.body.classList.add(
									'maxi-blocks--active'
								);

								editorWrapper.setAttribute(
									'maxi-blocks-responsive',
									mutation.target.classList.contains(
										'is-tablet-preview'
									)
										? 's'
										: 'xs'
								);

								// Hides scrollbar in firefox
								iframeDocument.documentElement.style.scrollbarWidth =
									'none';

								// Copy all fonts to iframe
								loadFonts(
									getPageFonts(true),
									true,
									iframeDocument
								);

								// Get all Maxi blocks <style> from <head>
								// and move to new iframe
								const maxiStyles = Array.from(
									document.querySelectorAll(
										'div.maxi-blocks__styles'
									)
								);

								if (!isEmpty(maxiStyles))
									maxiStyles.forEach(rawMaxiStyle => {
										const maxiStyle =
											rawMaxiStyle.cloneNode(true);
										const { id } = maxiStyle;

										iframeDocument
											.querySelector(`#${id}`)
											?.remove();

										maxiStyle.children[0].innerText =
											maxiStyle.children[0].innerText.replaceAll(
												' .edit-post-visual-editor',
												'.editor-styles-wrapper'
											);

										iframe.contentDocument.head.appendChild(
											maxiStyle
										);
									});

								// Move Maxi variables to iframe
								const maxiVariables = document
									.querySelector(
										'#maxi-blocks-sc-vars-inline-css'
									)
									?.cloneNode(true);

								if (maxiVariables) {
									iframeDocument
										.querySelector(
											'#maxi-blocks-sc-vars-inline-css'
										)
										?.remove();

									iframe.contentDocument.head.appendChild(
										maxiVariables
									);
								}

								// Ensures all Maxi styles are loaded on iframe
								const editStyles = iframeDocument.querySelector(
									'#maxi-blocks-block-editor-css'
								);
								const frontStyles =
									iframeDocument.querySelector(
										'#maxi-blocks-block-css'
									);

								if (!editStyles) {
									const rawEditStyles =
										document.querySelector(
											'#maxi-blocks-block-editor-css'
										);

									iframe.contentDocument.head.appendChild(
										rawEditStyles.cloneNode(true)
									);
								}

								if (!frontStyles) {
									const rawFrontStyles =
										document.querySelector(
											'#maxi-blocks-block-css'
										);

									iframe.contentDocument.head.appendChild(
										rawFrontStyles.cloneNode(true)
									);
								}
							}
						}
					}
					// Responsive toolbar
					if (
						mutation.type === 'attributes' &&
						mutation.target.classList.contains(
							'block-editor-post-preview__button-toggle'
						)
					) {
						if (mutation.target.getAttribute('aria-expanded')) {
							const node = document.querySelector(
								'.block-editor-post-preview__dropdown-content'
							);
							const repeatedNode = document.querySelector(
								'#maxi-blocks__responsive-toolbar'
							);

							if (node && !repeatedNode) {
								// Actions on default responsive values
								const responsiveButtons = Array.from(
									node.querySelectorAll(
										'.block-editor-post-preview__button-resize'
									)
								);

								const { setMaxiDeviceType } =
									dispatch('maxiBlocks');

								responsiveButtons.forEach(button => {
									button.addEventListener('click', e => {
										const { target } = e;
										const value = target.innerText;
										const maxiValue =
											(value === 'Desktop' &&
												'general') ||
											(value === 'Tablet' && 's') ||
											(value === 'Mobile' && 'xs');

										const editorWrapper =
											document.querySelector(
												'.edit-post-visual-editor'
											) ||
											document.querySelector(
												'.edit-site-visual-editor'
											);

										editorWrapper.setAttribute(
											'maxi-blocks-responsive',
											maxiValue
										);
										editorWrapper.removeAttribute(
											'maxi-blocks-responsive-width'
										);

										if (value === 'Desktop')
											editorWrapper.style.width = '';

										setMaxiDeviceType({
											deviceType: maxiValue,
											isGutenbergButton: true,
										});
									});
								});
							}
						}
					}
				}
			});
			observer.observe(targetNode, config);

			// Dismantling the bomb
			observerSubscribe();
		}
	});

	const changeHandlesDisplay = (display, wrapper) =>
		Array.from(
			wrapper.querySelectorAll('.resizable-editor__drag-handle')
		).forEach(handle => {
			handle.style.display = display;
		});

	const changeSiteEditorWidth = (width = '') => {
		document.querySelector('.edit-site-visual-editor').style.width = width;
	};

	const templatePartResizeObserver = new ResizeObserver(entries => {
		if (getIsTemplatesListOpened()) return;

		setTimeout(() => {
			const editorWrapper = entries[0].target;
			if (!editorWrapper) return;

			editorWrapper.style.maxWidth = 'initial';
			const { width } = editorWrapper.getBoundingClientRect();

			const { setMaxiDeviceType } = dispatch('maxiBlocks');
			setMaxiDeviceType({
				width,
				changeSize: false,
			});

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

	const resizeObserverSelector = '.interface-interface-skeleton__content';

	const resizeObserver = new ResizeObserver(() => {
		const resizeObserverTarget = document.querySelector(
			resizeObserverSelector
		);
		if (resizeObserverTarget) {
			const { width, height } = document
				.querySelector(resizeObserverSelector)
				.getBoundingClientRect();
			dispatch('maxiBlocks').setEditorContentSize({ width, height });
		}

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

	const isSiteEditor = getIsSiteEditor();

	let isNewEditorContentObserver = true;
	let isNewObserver = true;
	let isSCLoaded = false;
	let type = null;

	const editorContentUnsubscribe = subscribe(() => {
		const resizeObserverTarget = document.querySelector(
			resizeObserverSelector
		);
		if (!resizeObserverTarget) {
			isNewEditorContentObserver = true;
		}

		if (isSiteEditor) {
			const currentType = select('core/edit-site').getEditedPostType();
			const isTemplatesListOpened = getIsTemplatesListOpened();
			const siteEditorIframeBody = getSiteEditorIframeBody();

			if (
				!isTemplatesListOpened &&
				isNewEditorContentObserver &&
				siteEditorIframeBody
			) {
				setTimeout(() => {
					dispatch('maxiBlocks').setMaxiDeviceType({
						deviceType: 'general',
					});
				}, 150);

				isNewEditorContentObserver = false;
				resizeObserver.observe(resizeObserverTarget);
			} else if (
				(isTemplatesListOpened || type !== currentType) &&
				!isNewEditorContentObserver
			) {
				isNewEditorContentObserver = true;
				resizeObserver.disconnect();
			}

			// Need to add 'maxi-blocks--active' class to the FSE iframe body
			// because gutenberg is filtering the iframe classList
			// https://github.com/WordPress/gutenberg/blob/trunk/packages/block-editor/src/components/iframe/index.js#L213-L220
			if (
				siteEditorIframeBody &&
				!siteEditorIframeBody.classList.contains('maxi-blocks--active')
			)
				siteEditorIframeBody.classList.add('maxi-blocks--active');

			if (
				(getIsTemplatesListOpened() || type !== currentType) &&
				isSCLoaded
			)
				isSCLoaded = false;

			// Adding the SC styles after switching between the templates
			if (siteEditorIframeBody && !isSCLoaded) {
				setTimeout(() => {
					const SC = select(
						'maxiBlocks/style-cards'
					).receiveMaxiActiveStyleCard();
					if (SC) {
						updateSCOnEditor(SC.value);
						isSCLoaded = true;
					}
				}, 150);
			}

			if (getIsTemplatePart()) {
				const resizableBox = document.querySelector(
					'.components-resizable-box__container'
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
					(isTemplatesListOpened || type !== currentType) &&
					!isNewObserver
				) {
					isNewObserver = true;
					templatePartResizeObserver.disconnect();
				}
			}

			type = currentType;
		} else {
			if (!resizeObserverTarget) return;

			[resizeObserverTarget, document.body].forEach(
				element => element && resizeObserver.observe(element)
			);

			editorContentUnsubscribe();
		}
	});
});
