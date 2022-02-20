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
import { toolbarShapeColor } from '../../../../icons';

/**
 * Component
 */
const IconColor = props => {
	const { blockName, onChange } = props;

	if (blockName !== 'maxi-blocks/button-maxi') return null;

	return (
		<ToolbarPopover
			className='toolbar-item__background'
			tooltip={__('Icon Colour', 'maxi-blocks')}
			icon={toolbarShapeColor}
			advancedOptions='icon'
		>
			<div className='toolbar-item__icon-color__popover'>
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
					<p className='toolbar-item__icon-color__popover__warning'>
						{__(
							'Icon colour is inheriting from button.',
							'maxi-button'
						)}
					</p>
				) : (
					<ColorControl
						label={__('', 'maxi-blocks')}
						color={props['icon-color']}
						defaultColor={getDefaultAttribute('icon-color')}
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
