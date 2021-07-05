/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import ColorControl from '../../../color-control';
import {
	getBlockStyle,
	getDefaultAttribute,
} from '../../../../extensions/styles';

/**
 * Styles
 */
import './editor.scss';

/**
 * ShapeColor
 */
const ShapeColor = props => {
	const { blockName, onChange, clientId } = props;

	if (blockName !== 'maxi-blocks/shape-maxi') return null;

	return (
		<ToolbarPopover
			className='toolbar-item__background'
			tooltip={__('Shape Colour', 'maxi-blocks')}
			icon={
				<div
					className='toolbar-item__icon'
					style={{
						background: props['shape-palette-fill-color-status']
							? `var(--maxi-${getBlockStyle(clientId)}-color-${
									props['shape-palette-fill-color']
							  })`
							: props['shape-fill-color'],
						border: '1px solid #fff',
					}}
				/>
			}
		>
			<div className='toolbar-item__svg-color__popover'>
				<ColorControl
					label={__('Shape', 'maxi-blocks')}
					color={props['shape-fill-color']}
					defaultColor={getDefaultAttribute('shape-fill-color')}
					paletteColor={props['shape-palette-fill-color']}
					paletteStatus={props['shape-palette-fill-color-status']}
					onChange={({ color, paletteColor, paletteStatus }) => {
						onChange({
							'shape-fill-color': color,
							'shape-palette-fill-color': paletteColor,
							'shape-palette-fill-color-status': paletteStatus,
						});
					}}
					showPalette
					disableOpacity
				/>
			</div>
		</ToolbarPopover>
	);
};

export default ShapeColor;
