/**
 * Internal dependencies
 */
import ColorControl from '../color-control';

/**
 * SvgColor
 */
const SvgColor = props => {
	const { label, color, defaultColor, onChange } = props;
	return (
		<ColorControl
			label={label}
			color={color}
			defaultColor={defaultColor}
			onChange={val => {
				onChange(val);
			}}
		/>
	);
};

export default SvgColor;
