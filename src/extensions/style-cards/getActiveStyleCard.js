/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * External dependencies
 */
import { forIn } from 'lodash';

const getActiveStyleCard = (styleCards, getSelected = false) => {
	let SC;

	if (!styleCards)
		// Needs a delay, if not Redux returns error 3
		SC = setTimeout(
			() => select('maxiBlocks/style-cards').receiveMaxiStyleCards(),
			150
		);
	else SC = styleCards;

	let styleCardActive;

	const propExists = (obj, prop) => {
		let response = false;
		forIn(obj, value => {
			if (value[prop] !== undefined) {
				response = true;
			}
		});
		return response;
	};

	if (!getSelected) {
		forIn(SC, (value, key) => {
			if (value.status === 'active') {
				styleCardActive = { key, value };
			}
		});

		return styleCardActive || false;
	}

	const selectedExists = propExists(SC, 'selected');

	if (selectedExists)
		forIn(SC, (value, key) => {
			if (value.selected) {
				styleCardActive = { key, value };
			}
		});
	else
		forIn(SC, (value, key) => {
			if (value.status === 'active') {
				styleCardActive = { key, value };
			}
		});

	return styleCardActive || false;
};

export default getActiveStyleCard;
