import { receiveMaxiProStatus, sendMaxiProStatus } from './actions';

const resolvers = {
	*receiveMaxiProStatus() {
		const maxiStatus = yield receiveMaxiProStatus();

		return sendMaxiProStatus(maxiStatus);
	},
};

export default resolvers;
