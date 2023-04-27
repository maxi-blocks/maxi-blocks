/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../../../advanced-number-control';
import AlignmentControl from '../../../alignment-control';
import FontFamilySelector from '../../../font-family-selector';
import Icon from '../../../icon';
import ResponsiveTabsControl from '../../../responsive-tabs-control';
import TextBold from '../text-bold';
import TextFormatStrikethrough from '../text-format-strikethrough';
import TextFormatSubscript from '../text-format-subscript';
import TextFormatSuperscript from '../text-format-superscript';
import TextFormatUnderline from '../text-format-underline';
import TextItalic from '../text-italic';
import ToolbarPopover from '../toolbar-popover';
import {
	setFormat,
	getTypographyValue,
	textContext,
} from '../../../../extensions/text/formats';
import {
	getGroupAttributes,
	getDefaultAttribute,
} from '../../../../extensions/styles';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import {
	toolbarTextSize,
	toolbarTextLineHeight,
	toolbarTextLetterSpacing,
} from '../../../../icons';

/**
 * Component
 */
const TextOptionsContent = props => {
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
			<Icon
				className='toolbar-item__text-size-icon'
				icon={toolbarTextSize}
			/>
			<AdvancedNumberControl
				className='maxi-typography-control__size'
				value={getValue(`${prefix}font-size`, breakpoint, avoidXXL)}
				defaultValue={getDefault(`${prefix}font-size`, breakpoint)}
				onChangeValue={val => {
					onChangeFormat({
						[`${prefix}font-size`]: val,
					});
				}}
				onReset={() =>
					onChangeFormat(
						{
							[`${prefix}font-size`]: getDefault(
								`${prefix}font-size`
							),
						},
						true
					)
				}
				min={minMaxSettings[getValue(`${prefix}font-size-unit`)].min}
				max={minMaxSettings[getValue(`${prefix}font-size-unit`)].max}
			/>
			<Icon
				className='toolbar-item__text-size-icon'
				icon={toolbarTextLineHeight}
			/>
			<AdvancedNumberControl
				className='maxi-typography-control__line-height'
				value={getValue(`${prefix}line-height`, breakpoint, avoidXXL)}
				defaultValue={getDefault(`${prefix}line-height`, breakpoint)}
				onChangeValue={val => {
					onChangeFormat({
						[`${prefix}line-height`]: val,
					});
				}}
				onReset={() =>
					onChangeFormat(
						{
							[`${prefix}line-height`]: getDefault(
								`${prefix}line-height`
							),
						},
						true
					)
				}
				min={minMaxSettings[getValue(`${prefix}line-height-unit`)].min}
				max={minMaxSettings[getValue(`${prefix}line-height-unit`)].max}
			/>
			<Icon
				className='toolbar-item__text-size-icon'
				icon={toolbarTextLetterSpacing}
			/>
			<AdvancedNumberControl
				className='maxi-typography-control__letter-spacing'
				value={getValue(
					`${prefix}letter-spacing`,
					breakpoint,
					avoidXXL
				)}
				defaultValue={getDefault(`${prefix}letter-spacing`, breakpoint)}
				onChangeValue={val => {
					onChangeFormat({
						[`${prefix}letter-spacing`]: val,
					});
				}}
				onReset={() =>
					onChangeFormat(
						{
							[`${prefix}letter-spacing`]: '',
						},
						true
					)
				}
				min={
					minMaxSettingsLetterSpacing[
						getValue(`${prefix}letter-spacing-unit`)
					].min
				}
				max={
					minMaxSettingsLetterSpacing[
						getValue(`${prefix}letter-spacing-unit`)
					].max
				}
				step={0.1}
			/>
		</>
	);
};

/**
 * TextOptions
 */
const TextOptions = props => {
	const {
		textLevel = 'p',
		blockName,
		onChange,
		breakpoint,
		blockStyle,
		isList,
		clientId,
		prefix = '',
		styleCards = false,
		styleCardPrefix,
		isCaptionToolbar = false,
	} = props;

	if (blockName !== 'maxi-blocks/text-maxi' && !isCaptionToolbar) return null;

	const { formatValue, onChangeTextFormat } = useContext(textContext);

	const typography = { ...getGroupAttributes(props, 'typography') };

	const { styleCard, tooltipsHide } = useSelect(select => {
		const { receiveMaxiSelectedStyleCard } = select(
			'maxiBlocks/style-cards'
		);

		const { receiveMaxiSettings } = select('maxiBlocks');

		const maxiSettings = receiveMaxiSettings();
		const tooltipsHide = !isEmpty(maxiSettings.hide_tooltips)
			? maxiSettings.hide_tooltips
			: false;

		const styleCard = receiveMaxiSelectedStyleCard()?.value || {};

		return {
			styleCard,
			tooltipsHide,
		};
	});

	const getValue = prop =>
		getTypographyValue({
			prop,
			breakpoint,
			typography,
			formatValue,
			textLevel,
			blockStyle,
			styleCard,
			styleCardPrefix,
		});

	const onChangeFormat = (value, isReset = false) => {
		const obj = setFormat({
			formatValue,
			isList,
			typography,
			value,
			breakpoint,
			textLevel,
			returnFormatValue: true,
		});

		const newFormatValue = {
			...obj.formatValue,
		};
		delete obj.formatValue;

		onChangeTextFormat(newFormatValue);

		if (!isReset) onChange(obj);
		else onChange({ ...obj, isReset: true });
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
			max: 999,
		},
		em: {
			min: 0,
			max: 100,
		},
		vw: {
			min: 0,
			max: 100,
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
				text={__('Edit', 'maxi-blocks')}
				advancedOptions='typography'
			>
				<div className='toolbar-item__popover__font-options'>
					<ResponsiveTabsControl
						className='toolbar-item__typography-control__typography-tabs'
						breakpoint={breakpoint}
					>
						<div>
							<div className='toolbar-item__popover__font-options__wrap toolbar-item__popover__font-options__wrap_family'>
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
										breakpoint={breakpoint}
									/>
								</div>
								<div className='toolbar-item__typography-control__extra-text-options'>
									<AlignmentControl
										{...getGroupAttributes(
											props,
											'textAlignment'
										)}
										onChange={onChange}
										breakpoint={breakpoint}
										type='text'
										isToolbar
										disableRTC
									/>
									<TextBold
										onChangeFormat={onChangeFormat}
										getValue={getValue}
										tooltipsHide={tooltipsHide}
									/>
									<TextItalic
										onChangeFormat={onChangeFormat}
										getValue={getValue}
										tooltipsHide={tooltipsHide}
									/>
									<TextFormatUnderline
										onChangeFormat={onChangeFormat}
										getValue={getValue}
										tooltipsHide={tooltipsHide}
									/>
									<TextFormatStrikethrough
										onChangeFormat={onChangeFormat}
										getValue={getValue}
										tooltipsHide={tooltipsHide}
									/>
									<TextFormatSubscript
										onChangeFormat={onChangeFormat}
										getValue={getValue}
										tooltipsHide={tooltipsHide}
									/>
									<TextFormatSuperscript
										onChangeFormat={onChangeFormat}
										getValue={getValue}
										tooltipsHide={tooltipsHide}
									/>
								</div>
							</div>
							<div className='toolbar-item__popover__font-options__wrap toolbar-item__popover__font-options__wrap_inputs'>
								<TextOptionsContent
									getValue={getValue}
									getDefault={getDefault}
									onChangeFormat={onChangeFormat}
									prefix={prefix}
									minMaxSettings={minMaxSettings}
									minMaxSettingsLetterSpacing={
										minMaxSettingsLetterSpacing
									}
									avoidXXL={!styleCards}
									tooltipsHide={tooltipsHide}
								/>
							</div>
						</div>
					</ResponsiveTabsControl>
				</div>
			</ToolbarPopover>
		</div>
	);
};

export default TextOptions;
