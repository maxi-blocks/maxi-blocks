/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import TextControl from '../text-control';

const AriaLabelControl = ({ props, targets }) => {
	return <TextControl label={__('Aria Label', 'maxi-blocks')} newStyle />;
};

export default AriaLabelControl;
