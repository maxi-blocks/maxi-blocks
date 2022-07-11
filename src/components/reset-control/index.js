/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './editor.scss';
import Button from '../button';

/**
 * Icons
 */
import { reset } from '../../icons';

const ResetButton = props => {
	return (
		<Button
			className='maxi-reset-button'
			aria-label={__('Reset', 'maxi-blocks')}
			onClick={props.reset}
		>
			{reset}
		</Button>
	);
};

export default ResetButton;
