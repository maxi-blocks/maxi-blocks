/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { dispatch, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import {
	getIsSiteEditor,
	getIsTemplatePart,
	getSiteEditorIframeBody,
} from '../fse';
import getWinBreakpoint from '../dom/getWinBreakpoint';

/**
 * External dependencies
 */
import { omit } from 'lodash';

const breakpointResizer = ({
	size,
	breakpoints,
	winSize = 0,
	isGutenbergButton = false,
	changeSize = true,
}) => {
	const xxlSize = breakpoints.xl + 1;

	const getEditorWrapper = () => {
		if (getIsSiteEditor()) {
			if (getIsTemplatePart()) {
				return document.querySelector(
					'.edit-site-visual-editor .components-resizable-box__container'
				);
			}
			return document.querySelector('.edit-site-visual-editor');
		}
		return document.querySelector('.edit-post-visual-editor');
	};
	const editorWrapper = getEditorWrapper();

	if (!editorWrapper) return;

	[editorWrapper, getSiteEditorIframeBody()].forEach(element => {
		element?.setAttribute(
			'maxi-blocks-responsive',
			size !== 'general' ? size : getWinBreakpoint(winSize, breakpoints)
		);
	});

	// Function to get the current preview device type
	const getCurrentPreviewDeviceType = () => {
		// First, try to use the new preferred method if it exists
		if (select('core/editor') && select('core/editor').getDeviceType) {
			return select('core/editor').getDeviceType();
		}
		// Determine if we are in the site editor or post editor as a fallback
		const isSiteEditor = getIsSiteEditor(); // Ensure you have implemented this check
		const editorStore = isSiteEditor ? 'core/edit-site' : 'core/edit-post';

		// Check and call the deprecated method if available
		const storeSelect = select(editorStore);
		if (storeSelect.__experimentalGetPreviewDeviceType) {
			return storeSelect.__experimentalGetPreviewDeviceType();
		}
		console.error(
			__(
				'Unable to get the preview device type. The required method is not available.',
				'maxi-blocks'
			)
		);
		return 'Desktop'; // Fallback to 'Desktop' as a default
	};

	if (changeSize) {
		const winHeight = window.outerWidth;
		const responsiveWidth =
			(size === 'general' && 'none') ||
			(size === 'xxl' && (xxlSize > winSize ? xxlSize : winSize)) ||
			breakpoints[size];

		editorWrapper.setAttribute(
			'maxi-blocks-responsive-width',
			responsiveWidth
		);

		if (!isGutenbergButton) {
			editorWrapper.setAttribute('is-maxi-preview', true);
			if (getIsSiteEditor()) {
				document.querySelector(
					'.edit-site-visual-editor__editor-canvas'
				).style.width = null;
			}
		} else editorWrapper.removeAttribute('is-maxi-preview');

		if (size === 'general') {
			editorWrapper.style.width = '';
			editorWrapper.style.margin = '';
		} else {
			editorWrapper.style.margin =
				winHeight > responsiveWidth ? '0 auto' : '';

			if (isGutenbergButton) {
				editorWrapper.style = null;
			} else if (['s', 'xs'].includes(size) && !getIsSiteEditor()) {
				const gutenbergDeviceType = getCurrentPreviewDeviceType();

				if (gutenbergDeviceType !== 'Desktop')
					editorWrapper.style.width = 'fit-content';
				else editorWrapper.style.width = `${responsiveWidth}px`;
			} else if (editorWrapper.style.width !== `${responsiveWidth}px`) {
				editorWrapper.style.width = `${responsiveWidth}px`;
			}
		}
	}

	// Clean prevSavedAttrs when changing the responsive stage
	dispatch('maxiBlocks/styles').savePrevSavedAttrs([]);
};

const reducer = (
	state = {
		settings: {},
		breakpoints: {},
		deviceType: 'general',
		presets: '',
		copiedStyles: {},
		copiedBlocks: {},
		inspectorPath: [{ name: 'Settings', value: 0 }],
		deprecatedBlocks: {},
		blocksToRender: [],
		isPageLoaded: false,
		isIframeObserverSet: false,
		blockName: {},
		uniqueID: {},
	},
	action
) => {
	switch (action.type) {
		case 'SEND_GLOBAL_SETTINGS':
			return {
				...state,
				settings: {
					...state.settings,
					...action.settings,
				},
			};
		case 'SAVE_GENERAL_SETTING': {
			const { setting, value } = action;
			const newSettings = { [setting]: value };
			return {
				...state,
				settings: { ...state.settings, ...newSettings },
			};
		}
		case 'SEND_BREAKPOINTS':
			return {
				...state,
				breakpoints: action.breakpoints,
			};
		case 'SEND_DEVICE_TYPE':
			return {
				...state,
				deviceType: action.deviceType,
			};
		case 'SET_DEVICE_TYPE':
			breakpointResizer({
				size: action.deviceType,
				breakpoints: state.breakpoints,
				winSize: state.settings.editorContent.width,
				isGutenbergButton: action.isGutenbergButton,
				changeSize: action.changeSize,
			});

			return {
				...state,
				deviceType: action.deviceType,
			};
		case 'SET_EDITOR_CONTENT_SIZE':
			return {
				...state,
				settings: {
					...state.settings,
					editorContent: action.editorContentSize,
				},
			};
		case 'COPY_STYLES':
			return {
				...state,
				copiedStyles: action.copiedStyles,
			};
		case 'COPY_BLOCKS':
			return {
				...state,
				copiedBlocks: action.copiedBlocks,
			};
		case 'UPDATE_INSPECTOR_PATH': {
			const { depth, value } = action.inspectorPath;
			const newValue = omit(action.inspectorPath, ['depth']);
			const newInspectorPath = [...state.inspectorPath];

			if (depth === newInspectorPath.length) {
				newInspectorPath.push(newValue);
			} else if (depth < newInspectorPath.length) {
				newInspectorPath[depth] = newValue;

				for (let i = depth + 1; i <= newInspectorPath.length; i += 1) {
					newInspectorPath.splice(i, 1);
				}

				// In case of accordion return undefined
				if (value === undefined) {
					newInspectorPath.splice(depth, 1);
				}
			}

			return {
				...state,
				inspectorPath: newInspectorPath,
			};
		}
		case 'SAVE_DEPRECATED_BLOCK':
			return {
				...state,
				deprecatedBlocks: {
					...state.deprecatedBlocks,
					[action.uniqueID]: {
						...state.deprecatedBlocks[action.uniqueID],
						...action.attributes,
					},
				},
			};
		case 'REMOVE_DEPRECATED_BLOCK':
			return {
				...state,
				deprecatedBlocks: omit(state.deprecatedBlocks, action.uniqueID),
			};
		case 'BLOCK_WANTS_TO_RENDER': {
			const { uniqueID } = action;

			if (state.blocksToRender.includes(uniqueID)) return state;

			return {
				...state,
				blocksToRender: [...state.blocksToRender, uniqueID],
			};
		}
		case 'SET_IS_PAGE_LOADED':
			return {
				...state,
				isPageLoaded: action.isPageLoaded,
				blocksToRender: [],
			};
		case 'SET_IS_IFRAME_OBSERVER_SET':
			return {
				...state,
				isIframeObserverSet: action.isIframeObserverSet,
			};
		default:
			return state;
	}
};

export default reducer;
