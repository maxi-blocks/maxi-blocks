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
import {
	getAttributeKey,
	getAttributeValue,
	getColorRGBAString,
} from '../../../../extensions/styles';
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
								color={getAttributeValue({
									target: 'color',
									prefix: 'icon-stroke-',
									props,
								})}
								prefix='icon-stroke-'
								paletteColor={getAttributeValue({
									target: 'palette-color',
									prefix: 'icon-stroke-',
									props,
								})}
								paletteStatus={getAttributeValue({
									target: 'palette-status',
									prefix: 'icon-stroke-',
									props,
								})}
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
										firstVar: 'icon-stroke',
										secondVar: `color-${paletteColor}`,
										opacity: getAttributeValue({
											target: 'palette-opacity',
											prefix: 'icon-stroke-',
											props,
										}),
										blockStyle,
									});

									onChange(
										{
											[getAttributeKey(
												'color',
												false,
												'icon-stroke-'
											)]: color,
											[getAttributeKey(
												'palette-color',
												false,
												'icon-stroke-'
											)]: paletteColor,
											[getAttributeKey(
												'palette-status',
												false,
												'icon-stroke-'
											)]: paletteStatus,
											[getAttributeKey(
												'content',
												false,
												'icon-'
											)]: setSVGContent(
												getAttributeValue({
													target: 'content',
													prefix: 'icon-',
													props,
												}),
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
								color={getAttributeValue({
									target: 'color',
									prefix: 'icon-fill-',
									props,
								})}
								prefix='icon-fill-'
								paletteColor={getAttributeValue({
									target: 'palette-color',
									prefix: 'icon-fill-',
									props,
								})}
								paletteStatus={getAttributeValue({
									target: 'palette-status',
									prefix: 'icon-fill-',
									props,
								})}
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
										opacity: getAttributeValue({
											target: 'palette-opacity',
											prefix: 'icon-fill-',
											props,
										}),
										blockStyle,
									});

									onChange(
										{
											[getAttributeKey(
												'color',
												false,
												'icon-fill-'
											)]: color,
											[getAttributeKey(
												'palette-color',
												false,
												'icon-fill-'
											)]: paletteColor,
											[getAttributeKey(
												'palette-status',
												false,
												'icon-fill-'
											)]: paletteStatus,
											[getAttributeKey(
												'content',
												false,
												'icon-'
											)]: setSVGContent(
												getAttributeValue({
													target: 'content',
													prefix: 'icon-',
													props,
												}),
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
