/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import ColorControl from '../../../color-control';
import { getDefaultAttribute } from '../../../../extensions/styles';

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
			? `var(--maxi-${parentBlockStyle}-icon, var(--maxi-${parentBlockStyle}-color-${attr['icon-palette-color']}))`
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
		>
			<div className='toolbar-item__icon-color__popover'>
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
			</div>
		</ToolbarPopover>
	);
};

export default IconColor;
