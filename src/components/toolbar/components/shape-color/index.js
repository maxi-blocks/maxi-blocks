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
	getColorRGBAString,
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
						background: props['shape-fill-palette-status']
							? getColorRGBAString({
									firstVar: `color-${props['shape-fill-palette-color']}`,
									opacity:
										props['shape-fill-palette-opacity'],
									blockStyle: getBlockStyle(clientId),
							  })
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
					paletteColor={props['shape-fill-palette-color']}
					paletteStatus={props['shape-fill-palette-status']}
					onChange={({ color, paletteColor, paletteStatus }) => {
						onChange({
							'shape-fill-color': color,
							'shape-fill-palette-color': paletteColor,
							'shape-fill-palette-status': paletteStatus,
						});
					}}
					disableOpacity
				/>
			</div>
		</ToolbarPopover>
	);
};

export default ShapeColor;
