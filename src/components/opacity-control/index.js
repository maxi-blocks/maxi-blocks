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
import { isEmpty, round, isNil } from 'lodash';
import { getIsValid } from '../../extensions/styles';

/**
 * Component
 */
const OpacityControl = props => {
	const { className, onChange, label, opacity, onReset } = props;

	const classes = classnames('maxi-opacity-control', className);

	return (
		<AdvancedNumberControl
			className={classes}
			label={`${!isEmpty(label) ? label : __('Opacity', 'maxi-blocks')}`}
			value={getIsValid(opacity, true) ? opacity * 100 : 100}
			onChangeValue={val => {
				onChange(!isNil(val) ? round(val / 100, 2) : 0);
			}}
			min={0}
			max={100}
			onReset={() => (onReset ? onReset() : onChange(1))}
		/>
	);
};

export default OpacityControl;
