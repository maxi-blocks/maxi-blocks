/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import { getDefaultAttribute, getBlockStyle } from '../../extensions/styles';
import { getSCPropValue } from '../../extensions/style-cards';

/**
 * SvgColor
 */
const SvgColor = props => {
	const { type, label, onChange, clientId } = props;

	return (
		<>
			{type === 'line' ? (
				<ColorControl
					label={label}
					color={props['svg-line-color']}
					defaultColor={getDefaultAttribute('svg-line-color')}
					paletteColor={props['svg-palette-line-color']}
					paletteStatus={props['svg-palette-line-color-status']}
					onChange={({ color, paletteColor, paletteStatus }) => {
						onChange({
							'svg-line-color': color,
							'svg-palette-line-color': paletteColor,
							'svg-palette-line-color-status': paletteStatus,
						});
					}}
					showPalette
					globalStatus={getSCPropValue(
						'line-global',
						getBlockStyle(clientId),
						'icon'
					)}
					disableOpacity
				/>
			) : (
				<ColorControl
					label={label}
					color={props['svg-fill-color']}
					defaultColor={getDefaultAttribute('svg-fill-color')}
					paletteColor={props['svg-palette-fill-color']}
					paletteStatus={props['svg-palette-fill-color-status']}
					onChange={({ color, paletteColor, paletteStatus }) => {
						onChange({
							'svg-fill-color': color,
							'svg-palette-fill-color': paletteColor,
							'svg-palette-fill-color-status': paletteStatus,
						});
					}}
					showPalette
					globalStatus={getSCPropValue(
						'fill-global',
						getBlockStyle(clientId),
						'icon'
					)}
					disableOpacity
				/>
			)}
		</>
	);
};

export default SvgColor;
