/**
 * WordPress dependencies
 */
import { select, dispatch, subscribe } from '@wordpress/data';

/**
 * Internal dependencies
 */
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
import { isNil } from 'lodash';
import getEditorWrapper from './getEditorWrapper';

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
					'.edit-site-visual-editor .components-resizable-box__container'
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

			// Block margin value
			const rawWrapper = getEditorWrapper();
			const editorWrapper = rawWrapper?.contentDocument ?? rawWrapper;
			const blockContainer =
				editorWrapper?.querySelector('.is-root-container');

			if (blockContainer) blockMarginObserver.observe(blockContainer);

			editorContentUnsubscribe();
		}
	});
});
