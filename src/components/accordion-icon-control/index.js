/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SelectControl, ColorControl, SettingTabsControl } from '..';
import MaxiModal from '../../editor/library/modal';
import { getColorRGBAString } from '../../extensions/styles';
import { setSVGContent } from '../../extensions/svg';

const AccordionIconSettings = props => {
	const { onChange, blockStyle, svgType, svgTypeActive } = props;

	return (
		<>
			<SelectControl
				label={__('Icon position', 'maxi-blocks')}
				options={[
					{
						label: 'Right',
						value: 'right',
					},
					{
						label: 'Left',
						value: 'left',
					},
				]}
				value={props['icon-position']}
				onChange={val =>
					onChange({
						'icon-position': val,
					})
				}
			/>
			<SettingTabsControl
				items={[
					{
						label: __('Normal state', 'maxi-blocks'),
						content: (
							<>
								<MaxiModal
									type='accordion-icon'
									style={blockStyle}
									onSelect={obj => onChange(obj)}
									onRemove={obj => onChange(obj)}
									icon={props['icon-content']}
									label='Icon'
								/>
								{svgType !== 'Shape' && (
									<ColorControl
										label={__('Icon stroke', 'maxi-blocks')}
										className='maxi-icon-styles-control--color'
										color={props['icon-stroke-color']}
										prefix='icon-stroke-'
										paletteColor={
											props['icon-stroke-palette-color']
										}
										paletteOpacity={
											props['icon-stroke-palette-opacity']
										}
										paletteStatus={
											props['icon-stroke-palette-status']
										}
										onChange={({
											color,
											paletteColor,
											paletteStatus,
											paletteOpacity,
										}) => {
											const lineColorStr =
												getColorRGBAString({
													firstVar: 'icon-stroke',
													secondVar: `color-${paletteColor}`,
													opacity: paletteOpacity,
													blockStyle,
												});

											onChange({
												'icon-stroke-color': color,
												'icon-stroke-palette-color':
													paletteColor,
												'icon-stroke-palette-status':
													paletteStatus,
												'icon-stroke-palette-opacity':
													paletteOpacity,
												'icon-content': setSVGContent(
													props['icon-content'],
													paletteStatus
														? lineColorStr
														: color,
													'stroke'
												),
											});
										}}
									/>
								)}
								{svgType !== 'Line' && (
									<ColorControl
										label={__('Icon fill', 'maxi-blocks')}
										className='maxi-icon-styles-control--color'
										color={props['icon-fill-color']}
										prefix='icon-fill-'
										paletteColor={
											props['icon-fill-palette-color']
										}
										paletteOpacity={
											props['icon-fill-palette-opacity']
										}
										paletteStatus={
											props['icon-fill-palette-status']
										}
										onChange={({
											color,
											paletteColor,
											paletteStatus,
											paletteOpacity,
										}) => {
											const lineColorStr =
												getColorRGBAString({
													firstVar: 'icon-fill',
													secondVar: `color-${paletteColor}`,
													opacity: paletteOpacity,
													blockStyle,
												});

											onChange({
												'icon-fill-color': color,
												'icon-fill-palette-color':
													paletteColor,
												'icon-fill-palette-status':
													paletteStatus,
												'icon-fill-palette-opacity':
													paletteOpacity,
												'icon-content': setSVGContent(
													props['icon-content'],
													paletteStatus
														? lineColorStr
														: color,
													'fill'
												),
											});
										}}
									/>
								)}
							</>
						),
					},
					{
						label: __('Active state', 'maxi-blocks'),
						content: (
							<>
								<MaxiModal
									type='accordion-icon-active'
									style={blockStyle}
									onSelect={obj => onChange(obj)}
									onRemove={obj => onChange(obj)}
									icon={props['icon-content-active']}
									label='Icon Active'
								/>
								{svgTypeActive !== 'Shape' && (
									<ColorControl
										label={__('Icon stroke', 'maxi-blocks')}
										className='maxi-icon-styles-control--color'
										color={props['icon-stroke-color']}
										prefix='active-icon-stroke-'
										paletteColor={
											props[
												'active-icon-stroke-palette-color'
											]
										}
										paletteOpacity={
											props[
												'active-icon-stroke-palette-opacity'
											]
										}
										paletteStatus={
											props[
												'active-icon-stroke-palette-status'
											]
										}
										onChange={({
											color,
											paletteColor,
											paletteStatus,
											paletteOpacity,
										}) => {
											const lineColorStr =
												getColorRGBAString({
													firstVar: 'icon-stroke',
													secondVar: `color-${paletteColor}`,
													opacity: paletteOpacity,
													blockStyle,
												});

											onChange({
												'active-icon-stroke-color':
													color,
												'active-icon-stroke-palette-color':
													paletteColor,
												'active-icon-stroke-palette-status':
													paletteStatus,
												'active-icon-stroke-palette-opacity':
													paletteOpacity,
												'icon-content-active':
													setSVGContent(
														props[
															'icon-content-active'
														],
														paletteStatus
															? lineColorStr
															: color,
														'stroke'
													),
											});
										}}
									/>
								)}
								{svgTypeActive !== 'Line' && (
									<ColorControl
										label={__('Icon fill', 'maxi-blocks')}
										className='maxi-icon-styles-control--color'
										color={props['active-icon-fill-color']}
										prefix='active-icon-fill-'
										paletteColor={
											props[
												'active-icon-fill-palette-color'
											]
										}
										paletteOpacity={
											props[
												'active-icon-fill-palette-opacity'
											]
										}
										paletteStatus={
											props[
												'active-icon-fill-palette-status'
											]
										}
										onChange={({
											color,
											paletteColor,
											paletteStatus,
											paletteOpacity,
										}) => {
											const lineColorStr =
												getColorRGBAString({
													firstVar: 'icon-fill',
													secondVar: `color-${paletteColor}`,
													opacity: paletteOpacity,
													blockStyle,
												});

											onChange({
												'active-icon-fill-color': color,
												'active-icon-fill-palette-color':
													paletteColor,
												'active-icon-fill-palette-status':
													paletteStatus,
												'active-icon-fill-palette-opacity':
													paletteOpacity,
												'icon-content-active':
													setSVGContent(
														props[
															'icon-content-active'
														],
														paletteStatus
															? lineColorStr
															: color,
														'fill'
													),
											});
										}}
									/>
								)}
							</>
						),
					},
				]}
			/>
		</>
	);
};
export default AccordionIconSettings;
