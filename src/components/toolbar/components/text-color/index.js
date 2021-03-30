/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Icon } = wp.components;

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import ColorControl from '../../../color-control';
import {
	getCustomFormatValue,
	withFormatValue,
} from '../../../../extensions/text/formats';
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
const TextColor = withFormatValue(props => {
	const { blockName, onChange, breakpoint, formatValue } = props;

	if (blockName !== 'maxi-blocks/text-maxi') return null;

	const typography = { ...getGroupAttributes(props, 'typography') };

	const color = getCustomFormatValue({
		typography,
		formatValue,
		prop: 'color',
		breakpoint,
	});

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
				/>
			}
		/>
	);
});

export default TextColor;
