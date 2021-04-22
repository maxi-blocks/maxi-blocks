/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import ColorControl from '../../../color-control';

/**
 * SvgColor
 */
const SvgColor = props => {
	const { blockName, svgColor, svgColorDefault, onChange } = props;

	if (blockName !== 'maxi-blocks/svg-icon-maxi') return null;

	return (
		<ToolbarPopover
			className='toolbar-item__background'
			tooltip={__('SVG color', 'maxi-blocks')}
			icon={
				<div
					className='toolbar-item__icon'
					style={{
						background: svgColor,
						border: '1px solid #fff',
					}}
				/>
			}
			content={
				<ColorControl
					label={__('SVG', 'maxi-blocks')}
					color={svgColor}
					defaultColor={svgColorDefault}
					onChange={val => onChange({ [svgColor]: val })}
					disableGradient
				/>
			}
		/>
	);
};

export default SvgColor;
