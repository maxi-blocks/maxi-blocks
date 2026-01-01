export const setAbilities = abilities => ({
	type: 'SET_ABILITIES',
	abilities,
});

export const setStatus = status => ({
	type: 'SET_STATUS',
	status,
});

export const setError = error => ({
	type: 'SET_ERROR',
	error,
});

export const setToken = token => ({
	type: 'SET_TOKEN',
	token,
});

export const reset = () => ({
	type: 'RESET',
});
