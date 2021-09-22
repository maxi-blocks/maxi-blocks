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
					globalProps={{ target: 'line', type: 'icon' }}
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
					globalProps={{ target: 'fill', type: 'icon' }}
					disableOpacity
				/>
			)}
		</>
	);
};

export default SvgColor;
