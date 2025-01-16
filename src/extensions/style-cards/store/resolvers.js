import updateSCOnEditor from '@extensions/style-cards/updateSCOnEditor';
import getActiveStyleCard from '@extensions/style-cards/getActiveStyleCard';
import { receiveMaxiStyleCards, sendMaxiStyleCards } from './actions';
import { getActiveColourFromSC } from '@editor/style-cards/utils';

import { isEmpty } from 'lodash';
import { dispatch } from '@wordpress/data';

const resolvers = {
	*receiveMaxiStyleCards() {
		const maxiStyleCards = yield receiveMaxiStyleCards();
		let shouldSCMigratorRun = false;
		const updatedMaxiStyleCards = {};

		if (maxiStyleCards && !isEmpty(maxiStyleCards)) {
			for (const key in maxiStyleCards) {
				if (Object.prototype.hasOwnProperty.call(maxiStyleCards, key)) {
					const styleCard = maxiStyleCards[key];
					if (!('gutenberg_blocks_status' in styleCard)) {
						shouldSCMigratorRun = true;
						updatedMaxiStyleCards[key] = {
							...styleCard,
							gutenberg_blocks_status: true,
						};
					} else {
						updatedMaxiStyleCards[key] = styleCard;
					}
				}
			}

			const currentSC = shouldSCMigratorRun
				? getActiveStyleCard(updatedMaxiStyleCards)
				: getActiveStyleCard(maxiStyleCards);

			updateSCOnEditor(
				currentSC.value,
				getActiveColourFromSC(currentSC, 4)
			);
		}

		const response = shouldSCMigratorRun
			? sendMaxiStyleCards(updatedMaxiStyleCards)
			: sendMaxiStyleCards(maxiStyleCards);

		return response;
	},
};

export default resolvers;
