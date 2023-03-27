/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import withRTC from '../../extensions/maxi-block/withRTC';
import {
	getDefaultAttribute,
	getIsValid,
	getAttributeKey,
} from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isFunction, isNil, round } from 'lodash';

/**
 * Component
 */
const OpacityControl = props => {
	const {
		className,
		label = '',
		opacity,
		breakpoint,
		prefix = '',
		isHover = false,
		onChange,
		onChangeOpacity,
		onReset,
		disableLabel = false,
	} = props;

	const getOpacityAttributeKey = () =>
		getAttributeKey('opacity', isHover, prefix, breakpoint);

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
			onChangeValue={rawVal => {
				const val = !isNil(rawVal) ? round(rawVal / 100, 2) : 0;

				if (isFunction(onChangeOpacity)) return onChangeOpacity(val);
				return onChange({ [getOpacityAttributeKey()]: val });
			}}
			min={0}
			max={100}
			onReset={() => {
				if (isFunction(onReset)) return onReset();

				const opacityAttributeKey = getOpacityAttributeKey();

				if (isFunction(onChangeOpacity))
					return onChangeOpacity(
						getDefaultAttribute(opacityAttributeKey)
					);
				return onChange({
					[opacityAttributeKey]:
						getDefaultAttribute(opacityAttributeKey),
					isReset: true,
				});
			}}
		/>
	);
};

export default withRTC(OpacityControl);
