const DEFAULT_STATE = {
	abilities: [],
	status: 'idle',
	error: null,
	token: '',
};

const reducer = (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case 'SET_ABILITIES':
			return {
				...state,
				abilities: Array.isArray(action.abilities)
					? action.abilities
					: [],
			};
		case 'SET_STATUS':
			return {
				...state,
				status: action.status,
			};
		case 'SET_ERROR':
			return {
				...state,
				error: action.error,
			};
		case 'SET_TOKEN':
			return {
				...state,
				token: action.token,
			};
		case 'RESET':
			return { ...DEFAULT_STATE };
		default:
			return state;
	}
};

export default reducer;
