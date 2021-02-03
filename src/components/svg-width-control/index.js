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
			onChange={val => onChange(!isNil(val) ? val : defaultWidth)}
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
