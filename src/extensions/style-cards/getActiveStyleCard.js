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

	console.log('SC in getActiveStyleCard: ');
	console.log(SC);

	let styleCardActive;

	forIn(SC, (value, key) => {
		if (value.status === 'active') {
			styleCardActive = { key, value };
		}
	});
	console.log('return styleCardActive: ');
	console.log(styleCardActive);

	return styleCardActive || false;
};

export default getActiveStyleCard;
