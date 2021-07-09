/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import { getDefaultAttribute } from '../../extensions/styles';

/**
 * ShapeColor
 */
const ShapeColor = props => {
	const { onChange } = props;

	return (
		<ColorControl
			label={__('Shape', 'maxi-blocks')}
			color={props['shape-fill-color']}
			defaultColor={getDefaultAttribute('shape-fill-color')}
			paletteColor={props['shape-palette-fill-color']}
			paletteStatus={props['shape-palette-fill-color-status']}
			onChange={({ color, paletteColor, paletteStatus }) => {
				onChange({
					'shape-fill-color': color,
					'shape-palette-fill-color': paletteColor,
					'shape-palette-fill-color-status': paletteStatus,
				});
			}}
			showPalette
			disableOpacity
		/>
	);
};

export default ShapeColor;
