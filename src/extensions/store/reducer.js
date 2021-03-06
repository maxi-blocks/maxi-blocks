import controls from './controls';

const reducer = (
	state = {
		breakpoints: {},
		deviceType: 'general',
		presets: '',
		copiedStyles: {},
	},
	action
) => {
	switch (action.type) {
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
			return {
				...state,
				deviceType: action.deviceType,
			};
		case 'COPY_STYLES':
			return {
				...state,
				copiedStyles: action.copiedStyles,
			};
		case 'SEND_STYLE_CARDS':
			return {
				...state,
				styleCards: action.styleCards,
			};
		case 'SAVE_STYLE_CARDS':
			controls.SAVE_STYLE_CARDS(action);
			return {
				...state,
				styleCards: action.styleCards,
			};
		default:
			return state;
	}
};

export default reducer;
