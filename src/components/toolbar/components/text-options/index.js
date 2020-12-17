/**
 * WordPress dependencies
 */
const { __, sprintf } = wp.i18n;
const { Fragment } = wp.element;
const { Button, BaseControl } = wp.components;

/**
 * Internal dependencies
 */
import FontFamilySelector from '../../../font-family-selector';
import ToolbarPopover from '../toolbar-popover';
import TextFormatStrikethrough from '../text-format-strikethrough';
import TextFormatUnderline from '../text-format-underline';
import TextFormatOverline from '../text-format-overline';
import TextFormatSubscript from '../text-format-subscript';
import TextFormatSuperscript from '../text-format-superscript';
import TextFormatCode from '../text-format-code';
import {
	setFormat,
	getCustomFormatValue,
} from '../../../../extensions/text/formats';

/**
 * External dependencies
 */
import { isEmpty, trim } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import { toolbarType, reset } from '../../../../icons';

/**
 * TextOptions
 */
const TextOptions = props => {
	const { blockName, onChange, breakpoint, isList, formatValue } = props;

	if (blockName !== 'maxi-blocks/text-maxi') return null;

	const typography = { ...props.typography };
	const defaultTypography = { ...props.defaultTypography };

	const onChangeFormat = value => {
		const { typography: newTypography, content: newContent } = setFormat({
			formatValue,
			isList,
			typography,
			value,
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
			tooltip={__('Typography', 'maxi-blocks')}
			icon={toolbarType}
			advancedOptions='typography'
			content={
				<div className='toolbar-item__popover__font-options'>
					<div className='toolbar-item__popover__font-options__font'>
						<FontFamilySelector
							className='toolbar-item__popover__font-options__font__selector'
							theme='dark'
							font={getCustomFormatValue({
								typography,
								formatValue,
								prop: 'font-family',
								breakpoint,
							})}
							onChange={font => {
								onChangeFormat({
									'font-family': font.value,
									'font-options': font.files,
								});
							}}
						/>
						<Button
							className='components-maxi-control__reset-button'
							onClick={() => {
								onChangeFormat({
									'font-family':
										defaultTypography['font-family'],
									'font-options':
										defaultTypography['font-options'],
								});
							}}
							isSmall
							aria-label={sprintf(
								/* translators: %s: a textual label  */
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
									getCustomFormatValue({
										typography,
										formatValue,
										prop: 'font-size',
										breakpoint,
									})
								)}
								onChange={e => {
									const newFontSize = isEmpty(e.target.value)
										? ''
										: Number(e.target.value);

									onChangeFormat({
										'font-sizeUnit':
											typography[breakpoint][
												'font-sizeUnit'
											],
										'font-size': newFontSize,
									});
								}}
							/>
							<Button
								className='components-maxi-control__reset-button'
								onClick={() => {
									onChangeFormat({
										'font-sizeUnit':
											defaultTypography[breakpoint][
												'font-sizeUnit'
											],
										'font-size':
											defaultTypography[breakpoint][
												'font-size'
											],
									});
								}}
								isSmall
								aria-label={sprintf(
									/* translators: %s: a textual label  */
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
									getCustomFormatValue({
										typography,
										formatValue,
										prop: 'line-height',
										breakpoint,
									})
								)}
								onChange={e => {
									const newFontSize = isEmpty(e.target.value)
										? ''
										: Number(e.target.value);

									onChangeFormat({
										'line-heightUnit':
											typography[breakpoint][
												'line-heightUnit'
											],
										'line-height': newFontSize,
									});
								}}
							/>
							<Button
								className='components-maxi-control__reset-button'
								onClick={() => {
									onChangeFormat({
										'line-heightUnit':
											defaultTypography[breakpoint][
												'line-heightUnit'
											],
										'line-height':
											defaultTypography[breakpoint][
												'line-height'
											],
									});
								}}
								isSmall
								aria-label={sprintf(
									/* translators: %s: a textual label  */
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
									getCustomFormatValue({
										typography,
										formatValue,
										prop: 'letter-spacing',
										breakpoint,
									})
								)}
								onChange={e => {
									const newFontSize = isEmpty(e.target.value)
										? ''
										: Number(e.target.value);

									onChangeFormat({
										'letter-spacingUnit':
											typography[breakpoint][
												'letter-spacingUnit'
											],
										'letter-spacing': newFontSize,
									});
								}}
							/>
							<Button
								className='components-maxi-control__reset-button'
								onClick={() => {
									onChangeFormat({
										'letter-spacingUnit':
											defaultTypography[breakpoint][
												'letter-spacingUnit'
											],
										'letter-spacing':
											defaultTypography[breakpoint][
												'letter-spacing'
											],
									});
								}}
								isSmall
								aria-label={sprintf(
									/* translators: %s: a textual label  */
									__('Reset %s settings', 'maxi-blocks'),
									'letter spacing'
								)}
								type='reset'
							>
								{reset}
							</Button>
						</BaseControl>
						<div>
							<TextFormatOverline
								typography={typography}
								formatValue={formatValue}
								onChange={obj => onChange(obj)}
								isList={isList}
								breakpoint={breakpoint}
							/>
							<TextFormatStrikethrough
								typography={typography}
								formatValue={formatValue}
								onChange={obj => onChange(obj)}
								isList={isList}
								breakpoint={breakpoint}
							/>
							<TextFormatUnderline
								typography={typography}
								formatValue={formatValue}
								onChange={obj => onChange(obj)}
								isList={isList}
								breakpoint={breakpoint}
							/>
							<TextFormatSubscript
								typography={typography}
								formatValue={formatValue}
								onChange={obj => onChange(obj)}
								isList={isList}
								breakpoint={breakpoint}
							/>
							<TextFormatSuperscript
								typography={typography}
								formatValue={formatValue}
								onChange={obj => onChange(obj)}
								isList={isList}
								breakpoint={breakpoint}
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
