/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getWinBreakpoint from '../dom/getWinBreakpoint';

/**
 * External dependencies
 */
import { omit } from 'lodash';

const breakpointResizer = ({
	size,
	breakpoints,
	xxlSize = breakpoints.xl + 1,
	winSize = 0,
	isGutenbergButton = false,
	changeSize = true,
}) => {
	const editorWrapper = document.querySelector('.edit-post-visual-editor');

	const winHeight = window.outerWidth;
	const responsiveWidth =
		(size === 'general' && 'none') ||
		(size === 'xxl' && (xxlSize > winSize ? xxlSize : winSize)) ||
		breakpoints[size];

	editorWrapper.setAttribute(
		'maxi-blocks-responsive',
		size !== 'general' ? size : getWinBreakpoint(winSize, breakpoints)
	);
	editorWrapper.setAttribute('maxi-blocks-responsive-width', responsiveWidth);

	if (!isGutenbergButton) editorWrapper.setAttribute('is-maxi-preview', true);
	else editorWrapper.removeAttribute('is-maxi-preview');

	if (changeSize) {
		if (size === 'general') {
			editorWrapper.style.width = '';
			editorWrapper.style.margin = '';
		} else {
			editorWrapper.style.margin =
				winHeight > responsiveWidth ? '0 auto' : '';

			if (isGutenbergButton) editorWrapper.style = null;
			else if (['s', 'xs'].includes(size)) {
				const {
					__experimentalGetPreviewDeviceType: getPreviewDeviceType,
				} = select('core/edit-post');

				const gutenbergDeviceType = getPreviewDeviceType();

				if (gutenbergDeviceType !== 'Desktop')
					editorWrapper.style.width = 'fit-content';
				else editorWrapper.style.width = `${responsiveWidth}px`;
			} else if (editorWrapper.style.width !== `${responsiveWidth}px`)
				editorWrapper.style.width = `${responsiveWidth}px`;
		}
	}

	// Clean prevSavedAttrs when changing the responsive stage
	dispatch('maxiBlocks/styles').savePrevSavedAttrs([]);
};

const reducer = (
	state = {
		settings: {},
		breakpoints: {
			xs: 480,
			s: 767,
			m: 1024,
			l: 1366,
			xl: 1920,
		},
		deviceType: 'general',
		presets: '',
		copiedStyles: {},
		copiedBlocks: {},
		inspectorPath: [{ name: 'Settings', value: 0 }],
		deprecatedBlocks: {},
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
				xxlSize: action.width,
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
		default:
			return state;
	}
};

export default reducer;
