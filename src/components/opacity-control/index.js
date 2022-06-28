/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import { getIsValid } from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, round, isNil } from 'lodash';

/**
 * Component
 */
const OpacityControl = props => {
	const {
		className,
		onChange,
		label = '',
		opacity,
		onReset,
		disableLabel = false,
		defaultOpacity = undefined,
	} = props;

	const classes = classnames('maxi-opacity-control', className);

	return (
		<AdvancedNumberControl
			className={classes}
			label={`${
				!isEmpty(label) || disableLabel
					? label
					: __('Opacity', 'maxi-blocks')
			}`}
			value={getIsValid(opacity, true) ? round(opacity * 100, 2) : 100}
			onChangeValue={val => {
				onChange(!isNil(val) ? round(val / 100, 2) : 0);
			}}
			min={0}
			max={100}
			onReset={() => (onReset ? onReset() : onChange(defaultOpacity))}
		/>
	);
};

export default OpacityControl;
