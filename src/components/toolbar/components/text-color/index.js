/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { ColorPicker, Icon } = wp.components;
const { useSelect } = wp.data;
const { toggleFormat, create, toHTMLString, getActiveFormat } = wp.richText;

/**
 * Internal dependencies
 */
import { getLastBreakpointValue } from '../../../../utils';
import ToolbarPopover from '../toolbar-popover';

/**
 * External dependencies
 */
import { isObject, isNil } from 'lodash';

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
		node,
		content,
		breakpoint,
		isList,
		typeOfList,
	} = props;

	const formatName = 'maxi-blocks/text-color';

	const formatElement = {
		element: node,
		html: content,
		multilineTag: isList ? 'li' : undefined,
		multilineWrapperTags: isList ? typeOfList : undefined,
		__unstableIsEditableTree: true,
	};

	const { formatValue, isActive, currentColor } = useSelect(
		select => {
			const { getSelectionStart, getSelectionEnd } = select(
				'core/block-editor'
			);
			const formatValue = create(formatElement);
			formatValue.start = getSelectionStart().offset;
			formatValue.end = getSelectionEnd().offset;

			const activeFormat = getActiveFormat(formatValue, formatName);
			const isActive =
				(!isNil(activeFormat) && activeFormat.type === formatName) ||
				false;

			const currentColor =
				(isActive && activeFormat.attributes.color) || '';

			return {
				formatValue,
				isActive,
				currentColor,
			};
		},
		[getActiveFormat, formatElement]
	);

	if (blockName !== 'maxi-blocks/text-maxi') return null;

	const value =
		(!isObject(typography) && JSON.parse(typography)) || typography;

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

		const newFormat = toggleFormat(formatValue, {
			type: formatName,
			isActive,
			attributes: {
				style: `color: ${val.hex}`,
				color: val.hex,
			},
		});

		const newContent = toHTMLString({
			value: newFormat,
			multilineTag: isList ? 'li' : null,
		});

		onChange({ typography: JSON.stringify(value), content: newContent });
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
							background: currentColor,
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
						(isActive && currentColor) ||
						getLastBreakpointValue(value, 'color', breakpoint)
					}
					onChangeComplete={val => onClick(val)}
				/>
			}
		/>
	);
};

export default TextColor;
