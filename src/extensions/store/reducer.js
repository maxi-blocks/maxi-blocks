import controls from './controls';

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

const updateOpenedBlocksSettings = (objState, objAction) => {
	let newSettings = objState;
	const keySetting = Object.keys(objAction)[0]; // BlockId
	const newValue = Object.values(objAction)[0]; // Value

	switch (objAction.type) {
		case 'tab':
			const oldAccordionValue =
				(objState[keySetting] && objState[keySetting][1]) || undefined;
			newSettings[keySetting] = [newValue, oldAccordionValue];
		case 'accordion':
			const oldATabValue =
				(objState[keySetting] && objState[keySetting][0]) || 0;
			newSettings[keySetting] = [oldATabValue, newValue];
	}
	return newSettings;
};

const reducer = (
	state = {
		settings: {},
		breakpoints: {},
		deviceType: 'general',
		presets: '',
		copiedStyles: {},
		copiedBlocks: {},
		openedBlocksSettings: {},
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
		case 'UPDATE_OPENED_BLOCKS_SETTING':
			const newSettings = updateOpenedBlocksSettings(
				state.openedBlocksSettings,
				action.newBlocksSettings
			);

			return {
				...state,
				newSettings,
			};
		default:
			return state;
	}
};

export default reducer;
