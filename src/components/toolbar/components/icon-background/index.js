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
import { getDefaultAttribute } from '../../../../extensions/styles';

/**
 * Styles
 */
import './editor.scss';
import { backgroundColor } from '../../../../icons';

/**
 * Component
 */
const IconBackground = props => {
	const { blockName, onChange } = props;

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
					/>
				)}
			</div>
		</ToolbarPopover>
	);
};

export default IconBackground;
