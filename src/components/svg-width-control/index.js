/**
 * Internal dependencies
 */
import RangeSliderControl from '../range-slider-control';

/**
 * Component
 */
const SvgWidthControl = props => {
	const { defaultWidth, width, onChange } = props;

	return (
		<RangeSliderControl
			value={width}
			defaultValue={defaultWidth}
			onChange={val => onChange(val)}
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
