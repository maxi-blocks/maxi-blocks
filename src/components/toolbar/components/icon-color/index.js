/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import ColorControl from '../../../color-control';
import FancyRadioControl from '../../../fancy-radio-control';
import {
	getColorRGBAString,
	getDefaultAttribute,
} from '../../../../extensions/styles';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const IconColor = props => {
	const { blockName, onChange, parentBlockStyle } = props;

	if (blockName !== 'maxi-blocks/button-maxi') return null;

	const getColor = attr =>
		attr['icon-palette-color-status']
			? getColorRGBAString({
					firstVar: 'icon',
					secondVar: `color-${attr['icon-palette-color']}`,
					blockStyle: parentBlockStyle,
					opacity: attr['icon-palette-opacity'],
			  })
			: attr['icon-color'];

	return (
		<ToolbarPopover
			className='toolbar-item__background'
			tooltip={__('Icon Colour', 'maxi-blocks')}
			icon={
				<div
					className='toolbar-item__icon'
					style={{
						background: getColor(props),
						border: '1px solid #fff',
					}}
				/>
			}
			advancedOptions='icon'
		>
			<div className='toolbar-item__icon-color__popover'>
				<FancyRadioControl
					label={__(
						'Inherit Colour/Backgrond from Button',
						'maxi-block'
					)}
					selected={props['icon-inherit']}
					options={[
						{
							label: __('Yes', 'maxi-block'),
							value: 1,
						},
						{ label: __('No', 'maxi-block'), value: 0 },
					]}
					onChange={val =>
						onChange({
							'icon-inherit': val,
						})
					}
				/>
				{props['icon-inherit'] ? (
					<p className='toolbar-item__icon-color__popover__warning'>
						{__(
							'Icon color is inheriting from button.',
							'maxi-button'
						)}
					</p>
				) : (
					<ColorControl
						label={__('Icon', 'maxi-blocks')}
						color={props['icon-color']}
						defaultColor={getDefaultAttribute('icon-color')}
						paletteColor={props['icon-palette-color']}
						paletteStatus={props['icon-palette-color-status']}
						onChange={({ color, paletteColor, paletteStatus }) => {
							onChange({
								'icon-color': color,
								'icon-palette-color': paletteColor,
								'icon-palette-color-status': paletteStatus,
							});
						}}
						showPalette
						disableOpacity
					/>
				)}
			</div>
		</ToolbarPopover>
	);
};

export default IconColor;
