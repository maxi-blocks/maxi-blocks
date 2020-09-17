/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { ColorPicker, Icon } = wp.components;
const { useSelect } = wp.data;
const { getActiveFormat } = wp.richText;

/**
 * Internal dependencies
 */
import { getLastBreakpointValue } from '../../../../utils';
import ToolbarPopover from '../toolbar-popover';
import {
	__experimentalIsFormatActive,
	__experimentalSetFormatWithClass,
	__experimentalGetFormatClassName,
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

	const formatName = 'maxi-blocks/text-custom';

	const value =
		(!isObject(typography) && JSON.parse(typography)) || typography;

	const { isActive, currentClassName } = useSelect(() => {
		const isActive = __experimentalIsFormatActive(formatValue, formatName);

		const currentClassName = __experimentalGetFormatClassName(
			formatValue,
			formatName
		);

		return {
			isActive,
			currentClassName,
		};
	}, [
		getActiveFormat,
		__experimentalIsFormatActive,
		formatValue,
		formatName,
	]);

	if (blockName !== 'maxi-blocks/text-maxi') return null;

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
			isActive,
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
						(isActive && {
							background:
								value.customFormats[currentClassName][
									breakpoint
								].color,
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
						(isActive &&
							value.customFormats[currentClassName][breakpoint]
								.color) ||
						getLastBreakpointValue(value, 'color', breakpoint)
					}
					onChangeComplete={val => onClick(val)}
				/>
			}
		/>
	);
};

export default TextColor;
