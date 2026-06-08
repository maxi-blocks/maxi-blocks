import updateSCOnEditor from '@extensions/style-cards/updateSCOnEditor';
import getActiveStyleCard from '@extensions/style-cards/getActiveStyleCard';
import { receiveMaxiStyleCards, sendMaxiStyleCards } from './actions';
import { getActiveColourFromSC } from '@editor/style-cards/utils';
import {
	DARK_TONE_STYLE_OVERRIDES,
	SYNC_STYLE_SETTINGS_TONES_STATUS,
	SYNC_TYPOGRAPHY_TONES_STATUS,
} from '@extensions/style-cards/syncTypography';

import { isEmpty } from 'lodash';

const resolvers = {
	*receiveMaxiStyleCards() {
		const maxiStyleCards = yield receiveMaxiStyleCards();
		let shouldSCMigratorRun = false;
		const updatedMaxiStyleCards = {};

		if (maxiStyleCards && !isEmpty(maxiStyleCards)) {
			for (const key in maxiStyleCards) {
				if (Object.prototype.hasOwnProperty.call(maxiStyleCards, key)) {
					let styleCard = maxiStyleCards[key];
					if (!('gutenberg_blocks_status' in styleCard)) {
						shouldSCMigratorRun = true;
						styleCard = {
							...styleCard,
							gutenberg_blocks_status: true,
						};
					}
					if (!(SYNC_STYLE_SETTINGS_TONES_STATUS in styleCard)) {
						shouldSCMigratorRun = true;
						styleCard = {
							...styleCard,
							[SYNC_STYLE_SETTINGS_TONES_STATUS]:
								SYNC_TYPOGRAPHY_TONES_STATUS in styleCard
									? styleCard[SYNC_TYPOGRAPHY_TONES_STATUS]
									: true,
						};
					}
					if (!(DARK_TONE_STYLE_OVERRIDES in styleCard)) {
						shouldSCMigratorRun = true;
						styleCard = {
							...styleCard,
							[DARK_TONE_STYLE_OVERRIDES]: [],
						};
					}
					updatedMaxiStyleCards[key] = styleCard;
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
