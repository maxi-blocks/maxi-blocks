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
import {
	getAttributeKey,
	getLastBreakpointAttribute,
} from '@extensions/styles';

/**
 * Styles
 */
import './editor.scss';
import { backgroundColor } from '@maxi-icons';

/**
 * Component
 */
const IconBackground = props => {
	const {
		blockName,
		onChangeInline,
		onChange,
		breakpoint,
		isHover = false,
	} = props;

	if (blockName !== 'maxi-blocks/button-maxi') return null;

	return (
		<ToolbarPopover
			className='toolbar-item__background'
			tooltip={__('Icon Background', 'maxi-blocks')}
			position='bottom center'
			icon={backgroundColor}
			advancedOptions='icon'
		>
			<div className='toolbar-item__icon-background__popover'>
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
					<p className='toolbar-item__icon-background__popover__warning'>
						{__(
							'Icon background is inherited from button ',
							'maxi-button'
						)}
					</p>
				) : (
					<ColorControl
						label={__('Icon background', 'maxi-blocks')}
						paletteStatus={getLastBreakpointAttribute({
							target: 'icon-background-palette-status',
							breakpoint,
							attributes: props,
							isHover,
						})}
						paletteSCStatus={getLastBreakpointAttribute({
							target: 'icon-background-palette-sc-status',
							breakpoint,
							attributes: props,
							isHover,
						})}
						paletteColor={getLastBreakpointAttribute({
							target: 'icon-background-palette-color',
							breakpoint,
							attributes: props,
							isHover,
						})}
						paletteOpacity={getLastBreakpointAttribute({
							target: 'icon-background-palette-opacity',
							breakpoint,
							attributes: props,
							isHover,
						})}
						color={getLastBreakpointAttribute({
							target: 'icon-background-color',
							breakpoint,
							attributes: props,
							isHover,
						})}
						prefix='icon-background-'
						deviceType={breakpoint}
						onChangeInline={({ color }) =>
							onChangeInline &&
							onChangeInline(
								{
									background: color,
								},
								'.maxi-button-block__icon'
							)
						}
						onChange={({
							paletteStatus,
							paletteSCStatus,
							paletteColor,
							paletteOpacity,
							color,
						}) => {
							onChange(
								{
									[getAttributeKey(
										'background-palette-status',
										isHover,
										'icon-',
										breakpoint
									)]: paletteStatus,
									[getAttributeKey(
										'background-palette-sc-status',
										isHover,
										'icon-',
										breakpoint
									)]: paletteSCStatus,
									[getAttributeKey(
										'background-palette-color',
										isHover,
										'icon-',
										breakpoint
									)]: paletteColor,
									[getAttributeKey(
										'background-palette-opacity',
										isHover,
										'icon-',
										breakpoint
									)]: paletteOpacity,
									[getAttributeKey(
										'background-color',
										isHover,
										'icon-',
										breakpoint
									)]: color,
								},
								'.maxi-button-block__icon'
							);
						}}
						isHover={isHover}
					/>
				)}
			</div>
		</ToolbarPopover>
	);
};

export default IconBackground;
