/**
 * WordPress dependencies
 */
import { select, dispatch, subscribe } from '@wordpress/data';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * General
 *
 */
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
];

wp.domReady(() => {
	// Window size
	const setWindowSize = e => {
		const { innerWidth: width, innerHeight: height } = e.target;

		dispatch('maxiBlocks').setWindowSize({ width, height });
	};

	setWindowSize({ target: window });

	// eslint-disable-next-line @wordpress/no-global-event-listener
	window.addEventListener('resize', e => setWindowSize(e));

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

					// Responsive editor
					if (
						mutation.type === 'attributes' &&
						mutation.target.classList.contains(
							'edit-post-visual-editor'
						) &&
						mutation.target.classList.contains(
							'editor-styles-wrapper'
						)
					) {
						const responsiveWidth = mutation.target.getAttribute(
							'maxi-blocks-responsive-width'
						);

						if (
							mutation.target.style.width !==
							`${responsiveWidth}px`
						) {
							mutation.target.style.width = `${responsiveWidth}px`;
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

										setMaxiDeviceType(maxiValue);
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
});

const openSidebar = item => {
	const sidebar = document.querySelector('.maxi-sidebar');
	const wrapperElement = document.querySelector(
		`.maxi-accordion-control__item[data-name="${item}"]`
	);
	const button = wrapperElement.querySelector(
		'.maxi-accordion-control__item__button'
	);
	const content = wrapperElement.querySelector(
		'.maxi-accordion-control__item__panel'
	);

	Array.from(
		document.getElementsByClassName('maxi-accordion-control__item__button')
	).forEach(el => {
		if (el.getAttribute('aria-expanded'))
			el.setAttribute('aria-expanded', false);
	});
	Array.from(
		document.getElementsByClassName('maxi-accordion-control__item__panel')
	).forEach(el => {
		if (!el.getAttribute('hidden')) el.setAttribute('hidden', '');
	});

	button.setAttribute('aria-expanded', true);
	content.removeAttribute('hidden');

	sidebar.scroll({
		top: wrapperElement.getBoundingClientRect().top,
		behavior: 'smooth',
	});
};
export default openSidebar;
