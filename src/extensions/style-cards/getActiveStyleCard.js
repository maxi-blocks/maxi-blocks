/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * External dependencies
 */
import { forIn } from 'lodash';

const getActiveStyleCard = styleCards => {
	const { receiveMaxiStyleCards } = select('maxiBlocks/style-cards');

	let SC;

	if (!styleCards)
		// Needs a delay, if not Redux returns error 3
		SC = setTimeout(() => receiveMaxiStyleCards(), 150);
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
