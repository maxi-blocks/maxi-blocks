/**
 * WordPress dependencies
 */
const { select, dispatch } = wp.data;

/**
 * Internal dependencies
 */
import ResponsiveSelector from '../../editor/responsive-selector';
/**
 * General
 *
 */
const allowedBlocks = [
	'maxi-blocks/block-image-box',
	'maxi-blocks/block-title-extra',
	'maxi-blocks/testimonials-slider-block',
	'maxi-blocks/row-maxi',
	'maxi-blocks/column-maxi',
	'maxi-blocks/button-maxi',
	'maxi-blocks/text-maxi',
	'maxi-blocks/divider-maxi',
	'maxi-blocks/image-maxi',
	'maxi-blocks/section-maxi',
	'maxi-blocks/container-maxi',
	'maxi-blocks/svg-icon-maxi',
	'maxi-blocks/icon-maxi',
];

document.addEventListener('DOMContentLoaded', () => {
	/**
	 * Mutation Observer for:
	 * - Add special classes on Settings Sidebar
	 * - Hide original WP toolbar on selected Maxi Blocks
	 * - Add Maxi responsive toolbar on Preview drop-down menu
	 */
	if (document.getElementsByClassName('edit-post-layout')) {
		const targetNode = document.querySelector('.edit-post-layout');
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
					const blockName = select('core/block-editor').getBlockName(
						select('core/block-editor').getSelectedBlockClientId()
					);
					const editPostSidebarNode = document.querySelector(
						'.edit-post-sidebar'
					);
					const blockEditorBlockInspectorNode = document.querySelector(
						'.block-editor-block-inspector'
					);
					const blockToolbarUniversal = document.querySelector(
						'.block-editor-block-toolbar'
					);
					const blockToolbarEditor = document.querySelector(
						'.block-editor-block-list__block-popover'
					);

					if (!!blockName && allowedBlocks.includes(blockName)) {
						if (editPostSidebarNode)
							editPostSidebarNode.classList.add('maxi-sidebar');
						if (blockEditorBlockInspectorNode)
							blockEditorBlockInspectorNode.classList.add(
								'maxi-controls'
							);
						if (blockToolbarUniversal)
							blockToolbarUniversal.style.display = 'none';
						if (blockToolbarEditor)
							blockToolbarEditor.style.display = 'none';
					} else {
						if (
							!!editPostSidebarNode &&
							editPostSidebarNode.classList.contains(
								'maxi-sidebar'
							)
						)
							editPostSidebarNode.classList.remove(
								'maxi-sidebar'
							);
						if (
							!!blockEditorBlockInspectorNode &&
							blockEditorBlockInspectorNode.classList.contains(
								'maxi-controls'
							)
						)
							blockEditorBlockInspectorNode.classList.remove(
								'maxi-controls'
							);
						if (blockToolbarUniversal)
							blockToolbarUniversal.style.display = null;
						if (blockToolbarEditor)
							blockToolbarEditor.style.display = null;
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
							// Insert responsive toolbar
							const responsiveWrapper = document.createElement(
								'div'
							);
							responsiveWrapper.id =
								'maxi-blocks__responsive-toolbar';

							const menuWrapper = node.querySelector(
								'.components-menu-group'
							).parentElement;

							menuWrapper.appendChild(responsiveWrapper);

							wp.element.render(
								wp.element.createElement(
									ResponsiveSelector,
									{}
								),
								responsiveWrapper
							);

							// Actions on default responsive values
							const responsiveButtons = Array.from(
								node.querySelectorAll(
									'.block-editor-post-preview__button-resize'
								)
							);

							const { setMaxiDeviceType } = dispatch(
								'maxiBlocks'
							);

							responsiveButtons.forEach(button => {
								button.addEventListener('click', e => {
									const { target } = e;
									const value = target.innerText;
									const maxiValue =
										(value === 'Desktop' && 'general') ||
										(value === 'Tablet' && 's') ||
										(value === 'Mobile' && 'xs');

									const editorWrapper = document.querySelector(
										'.edit-post-visual-editor.editor-styles-wrapper'
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

				// Responsive editor
				if (
					mutation.type === 'attributes' &&
					mutation.target.classList.contains(
						'edit-post-visual-editor'
					) &&
					mutation.target.classList.contains('editor-styles-wrapper')
				) {
					const responsiveWidth = mutation.target.getAttribute(
						'maxi-blocks-responsive-width'
					);

					if (
						mutation.target.style.width !== `${responsiveWidth}px`
					) {
						mutation.target.style.width = `${responsiveWidth}px`;
					}
				}
			}
		});
		observer.observe(targetNode, config);
	}
	/**
	 * Hover classes
	 */
	window.addEventListener('mouseover', e => {
		let pathItem = null;
		const hasPath = Array.from(e.path).some((path, i) => {
			if (path && path.classList)
				try {
					if (
						path.classList.contains('maxi-column-block') ||
						path.classList.contains('maxi-container-block')
					) {
						pathItem = i;
						return true;
					}
				} catch (error) {
					pathItem = null;
					return false;
				}

			return false;
		});

		if (hasPath) {
			e.path[pathItem].classList.add('maxi-block--hovered');
			const blockListAppenders = Array.from(
				e.path[pathItem].getElementsByClassName('block-list-appender')
			);
			blockListAppenders[blockListAppenders.length - 1].classList.add(
				'block-list-appender--show'
			);
		}
	});
	window.addEventListener('mouseout', e => {
		let pathItem = null;
		const hasPath = Array.from(e.path).some((path, i) => {
			if (path && path.classList)
				try {
					if (
						path.classList.contains('maxi-column-block') ||
						path.classList.contains('maxi-container-block')
					) {
						pathItem = i;
						return true;
					}
				} catch (error) {
					pathItem = null;
					return false;
				}
			return false;
		});

		if (hasPath) {
			e.path[pathItem].classList.remove('maxi-block--hovered');
			const blockListAppenders = Array.from(
				e.path[pathItem].getElementsByClassName('block-list-appender')
			);
			blockListAppenders[blockListAppenders.length - 1].classList.remove(
				'block-list-appender--show'
			);
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
