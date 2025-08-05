/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './editor.scss';
import Button from '@components/button';

/**
 * Icons
 */
import { reset } from '@maxi-icons';

const ResetButton = props => {
	const {
		className = '',
		isSmall = false,
		isLarge = false,
		isAbsolute = false,
		isInline = false,
		...otherProps
	} = props;

	// Build className based on props and our new variant system
	let resetClassName = 'maxi-reset-button';

	if (isSmall) resetClassName += ' maxi-reset-button--small';
	if (isLarge) resetClassName += ' maxi-reset-button--large';
	if (isAbsolute) resetClassName += ' maxi-reset-button--absolute';
	if (isInline) resetClassName += ' maxi-reset-button--inline';

	// Add any additional className passed in
	if (className) resetClassName += ` ${className}`;

	return (
		<Button
			className={resetClassName}
			action='reset'
			type='reset'
			aria-label={__('Reset', 'maxi-blocks')}
			onClick={
				(e => {
					e.preventDefault();
				},
				otherProps.onReset)
			}
		>
			{reset}
		</Button>
	);
};

export default ResetButton;
