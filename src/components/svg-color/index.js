/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import SettingTabsControl from '../setting-tabs-control';

/**
 * SvgColor
 */
const SvgColor = props => {
	const { type, label, onChange, isHover = false } = props;

	return (
		<SettingTabsControl
			items={[
				{
					label: __('Normal state', 'maxi-blocks'),
					content: (
						<>
							{type === 'line' ? (
								<ColorControl
									label={label}
									isHover={isHover}
									className='maxi-color-control__SVG-line-color'
									color={props['svg-line-color']}
									prefix='svg-line-'
									paletteColor={
										props['svg-line-palette-color']
									}
									paletteStatus={
										props['svg-line-palette-status']
									}
									onChange={({
										color,
										paletteColor,
										paletteStatus,
									}) => {
										onChange({
											'svg-line-color': color,
											'svg-line-palette-color':
												paletteColor,
											'svg-line-palette-status':
												paletteStatus,
										});
									}}
									globalProps={{
										target: 'line',
										type: 'icon',
									}}
									disableOpacity
								/>
							) : (
								<ColorControl
									label={label}
									className='maxi-color-control__SVG-fill-color'
									color={props['svg-fill-color']}
									prefix='svg-fill-'
									paletteColor={
										props['svg-fill-palette-color']
									}
									paletteStatus={
										props['svg-fill-palette-status']
									}
									onChange={({
										color,
										paletteColor,
										paletteStatus,
									}) => {
										onChange({
											'svg-fill-color': color,
											'svg-fill-palette-color':
												paletteColor,
											'svg-fill-palette-status':
												paletteStatus,
										});
									}}
									globalProps={{
										target: 'fill',
										type: 'icon',
									}}
									disableOpacity
								/>
							)}
						</>
					),
				},
				{
					label: __('Hover state', 'maxi-blocks'),
					content: <>test</>,
				},
			]}
		/>
	);
};

export default SvgColor;
