/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import ColorControl from '../../../color-control';
import { getBlockStyle } from '../../../../extensions/styles';

/**
 * Styles
 */
import './editor.scss';

/**
 * SvgColor
 */
const SvgColor = props => {
	const { type, blockName, svgColor, svgColorDefault, onChange, clientId } =
		props;

	if (blockName !== 'maxi-blocks/svg-icon-maxi') return null;

	return (
		<ToolbarPopover
			className='toolbar-item__background'
			tooltip={__(
				`SVG ${type === 'svgColorFill' ? 'Fill' : 'Line'} Colour`,
				'maxi-blocks'
			)}
			icon={
				<div
					className='toolbar-item__icon'
					style={{
						background: props[`svg-palette-${type}-color-status`]
							? `var(--maxi-${getBlockStyle(clientId)}-color-${
									props[`svg-palette-${type}-color`]
							  })`
							: svgColor,
						border: '1px solid #fff',
					}}
				/>
			}
		>
			<div className='toolbar-item__svg-color__popover'>
				<ColorControl
					label={__('SVG', 'maxi-blocks')}
					color={svgColor}
					defaultColor={svgColorDefault}
					paletteColor={props[`svg-palette-${type}-color`]}
					paletteStatus={props[`svg-palette-${type}-color-status`]}
					onChange={({ color, paletteColor, paletteStatus }) =>
						onChange({
							[`${type}`]: color,
							[`svg-palette-${type}-color`]: paletteColor,
							[`svg-palette-${type}-color-status`]: paletteStatus,
						})
					}
					disableGradient
					showPalette
				/>
			</div>
		</ToolbarPopover>
	);
};

export default SvgColor;
