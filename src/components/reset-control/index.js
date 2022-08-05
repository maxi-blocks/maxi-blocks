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

/**
 * External dependencies
 */
import classnames from 'classnames';

const ResetButton = props => {
	return (
		<Button
			className={classnames('maxi-reset-button', props.className)}
			action='reset'
			type='reset'
			aria-label={__('Reset', 'maxi-blocks')}
			onClick={
				(e => {
					e.preventDefault();
				},
				props.onReset)
			}
		>
			{reset}
		</Button>
	);
};

export default ResetButton;
