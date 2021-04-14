/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import ColorControl from '../../../color-control';
import { getCustomFormatValue } from '../../../../extensions/text/formats';
import {
	getGroupAttributes,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../../../extensions/styles';

/**
 * Icons
 */
import './editor.scss';
import { toolbarType } from '../../../../icons';

/**
 * TextColor
 */
const TextColor = props => {
	const { blockName, onChange, breakpoint, blockStyle, formatValue } = props;

	if (blockName !== 'maxi-blocks/text-maxi') return null;

	const typography = { ...getGroupAttributes(props, 'typography') };

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [color, setColor] = useState(
		getCustomFormatValue({
			typography,
			formatValue,
			prop: 'color',
			breakpoint,
		})
	);

	return (
		<ToolbarPopover
			className='toolbar-item__text-options'
			tooltip={__('Text Colour', 'maxi-blocks')}
			icon={
				<div
					className='toolbar-item__text-options__icon'
					style={
						(color && {
							background: color,
						}) || {
							background: getLastBreakpointAttribute(
								typography,
								'color',
								breakpoint
							),
						}
					}
				>
					<Icon
						className='toolbar-item__text-options__inner-icon'
						icon={toolbarType}
					/>
				</div>
			}
			content={
				<div className='toolbar-item__text-color__popover'>
					<ColorControl
						label={__('Text', 'maxi-blocks')}
						defaultColor={getDefaultAttribute('color')}
						color={
							color ||
							getLastBreakpointAttribute(
								'color',
								breakpoint,
								typography
							)
						}
						onChange={val =>
							onChange({
								[`color-${breakpoint}`]: val,
							})
						}
						showPalette
						blockStyle={blockStyle}
						palette={{ ...getGroupAttributes(props, 'palette') }}
						colorPaletteType='typography'
						onChangePalette={val => onChange(val)}
						deviceType={breakpoint}
					/>
				</div>
			}
		/>
	);
};

export default TextColor;
