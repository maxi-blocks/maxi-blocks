/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '@components/toolbar/components/toolbar-popover';
import ColorControl from '@components/color-control';
import ToggleSwitch from '@components/toggle-switch';

/**
 * Styles
 */
import './editor.scss';
import { toolbarShapeColor } from '@maxi-icons';
import { getColorRGBAString } from '@extensions/styles';
import { setSVGContent } from '@extensions/svg';

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
							'Icon colour is inherited from button.',
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
								paletteSCStatus={
									props['icon-stroke-palette-sc-status']
								}
								onChangeInline={({ color }) =>
									onChangeInline(
										{ stroke: color },
										'[data-stroke]'
									)
								}
								onChange={({
									color,
									paletteColor,
									paletteStatus,
									paletteSCStatus,
								}) => {
									const lineColorStr = getColorRGBAString(
										paletteSCStatus
											? {
													firstVar: 'icon-stroke',
													secondVar: `color-${paletteColor}`,
													opacity:
														props[
															'icon-stroke-palette-opacity'
														],
													blockStyle,
											  }
											: {
													firstVar: 'icon-stroke',
													secondVar: `color-${paletteColor}`,
													opacity:
														props[
															'icon-stroke-palette-opacity'
														],
													blockStyle,
											  }
									);

									onChange(
										{
											'icon-stroke-color': color,
											'icon-stroke-palette-color':
												paletteColor,
											'icon-stroke-palette-status':
												paletteStatus,
											'icon-stroke-palette-sc-status':
												paletteSCStatus,
											'icon-content': setSVGContent(
												props['icon-content'],
												paletteStatus
													? lineColorStr
													: color,
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
								paletteSCStatus={
									props['icon-fill-palette-sc-status']
								}
								onChangeInline={({ color }) =>
									onChangeInline(
										{ fill: color },
										'[data-fill]'
									)
								}
								onChange={({
									color,
									paletteColor,
									paletteStatus,
									paletteSCStatus,
								}) => {
									const fillColorStr = getColorRGBAString(
										paletteSCStatus
											? {
													firstVar: `color-${paletteColor}`,
													opacity:
														props[
															'icon-fill-palette-opacity'
														],
													blockStyle,
											  }
											: {
													firstVar: 'icon-fill',
													secondVar: `color-${paletteColor}`,
													opacity:
														props[
															'icon-fill-palette-opacity'
														],
													blockStyle,
											  }
									);

									onChange(
										{
											'icon-fill-color': color,
											'icon-fill-palette-color':
												paletteColor,
											'icon-fill-palette-status':
												paletteStatus,
											'icon-fill-palette-sc-status':
												paletteSCStatus,
											'icon-content': setSVGContent(
												props['icon-content'],
												paletteStatus
													? fillColorStr
													: color,
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
