/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, round } from 'lodash';

/**
 * Component
 */
const OpacityControl = props => {
	const { className, onChange, label, opacity } = props;

	const classes = classnames('maxi-opacity-control', className);

	return (
		<AdvancedNumberControl
			className={classes}
			label={`${!isEmpty(label) ? label : __('Opacity', 'maxi-blocks')}`}
			disableUnit
			value={
				opacity !== undefined && opacity !== ''
					? round(opacity * 100, 2)
					: ''
			}
			onChangeValue={val => {
				onChange(
					val !== undefined && val !== '' ? round(val / 100, 2) : ''
				);
			}}
			min={0}
			max={100}
			onReset={() => onChange('')}
		/>
	);
};

export default OpacityControl;
