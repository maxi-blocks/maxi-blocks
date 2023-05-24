/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	getAttributeKey,
	getAttributesValue,
} from '../../../../extensions/attributes';
import { getColorRGBAString } from '../../../../extensions/styles';
import { setSVGContent } from '../../../../extensions/svg';
import ColorControl from '../../../color-control';
import ToggleSwitch from '../../../toggle-switch';
import ToolbarPopover from '../toolbar-popover';

/**
 * Styles
 */
import { toolbarShapeColor } from '../../../../icons';
import './editor.scss';

/**
 * Component
 */
const IconColor = props => {
	const { blockName, onChangeInline, onChange, svgType, blockStyle } = props;

	if (blockName !== 'maxi-blocks/button-maxi') return null;

	const iconInherit = getAttributesValue({
		target: 'icon-inherit',
		props,
	});

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
					selected={iconInherit}
					onChange={val => {
						onChange({
							'icon-inherit': val,
						});
					}}
				/>
				{iconInherit ? (
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
								color={getAttributesValue({
									target: '_cc',
									prefix: 'icon-stroke-',
									props,
								})}
								prefix='icon-stroke-'
								paletteColor={getAttributesValue({
									target: '_pc',
									prefix: 'icon-stroke-',
									props,
								})}
								paletteStatus={getAttributesValue({
									target: '_ps',
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
										opacity: getAttributesValue({
											target: '_po',
											prefix: 'icon-stroke-',
											props,
										}),
										blockStyle,
									});

									onChange(
										{
											[getAttributeKey({
												key: '_cc',
												prefix: 'icon-stroke-',
											})]: color,
											[getAttributeKey({
												key: '_pc',
												prefix: 'icon-stroke-',
											})]: paletteColor,
											[getAttributeKey({
												key: '_ps',
												prefix: 'icon-stroke-',
											})]: paletteStatus,
											[getAttributeKey({
												key: 'content',
												prefix: 'icon-',
											})]: setSVGContent(
												getAttributesValue({
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
								color={getAttributesValue({
									target: '_cc',
									prefix: 'icon-fill-',
									props,
								})}
								prefix='icon-fill-'
								paletteColor={getAttributesValue({
									target: '_pc',
									prefix: 'icon-fill-',
									props,
								})}
								paletteStatus={getAttributesValue({
									target: '_ps',
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
										opacity: getAttributesValue({
											target: '_po',
											prefix: 'icon-fill-',
											props,
										}),
										blockStyle,
									});

									onChange(
										{
											[getAttributeKey({
												key: '_cc',
												prefix: 'icon-fill-',
											})]: color,
											[getAttributeKey({
												key: '_pc',
												prefix: 'icon-fill-',
											})]: paletteColor,
											[getAttributeKey({
												key: '_ps',
												prefix: 'icon-fill-',
											})]: paletteStatus,
											[getAttributeKey({
												key: 'content',
												prefix: 'icon-',
											})]: setSVGContent(
												getAttributesValue({
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
