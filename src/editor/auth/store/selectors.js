// eslint-disable-next-line import/prefer-default-export
export const receiveMaxiProStatus = state => {
	if (state.data) return state.data;
	return false;
};
