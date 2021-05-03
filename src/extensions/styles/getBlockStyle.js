/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * External dependencies
 */
import { isNull } from 'lodash';

const getBlockStyle = clientId => {
	const { getBlockAttributes, getBlockParents } = select('core/block-editor');

	const parentStyles = getBlockAttributes(getBlockParents(clientId)[0]);
	const currentBlockStyle = getBlockAttributes(clientId).blockStyle;

	switch (currentBlockStyle) {
		case 'maxi-light':
		case 'light':
			return 'light';
		case 'maxi-dark':
		case 'dark':
			return 'dark';
		case 'maxi-parent': {
			return isNull(parentStyles)
				? 'dark'
				: parentStyles.blockStyle === 'maxi-light' ||
				  parentStyles.blockStyle === 'light'
				? 'light'
				: 'dark';
		}
		default:
			return 'light';
	}
};

export default getBlockStyle;
