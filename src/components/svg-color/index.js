/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import { getDefaultAttribute } from '../../extensions/styles';

/**
 * SvgColor
 */
const SvgColor = props => {
	const { type, label, onChange } = props;

	const color = props[`svg-${type}-color`];
	const defaultColor = getDefaultAttribute(`svg-${type}-color`);
	const paletteColor = props[`svg-palette-${type}-color`];
	const paletteStatus = props[`svg-palette-${type}-color-status`];

	return (
		<ColorControl
			label={label}
			color={color}
			defaultColor={defaultColor}
			paletteColor={paletteColor}
			paletteStatus={paletteStatus}
			onChange={({ color, paletteColor, paletteStatus }) => {
				onChange({
					[`svg-${type}-color`]: color,
					[`svg-palette-${type}-color`]: paletteColor,
					[`svg-palette-${type}-color-status`]: paletteStatus,
				});
			}}
			showPalette
			disableOpacity
		/>
	);
};

export default SvgColor;
