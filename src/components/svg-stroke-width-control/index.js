/**
 * WordPress dependencies
 */
const { RangeControl } = wp.components;

/**
 * Component
 */
const SvgStrokeWidthControl = props => {
	const { defaultStroke, stroke, onChange } = props;

	return (
		<RangeControl
			value={stroke}
			onChange={val => onChange(val)}
			min={0.1}
			max={10}
			step={0.1}
			withInputField
			initialPosition={defaultStroke}
			allowReset
		/>
	);
};

export default SvgStrokeWidthControl;
