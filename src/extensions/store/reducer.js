import { omit } from 'lodash';

const breakpointResizer = (
	size,
	breakpoints,
	xxlSize = breakpoints.xl + 1,
	winSize = 0
) => {
	const editorWrapper = document.querySelector('.edit-post-visual-editor');
	const winHeight = window.outerWidth;
	const responsiveWidth =
		(size === 'general' && 'none') ||
		(size === 'xxl' && (xxlSize > winSize ? xxlSize : winSize)) ||
		breakpoints[size];

	editorWrapper.setAttribute(
		'maxi-blocks-responsive',
		size !== 'general' ? size : ''
	);
	editorWrapper.setAttribute('maxi-blocks-responsive-width', responsiveWidth);

	if (size === 'general') {
		editorWrapper.style.width = '';
		editorWrapper.style.margin = '';
	} else {
		if (size !== 'xxl') editorWrapper.style.width = `${responsiveWidth}px`;
		else editorWrapper.style.width = `${responsiveWidth}px`;

		if (winHeight > responsiveWidth)
			editorWrapper.style.margin = '36px auto';
		else editorWrapper.style.margin = '';
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
				action.width,
				state.settings.window.width
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
		case 'UPDATE_INSPECTOR_PATH':
			const { depth, value } = action.inspectorPath;
			const newValue = omit(action.inspectorPath, ['depth']);
			const newInspectorPath = state.inspectorPath;

			if (depth === newInspectorPath.length) {
				newInspectorPath.push(newValue);
			} else if (depth < newInspectorPath.length) {
				newInspectorPath[depth] = newValue;

				for (let i = depth + 1; i <= newInspectorPath.length; i++) {
					newInspectorPath.splice(i, 1);
				}

				// In case of Accordiont return undefined
				if (value === undefined) {
					newInspectorPath.splice(depth, 1);
				}
			}

			return {
				...state,
				inspectorPath: newInspectorPath,
			};
		default:
			return state;
	}
};

export default reducer;
