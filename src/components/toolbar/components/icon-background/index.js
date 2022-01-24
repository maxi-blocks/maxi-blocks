/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import ColorControl from '../../../color-control';
import SettingTabsControl from '../../../setting-tabs-control';
import ToggleSwitch from '../../../toggle-switch';
import {
	getColorRGBAString,
	getDefaultAttribute,
} from '../../../../extensions/styles';

/**
 * Styles
 */
import './editor.scss';
import { backgroundColor } from '../../../../icons';

/**
 * Component
 */
const IconBackground = props => {
	const { blockName, onChange, parentBlockStyle } = props;

	if (blockName !== 'maxi-blocks/button-maxi') return null;

	const getColor = attr =>
		attr['icon-background-palette-status']
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
			icon={backgroundColor}
			// icon={
			// 	<div
			// 		className='toolbar-item__background'
			// 		style={{
			// 			background: getColor(props),
			// 			border: '1px solid #fff',
			// 		}}
			// 	/>
			// }
			advancedOptions='icon'
		>
			<div className='toolbar-item__icon-background__popover'>
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
				{/* <SettingTabsControl
					label={__(
						'Inherit Colour/Background from Button',
						'maxi-block'
					)}
					type='buttons'
					selected={props['icon-inherit']}
					items={[
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
				/> */}
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
						paletteStatus={props['icon-background-palette-status']}
						onChange={({ color, paletteColor, paletteStatus }) => {
							onChange({
								'icon-background-color': color,
								'icon-background-palette-color': paletteColor,
								'icon-background-palette-status': paletteStatus,
							});
						}}
						disableOpacity
					/>
				)}
			</div>
		</ToolbarPopover>
	);
};

export default IconBackground;
