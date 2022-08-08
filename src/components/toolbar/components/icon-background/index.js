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
import { getLastBreakpointAttribute } from '../../../../extensions/styles';

/**
 * Styles
 */
import './editor.scss';
import { backgroundColor } from '../../../../icons';

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
							'Icon background is inheriting from button.',
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
						onChange={obj => {
							onChange(
								{
									...('paletteStatus' in obj && {
										[`icon-background-palette-status-${breakpoint}${
											isHover ? '-hover' : ''
										}`]: obj.paletteStatus,
									}),
									...('paletteColor' in obj && {
										[`icon-background-palette-color-${breakpoint}${
											isHover ? '-hover' : ''
										}`]: obj.paletteColor,
									}),
									...('paletteOpacity' in obj && {
										[`icon-background-palette-opacity-${breakpoint}${
											isHover ? '-hover' : ''
										}`]: obj.paletteOpacity,
									}),
									...('color' in obj && {
										[`icon-background-color-${breakpoint}${
											isHover ? '-hover' : ''
										}`]: obj.color,
									}),
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
