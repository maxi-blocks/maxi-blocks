/**
 * WordPress dependencies
 */
import { select, dispatch, subscribe, resolveSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

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
import getEditorWrapper from './getEditorWrapper';
import { setScreenSize } from '../styles';
import { authConnect, getMaxiCookieKey } from '../../editor/auth';

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
			}

			// Need to add 'maxi-blocks--active' class to the FSE iframe body
			// because gutenberg is filtering the iframe classList
			// https://github.com/WordPress/gutenberg/blob/trunk/packages/block-editor/src/components/iframe/index.js#L213-L220
			if (
				siteEditorIframeBody &&
				!siteEditorIframeBody.classList.contains('maxi-blocks--active')
			)
				siteEditorIframeBody.classList.add('maxi-blocks--active');

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
		}
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
	let shouldSCMigratorRun = true;

	const unsubscribe = subscribe(async () => {
		if (!shouldSCMigratorRun) {
			return;
		}

		shouldSCMigratorRun = false;

		const { receiveMaxiActiveStyleCard, receiveMaxiStyleCards } = select(
			'maxiBlocks/style-cards'
		);

		const styleCard = receiveMaxiActiveStyleCard();
		const styleCards = receiveMaxiStyleCards();

		if (styleCard && styleCards) {
			const { saveSCStyles, saveMaxiStyleCards } = dispatch(
				'maxiBlocks/style-cards'
			);

			if (!('gutenberg_blocks_status' in styleCard.value)) {
				const newStyleCards = {
					...styleCards,
					[styleCard.key]: {
						...styleCard.value,
						gutenberg_blocks_status: true,
					},
				};
				await saveMaxiStyleCards(newStyleCards, true);
				updateSCOnEditor(newStyleCards[styleCard.key]);

				// eslint-disable-next-line no-console
				console.log(
					'Style Cards gutenberg_blocks_status has been set to default.'
				);
			}

			const SCStyles = await apiFetch({
				path: '/maxi-blocks/v1.0/style-card/',
				method: 'GET',
			});

			if (SCStyles && styleCard?.value?.gutenberg_blocks_status) {
				if (
					[
						'_maxi_blocks_style_card_styles',
						'_maxi_blocks_style_card_styles_preview',
					].some(
						key =>
							!SCStyles[key]?.includes('maxi-block--use-sc') ||
							!SCStyles[key].includes(
								'.comment-reply-title small a'
							)
					)
				) {
					await saveSCStyles(true);

					// eslint-disable-next-line no-console
					console.log(
						'Style Cards migrator has been successfully used to update the styles.'
					);
				}
			}

			unsubscribe();
		}

		shouldSCMigratorRun = true;
	});

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
});
