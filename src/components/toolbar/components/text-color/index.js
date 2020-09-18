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
	__experimentalSetFormatWithClass,
	__experimentalGetCustomFormatValue,
} from '../../../../extensions/text/formats';

/**
 * External dependencies
 */
import { isObject } from 'lodash';

/**
 * Icons
 */
import './editor.scss';
import { toolbarType } from '../../../../icons';

/**
 * TextColor
 */
const TextColor = props => {
	const {
		blockName,
		typography,
		onChange,
		content,
		breakpoint,
		isList,
		formatValue,
	} = props;

	if (blockName !== 'maxi-blocks/text-maxi') return null;

	const value =
		(!isObject(typography) && JSON.parse(typography)) || typography;

	const color = __experimentalGetCustomFormatValue({
		typography: value,
		formatValue,
		prop: 'color',
		breakpoint,
	});

	const returnColor = val => {
		return `rgba(${val.rgb.r},${val.rgb.g},${val.rgb.b},${val.rgb.a})`;
	};

	const updateTypography = val => {
		value[breakpoint].color = returnColor(val);

		onChange({ typography: JSON.stringify(value), content });
	};

	const onClick = val => {
		if (formatValue.start === formatValue.end) {
			updateTypography(val);
			return;
		}

		const {
			typography: newTypography,
			content: newContent,
		} = __experimentalSetFormatWithClass({
			formatValue,
			isList,
			typography: value,
			value: {
				color: val.hex,
			},
			breakpoint,
		});

		onChange({
			typography: JSON.stringify(newTypography),
			content: newContent,
		});
	};

	return (
		<ToolbarPopover
			className='toolbar-item__text-options'
			tooltip={__('Text options', 'maxi-blocks')}
			icon={
				<div
					className='toolbar-item__text-options__icon'
					style={
						(color && {
							background: color,
						}) || {
							background: getLastBreakpointValue(
								value,
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
						getLastBreakpointValue(value, 'color', breakpoint)
					}
					onChangeComplete={val => onClick(val)}
				/>
			}
		/>
	);
};

export default TextColor;
