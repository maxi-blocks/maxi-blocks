/**
 * WordPress dependencies
 */
const { RangeControl } = wp.components;

/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * Component
 */
const RangeSliderControl = props => {
	const { onChange, defaultValue, min = 0, max = 100, ...rest } = props;

	return (
		<RangeControl
			{...rest}
			min={min}
			max={max}
			onChange={val => {
				let value = isNil(val) ? defaultValue : val;

				if (value > max) value = max;
				if (value < min) value = min;

				onChange(value);
			}}
		/>
	);
};

export default RangeSliderControl;
