/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { ColorPicker, Icon } = wp.components;
const { useState } = wp.element;

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import {
	setFormat,
	getCustomFormatValue,
} from '../../../../extensions/text/formats';
import {
	getGroupAttributes,
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
	const { blockName, onChange, breakpoint, isList, formatValue } = props;

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

	const returnColor = val => {
		return `rgba(${val.rgb.r},${val.rgb.g},${val.rgb.b},${val.rgb.a})`;
	};

	const onClick = val => {
		const obj = setFormat({
			formatValue,
			isList,
			typography,
			value: {
				color: returnColor(val),
			},
			breakpoint,
		});

		setColor(returnColor(val));

		onChange(obj);
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
				<ColorPicker
					color={
						color ||
						getLastBreakpointAttribute(
							'color',
							breakpoint,
							typography
						)
					}
					onChangeComplete={obj => onClick(obj)}
				/>
			}
		/>
	);
};

export default TextColor;
