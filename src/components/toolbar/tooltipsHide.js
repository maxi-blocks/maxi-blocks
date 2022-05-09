/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const tooltipsHide = () => {
	const { receiveMaxiSettings } = select('maxiBlocks');

	const maxiSettings = receiveMaxiSettings();

	return !isEmpty(maxiSettings.hide_tooltips)
		? maxiSettings.hide_tooltips
		: false;
};

export default tooltipsHide;
