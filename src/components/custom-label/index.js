/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { DotTip } from '@wordpress/nux';

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
				label={__('Block name', 'maxi-blocks')}
				placeholder={__('Give a name…')}
				value={customLabel}
				onChange={value => onChange(value)}
			/>
			<DotTip tipId='guide/settings'>
				All block settings are located in the sidebar.
			</DotTip>
		</div>
	);
};

export default CustomLabel;
