/**
 * WordPress dependencies
 */
const { __, sprintf } = wp.i18n;
const { Fragment } = wp.element;
const { getBlockAttributes } = wp.blocks;
const { Button, BaseControl } = wp.components;
const { useSelect } = wp.data;
const { getActiveFormat } = wp.richText;

/**
 * Internal dependencies
 */
import { getLastBreakpointValue } from '../../../../utils';
import FontFamilySelector from '../../../font-family-selector';
import ToolbarPopover from '../toolbar-popover';
import TextFormatStrikethrough from '../text-format-strikethrough';
import TextFormatUnderline from '../text-format-underline';
import TextFormatSubscript from '../text-format-subscript';
import TextFormatSuperscript from '../text-format-superscript';
import TextFormatCode from '../text-format-code';
import {
	getFormatSettings,
	getFormattedString,
} from '../../../../extensions/text/formats';
import defaultFontSize from './default';

/**
 * External dependencies
 */
import { isObject, isEmpty, trim } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import { toolbarType, reset } from '../../../../icons';

/**
 * TextOptions
 */
const TextOptions = props => {
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

	const defaultRawTypography = getBlockAttributes('maxi-blocks/text-maxi')
		.typography; // ??

	const formatName = 'maxi-blocks/text-size';

	const formatElement = {
		element: node,
		html: content,
		multilineTag: isList ? 'li' : undefined,
		multilineWrapperTags: isList ? typeOfList : undefined,
		__unstableIsEditableTree: true,
	};

	const { formatValue, isActive, currentClassName } = useSelect(() => {
		const { formatValue, isActive } = getFormatSettings(
			formatElement,
			formatName
		);

		const activeFormat = getActiveFormat(formatValue, formatName);

		const currentClassName =
			(isActive && activeFormat.attributes.className) || '';

		return {
			formatValue,
			isActive,
			currentClassName,
		};
	}, [getActiveFormat, formatElement]);

	if (blockName !== 'maxi-blocks/text-maxi') return null;

	const value =
		(!isObject(typography) && JSON.parse(typography)) || typography;

	const defaultTypography =
		(typeof defaultRawTypography !== 'object' &&
			JSON.parse(defaultRawTypography)) ||
		defaultRawTypography;

	const updateTypography = () => {
		onChange({ typography: JSON.stringify(value), content });
	};

	const toggleFormat = (formatClassName, fontSize) => {
		return getFormattedString({
			formatValue,
			formatName,
			isActive,
			isList,
			attributes: {
				attributes: {
					className: formatClassName,
					size: fontSize,
				},
			},
		});
	};
	const onChangeSize = val => {
		if (formatValue.start === formatValue.end) {
			value[breakpoint]['font-size'] = isEmpty(val) ? '' : Number(val);
			updateTypography();
			return;
		}

		const formatClassName = `maxi-text-block__custom-font-size--${
			Object.keys(value.customFormats).length
		}`;
		const newFontSize = isEmpty(val) ? '' : Number(val);

		const newContent =
			((isEmpty(currentClassName) ||
				value[breakpoint]['font-size'] === newFontSize) &&
				toggleFormat(formatClassName, val)) ||
			content;

		if (!value.customFormats[currentClassName]) {
			const newCustomFormat = {
				[formatClassName]: {
					...defaultFontSize,
					[breakpoint]: {
						'font-sizeUnit': value[breakpoint]['font-sizeUnit'],
						'font-size': newFontSize,
					},
				},
			};

			value.customFormats = Object.assign(value.customFormats, {
				...newCustomFormat,
			});
		} else if (value[breakpoint]['font-size'] === newFontSize) {
			delete value.customFormats[currentClassName];
		} else {
			value.customFormats[currentClassName][breakpoint]['font-sizeUnit'] =
				value[breakpoint]['font-sizeUnit'];
			value.customFormats[currentClassName][breakpoint][
				'font-size'
			] = newFontSize;
		}

		onChange({ typography: JSON.stringify(value), content: newContent });
	};

	return (
		<ToolbarPopover
			className='toolbar-item__text-options'
			tooltip={__('Text options', 'maxi-blocks')}
			icon={toolbarType}
			advancedOptions='typography'
			content={
				<div className='toolbar-item__popover__font-options'>
					<div className='toolbar-item__popover__font-options__font'>
						<FontFamilySelector
							className='toolbar-item__popover__font-options__font__selector'
							font={getLastBreakpointValue(
								value,
								'font-family',
								breakpoint
							)}
							onChange={font => {
								value[breakpoint]['font-family'] = font.value;
								value.options = font.files;
								updateTypography();
							}}
						/>
						<Button
							className='components-maxi-control__reset-button'
							onClick={() => {
								value[breakpoint]['font-family'] =
									defaultTypography.font;
								updateTypography();
							}}
							isSmall
							aria-label={sprintf(
								/* translators: %s: a texual label  */
								__('Reset %s settings', 'maxi-blocks'),
								'font size'
							)}
							type='reset'
						>
							{reset}
						</Button>
					</div>
					<Fragment>
						<BaseControl
							label={__('Size', 'maxi-blocks')}
							className='toolbar-item__popover__font-options__number-control'
						>
							<input
								type='number'
								value={trim(
									(isActive &&
										getLastBreakpointValue(
											value.customFormats[
												currentClassName
											],
											'font-size',
											breakpoint
										)) ||
										getLastBreakpointValue(
											value,
											'font-size',
											breakpoint
										)
								)}
								onChange={e => {
									onChangeSize(e.target.value);
								}}
							/>
							<Button
								className='components-maxi-control__reset-button'
								onClick={() => {
									value[breakpoint]['font-size'] =
										defaultTypography[breakpoint][
											'font-size'
										];
									onChangeSize(null);
								}}
								isSmall
								aria-label={sprintf(
									/* translators: %s: a texual label  */
									__('Reset %s settings', 'maxi-blocks'),
									'size'
								)}
								type='reset'
							>
								{reset}
							</Button>
						</BaseControl>
						<BaseControl
							label={__('Line Height', 'maxi-blocks')}
							className='toolbar-item__popover__font-options__number-control'
						>
							<input
								type='number'
								value={trim(
									getLastBreakpointValue(
										value,
										'line-height',
										breakpoint
									)
								)}
								onChange={e => {
									value[breakpoint]['line-height'] = isEmpty(
										e.target.value
									)
										? ''
										: Number(e.target.value);
									updateTypography();
								}}
							/>
							<Button
								className='components-maxi-control__reset-button'
								onClick={() => {
									value[breakpoint]['line-height'] =
										defaultTypography[breakpoint][
											'line-height'
										];
									updateTypography();
								}}
								isSmall
								aria-label={sprintf(
									/* translators: %s: a texual label  */
									__('Reset %s settings', 'maxi-blocks'),
									'line height'
								)}
								type='reset'
							>
								{reset}
							</Button>
						</BaseControl>
						<BaseControl
							label={__('Letter Spacing', 'maxi-blocks')}
							className='toolbar-item__popover__font-options__number-control'
						>
							<input
								type='number'
								value={trim(
									getLastBreakpointValue(
										value,
										'letter-spacing',
										breakpoint
									)
								)}
								onChange={e => {
									value[breakpoint][
										'letter-spacing'
									] = isEmpty(e.target.value)
										? ''
										: Number(e.target.value);
									updateTypography();
								}}
							/>
							<Button
								className='components-maxi-control__reset-button'
								onClick={() => {
									value[breakpoint]['letter-spacing'] =
										defaultTypography[breakpoint][
											'letter-spacing'
										];
									updateTypography();
								}}
								isSmall
								aria-label={sprintf(
									/* translators: %s: a texual label  */
									__('Reset %s settings', 'maxi-blocks'),
									'letter spacing'
								)}
								type='reset'
							>
								{reset}
							</Button>
						</BaseControl>
						<div>
							<TextFormatStrikethrough
								content={content}
								onChange={content => onChange({ content })}
								node={node}
								isList={isList}
								typeOfList={typeOfList}
							/>
							<TextFormatUnderline
								content={content}
								onChange={content => onChange({ content })}
								node={node}
								isList={isList}
								typeOfList={typeOfList}
							/>
							<TextFormatSubscript
								content={content}
								onChange={content => onChange({ content })}
								node={node}
								isList={isList}
								typeOfList={typeOfList}
							/>
							<TextFormatSuperscript
								content={content}
								onChange={content => onChange({ content })}
								node={node}
								isList={isList}
								typeOfList={typeOfList}
							/>
							<TextFormatCode
								content={content}
								onChange={content => onChange({ content })}
								node={node}
								isList={isList}
								typeOfList={typeOfList}
							/>
						</div>
					</Fragment>
				</div>
			}
		/>
	);
};

export default TextOptions;
