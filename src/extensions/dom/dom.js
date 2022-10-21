/**
 * WordPress dependencies
 */
import { select, dispatch, subscribe } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getPageFonts, loadFonts } from '../text/fonts';
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
	'maxi-blocks/accordion-maxi',
	'maxi-blocks/pane-maxi',
	'maxi-blocks/video-maxi',
	'maxi-blocks/search-maxi',
];

wp.domReady(() => {
	const observerSubscribe = subscribe(() => {
		const targetNode = document.querySelector('.edit-post-layout');

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
						const editPostSidebarNode =
							document.querySelector('.edit-post-sidebar');
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
								'.edit-post-post-preview-dropdown'
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

	const editorContentUnsubscribe = subscribe(() => {
		const targetNode = document.querySelector(
			'.interface-interface-skeleton__content'
		);

		if (targetNode) {
			const { setEditorContentSize } = dispatch('maxiBlocks');

			const resizeObserver = new ResizeObserver(() => {
				const { width, height } = targetNode.getBoundingClientRect();
				setEditorContentSize({ width, height });

				// On changing the canvas editor size, we must update the winBreakpoint
				// to add the necessary attributes to display styles. The observer can't
				// rely on the next element cause it disappears when selecting 's' or 'xs'
				// due to the appearance of the iframe.
				const editorWrapper = document.querySelector(
					'.editor-styles-wrapper'
				);

				if (editorWrapper) {
					const { width: winWidth } =
						editorWrapper.getBoundingClientRect();

					const deviceType = getWinBreakpoint(winWidth);
					const baseWinBreakpoint =
						select('maxiBlocks').receiveBaseBreakpoint();

					if (
						deviceType === baseWinBreakpoint ||
						isNil(baseWinBreakpoint)
					)
						setScreenSize('general', false);
					else if (!['xs', 's'].includes(deviceType))
						setScreenSize(deviceType, false);
				}
			});

			[targetNode, document.body].forEach(element =>
				resizeObserver.observe(element)
			);

			editorContentUnsubscribe();
		}
	});
});
