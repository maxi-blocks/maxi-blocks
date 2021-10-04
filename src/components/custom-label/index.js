/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import TextControl from '../text-control';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Component
 */
const CustomLabel = props => {
	const { className, customLabel, onChange } = props;

	const classes = classnames('maxi-custom-label', className);

	return (
		<div className={classes}>
			<TextControl
				label={__('Block label', 'maxi-blocks')}
				value={customLabel}
				onChange={value => onChange(value)}
			/>
		</div>
	);
};

export default CustomLabel;
