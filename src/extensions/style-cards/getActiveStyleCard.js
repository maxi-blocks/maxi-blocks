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
		SC = select('maxiBlocks/style-cards').receiveMaxiStyleCards();
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
