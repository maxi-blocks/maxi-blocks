/**
 * Internal dependencies
 */
import { getIsTemplatePart, getSiteEditorIframeBody } from '../fse';

/**
 * External dependencies
 */
import { omit } from 'lodash';

const breakpointResizer = (
	size,
	breakpoints,
	winSize = 0,
	winBreakpoint,
	ignoreMaxiBlockResponsiveWidth
) => {
	const xxlSize = breakpoints.xl + 1;

	const editorWrapper =
		document.querySelector('.edit-post-visual-editor') ||
		(getIsTemplatePart() &&
			document.querySelector('.components-resizable-box__container')) ||
		document.querySelector('.edit-site-visual-editor');

	[editorWrapper, getSiteEditorIframeBody()].forEach(element => {
		element?.setAttribute(
			'maxi-blocks-responsive',
			size !== 'general' ? size : winBreakpoint
		);
	});

	if (!ignoreMaxiBlockResponsiveWidth) {
		const winHeight = window.outerWidth;
		const responsiveWidth =
			(size === 'general' && 'none') ||
			(size === 'xxl' && (xxlSize > winSize ? xxlSize : winSize)) ||
			breakpoints[size];

		editorWrapper.setAttribute(
			'maxi-blocks-responsive-width',
			responsiveWidth
		);

		if (size === 'general') {
			editorWrapper.style.width = '';
			editorWrapper.style.margin = '';
		} else {
			editorWrapper.style.width = `${responsiveWidth}px`;

			if (winHeight > responsiveWidth)
				editorWrapper.style.margin = '0 auto';
			else editorWrapper.style.margin = '';
		}
	}
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
			breakpointResizer(
				action.deviceType,
				state.breakpoints,
				state.settings.window.width,
				action.winBreakpoint,
				action.ignoreMaxiBlockResponsiveWidth
			);
			return {
				...state,
				deviceType: action.deviceType,
			};
		case 'SET_WINDOW_SIZE':
			return {
				...state,
				settings: {
					...state.settings,
					window: action.winSize,
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

				for (let i = depth + 1; i <= newInspectorPath.length; i++) {
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
		default:
			return state;
	}
};

export default reducer;
