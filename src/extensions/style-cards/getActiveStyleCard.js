/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * External dependencies
 */
import { forIn } from 'lodash';

const getActiveStyleCard = styleCards => {
	let SC;

	if (!styleCards)
		// Needs a delay, if not Redux returns error 3
		SC = setTimeout(
			() => select('maxiBlocks/style-cards').receiveMaxiStyleCards(),
			150
		);
	else SC = styleCards;

	let styleCardActive;

	forIn(SC, (value, key) => {
		if (value.status === 'active') {
			styleCardActive = { key, value };
		}
	});

	return styleCardActive || false;
};

export default getActiveStyleCard;
