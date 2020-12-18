/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { ColorPicker, Icon } = wp.components;

/**
 * Internal dependencies
 */
import { getLastBreakpointValue } from '../../../../utils';
import ToolbarPopover from '../toolbar-popover';
import {
	setFormat,
	getCustomFormatValue,
} from '../../../../extensions/text/formats';

/**
 * Icons
 */
import './editor.scss';
import { toolbarType } from '../../../../icons';

/**
 * TextColor
 */
const TextColor = props => {
	const { blockName, onChange, breakpoint, isList, formatValue } = props;

	if (blockName !== 'maxi-blocks/text-maxi') return null;

	const typography = { ...props.typography };

	const color = getCustomFormatValue({
		typography,
		formatValue,
		prop: 'color',
		breakpoint,
	});

	const returnColor = val => {
		return `rgba(${val.rgb.r},${val.rgb.g},${val.rgb.b},${val.rgb.a})`;
	};

	const onClick = val => {
		const { typography: newTypography, content: newContent } = setFormat({
			formatValue,
			isList,
			typography,
			value: {
				color: returnColor(val),
			},
			breakpoint,
		});

		onChange({
			typography: newTypography,
			...(newContent && { content: newContent }),
		});
	};

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
							background: getLastBreakpointValue(
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
				<ColorPicker
					color={
						color ||
						getLastBreakpointValue(typography, 'color', breakpoint)
					}
					onChangeComplete={val => onClick(val)}
				/>
			}
		/>
	);
};

export default TextColor;
