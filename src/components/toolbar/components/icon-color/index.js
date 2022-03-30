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
		attr['icon-palette-status']
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
			tab={0}
		>
			<div className='toolbar-item__icon-color__popover'>
				<SettingTabsControl
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
				/>
				{props['icon-inherit'] ? (
					<p className='toolbar-item__icon-color__popover__warning'>
						{__(
							'Icon colour is inheriting from button.',
							'maxi-button'
						)}
					</p>
				) : (
					<ColorControl
						label={__('Icon', 'maxi-blocks')}
						color={props['icon-color']}
						prefix='icon-'
						paletteColor={props['icon-palette-color']}
						paletteStatus={props['icon-palette-status']}
						onChange={({ color, paletteColor, paletteStatus }) => {
							onChange({
								'icon-color': color,
								'icon-palette-color': paletteColor,
								'icon-palette-status': paletteStatus,
							});
						}}
						disableOpacity
					/>
				)}
			</div>
		</ToolbarPopover>
	);
};

export default IconColor;
