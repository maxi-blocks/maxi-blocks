import controls from './controls';

const breakpointResizer = (size, breakpoints) => {
	const editorWrapper = document.querySelector('.editor-styles-wrapper');
	const winHeight = window.outerWidth;
	const responsiveWidth =
		(size === 'general' && 'none') ||
		(size === 'xxl' && 2000) ||
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
		const xxlSize = 2000; // Temporary value, needs to be fixed

		if (size !== 'xxl')
			editorWrapper.style.width = `${breakpoints[size]}px`;
		else editorWrapper.style.width = `${xxlSize}px`;

		if (winHeight > breakpoints[size])
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
		case 'SEND_MOTION_PRESETS':
			return {
				...state,
				presets: action.presets,
			};
		case 'SEND_BREAKPOINTS':
			return {
				...state,
				breakpoints: action.breakpoints,
			};
		case 'SAVE_MOTION_PRESETS':
			controls.SAVE_MOTION_PRESETS(action);
			return {
				...state,
				presets: action.presets,
			};
		case 'SEND_DEVICE_TYPE':
			return {
				...state,
				deviceType: action.deviceType,
			};
		case 'SET_DEVICE_TYPE':
			breakpointResizer(action.deviceType, state.breakpoints);
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
		default:
			return state;
	}
};

export default reducer;
