import { receiveMaxiStyleCards, sendMaxiStyleCards } from './actions';

const resolvers = {
	*receiveMaxiStyleCards() {
		const maxiStyleCards = yield receiveMaxiStyleCards();
		return sendMaxiStyleCards(maxiStyleCards);
	},
};

export default resolvers;
