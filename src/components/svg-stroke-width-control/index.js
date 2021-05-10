/**
 * Internal dependencies
 */
import RangeSliderControl from '../range-slider-control';

/**
 * Component
 */
const SvgStrokeWidthControl = props => {
	const { defaultStroke, stroke, onChange } = props;

	return (
		<RangeSliderControl
			value={stroke}
			defaultValue={defaultStroke}
			onChange={val => onChange(val)}
			min={0.1}
			max={5}
			step={0.1}
			withInputField
			initialPosition={defaultStroke}
			allowReset
		/>
	);
};

export default SvgStrokeWidthControl;
