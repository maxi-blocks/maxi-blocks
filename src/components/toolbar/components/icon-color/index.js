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
	const { blockName, onChangeInline, onChange, svgType, parentBlockStyle } =
		props;

	if (blockName !== 'maxi-blocks/button-maxi') return null;

	return (
		<ToolbarPopover
			className='toolbar-item__background'
			position='bottom center'
			tooltip={__('Icon Colour', 'maxi-blocks')}
			icon={toolbarShapeColor}
			advancedOptions='icon'
		>
			<div className='toolbar-item__icon-color__popover'>
				<ToggleSwitch
					label={__(
						'Inherit Colour/Background from Button',
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
								color={props['icon-color']}
								prefix='icon-'
								paletteColor={props['icon-palette-color']}
								paletteStatus={props['icon-palette-status']}
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
								}) => {
									const lineColorStr = getColorRGBAString({
										firstVar: 'icon-line',
										secondVar: `color-${paletteColor}`,
										opacity: props['icon-palette-opacity'],
										blockStyle: parentBlockStyle,
									});

									onChange(
										{
											'icon-color': color,
											'icon-palette-color': paletteColor,
											'icon-palette-status':
												paletteStatus,
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
								label={__('Icon Fill', 'maxi-blocks')}
								color={props['icon-fill-color']}
								prefix='icon-fill'
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
								onChange={({
									color,
									paletteColor,
									paletteStatus,
								}) => {
									const fillColorStr = getColorRGBAString({
										firstVar: 'icon-fill',
										secondVar: `color-${paletteColor}`,
										opacity:
											props['icon-fill-palette-opacity'],
										blockStyle: parentBlockStyle,
									});

									onChange(
										{
											'icon-fill-color': color,
											'icon-fill-palette-color':
												paletteColor,
											'icon-fill-palette-status':
												paletteStatus,
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
