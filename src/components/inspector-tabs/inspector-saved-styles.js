/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SavedStyles from '@components/saved-styles';

const savedStyles = props => {
	return {
		label: __('Copy and paste styles', 'maxi-blocks'),
		content: <SavedStyles {...props} />,
	};
};

export default savedStyles;
