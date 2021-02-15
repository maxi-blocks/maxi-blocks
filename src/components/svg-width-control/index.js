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
const SvgWidthControl = props => {
	const { defaultWidth, width, onChange } = props;

	return (
		<RangeControl
			value={width}
			onChange={val => {
				let value = val;

				if (value > 250) value = 250;
				if (value < 10) value = 10;

				onChange(!isNil(value) ? value : defaultWidth);
			}}
			min={10}
			max={250}
			step={1}
			withInputField
			initialPosition={defaultWidth}
			allowReset
		/>
	);
};

export default SvgWidthControl;
