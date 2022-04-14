/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import { getDefaultAttribute } from '../../extensions/styles';

/**
 * SvgColor
 */
const SvgColor = props => {
	const { type, label, onChange, disableOpacity = true, prefix = '' } = props;

	return (
		<>
			{type === 'line' ? (
				<ColorControl
					label={label}
					className='maxi-color-control__SVG-line-color'
					color={props['svg-line-color']}
					prefix='svg-line-'
					paletteColor={props[`${prefix}svg-line-palette-color`]}
					paletteStatus={props[`${prefix}svg-line-palette-status`]}
					paletteOpacity={props[`${prefix}svg-line-palette-opacity`]}
					onChange={({
						color,
						paletteColor,
						paletteStatus,
						paletteOpacity,
					}) => {
						onChange({
							[`${prefix}svg-line-color`]: color,
							[`${prefix}svg-line-palette-color`]: paletteColor,
							[`${prefix}svg-line-palette-status`]: paletteStatus,
							[`${prefix}svg-line-palette-opacity`]:
								paletteOpacity,
						});
					}}
					globalProps={{ target: 'line', type: 'icon' }}
					disableOpacity={disableOpacity}
				/>
			) : (
				<ColorControl
					label={label}
					className='maxi-color-control__SVG-fill-color'
					color={props[`${prefix}svg-fill-color`]}
					prefix='svg-fill-'
					paletteColor={props[`${prefix}svg-fill-palette-color`]}
					paletteStatus={props[`${prefix}svg-fill-palette-status`]}
					paletteOpacity={props[`${prefix}svg-fill-palette-opacity`]}
					onChange={({
						color,
						paletteColor,
						paletteStatus,
						paletteOpacity,
					}) => {
						onChange({
							[`${prefix}svg-fill-color`]: color,
							[`${prefix}svg-fill-palette-color`]: paletteColor,
							[`${prefix}svg-fill-palette-status`]: paletteStatus,
							[`${prefix}svg-fill-palette-opacity`]:
								paletteOpacity,
						});
					}}
					globalProps={{ target: 'fill', type: 'icon' }}
					disableOpacity={disableOpacity}
				/>
			)}
		</>
	);
};

export default SvgColor;
