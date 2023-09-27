/**
 * WordPress dependencies
 */
import { select, dispatch, subscribe, resolveSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import {
	getIsSiteEditor as originalGetIsSiteEditor,
	getIsTemplatePart,
	getIsTemplatesListOpened as originalGetIsTemplatesListOpened,
	getSiteEditorIframeBody,
} from '../fse';
import getWinBreakpoint from './getWinBreakpoint';
import { default as originalGetEditorWrapper } from './getEditorWrapper';
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
// postcss and auto fixer on the controls of style store
window.process = window.process || {};
window.process.env = window.process.env || {};
window.process.env.BROWSERSLIST_DISABLE_CACHE = false;

/**
 * Cache
 */
const cache = {
	siteEditor: null,
	editorWrapper: null,
	resizeObserverTarget: null,
	blockContainer: null,
	isSiteEditor: null,
	isTemplatesListOpened: null,
	breakpoints: ['xxl', 'xl', 'l', 'm', 's', 'xs'],
};

/**
 * Caching functions
 */
const getSiteEditor = () => {
	if (!cache.siteEditor) {
		cache.siteEditor = document.querySelector('.edit-site-visual-editor');
	}
	return cache.siteEditor;
};

const getEditorWrapper = () => {
	if (!cache.editorWrapper) {
		cache.editorWrapper = originalGetEditorWrapper();
	}
	return cache.editorWrapper;
};

const getIsSiteEditor = () => {
	if (cache.isSiteEditor === null) {
		cache.isSiteEditor = originalGetIsSiteEditor();
	}
	return cache.isSiteEditor;
};

const getIsTemplatesListOpened = () => {
	if (cache.isTemplatesListOpened === null) {
		cache.isTemplatesListOpened = originalGetIsTemplatesListOpened();
	}
	return cache.isTemplatesListOpened;
};

const getResizeObserverTarget = () => {
	if (!cache.resizeObserverTarget) {
		cache.resizeObserverTarget = document.querySelector(
			'.interface-interface-skeleton__content'
		);
	}
	return cache.resizeObserverTarget;
};

const getBlockContainer = () => {
	if (!cache.blockContainer) {
		const editorWrapper =
			getEditorWrapper()?.contentDocument ?? getEditorWrapper();
		cache.blockContainer =
			editorWrapper?.querySelector('.is-root-container');
	}
	return cache.blockContainer;
};

wp.domReady(() => {
	const changeHandlesDisplay = (display, wrapper) =>
		Array.from(
			wrapper.querySelectorAll('.resizable-editor__drag-handle')
		).forEach(handle => {
			handle.style.display = display;
		});

	const changeSiteEditorWidth = (width = '') => {
		getSiteEditor().style.width = width;
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

			const { breakpoints } = cache;

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

	const setBaseBreakpoint = () => {
		const resizeObserverTarget = getResizeObserverTarget();
		if (resizeObserverTarget) {
			const { width, height } =
				resizeObserverTarget.getBoundingClientRect();
			dispatch('maxiBlocks').setEditorContentSize({ width, height });
		}
	};

	const resizeObserver = new ResizeObserver(() => {
		setBaseBreakpoint();
		const editorWrapper = getEditorWrapper();

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

	const editorContentUnsubscribe = subscribe(() => {
		if (getIsSiteEditor()) {
			const siteEditorIframeBody = getSiteEditorIframeBody();

			if (!getIsTemplatesListOpened() && siteEditorIframeBody) {
				setTimeout(() => {
					dispatch('maxiBlocks').setMaxiDeviceType({
						deviceType: 'general',
					});
				}, 150);

				resizeObserver.observe(getResizeObserverTarget());
				setBaseBreakpoint();
			}

			if (
				siteEditorIframeBody &&
				!siteEditorIframeBody.classList.contains('maxi-blocks--active')
			)
				siteEditorIframeBody.classList.add('maxi-blocks--active');

			if (getIsTemplatePart()) {
				const resizableBox = document.querySelector(
					'.edit-site-visual-editor .components-resizable-box__container'
				);

				if (
					!getIsTemplatesListOpened() &&
					getSiteEditorIframeBody() &&
					resizableBox
				) {
					templatePartResizeObserver.observe(resizableBox);
				} else {
					templatePartResizeObserver.disconnect();
				}
			}
		} else {
			if (getResizeObserverTarget()) {
				resizeObserver.observe(getResizeObserverTarget());
			}
			resizeObserver.observe(document.body);

			const blockContainer = getBlockContainer();
			if (blockContainer) blockMarginObserver.observe(blockContainer);
		}
	});

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
						preview.style.display = 'none';
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
