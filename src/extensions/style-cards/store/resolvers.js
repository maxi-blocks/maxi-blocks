import updateSCOnEditor from '../updateSCOnEditor';
import getActiveStyleCard from '../getActiveStyleCard';
import { receiveMaxiStyleCards, sendMaxiStyleCards } from './actions';
import { getActiveColourFromSC } from '../../../editor/style-cards/utils';

import { isEmpty } from 'lodash';

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
					}

					if (
						!(
							'font-size-clamp-status-general' in
							styleCard.light.defaultStyleCard.p
						)
					) {
						shouldSCMigratorRun = true;

						const clampAttributes = {
							'font-size-clamp-status-general': false,
							'font-size-clamp-min-general': 1,
							'font-size-clamp-min-unit-general': 'rem',
							'font-size-clamp-max-general': 3,
							'font-size-clamp-max-unit-general': 'rem',
							'font-size-clamp-status-xl': false,
							'font-size-clamp-min-xl': 1,
							'font-size-clamp-min-unit-xl': 'rem',
							'font-size-clamp-max-xl': 3,
							'font-size-clamp-max-unit-xl': 'rem',
						};

						const items = [
							'p',
							'button',
							'h1',
							'h2',
							'h3',
							'h4',
							'h5',
							'h6',
						];

						updatedMaxiStyleCards[key] = styleCard;
						items.forEach(item => {
							updatedMaxiStyleCards[key].light.defaultStyleCard[
								item
							] = {
								...updatedMaxiStyleCards[key].light
									.defaultStyleCard[item],
								...clampAttributes,
							};
							updatedMaxiStyleCards[key].dark.defaultStyleCard[
								item
							] = {
								...updatedMaxiStyleCards[key].dark
									.defaultStyleCard[item],
								...clampAttributes,
							};
						});

						console.log(updatedMaxiStyleCards);
					}

					if (!updatedMaxiStyleCards[key]) {
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
