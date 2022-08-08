/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import ColorControl from '../../../color-control';
import ToggleSwitch from '../../../toggle-switch';

/**
 * Styles
 */
import './editor.scss';
import { toolbarShapeColor } from '../../../../icons';
import { getColorRGBAString } from '../../../../extensions/styles';
import { setSVGContent } from '../../../../extensions/svg';

/**
 * Component
 */
const IconColor = props => {
	const { blockName, onChangeInline, onChange, svgType, blockStyle } = props;

	if (blockName !== 'maxi-blocks/button-maxi') return null;

	return (
		<ToolbarPopover
			className='toolbar-item__background'
			tooltip={__('Icon Colour', 'maxi-blocks')}
			position='bottom center'
			icon={toolbarShapeColor}
			advancedOptions='icon'
		>
			<div className='toolbar-item__icon-color__popover'>
				<ToggleSwitch
					label={__(
						'Inherit colour/background from button',
						'maxi-blocks'
					)}
					selected={props['icon-inherit']}
					onChange={val => {
						onChange({
							'icon-inherit': val,
						});
					}}
				/>
				{props['icon-inherit'] ? (
					<p className='toolbar-item__icon-color__popover__warning'>
						{__(
							'Icon colour is inheriting from button.',
							'maxi-button'
						)}
					</p>
				) : (
					<>
						{svgType !== 'Shape' && (
							<ColorControl
								label={__('Icon stroke', 'maxi-blocks')}
								color={props['icon-stroke-color']}
								prefix='icon-stroke-'
								paletteColor={
									props['icon-stroke-palette-color']
								}
								paletteStatus={
									props['icon-stroke-palette-status']
								}
								onChangeInline={({ color }) =>
									onChangeInline(
										{ stroke: color },
										'[data-stroke]'
									)
								}
								onChange={obj => {
									const lineColorStr = getColorRGBAString({
										firstVar: 'icon-stroke',
										secondVar: `color-${
											obj.paletteColor ??
											props['icon-stroke-palette-color']
										}`,
										opacity:
											props[
												'icon-stroke-palette-opacity'
											],
										blockStyle,
									});

									onChange(
										{
											...('color' in obj && {
												'icon-stroke-color': obj.color,
											}),
											...('paletteColor' in obj && {
												'icon-stroke-palette-color':
													obj.paletteColor,
											}),
											...('paletteStatus' in obj && {
												'icon-stroke-palette-status':
													obj.paletteStatus,
											}),
											'icon-content': setSVGContent(
												props['icon-content'],
												obj.paletteStatus ??
													props[
														'icon-stroke-palette-status'
													]
													? lineColorStr
													: obj.color ??
															props[
																'icon-stroke-color'
															],
												'stroke'
											),
										},
										'[data-stroke]'
									);
								}}
								disableOpacity
							/>
						)}
						{svgType !== 'Line' && (
							<ColorControl
								label={__('Icon fill', 'maxi-blocks')}
								color={props['icon-fill-color']}
								prefix='icon-fill-'
								paletteColor={props['icon-fill-palette-color']}
								paletteStatus={
									props['icon-fill-palette-status']
								}
								onChangeInline={({ color }) =>
									onChangeInline(
										{ fill: color },
										'[data-fill]'
									)
								}
								onChange={obj => {
									const fillColorStr = getColorRGBAString({
										firstVar: 'icon-fill',
										secondVar: `color-${
											obj.paletteColor ??
											props['icon-fill-palette-color']
										}`,
										opacity:
											props['icon-fill-palette-opacity'],
										blockStyle,
									});

									onChange(
										{
											...('color' in obj && {
												'icon-fill-color': obj.color,
											}),
											...('paletteColor' in obj && {
												'icon-fill-palette-color':
													obj.paletteColor,
											}),
											...('paletteStatus' in obj && {
												'icon-fill-palette-status':
													obj.paletteStatus,
											}),
											'icon-content': setSVGContent(
												props['icon-content'],
												obj.paletteStatus ??
													props[
														'icon-fill-palette-status'
													]
													? fillColorStr
													: obj.color ??
															props[
																'icon-fill-color'
															],
												'fill'
											),
										},
										'[data-fill]'
									);
								}}
								disableOpacity
							/>
						)}
					</>
				)}
			</div>
		</ToolbarPopover>
	);
};

export default IconColor;
