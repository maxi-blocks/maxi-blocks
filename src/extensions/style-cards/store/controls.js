/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import { getSCVariablesObject, createSCStyleString } from '../updateSCOnEditor';

/**
 * Controls
 */
const controls = {
	async RECEIVE_STYLE_CARDS() {
		return apiFetch({ path: '/maxi-blocks/v1.0/style-cards/' }).then(sc =>
			JSON.parse(sc)
		);
	},
	async SAVE_STYLE_CARDS(styleCards) {
		await apiFetch({
			path: '/maxi-blocks/v1.0/style-cards/',
			method: 'POST',
			data: {
				styleCards: JSON.stringify(styleCards),
			},
		}).catch(err => {
			console.error('Error saving Style Card. Code error: ', err);
		});
	},
	async UPDATE_STYLE_CARD(styleCards, isUpdate) {
		const varSC = getSCVariablesObject(styleCards.value);
		const parsedSC = createSCStyleString(varSC);

		await apiFetch({
			path: '/maxi-blocks/v1.0/style-card',
			method: 'POST',
			data: {
				meta: parsedSC,
				update: isUpdate,
			},
		});
	},
	async RESET_STYLE_CARDS() {
		await apiFetch({
			path: '/maxi-blocks/v1.0/style-cards/reset',
		}).then(() =>
			// eslint-disable-next-line no-console
			console.log(
				"IMPORTANT: the changes won't have any effect until the page is refreshed"
			)
		);
	},
};

export default controls;
