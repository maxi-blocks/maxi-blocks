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
const IconBackground = props => {
	const { blockName, onChange, parentBlockStyle } = props;

	if (blockName !== 'maxi-blocks/button-maxi') return null;

	const getColor = attr =>
		attr['icon-background-palette-color-status']
			? getColorRGBAString({
					firstVar: 'icon',
					secondVar: `color-${attr['icon-background-palette-color']}`,
					blockStyle: parentBlockStyle,
					opacity: attr['icon-background-palette-color'],
			  })
			: attr['icon-background-color'];

	return (
		<ToolbarPopover
			className='toolbar-item__background'
			tooltip={__('Icon Background', 'maxi-blocks')}
			icon={
				<div
					className='toolbar-item__background'
					style={{
						background: getColor(props),
						border: '1px solid #fff',
					}}
				/>
			}
			advancedOptions='icon'
		>
			<div className='toolbar-item__icon-background__popover'>
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
					<p className='toolbar-item__icon-background__popover__warning'>
						{__(
							'Icon background is inheriting from button.',
							'maxi-button'
						)}
					</p>
				) : (
					<ColorControl
						label={__('Icon Background', 'maxi-blocks')}
						color={props['icon-background-color']}
						defaultColor={getDefaultAttribute(
							'icon-background-color'
						)}
						paletteColor={props['icon-background-palette-color']}
						paletteStatus={
							props['icon-background-palette-color-status']
						}
						onChange={({ color, paletteColor, paletteStatus }) => {
							onChange({
								'icon-background-color': color,
								'icon-background-palette-color': paletteColor,
								'icon-background-palette-color-status':
									paletteStatus,
							});
						}}
					/>
				)}
			</div>
		</ToolbarPopover>
	);
};

export default IconBackground;
