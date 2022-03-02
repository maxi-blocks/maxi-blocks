import updateSCOnEditor from '../updateSCOnEditor';
import getActiveStyleCard from '../getActiveStyleCard';
import { receiveMaxiStyleCards, sendMaxiStyleCards } from './actions';

import { isEmpty } from 'lodash';

const resolvers = {
	*receiveMaxiStyleCards() {
		const maxiStyleCards = yield receiveMaxiStyleCards();

		if (maxiStyleCards && !isEmpty(maxiStyleCards)) {
			const currentSC = getActiveStyleCard(maxiStyleCards);

			updateSCOnEditor(currentSC.value);
		}

		return sendMaxiStyleCards(maxiStyleCards);
	},
};

export default resolvers;
