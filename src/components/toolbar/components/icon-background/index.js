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
	getLastBreakpointAttribute,
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
	const { blockName, onChange, breakpoint, isHover = false } = props;

	if (blockName !== 'maxi-blocks/button-maxi') return null;

	return (
		<ToolbarPopover
			className='toolbar-item__background'
			tooltip={__('Icon Background', 'maxi-blocks')}
			icon={backgroundColor}
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
						color={getLastBreakpointAttribute(
							'icon-background-color',
							breakpoint,
							props,
							isHover
						)}
						prefix='icon-background-'
						paletteStatus={getLastBreakpointAttribute(
							'icon-background-palette-status',
							breakpoint,
							props,
							isHover
						)}
						paletteOpacity={getLastBreakpointAttribute(
							'icon-background-palette-opacity',
							breakpoint,
							props,
							isHover
						)}
						paletteColor={getLastBreakpointAttribute(
							'icon-background-palette-color',
							breakpoint,
							props,
							isHover
						)}
						deviceType={breakpoint}
						useBreakpointForDefault
						onChange={({
							color,
							paletteColor,
							paletteStatus,
							paletteOpacity,
						}) => {
							onChange({
								[getAttributeKey(
									'background-palette-status',
									isHover,
									'icon-',
									breakpoint
								)]: paletteStatus,
								[getAttributeKey(
									'background-palette-opacity',
									isHover,
									'icon-',
									breakpoint
								)]: paletteOpacity,
								[getAttributeKey(
									'background-palette-color',
									isHover,
									'icon-',
									breakpoint
								)]: paletteColor,
								[getAttributeKey(
									'background-color',
									isHover,
									'icon-',
									breakpoint
								)]: color,
							});
						}}
					/>
				)}
			</div>
		</ToolbarPopover>
	);
};

export default IconBackground;
