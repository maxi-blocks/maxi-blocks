/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect, dispatch } from '@wordpress/data';

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
import AdvancedNumberControl from '../../../advanced-number-control';
import {
	setFormat,
	getCustomFormatValue,
	withFormatValue,
} from '../../../../extensions/text/formats';
import {
	getGroupAttributes,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../../../extensions/styles';

/**
 * Styles and icons
 */
import './editor.scss';
// import { toolbarType } from '../../../../icons';
import { ResponsiveTabsControl } from '../../..';

/**
 * Component
 */
const TextOptions = props => {
	const {
		getValue,
		getDefault,
		onChangeFormat,
		prefix,
		minMaxSettings,
		minMaxSettingsLetterSpacing,
		breakpoint,
		avoidXXL,
	} = props;

	return (
		<>
			<AdvancedNumberControl
				className='maxi-typography-control__size'
				label={__('Size', 'maxi-blocks')}
				enableUnit
				unit={getValue(`${prefix}font-size-unit`, breakpoint, avoidXXL)}
				defaultUnit={getDefault(`${prefix}font-size-unit`, breakpoint)}
				onChangeUnit={val => {
					onChangeFormat(
						{
							[`${prefix}font-size-unit`]: val,
						},
						breakpoint
					);
				}}
				value={getValue(`${prefix}font-size`, breakpoint, avoidXXL)}
				defaultValue={getDefault(`${prefix}font-size`, breakpoint)}
				onChangeValue={val => {
					onChangeFormat(
						{
							[`${prefix}font-size`]: val,
						},
						breakpoint
					);
				}}
				onReset={() =>
					onChangeFormat(
						{
							[`${prefix}font-size-unit`]: getDefault(
								`${prefix}font-size-unit`
							),
							[`${prefix}font-size`]: getDefault(
								`${prefix}font-size`
							),
						},
						breakpoint
					)
				}
				minMaxSettings={minMaxSettings}
				allowedUnits={['px', 'em', 'vw', '%']}
			/>
			<AdvancedNumberControl
				className='maxi-typography-control__line-height'
				label={__('Line Height', 'maxi-blocks')}
				enableUnit
				unit={
					getValue(
						`${prefix}line-height-unit`,
						breakpoint,
						avoidXXL
					) || ''
				}
				defaultUnit={getDefault(
					`${prefix}line-height-unit`,
					breakpoint
				)}
				onChangeUnit={val => {
					onChangeFormat(
						{
							[`${prefix}line-height-unit`]: val,
						},
						breakpoint
					);
				}}
				value={getValue(`${prefix}line-height`, breakpoint, avoidXXL)}
				defaultValue={getDefault(`${prefix}line-height`, breakpoint)}
				onChangeValue={val => {
					onChangeFormat(
						{
							[`${prefix}line-height`]: val,
						},
						breakpoint
					);
				}}
				onReset={() =>
					onChangeFormat(
						{
							[`${prefix}line-height-unit`]: getDefault(
								`${prefix}line-height-unit`
							),
							[`${prefix}line-height`]: getDefault(
								`${prefix}line-height`
							),
						},
						breakpoint
					)
				}
				minMaxSettings={minMaxSettings}
				allowedUnits={['px', 'em', 'vw', '%', '-']}
			/>
			<AdvancedNumberControl
				className='maxi-typography-control__letter-spacing'
				label={__('Letter Spacing', 'maxi-blocks')}
				enableUnit
				allowedUnits={['px', 'em', 'vw']}
				unit={getValue(
					`${prefix}letter-spacing-unit`,
					breakpoint,
					avoidXXL
				)}
				defaultUnit={getDefault(
					`${prefix}letter-spacing-unit`,
					breakpoint
				)}
				onChangeUnit={val => {
					onChangeFormat(
						{
							[`${prefix}letter-spacing-unit`]: val,
						},
						breakpoint
					);
				}}
				value={getValue(
					`${prefix}letter-spacing`,
					breakpoint,
					avoidXXL
				)}
				defaultValue={getDefault(`${prefix}letter-spacing`, breakpoint)}
				onChangeValue={val => {
					onChangeFormat(
						{
							[`${prefix}letter-spacing`]: val,
						},
						breakpoint
					);
				}}
				onReset={() =>
					onChangeFormat(
						{
							[`${prefix}letter-spacing-unit`]: getDefault(
								`${prefix}letter-spacing-unit`
							),
							[`${prefix}letter-spacing`]: '',
						},
						breakpoint
					)
				}
				minMaxSettings={minMaxSettingsLetterSpacing}
				step={0.1}
			/>
		</>
	);
};

/**
 * TypographyControl
 */
const TypographyControl = withFormatValue(props => {
	const {
		blockName,
		onChange,
		breakpoint,
		isList,
		textLevel,
		formatValue,
		clientId,
		prefix = '',
		styleCards = false,
		disableFormats = false,
		isHover = false,
		styleCardPrefix,
		isCaptionToolbar = false,
	} = props;

	if (blockName !== 'maxi-blocks/text-maxi' && !isCaptionToolbar) return null;

	const typography = { ...getGroupAttributes(props, 'typography') };

	const { styleCard } = useSelect(select => {
		const { receiveMaxiSelectedStyleCard } = wp.data.select(
			'maxiBlocks/style-cards'
		);

		const styleCard = receiveMaxiSelectedStyleCard()?.value || {};

		return {
			styleCard,
		};
	});

	const getValue = (prop, customBreakpoint, avoidXXL) => {
		const currentBreakpoint = customBreakpoint || breakpoint;

		if (disableFormats)
			return getLastBreakpointAttribute(
				prop,
				currentBreakpoint,
				typography,
				isHover,
				false,
				avoidXXL
			);

		const nonHoverValue = getCustomFormatValue({
			typography,
			formatValue,
			prop,
			breakpoint: currentBreakpoint,
			textLevel,
			styleCard,
			styleCardPrefix,
			avoidXXL,
		});

		if (!isHover) return nonHoverValue;

		return (
			getCustomFormatValue({
				typography,
				formatValue,
				prop,
				breakpoint: currentBreakpoint,
				isHover,
				textLevel,
				styleCard,
				styleCardPrefix,
			}) || nonHoverValue
		);
	};

	const onChangeFormat = (value, customBreakpoint) => {
		const obj = setFormat({
			formatValue,
			isList,
			typography: { ...getGroupAttributes(props, 'typography') },
			value,
			breakpoint: customBreakpoint ?? breakpoint,
			textLevel,
			returnFormatValue: true,
		});

		const newFormatValue = { ...obj.formatValue };
		delete obj.formatValue;

		// Needs a time-out to don't be overwrite by the method `onChangeRichText` used on text related blocks
		setTimeout(() => {
			dispatch('maxiBlocks/text').sendFormatValue(
				newFormatValue,
				clientId
			);
		}, 200); // higher than the 150 of `onChangeRichText` method

		onChange(obj);
	};

	const getDefault = (prop, customBreakpoint) => {
		const currentBreakpoint = customBreakpoint || breakpoint;
		const defaultAttribute = getDefaultAttribute(
			`${prop}-${currentBreakpoint}`,
			clientId
		);

		return defaultAttribute;
	};

	const minMaxSettings = {
		px: {
			min: 0,
			max: 99,
		},
		em: {
			min: 0,
			max: 99,
		},
		vw: {
			min: 0,
			max: 99,
		},
		'%': {
			min: 0,
			max: 100,
		},
		'-': {
			min: 0,
			max: 16,
		},
	};

	const minMaxSettingsLetterSpacing = {
		px: {
			min: -3,
			max: 30,
		},
		em: {
			min: -1,
			max: 10,
		},
		vw: {
			min: -1,
			max: 10,
		},
	};

	return (
		<div className='toolbar-item toolbar-item__typography-control'>
			<ToolbarPopover
				tooltip={__('Edit text', 'maxi-blocks')}
				// icon={toolbarType}
				text={__('Edit text', 'maxi-blocks')}
				advancedOptions='typography'
			>
				<div className='toolbar-item__popover__font-options'>
					<div className='toolbar-item__popover__font-options__font'>
						<FontFamilySelector
							className='toolbar-item__popover__font-options__font__selector'
							defaultValue={getDefaultAttribute(
								`font-family-${breakpoint}`
							)}
							font={getValue('font-family')}
							onChange={font => {
								onChangeFormat({
									'font-family': font.value,
								});
							}}
							theme='dark'
						/>
					</div>
					<>
						<ResponsiveTabsControl
							className='toolbar-item__typography-control__typography-tabs'
							breakpoint={breakpoint}
						>
							<TextOptions
								getValue={getValue}
								getDefault={getDefault}
								onChangeFormat={onChangeFormat}
								prefix={prefix}
								minMaxSettings={minMaxSettings}
								minMaxSettingsLetterSpacing={
									minMaxSettingsLetterSpacing
								}
								avoidXXL={!styleCards}
							/>
						</ResponsiveTabsControl>
						<div className='toolbar-item__typography-control__extra-text-options'>
							<TextFormatOverline
								{...getGroupAttributes(props, 'typography')}
								formatValue={formatValue}
								onChange={obj => onChange(obj)}
								isList={isList}
								breakpoint={breakpoint}
								textLevel={textLevel}
								styleCard={styleCard}
							/>
							<TextFormatStrikethrough
								{...getGroupAttributes(props, 'typography')}
								formatValue={formatValue}
								onChange={obj => onChange(obj)}
								isList={isList}
								breakpoint={breakpoint}
								textLevel={textLevel}
								styleCard={styleCard}
							/>
							<TextFormatUnderline
								{...getGroupAttributes(props, 'typography')}
								formatValue={formatValue}
								onChange={obj => onChange(obj)}
								isList={isList}
								breakpoint={breakpoint}
								textLevel={textLevel}
								styleCard={styleCard}
							/>
							<TextFormatSubscript
								{...getGroupAttributes(props, 'typography')}
								formatValue={formatValue}
								onChange={obj => onChange(obj)}
								isList={isList}
								breakpoint={breakpoint}
								textLevel={textLevel}
								styleCard={styleCard}
							/>
							<TextFormatSuperscript
								{...getGroupAttributes(props, 'typography')}
								formatValue={formatValue}
								onChange={obj => onChange(obj)}
								isList={isList}
								breakpoint={breakpoint}
								textLevel={textLevel}
								styleCard={styleCard}
							/>
							<TextFormatCode
								onChange={content => onChange({ content })}
								isList={isList}
								formatValue={formatValue}
								textLevel={textLevel}
								styleCard={styleCard}
							/>
						</div>
					</>
				</div>
			</ToolbarPopover>
		</div>
	);
});

export default TypographyControl;
