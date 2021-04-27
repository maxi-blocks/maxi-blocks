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
	const { type, blockStyle, label, onChange, clientId } = props;

	return (
		<ColorControl
			label={label}
			color={type}
			defaultColor={getDefaultAttribute(type)}
			disableOpacity
			onChange={val => onChange({ type: val })}
			showPalette
			blockStyle={blockStyle}
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
