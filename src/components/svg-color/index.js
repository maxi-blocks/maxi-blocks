/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import {
	getGroupAttributes,
	getDefaultAttribute,
} from '../../extensions/styles';

/**
 * SvgColor
 */
const SvgColor = props => {
	const { type, color, label, onChange, clientId } = props;

	return (
		<ColorControl
			label={label}
			color={color}
			defaultColor={getDefaultAttribute(type)}
			disableOpacity
			onChange={val => onChange({ [`${type}`]: val })}
			showPalette
			palette={{
				...getGroupAttributes(props, 'palette'),
			}}
			colorPaletteType={type}
			onChangePalette={val => onChange(val)}
			clientId={clientId}
		/>
	);
};

export default SvgColor;
