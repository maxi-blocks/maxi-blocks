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
	getGroupAttributes,
	getBlockStyle,
} from '../../../../extensions/styles';

/**
 * Styles
 */
import './editor.scss';

/**
 * SvgColor
 */
const SvgColor = props => {
	const {
		type,
		blockName,
		svgColor,
		svgColorDefault,
		onChange,
		breakpoint,
		clientId,
	} = props;

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
						background:
							props[`${type}`] ||
							`var(--maxi-${getBlockStyle(clientId)}-color-${
								props[`palette-preset-${type}-color`]
							})`,
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
					onChange={val => onChange({ [`${type}`]: val })}
					disableGradient
					showPalette
					palette={{ ...getGroupAttributes(props, 'palette') }}
					colorPaletteType={type}
					onChangePalette={val => onChange(val)}
					deviceType={breakpoint}
					clientId={clientId}
				/>
			</div>
		</ToolbarPopover>
	);
};

export default SvgColor;
