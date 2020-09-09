/**
 * WordPress dependencies
 */
const { RangeControl } = wp.components;

/**
 * Component
 */
const SvgWidthControl = props => {
	const { width, onChange } = props;

	return (
		<RangeControl
			value={width}
			onChange={val => onChange(val)}
			min={10}
			max={250}
			step={1}
			withInputField
			initialPosition={64}
			allowReset
		/>
	);
};

export default SvgWidthControl;
