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
					className='maxi-color-control__SVG-line-color'
					color={props['svg-line-color']}
					prefix='svg-line-'
					paletteColor={props['svg-line-palette-color']}
					paletteStatus={props['svg-line-palette-status']}
					onChange={({ color, paletteColor, paletteStatus }) => {
						onChange({
							'svg-line-color': color,
							'svg-line-palette-color': paletteColor,
							'svg-line-palette-status': paletteStatus,
						});
					}}
					globalProps={{ target: 'line', type: 'icon' }}
					disableOpacity
				/>
			) : (
				<ColorControl
					label={label}
					className='maxi-color-control__SVG-fill-color'
					color={props['svg-fill-color']}
					prefix='svg-fill-'
					paletteColor={props['svg-fill-palette-color']}
					paletteStatus={props['svg-fill-palette-status']}
					onChange={({ color, paletteColor, paletteStatus }) => {
						onChange({
							'svg-fill-color': color,
							'svg-fill-palette-color': paletteColor,
							'svg-fill-palette-status': paletteStatus,
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
