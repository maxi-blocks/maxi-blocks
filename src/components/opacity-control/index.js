/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import withRTC from '../../extensions/maxi-block/withRTC';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, round, isNil } from 'lodash';
import { getDefaultAttribute, getIsValid } from '../../extensions/styles';

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
	} = props;

	const { breakpoint } = useSelect(select => ({
		breakpoint: select('maxiBlocks').receiveMaxiDeviceType(),
	}));

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
			onReset={() =>
				onReset
					? onReset()
					: onChange(getDefaultAttribute(`opacity-${breakpoint}`))
			}
		/>
	);
};

export default withRTC(OpacityControl);
