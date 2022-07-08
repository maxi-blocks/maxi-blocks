/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Button from '../button';

/**
 * Icons
 */
import { reset } from '../../icons';

const ResetButton = props => {
	return (
		<Button aria-label={__('Reset', 'maxi-blocks')} onClick={props.onReset}>
			{reset}
		</Button>
	);
};

export default ResetButton;
