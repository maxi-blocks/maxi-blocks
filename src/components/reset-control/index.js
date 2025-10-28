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
		// Positioning preset props
		isTopLeft = false,
		isTopRight = false,
		isTopCenter = false,
		isBottomLeft = false,
		isBottomRight = false,
		isCenterLeft = false,
		isCenterRight = false,
		// Custom positioning props
		customPosition = null,
		customTop = null,
		customRight = null,
		customBottom = null,
		customLeft = null,
		customZIndex = null,
		...otherProps
	} = props;

	// Build className based on props and our new variant system
	let resetClassName = 'maxi-reset-button';

	if (isSmall) resetClassName += ' maxi-reset-button--small';
	if (isLarge) resetClassName += ' maxi-reset-button--large';
	if (isAbsolute) resetClassName += ' maxi-reset-button--absolute';
	if (isInline) resetClassName += ' maxi-reset-button--inline';

	// Positioning presets
	if (isTopLeft) resetClassName += ' maxi-reset-button--top-left';
	if (isTopRight) resetClassName += ' maxi-reset-button--top-right';
	if (isTopCenter) resetClassName += ' maxi-reset-button--top-center';
	if (isBottomLeft) resetClassName += ' maxi-reset-button--bottom-left';
	if (isBottomRight) resetClassName += ' maxi-reset-button--bottom-right';
	if (isCenterLeft) resetClassName += ' maxi-reset-button--center-left';
	if (isCenterRight) resetClassName += ' maxi-reset-button--center-right';

	// Add any additional className passed in
	if (className) resetClassName += ` ${className}`;

	// Build custom CSS properties for positioning
	const customStyles = {};
	if (customPosition !== null)
		customStyles['--reset-position'] = customPosition;
	if (customTop !== null) customStyles['--reset-top'] = customTop;
	if (customRight !== null) customStyles['--reset-right'] = customRight;
	if (customBottom !== null) customStyles['--reset-bottom'] = customBottom;
	if (customLeft !== null) customStyles['--reset-left'] = customLeft;
	if (customZIndex !== null) customStyles['--reset-z-index'] = customZIndex;

	return (
		<Button
			className={resetClassName}
			style={customStyles}
			action='reset'
			type='reset'
			aria-label={__('Reset', 'maxi-blocks')}
			onClick={e => {
				e.preventDefault();
				otherProps.onReset(e);
			}}
		>
			{reset}
		</Button>
	);
};

export default ResetButton;
