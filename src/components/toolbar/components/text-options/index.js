/**
 * WordPress dependencies
 */
const { __, sprintf } = wp.i18n;
const { Fragment } = wp.element;
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
	__experimentalIsFormatActive,
	__experimentalSetFormatWithClass,
} from '../../../../extensions/text/formats';
import { defaultFontSizeObject } from '../../../../extensions/text/formats/formats';

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
		defaultTypography,
		onChange,
		content,
		breakpoint,
		isList,
		formatValue,
	} = props;

	const formatName = 'maxi-blocks/text-size';

	const { isActive, currentClassName } = useSelect(() => {
		const isActive = __experimentalIsFormatActive(formatValue, formatName);

		const activeFormat = getActiveFormat(formatValue, formatName);

		const currentClassName =
			(isActive && activeFormat.attributes.className) || '';

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

	const value =
		(!isObject(typography) && JSON.parse(typography)) || typography;

	const defaultValue =
		(typeof defaultTypography !== 'object' &&
			JSON.parse(defaultTypography)) ||
		defaultTypography;

	const updateTypography = () => {
		onChange({ typography: JSON.stringify(value), content });
	};

	const onChangeSize = val => {
		if (formatValue.start === formatValue.end) {
			value[breakpoint]['font-size'] = isEmpty(val) ? '' : Number(val);
			updateTypography();
			return;
		}

		const newFontSize = isEmpty(val) ? '' : Number(val);

		const {
			typography: newTypography,
			newContent,
		} = __experimentalSetFormatWithClass({
			currentClassName,
			formatClassNamePrefix: 'maxi-text-block__custom-font-size--',
			defaultObject: defaultFontSizeObject,
			formatValue,
			formatName,
			isActive,
			isList,
			content,
			typography: value,
			value: {
				'font-sizeUnit': value[breakpoint]['font-sizeUnit'],
				'font-size': newFontSize,
			},
			breakpoint,
			toggleConditional: isEmpty(currentClassName) || isEmpty(val),
			deleteConditional: isEmpty(val),
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
									defaultValue.font;
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
										defaultValue[breakpoint]['font-size'];
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
										defaultValue[breakpoint]['line-height'];
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
										defaultValue[breakpoint][
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
								onChange={content => onChange({ content })}
								isList={isList}
								formatValue={formatValue}
							/>
							<TextFormatUnderline
								onChange={content => onChange({ content })}
								isList={isList}
								formatValue={formatValue}
							/>
							<TextFormatSubscript
								onChange={content => onChange({ content })}
								isList={isList}
								formatValue={formatValue}
							/>
							<TextFormatSuperscript
								onChange={content => onChange({ content })}
								isList={isList}
								formatValue={formatValue}
							/>
							<TextFormatCode
								onChange={content => onChange({ content })}
								isList={isList}
								formatValue={formatValue}
							/>
						</div>
					</Fragment>
				</div>
			}
		/>
	);
};

export default TextOptions;
