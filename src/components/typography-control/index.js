/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select, dispatch, useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import AlignmentControl from '../alignment-control';
import ColorControl from '../color-control';
import FontFamilySelector from '../font-family-selector';
import ResponsiveTabsControl from '../responsive-tabs-control';
import SelectControl from '../select-control';
import TextShadowControl from '../text-shadow-control';
import SettingTabsControl from '../setting-tabs-control';
import { loadFonts } from '../../extensions/text/fonts';

import {
	setFormat,
	getCustomFormatValue,
	withFormatValue,
} from '../../extensions/text/formats';
import {
	getDefaultAttribute,
	getGroupAttributes,
	getIsValid,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import { getDefaultSCValue } from '../../extensions/style-cards';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil, isBoolean, isNumber, isEmpty } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';

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
				label={__('Font size', 'maxi-blocks')}
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
				placeholder={getValue(
					`${prefix}font-size`,
					breakpoint,
					avoidXXL
				)}
				value={getValue(
					`${prefix}font-size`,
					breakpoint,
					avoidXXL,
					true
				)}
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
								`${prefix}font-size-unit`,
								breakpoint
							),
							[`${prefix}font-size`]: getDefault(
								`${prefix}font-size`,
								breakpoint
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
				label={__('Line height', 'maxi-blocks')}
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
							...(val === '-' && {
								[`${prefix}line-height`]:
									minMaxSettings['-'].max,
							}),
						},
						breakpoint
					);
				}}
				placeholder={getValue(
					`${prefix}line-height`,
					breakpoint,
					avoidXXL
				)}
				value={getValue(
					`${prefix}line-height`,
					breakpoint,
					avoidXXL,
					true
				)}
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
								`${prefix}line-height-unit`,
								breakpoint
							),
							[`${prefix}line-height`]: getDefault(
								`${prefix}line-height`,
								breakpoint
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
				label={__('Letter spacing', 'maxi-blocks')}
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
				placeholder={getValue(
					`${prefix}letter-spacing`,
					breakpoint,
					avoidXXL
				)}
				value={getValue(
					`${prefix}letter-spacing`,
					breakpoint,
					avoidXXL,
					true
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
								`${prefix}letter-spacing-unit`,
								breakpoint
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

const LinkOptions = props => {
	const {
		getValue,
		onChangeInline,
		onChangeFormat,
		prefix,
		breakpoint,
		textLevel,
		clientId,
	} = props;

	const [linkStatus, setLinkStatus] = useState('normal_link');

	return (
		<>
			<SettingTabsControl
				type='buttons'
				fullWidthMode
				className='maxi-typography-control__link-options'
				selected={linkStatus}
				items={[
					{
						label: __('Link', 'maxi-block'),
						value: 'normal_link',
						extraIndicatorsResponsive: [
							`${prefix}link-color`,
							`${prefix}link-palette-color`,
							`${prefix}link-palette-opacity`,
							`${prefix}link-palette-status`,
						],
					},
					{
						label: __('Hover', 'maxi-block'),
						value: 'hover_link',
						extraIndicatorsResponsive: [
							`${prefix}link-hover-color`,
							`${prefix}link-hover-palette-color`,
							`${prefix}link-hover-palette-opacity`,
							`${prefix}link-hover-palette-status`,
						],
					},
					{
						label: __('Active', 'maxi-block'),
						value: 'active_link',
						extraIndicatorsResponsive: [
							`${prefix}link-active-color`,
							`${prefix}link-active-palette-color`,
							`${prefix}link-active-palette-opacity`,
							`${prefix}link-active-palette-status`,
						],
					},
					{
						label: __('Visited', 'maxi-block'),
						value: 'visited_link',
						extraIndicatorsResponsive: [
							`${prefix}link-visited-color`,
							`${prefix}link-visited-palette-color`,
							`${prefix}link-visited-palette-opacity`,
							`${prefix}link-visited-palette-status`,
						],
					},
				]}
				onChange={val => setLinkStatus(val)}
			/>
			{linkStatus === 'normal_link' && (
				<ColorControl
					label={__('Font', 'maxi-blocks')}
					className='maxi-typography-link-color'
					color={getValue(`${prefix}link-color`)}
					prefix={`${prefix}link-`}
					useBreakpointForDefault
					paletteStatus={getValue(`${prefix}link-palette-status`)}
					paletteColor={getValue(`${prefix}link-palette-color`)}
					paletteOpacity={
						getValue(`${prefix}link-palette-opacity`) || 1
					}
					onChangeInline={({ color }) =>
						onChangeInline({ color }, 'a')
					}
					onChange={({
						paletteColor,
						paletteStatus,
						paletteOpacity,
						color,
					}) =>
						onChangeFormat(
							{
								[`${prefix}link-palette-status`]: paletteStatus,
								[`${prefix}link-palette-color`]: paletteColor,
								[`${prefix}link-palette-opacity`]:
									paletteOpacity,
								[`${prefix}link-color`]: color,
							},
							false,
							true
						)
					}
					textLevel={textLevel}
					deviceType={breakpoint}
					clientId={clientId}
					disableGradient
					globalProps={{ target: 'link', type: 'link' }}
				/>
			)}
			{linkStatus === 'hover_link' && (
				<ColorControl
					label={__('Font', 'maxi-blocks')}
					className='maxi-typography-link-hover-color'
					color={getValue(`${prefix}link-hover-color`)}
					prefix={`${prefix}link-hover-`}
					useBreakpointForDefault
					paletteStatus={getValue(
						`${prefix}link-hover-palette-status`
					)}
					paletteColor={getValue(`${prefix}link-hover-palette-color`)}
					paletteOpacity={
						getValue(`${prefix}link-hover-palette-opacity`) || 1
					}
					onChangeInline={({ color }) =>
						onChangeInline({ color }, 'a:hover')
					}
					onChange={({
						paletteColor,
						paletteStatus,
						paletteOpacity,
						color,
					}) =>
						onChangeFormat(
							{
								[`${prefix}link-hover-palette-status`]:
									paletteStatus,
								[`${prefix}link-hover-palette-color`]:
									paletteColor,
								[`${prefix}link-hover-palette-opacity`]:
									paletteOpacity,
								[`${prefix}link-hover-color`]: color,
							},
							false,
							true
						)
					}
					textLevel={textLevel}
					deviceType={breakpoint}
					clientId={clientId}
					disableGradient
					globalProps={{ target: 'hover', type: 'link' }}
				/>
			)}
			{linkStatus === 'active_link' && (
				<ColorControl
					label={__('Font', 'maxi-blocks')}
					className='maxi-typography-link-active-color'
					color={getValue(`${prefix}link-active-color`)}
					prefix={`${prefix}link-active-`}
					useBreakpointForDefault
					paletteStatus={getValue(
						`${prefix}link-active-palette-status`
					)}
					paletteColor={getValue(
						`${prefix}link-active-palette-color`
					)}
					paletteOpacity={
						getValue(`${prefix}link-active-palette-opacity`) || 1
					}
					onChangeInline={({ color }) =>
						onChangeInline({ color }, 'a:active')
					}
					onChange={({
						paletteColor,
						paletteStatus,
						paletteOpacity,
						color,
					}) =>
						onChangeFormat(
							{
								[`${prefix}link-active-palette-status`]:
									paletteStatus,
								[`${prefix}link-active-palette-color`]:
									paletteColor,
								[`${prefix}link-active-palette-opacity`]:
									paletteOpacity,
								[`${prefix}link-active-color`]: color,
							},
							false,
							true
						)
					}
					textLevel={textLevel}
					deviceType={breakpoint}
					clientId={clientId}
					disableGradient
					globalProps={{ target: 'active', type: 'link' }}
				/>
			)}
			{linkStatus === 'visited_link' && (
				<ColorControl
					label={__('Font', 'maxi-blocks')}
					className='maxi-typography-link-visited-color'
					color={getValue(`${prefix}link-visited-color`)}
					prefix={`${prefix}link-visited-`}
					useBreakpointForDefault
					paletteStatus={getValue(
						`${prefix}link-visited-palette-status`
					)}
					paletteColor={getValue(
						`${prefix}link-visited-palette-color`
					)}
					paletteOpacity={
						getValue(`${prefix}link-visited-palette-opacity`) || 1
					}
					onChangeInline={({ color }) =>
						onChangeInline({ color }, 'a:visited')
					}
					onChange={({
						paletteColor,
						paletteStatus,
						paletteOpacity,
						color,
					}) =>
						onChangeFormat(
							{
								[`${prefix}link-visited-palette-status`]:
									paletteStatus,
								[`${prefix}link-visited-palette-color`]:
									paletteColor,
								[`${prefix}link-visited-palette-opacity`]:
									paletteOpacity,
								[`${prefix}link-visited-color`]: color,
							},
							false,
							true
						)
					}
					textLevel={textLevel}
					deviceType={breakpoint}
					clientId={clientId}
					disableGradient
					globalProps={{ target: 'visited', type: 'link' }}
				/>
			)}
		</>
	);
};

const TypographyControl = withFormatValue(props => {
	const {
		className,
		textLevel = 'p',
		hideAlignment = false,
		onChangeInline,
		onChange,
		breakpoint = 'general',
		formatValue,
		isList = false,
		isHover = false,
		disableColor = false,
		prefix = '',
		disableFormats = false,
		disableCustomFormats = false,
		hideTextShadow = false,
		styleCards = false,
		disablePalette = false,
		disableFontFamily = false,
		clientId,
		styleCardPrefix,
		allowLink = false,
		blockStyle,
		globalProps,
	} = props;

	const typography =
		props.typography ||
		getGroupAttributes(props, [
			'typography',
			...(allowLink ? ['link'] : []),
			...(isHover ? ['typographyHover'] : []),
		]);

	const { styleCard } = useSelect(select => {
		const { receiveMaxiSelectedStyleCard } = select(
			'maxiBlocks/style-cards'
		);

		const styleCard = receiveMaxiSelectedStyleCard()?.value || {};

		return {
			styleCard,
		};
	});

	const classes = classnames('maxi-typography-control', className);

	const Divider = () => <hr style={{ margin: '15px 0' }} />;

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

	const getValue = (prop, customBreakpoint, avoidXXL, avoidSC = false) => {
		const currentBreakpoint = customBreakpoint || breakpoint;

		if (disableFormats)
			return getLastBreakpointAttribute({
				target: prop,
				breakpoint: currentBreakpoint,
				attributes: typography,
				isHover,
				avoidXXL,
			});

		const nonHoverValue =
			getCustomFormatValue({
				typography,
				formatValue,
				prop,
				breakpoint: currentBreakpoint,
				textLevel,
				styleCard,
				styleCardPrefix,
				avoidXXL,
				avoidSC,
			}) ??
			// In cases like HoverEffectControl, where we want the SC 'p' value
			// but requires a clean 'prop' value (no prefix)
			getCustomFormatValue({
				typography,
				formatValue,
				prop: prop.replace(prefix, ''),
				breakpoint: currentBreakpoint,
				textLevel,
				styleCard,
				styleCardPrefix,
				avoidXXL,
				avoidSC,
			});

		if (!isHover) return nonHoverValue;

		const hoverValue = getCustomFormatValue({
			typography,
			formatValue,
			prop,
			breakpoint: currentBreakpoint,
			isHover,
			textLevel,
			styleCard,
			styleCardPrefix,
		});

		if (hoverValue || isBoolean(hoverValue) || isNumber(hoverValue))
			return hoverValue;

		return nonHoverValue;
	};

	const getWeightOptions = () => {
		const { getFont } = select('maxiBlocks/text');

		if (!isNil(getValue(`${prefix}font-family`))) {
			const fontFiles = getFont(getValue(`${prefix}font-family`))?.files;
			const fontOptions = fontFiles
				? Object.keys(fontFiles).map(key => key)
				: [];

			if (fontOptions.length === 0) {
				return [
					{ label: __('Thin (Hairline)', 'maxi-blocks'), value: 100 },
					{
						label: __('Extra Light (Ultra Light)', 'maxi-blocks'),
						value: 200,
					},
					{ label: __('Light', 'maxi-blocks'), value: 300 },
					{
						label: __('Normal (Regular)', 'maxi-blocks'),
						value: 400,
					},
					{ label: __('Medium', 'maxi-blocks'), value: 500 },
					{
						label: __('Semi Bold (Semi Bold)', 'maxi-blocks'),
						value: 600,
					},
					{ label: __('Bold', 'maxi-blocks'), value: 700 },
					{
						label: __('Extra Bold (Ultra Bold)', 'maxi-blocks'),
						value: 800,
					},
					{ label: __('Black (Heavy)', 'maxi-blocks'), value: 900 },
					{
						label: __('Extra Black (Ultra Black)', 'maxi-blocks'),
						value: 950,
					},
				];
			}
			const weightOptions = {
				100: 'Thin (Hairline)',
				200: 'Extra Light (Ultra Light)',
				300: 'Light',
				400: 'Normal (Regular)',
				500: 'Medium',
				600: 'Semi Bold (Semi Bold)',
				700: 'Bold',
				800: 'Extra Bold (Ultra Bold)',
				900: 'Black (Heavy)',
				950: 'Extra Black (Ultra Black)',
			};
			const response = [];
			if (!fontOptions.includes('900')) {
				fontOptions.push('900');
			}
			fontOptions.forEach(weight => {
				const weightOption = {};
				if (weightOptions[weight]) {
					weightOption.label = __(
						weightOptions[weight],
						'maxi-blocks'
					);
					weightOption.value = weight;
					response.push(weightOption);
				}
			});
			return response;
		}
		return null;
	};

	const getDefault = (prop, customBreakpoint) => {
		const currentBreakpoint = customBreakpoint || breakpoint;

		const defaultAttribute = !styleCards
			? getDefaultAttribute(`${prop}-${currentBreakpoint}`, clientId)
			: getDefaultSCValue({
					target: `${prop}-${currentBreakpoint}`,
					SC: styleCard,
					SCStyle: blockStyle,
					groupAttr: textLevel,
			  });

		return defaultAttribute;
	};

	const onChangeFormat = (
		value,
		customBreakpoint,
		forceDisableCustomFormats = false
	) => {
		const obj = setFormat({
			formatValue,
			isList,
			typography,
			value,
			breakpoint: customBreakpoint || breakpoint,
			isHover,
			textLevel,
			disableCustomFormats:
				forceDisableCustomFormats ?? disableCustomFormats,
			styleCardPrefix,
			returnFormatValue: true,
		});

		if (!isEmpty(obj.formatValue)) {
			const newFormatValue = { ...obj.formatValue };
			delete obj.formatValue;

			dispatch('maxiBlocks/text').sendFormatValue(
				newFormatValue,
				clientId
			);
		}

		onChange(obj);
	};

	const getOpacityValue = label => {
		const value = getValue(label);

		return getIsValid(value, true) ? value : 1;
	};

	return (
		<div className={classes}>
			{!disableFontFamily && (
				<FontFamilySelector
					className='maxi-typography-control__font-family'
					font={getValue(`${prefix}font-family`)}
					onChange={font => {
						onChangeFormat({
							[`${prefix}font-family`]: font.value,
							[`${prefix}font-options`]: font.files,
						});
					}}
					fontWeight={getValue(`${prefix}font-weight`)}
					fontStyle={getValue(`${prefix}font-style`)}
				/>
			)}
			{!disableColor && !styleCards && (
				<ColorControl
					label={__('Font', 'maxi-blocks')}
					className='maxi-typography-control__color'
					color={getValue(`${prefix}color`)}
					prefix={prefix}
					paletteColor={getValue(`${prefix}palette-color`)}
					paletteOpacity={getOpacityValue(`${prefix}palette-opacity`)}
					paletteStatus={getValue(`${prefix}palette-status`)}
					onChangeInline={({ color }) =>
						onChangeInline({ color }, textLevel)
					}
					onChange={({
						color,
						paletteColor,
						paletteStatus,
						paletteOpacity,
					}) =>
						onChangeFormat({
							[`${prefix}color`]: color,
							[`${prefix}palette-color`]: paletteColor,
							[`${prefix}palette-status`]: paletteStatus,
							[`${prefix}palette-opacity`]: paletteOpacity,
						})
					}
					globalProps={globalProps}
					textLevel={textLevel}
					isHover={isHover}
					deviceType={breakpoint}
					clientId={clientId}
					disableGradient
					disablePalette={disablePalette}
				/>
			)}
			{!hideAlignment && (
				<AlignmentControl
					{...getGroupAttributes(props, 'textAlignment')}
					className='maxi-typography-control__text-alignment'
					label={__('Alignment', 'maxi-blocks')}
					onChange={obj => onChange(obj)}
					breakpoint={breakpoint}
					type='text'
				/>
			)}
			<ResponsiveTabsControl
				className='maxi-typography-control__text-options-tabs'
				breakpoint={breakpoint}
			>
				<TextOptions
					getValue={getValue}
					getDefault={getDefault}
					onChangeFormat={onChangeFormat}
					prefix={prefix}
					minMaxSettings={minMaxSettings}
					minMaxSettingsLetterSpacing={minMaxSettingsLetterSpacing}
					avoidXXL={!styleCards}
				/>
			</ResponsiveTabsControl>
			<hr />
			{!disableFontFamily &&
				!disableColor &&
				!styleCards &&
				!hideAlignment && <Divider />}
			<SelectControl
				label={__('Font weight', 'maxi-blocks')}
				className='maxi-typography-control__weight'
				value={getValue(`${prefix}font-weight`)}
				options={getWeightOptions()}
				onChange={val => {
					onChangeFormat({ [`${prefix}font-weight`]: val });
					const fontName = getValue(`${prefix}font-family`);
					const fontStyle = getValue(`${prefix}font-style`);
					const objFont = { [fontName]: {} };

					objFont[fontName].weight = val.toString();
					if (fontStyle) objFont[fontName].style = fontStyle;

					loadFonts(objFont);
				}}
			/>
			<SelectControl
				label={__('Text transform', 'maxi-blocks')}
				className='maxi-typography-control__transform'
				value={getValue(`${prefix}text-transform`)}
				options={[
					{
						label: __('Default', 'maxi-blocks'),
						value: 'none',
					},
					{
						label: __('Capitalize', 'maxi-blocks'),
						value: 'capitalize',
					},
					{
						label: __('Uppercase', 'maxi-blocks'),
						value: 'uppercase',
					},
					{
						label: __('Lowercase', 'maxi-blocks'),
						value: 'lowercase',
					},
				]}
				onChange={val => {
					onChangeFormat({
						[`${prefix}text-transform`]: val,
					});
				}}
			/>
			<SelectControl
				label={__('Style', 'maxi-blocks')}
				className='maxi-typography-control__font-style'
				value={getValue(`${prefix}font-style`)}
				options={[
					{
						label: __('Default', 'maxi-blocks'),
						value: 'normal',
					},
					{
						label: __('Italic', 'maxi-blocks'),
						value: 'italic',
					},
					{
						label: __('Oblique', 'maxi-blocks'),
						value: 'oblique',
					},
				]}
				onChange={val => {
					onChangeFormat({
						[`${prefix}font-style`]: val,
					});
				}}
			/>
			<SelectControl
				label={__('Text decoration', 'maxi-blocks')}
				className='maxi-typography-control__decoration'
				value={getValue(`${prefix}text-decoration`)}
				options={[
					{
						label: __('Default', 'maxi-blocks'),
						value: 'none',
					},
					{
						label: __('Overline', 'maxi-blocks'),
						value: 'overline',
					},
					{
						label: __('Line Through', 'maxi-blocks'),
						value: 'line-through',
					},
					{
						label: __('Underline', 'maxi-blocks'),
						value: 'underline',
					},
					{
						label: __('Underline Overline', 'maxi-blocks'),
						value: 'underline overline',
					},
				]}
				onChange={val => {
					onChangeFormat({
						[`${prefix}text-decoration`]: val,
					});
				}}
			/>
			<SelectControl
				label={__('Text orientation', 'maxi-blocks')}
				className='maxi-typography-control__decoration'
				value={getValue(
					`${prefix}text-orientation`,
					breakpoint,
					false,
					true
				)}
				options={[
					{
						label: __('None', 'maxi-blocks'),
						value: '',
					},
					{
						label: __('Mixed', 'maxi-blocks'),
						value: 'mixed',
					},
					{
						label: __('Upright', 'maxi-blocks'),
						value: 'upright',
					},
					{
						label: __('Sideways', 'maxi-blocks'),
						value: 'sideways',
					},
				]}
				onChange={val => {
					onChangeFormat(
						{
							[`${prefix}text-orientation`]: val,
						},
						breakpoint,
						true
					);
				}}
			/>
			<AdvancedNumberControl
				className='maxi-typography-control__text-indent'
				label={__('Text indent', 'maxi-blocks')}
				enableUnit
				unit={getValue(`${prefix}text-indent-unit`, breakpoint)}
				defaultUnit={getDefault(
					`${prefix}text-indent-unit`,
					breakpoint
				)}
				onChangeUnit={val => {
					onChangeFormat(
						{
							[`${prefix}text-indent-unit`]: val,
						},
						breakpoint,
						true
					);
				}}
				placeholder={getValue(`${prefix}text-indent`, breakpoint)}
				value={getValue(
					`${prefix}text-indent`,
					breakpoint,
					false,
					true
				)}
				defaultValue={getDefault(`${prefix}text-indent`, breakpoint)}
				onChangeValue={val => {
					onChangeFormat(
						{
							[`${prefix}text-indent`]: val,
						},
						breakpoint,
						true
					);
				}}
				onReset={() =>
					onChangeFormat(
						{
							[`${prefix}text-indent-unit`]: getDefault(
								`${prefix}text-indent-unit`
							),
							[`${prefix}text-indent`]: getDefault(
								`${prefix}text-indent`
							),
						},
						breakpoint,
						true
					)
				}
				minMaxSettings={{
					px: {
						min: -99,
						max: 99,
					},
					em: {
						min: -99,
						max: 99,
					},
					vw: {
						min: -99,
						max: 99,
					},
					'%': {
						min: -100,
						max: 100,
					},
				}}
				allowedUnits={['px', 'em', 'vw', '%']}
			/>
			{!hideTextShadow && (
				<>
					<hr />
					<TextShadowControl
						className='maxi-typography-control__text-shadow'
						textShadow={getValue(`${prefix}text-shadow`)}
						onChange={val => {
							onChangeFormat({
								[`${prefix}text-shadow`]: val,
							});
						}}
						defaultColor={getLastBreakpointAttribute({
							target: 'color',
							breakpoint,
							attributes: typography,
						})}
						blockStyle={blockStyle}
						breakpoint={breakpoint}
					/>
				</>
			)}
			{allowLink && (
				<LinkOptions
					getValue={getValue}
					getDefault={getDefault}
					onChangeInline={onChangeInline}
					onChangeFormat={onChangeFormat}
					prefix={prefix}
					breakpoint={breakpoint}
					textLevel={textLevel}
					isHover={isHover}
					clientId={clientId}
					getOpacityValue={getOpacityValue}
				/>
			)}
		</div>
	);
});

export default TypographyControl;
