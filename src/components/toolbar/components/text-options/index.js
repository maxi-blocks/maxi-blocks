/**
 * WordPress dependencies
 */
const { __, sprintf } = wp.i18n;
const { Fragment } = wp.element;
const { Button, BaseControl } = wp.components;
const { useState } = wp.element;

/**
 * Internal dependencies
 */
import { defaultTypography } from '../../../../extensions/text';
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
import { getGroupAttributes } from '../../../../extensions/styles';

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
	const {
		blockName,
		onChange,
		breakpoint,
		isList,
		getFormatValue,
		textLevel,
	} = props;

	if (blockName !== 'maxi-blocks/text-maxi') return null;

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [typography, setTypography] = useState(
		getGroupAttributes(props, 'typography')
	);

	const getValue = prop => {
		const formatValue = getFormatValue();

		return getCustomFormatValue({
			defaultTypography,
			formatValue,
			prop,
			breakpoint,
		});
	};

	const onChangeFormat = value => {
		const formatValue = getFormatValue();

		const obj = setFormat({
			formatValue,
			isList,
			typography,
			value,
			breakpoint,
		});

		setTypography(getGroupAttributes(obj, 'typography'));

		onChange(obj);
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
							font={getValue('font-family')}
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
										defaultTypography[textLevel][
											`font-family-${breakpoint}`
										],
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
								value={trim(getValue('font-size'))}
								onChange={e => {
									const newFontSize = isEmpty(e.target.value)
										? ''
										: +e.target.value;

									onChangeFormat({
										'font-size': newFontSize,
									});
								}}
							/>
							<Button
								className='components-maxi-control__reset-button'
								onClick={() => {
									onChangeFormat({
										'font-size':
											defaultTypography[textLevel][
												`font-size-${breakpoint}`
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
								value={trim(getValue('line-height'))}
								onChange={e => {
									const newFontSize = isEmpty(e.target.value)
										? ''
										: +e.target.value;

									onChangeFormat({
										'line-height': newFontSize,
									});
								}}
							/>
							<Button
								className='components-maxi-control__reset-button'
								onClick={() => {
									onChangeFormat({
										'line-height':
											defaultTypography[textLevel][
												`line-height-${breakpoint}`
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
								value={trim(getValue('letter-spacing'))}
								onChange={e => {
									const newFontSize = isEmpty(e.target.value)
										? ''
										: +e.target.value;

									onChangeFormat({
										'letter-spacing': newFontSize,
									});
								}}
							/>
							<Button
								className='components-maxi-control__reset-button'
								onClick={() => {
									onChangeFormat({
										'letter-spacing':
											defaultTypography[textLevel][
												`letter-spacing-${breakpoint}`
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
								getFormatValue={getFormatValue}
								onChange={obj => onChange(obj)}
								isList={isList}
								breakpoint={breakpoint}
							/>
							<TextFormatStrikethrough
								typography={typography}
								getFormatValue={getFormatValue}
								onChange={obj => onChange(obj)}
								isList={isList}
								breakpoint={breakpoint}
							/>
							<TextFormatUnderline
								typography={typography}
								getFormatValue={getFormatValue}
								onChange={obj => onChange(obj)}
								isList={isList}
								breakpoint={breakpoint}
							/>
							<TextFormatSubscript
								typography={typography}
								getFormatValue={getFormatValue}
								onChange={obj => onChange(obj)}
								isList={isList}
								breakpoint={breakpoint}
							/>
							<TextFormatSuperscript
								typography={typography}
								getFormatValue={getFormatValue}
								onChange={obj => onChange(obj)}
								isList={isList}
								breakpoint={breakpoint}
							/>
							<TextFormatCode
								onChange={content => onChange({ content })}
								isList={isList}
								getFormatValue={getFormatValue}
							/>
						</div>
					</Fragment>
				</div>
			}
		/>
	);
};

export default TextOptions;
