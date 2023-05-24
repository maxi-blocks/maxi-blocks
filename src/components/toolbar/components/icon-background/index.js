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
import {
	getAttributeKey,
	getAttributesValue,
	getLastBreakpointAttribute,
} from '../../../../extensions/attributes';

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

	const iconInherit = getAttributesValue({
		target: 'icon-inherit',
		props,
	});

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
					selected={iconInherit}
					onChange={val => {
						onChange({
							'icon-inherit': val,
						});
					}}
				/>
				{iconInherit ? (
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
							target: 'icon-background-color-custom-color',
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
							paletteColor,
							paletteOpacity,
							color,
						}) => {
							onChange(
								{
									[getAttributeKey({
										key: 'background-palette-status',
										isHover,
										prefix: 'icon-',
										breakpoint,
									})]: paletteStatus,
									[getAttributeKey({
										key: 'background-palette-color',
										isHover,
										prefix: 'icon-',
										breakpoint,
									})]: paletteColor,
									[getAttributeKey({
										key: 'background-palette-opacity',
										isHover,
										prefix: 'icon-',
										breakpoint,
									})]: paletteOpacity,
									[getAttributeKey({
										key: 'bc_cc',
										isHover,
										prefix: 'icon-',
										breakpoint,
									})]: color,
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
