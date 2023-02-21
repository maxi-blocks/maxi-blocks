import updateSCOnEditor from '../updateSCOnEditor';
import getActiveStyleCard from '../getActiveStyleCard';
import { receiveMaxiStyleCards, sendMaxiStyleCards } from './actions';
import { getActiveColourFromSC } from '../../../editor/style-cards/utils';

import { isEmpty } from 'lodash';

const resolvers = {
	*receiveMaxiStyleCards() {
		const maxiStyleCards = yield receiveMaxiStyleCards();

		if (maxiStyleCards && !isEmpty(maxiStyleCards)) {
			const currentSC = getActiveStyleCard(maxiStyleCards);
			updateSCOnEditor(
				currentSC.value,
				getActiveColourFromSC(currentSC, 4)
			);
		}

		return sendMaxiStyleCards(maxiStyleCards);
	},
};

export default resolvers;
