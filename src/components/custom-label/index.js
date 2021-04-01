/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
const { TextControl } = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const CustomLabel = props => {
	const { className, customLabel, onChange } = props;

	const classes = classnames('maxi-custom-label', className);

	return (
		<div className={classes}>
			<TextControl
				label={__('Block Label', 'maxi-blocks')}
				value={customLabel}
				onChange={value => onChange(value)}
			/>
		</div>
	);
};

export default CustomLabel;
