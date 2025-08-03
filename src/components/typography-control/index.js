/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useState, useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';
import AlignmentControl from '@components/alignment-control';
import Button from '@components/button';
import ColorControl from '@components/color-control';
import FontFamilySelector from '@components/font-family-selector';
import ResponsiveTabsControl from '@components/responsive-tabs-control';
import SelectControl from '@components/select-control';
import TextShadowControl from '@components/text-shadow-control';
import SettingTabsControl from '@components/setting-tabs-control';
import FontWeightControl from '@components/font-weight-control';
import {
	setFormat,
	getTypographyValue,
	TextContext,
	ListContext,
} from '@extensions/text/formats';
import {
	getDefaultAttribute,
	getGroupAttributes,
	getIsValid,
	getLastBreakpointAttribute,
} from '@extensions/styles';
import { getListTypographyAttributes } from '@extensions/text/lists';
import { getDefaultSCValue } from '@extensions/style-cards';
import { getClosestAvailableFontWeight, getWeightOptions } from './utils';
import onChangeFontWeight from '@components/font-weight-control/utils';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isNil } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const LinkOptions = props => {
	const {
		getValue,
		onChangeInline,
		onChangeFormat,
		prefix,
		breakpoint,
		textLevel,
		clientId,
		isListItem,
	} = props;

	const [linkStatus, setLinkStatus] = useState('normal_link');

	const handleReset = () => {
		onChangeFormat(
			{
				[`${prefix}link-color`]: undefined,
				[`${prefix}link-palette-color`]: undefined,
				[`${prefix}link-palette-status`]: undefined,
				[`${prefix}link-palette-sc-status`]: undefined,
				[`${prefix}link-palette-opacity`]: undefined,
			},
			undefined,
			true
		);
	};

	return (
		<>
			<SettingTabsControl
				type='buttons'
				fullWidthMode
				className='maxi-typography-control__link-options'
				selected={linkStatus}
				hasBorder
				items={[
					{
						label: __('Link', 'maxi-blocks'),
						value: 'normal_link',
						extraIndicatorsResponsive: [
							`${prefix}link-color`,
							`${prefix}link-palette-color`,
							`${prefix}link-palette-opacity`,
							`${prefix}link-palette-status`,
						],
					},
					{
						label: __('Hover', 'maxi-blocks'),
						value: 'hover_link',
						extraIndicatorsResponsive: [
							`${prefix}link-hover-color`,
							`${prefix}link-hover-palette-color`,
							`${prefix}link-hover-palette-opacity`,
							`${prefix}link-hover-palette-status`,
						],
					},
					{
						label: __('Active', 'maxi-blocks'),
						value: 'active_link',
						extraIndicatorsResponsive: [
							`${prefix}link-active-color`,
							`${prefix}link-active-palette-color`,
							`${prefix}link-active-palette-opacity`,
							`${prefix}link-active-palette-status`,
						],
					},
					{
						label: __('Visited', 'maxi-blocks'),
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
					color={getValue('link-color')}
					prefix={`${prefix}link-`}
					paletteStatus={getValue('link-palette-status')}
					paletteSCStatus={getValue('link-palette-sc-status')}
					paletteColor={getValue('link-palette-color')}
					paletteOpacity={getValue('link-palette-opacity')}
					onChangeInline={({ color }) =>
						onChangeInline({ color }, 'a')
					}
					onChange={({
						paletteColor,
						paletteStatus,
						paletteSCStatus,
						paletteOpacity,
						color,
					}) =>
						onChangeFormat(
							{
								[`${prefix}link-palette-status`]: paletteStatus,
								[`${prefix}link-palette-sc-status`]:
									paletteSCStatus,
								[`${prefix}link-palette-color`]: paletteColor,
								[`${prefix}link-palette-opacity`]:
									paletteOpacity,
								[`${prefix}link-color`]: color,
							},
							{ forceDisableCustomFormats: false, tag: 'a' }
						)
					}
					{...(isListItem && {
						onReset: handleReset,
					})}
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
					color={getValue('link-hover-color')}
					prefix={`${prefix}link-hover-`}
					paletteStatus={getValue('link-hover-palette-status')}
					paletteSCStatus={getValue('link-hover-palette-sc-status')}
					paletteColor={getValue('link-hover-palette-color')}
					paletteOpacity={getValue('link-hover-palette-opacity')}
					onChangeInline={({ color }) =>
						onChangeInline({ color }, 'a:hover')
					}
					onChange={({
						paletteColor,
						paletteStatus,
						paletteSCStatus,
						paletteOpacity,
						color,
					}) =>
						onChangeFormat(
							{
								[`${prefix}link-hover-palette-status`]:
									paletteStatus,
								[`${prefix}link-hover-palette-sc-status`]:
									paletteSCStatus,
								[`${prefix}link-hover-palette-color`]:
									paletteColor,
								[`${prefix}link-hover-palette-opacity`]:
									paletteOpacity,
								[`${prefix}link-hover-color`]: color,
							},
							{ forceDisableCustomFormats: false, tag: 'a:hover' }
						)
					}
					{...(isListItem && {
						onReset: handleReset,
					})}
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
					color={getValue('link-active-color')}
					prefix={`${prefix}link-active-`}
					paletteStatus={getValue('link-active-palette-status')}
					paletteSCStatus={getValue('link-active-palette-sc-status')}
					paletteColor={getValue('link-active-palette-color')}
					paletteOpacity={getValue('link-active-palette-opacity')}
					onChangeInline={({ color }) =>
						onChangeInline({ color }, 'a:active')
					}
					onChange={({
						paletteColor,
						paletteStatus,
						paletteSCStatus,
						paletteOpacity,
						color,
					}) =>
						onChangeFormat(
							{
								[`${prefix}link-active-palette-status`]:
									paletteStatus,
								[`${prefix}link-active-palette-sc-status`]:
									paletteSCStatus,
								[`${prefix}link-active-palette-color`]:
									paletteColor,
								[`${prefix}link-active-palette-opacity`]:
									paletteOpacity,
								[`${prefix}link-active-color`]: color,
							},
							{
								forceDisableCustomFormats: false,
								tag: 'a:active',
							}
						)
					}
					{...(isListItem && {
						onReset: handleReset,
					})}
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
					color={getValue('link-visited-color')}
					prefix={`${prefix}link-visited-`}
					paletteStatus={getValue('link-visited-palette-status')}
					paletteSCStatus={getValue('link-visited-palette-sc-status')}
					paletteColor={getValue('link-visited-palette-color')}
					paletteOpacity={getValue('link-visited-palette-opacity')}
					onChangeInline={({ color }) =>
						onChangeInline({ color }, 'a:visited')
					}
					onChange={({
						paletteColor,
						paletteStatus,
						paletteSCStatus,
						paletteOpacity,
						color,
					}) =>
						onChangeFormat(
							{
								[`${prefix}link-visited-palette-status`]:
									paletteStatus,
								[`${prefix}link-visited-palette-sc-status`]:
									paletteSCStatus,
								[`${prefix}link-visited-palette-color`]:
									paletteColor,
								[`${prefix}link-visited-palette-opacity`]:
									paletteOpacity,
								[`${prefix}link-visited-color`]: color,
							},
							{
								forceDisableCustomFormats: false,
								tag: 'a:visited',
							}
						)
					}
					{...(isListItem && {
						onReset: handleReset,
					})}
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

const TypographyControl = props => {
	const {
		className,
		textLevel = 'p',
		hideAlignment = false,
		onChangeInline = null,
		onChange,
		breakpoint = 'general',
		inlineTarget = '.maxi-text-block__content',
		isList = false,
		isHover = false,
		disableColor = false,
		prefix = '',
		disableFormats = false,
		disableCustomFormats = false,
		showBottomGap = false,
		hideTextShadow = false,
		isStyleCards = false,
		disablePalette = false,
		disableFontFamily = false,
		clientId,
		styleCardPrefix,
		allowLink = false,
		blockStyle,
		globalProps,
		forceIndividualChanges = false,
		setShowLoader,
	} = props;
	const { formatValue, onChangeTextFormat } =
		!isStyleCards && !disableCustomFormats ? useContext(TextContext) : {};
	const listContext = useContext(ListContext);

	const rawTypography =
		props.typography ||
		getGroupAttributes(
			props,
			[
				'typography',
				...(allowLink ? ['link'] : []),
				...(isHover ? ['typographyHover'] : []),
			],
			isHover,
			prefix
		);

	const typography = listContext
		? getListTypographyAttributes(listContext, rawTypography)
		: rawTypography;

	const { styleCard, baseBreakpoint } = useSelect(select => {
		const { receiveMaxiSelectedStyleCard } = select(
			'maxiBlocks/style-cards'
		);
		const { receiveBaseBreakpoint } = select('maxiBlocks');

		const styleCard = receiveMaxiSelectedStyleCard()?.value || {};

		const baseBreakpoint = receiveBaseBreakpoint();

		return {
			styleCard,
			baseBreakpoint,
		};
	});

	const classes = classnames('maxi-typography-control', className);

	const minMaxSettings = {
		px: {
			min: 0,
			max: 999,
		},
		em: {
			min: 0,
			max: 100,
		},
		rem: {
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

	const minMaxSettingsLineHeight = {
		...minMaxSettings,
		'%': {
			min: 0,
			max: 300,
			maxRange: 300,
		},
	};

	const minMaxSettingsLetterSpacing = {
		px: {
			min: -10,
			max: 30,
		},
		em: {
			min: -3,
			max: 10,
		},
		rem: {
			min: -3,
			max: 10,
		},
		vw: {
			min: -3,
			max: 10,
		},
	};

	const getSCValue = ({ SC, target, blockStyle, SCEntry }) => {
		const styleCardEntry =
			SC?.[blockStyle]?.styleCard?.[SCEntry] ||
			SC?.[blockStyle]?.defaultStyleCard?.[SCEntry];
		const value = styleCardEntry?.[target];

		return value;
	};

	const getDefault = (target, keepBreakpoint = false) => {
		const prop = `${prefix}${target}`;

		const currentBreakpoint =
			(isStyleCards &&
				breakpoint === 'general' &&
				!keepBreakpoint &&
				baseBreakpoint) ||
			breakpoint;

		// Special handling for unit targets
		if (!isStyleCards && target.includes('-unit')) {
			const connectedTarget = target.replace('-unit', '');
			const connectedValue = getTypographyValue({
				disableFormats,
				prop: `${prefix}${connectedTarget}`,
				breakpoint,
				typography,
				isHover,
				formatValue,
				textLevel,
				blockStyle,
				styleCard,
				styleCardPrefix,
				prefix,
			});

			const scDefaultValue = getDefaultSCValue({
				target: `${prefix}${connectedTarget}-${currentBreakpoint}`,
				SC: styleCard,
				SCStyle: blockStyle,
				groupAttr: textLevel,
			});
			// If connected value matches SC default, prioritize SC unit
			if (connectedValue === scDefaultValue) {
				const scUnitValue = getDefaultSCValue({
					target: `${prop}-${currentBreakpoint}`,
					SC: styleCard,
					SCStyle: blockStyle,
					groupAttr: textLevel,
				});
				if (scUnitValue !== undefined) {
					return scUnitValue;
				}
			}
		}

		let defaultAttribute = !isStyleCards
			? getDefaultAttribute(`${prop}-${currentBreakpoint}`, clientId)
			: getDefaultSCValue({
					target: `${prop}-${currentBreakpoint}`,
					SC: styleCard,
					SCStyle: blockStyle,
					groupAttr: textLevel,
			  });

		if (isStyleCards && isNil(defaultAttribute)) {
			defaultAttribute = getDefaultSCValue({
				target: `${prop}-${breakpoint}`,
				SC: styleCard,
				SCStyle: blockStyle,
				groupAttr: textLevel,
			});
		}

		return defaultAttribute;
	};

	const getValue = (target, avoidSC = false) => {
		if (!isStyleCards && target.includes('-unit')) {
			const connectedTarget = target.replace('-unit', '');

			const connectedValue = getTypographyValue({
				disableFormats,
				prop: `${prefix}${connectedTarget}`,
				breakpoint,
				typography,
				isHover,
				formatValue,
				textLevel,
				blockStyle,
				styleCard,
				styleCardPrefix,
				prefix,
			});

			const currentValue = getTypographyValue({
				disableFormats,
				prop: `${prefix}${target}`,
				breakpoint,
				typography,
				isHover,
				formatValue,
				textLevel,
				blockStyle,
				styleCard,
				styleCardPrefix,
				prefix,
				avoidSC,
			});
			const defaultValue = getDefault(target);
			const scValue = getSCValue({
				SC: styleCard,
				target: `${prefix}${connectedTarget}-${breakpoint}`,
				blockStyle,
				SCEntry: textLevel,
			});
			// If connected value matches SC value, prioritize SC unit
			if (
				currentValue === defaultValue &&
				(connectedValue === scValue || scValue === undefined)
			) {
				const scUnitValue = getSCValue({
					SC: styleCard,
					target: `${prefix}${target}-${breakpoint}`,
					blockStyle,
					SCEntry: textLevel,
				});

				if (scUnitValue !== undefined) {
					return scUnitValue;
				}
			}
		}
		return getTypographyValue({
			disableFormats,
			prop: `${prefix}${target}`,
			breakpoint,
			typography,
			isHover,
			formatValue,
			textLevel,
			blockStyle,
			styleCard,
			styleCardPrefix,
			prefix,
			avoidSC,
		});
	};

	const getInlineTarget = tag => {
		const target = `${inlineTarget} ${isList ? 'li' : ''}${
			tag !== ''
				? `${tag}, ${inlineTarget} ${isList ? 'li' : ''} ${tag} span`
				: ''
		}`;

		return target.replace(/\s{2,}/g, ' ');
	};

	const onChangeFormat = (
		value,
		{ forceDisableCustomFormats = false, tag = '', isReset = false } = {},
		disableFilter = false
	) => {
		if (forceIndividualChanges) {
			const obj = Object.entries(value).reduce((acc, [key, val]) => {
				acc[`${key}-${breakpoint}`] = val;

				return acc;
			}, {});

			onChange({ ...obj, isReset });
			return;
		}

		const obj = setFormat({
			formatValue,
			isList,
			typography,
			value,
			breakpoint,
			isHover,
			textLevel,
			disableCustomFormats:
				forceDisableCustomFormats || disableCustomFormats,
			styleCardPrefix,
			returnFormatValue: true,
		});

		const filteredObj = !disableFilter
			? Object.fromEntries(
					Object.entries(obj).filter(
						([key, value]) =>
							value !== undefined || key.includes('font-family')
					)
			  )
			: obj;

		if (!isEmpty(filteredObj.formatValue)) {
			const newFormatValue = {
				...filteredObj.formatValue,
				start: formatValue.start,
				end: formatValue.end,
			};
			delete filteredObj.formatValue;

			onChangeTextFormat(newFormatValue);
		}

		if (!isReset) {
			onChange(filteredObj, getInlineTarget(tag));
		} else {
			onChange({ ...obj, isReset: true }, getInlineTarget(tag));
		}
	};

	const onChangeInlineValue = (obj, tag = '') => {
		onChangeInline && onChangeInline(obj, getInlineTarget(tag), isList);
	};

	const getOpacityValue = label => {
		const value = getValue(label);

		return getIsValid(value, true) ? value : 1;
	};

	return (
		<ResponsiveTabsControl breakpoint={breakpoint}>
			<div className={classes}>
				{!disableFontFamily && (
					<FontFamilySelector
						className='maxi-typography-control__font-family'
						font={getValue('font-family')}
						onChange={font => {
							const currentWeight = getValue('font-weight');
							const fontName =
								font.value ?? getDefault('font-family');
							const isInWeightOptions =
								isNil(currentWeight) ||
								isNil(fontName) ||
								getWeightOptions(fontName).some(
									({ value }) => +value === +currentWeight
								);

							onChangeFormat({
								[`${prefix}font-family`]: font.value,
								...(!isInWeightOptions && {
									[`${prefix}font-weight`]:
										getClosestAvailableFontWeight(
											fontName,
											currentWeight
										),
								}),
								[`${prefix}font-options`]: font.files,
							});

							if (!isInWeightOptions) {
								onChangeFontWeight(
									getClosestAvailableFontWeight(
										fontName,
										currentWeight
									),
									fontName,
									getValue('font-style') ??
										getDefault('font-style'),
									setShowLoader
								);
							}
						}}
						fontWeight={getValue('font-weight')}
						fontStyle={getValue('font-style')}
						setShowLoader={setShowLoader}
						breakpoint={breakpoint}
					/>
				)}
				<div
					className='maxi-typography-control__weight-size-row'
					style={{ display: 'flex', gap: '10px' }}
				>
					<div style={{ flex: '1' }}>
						<FontWeightControl
							onChange={val => {
								onChangeFormat({
									[`${prefix}font-weight`]: val,
								});
							}}
							onReset={() => {
								onChangeFormat(
									{
										[`${prefix}font-weight`]:
											getDefault('font-weight'),
									},
									{ isReset: true }
								);
							}}
							fontWeight={getValue('font-weight')}
							defaultFontWeight={getDefault('font-weight')}
							fontName={
								getValue('font-family') ??
								getDefault('font-family')
							}
							fontStyle={getValue('font-style')}
							breakpoint={breakpoint}
							setShowLoader={setShowLoader}
						/>
					</div>
					<div style={{ flex: '1' }}>
						<AdvancedNumberControl
							className='maxi-typography-control__size'
							label={__('Text size', 'maxi-blocks')}
							enableUnit
							unit={getValue('font-size-unit')}
							defaultUnit={getDefault('font-size-unit')}
							newStyle
							resetButtonClassName='maxi-reset-button--typography'
							onChangeUnit={val => {
								const currentValue = getValue('font-size');
								const { min, max } = minMaxSettings[val] || {};
								const newValue =
									max && currentValue > max
										? max
										: min && currentValue < min
										? min
										: currentValue;
								onChangeFormat({
									[`${prefix}font-size-unit`]: val,
									[`${prefix}font-size`]: newValue,
								});
							}}
							placeholder={getValue('font-size')}
							value={getValue('font-size', !isStyleCards)}
							defaultValue={getDefault('font-size')}
							onChangeValue={val => {
								onChangeFormat({
									[`${prefix}font-size`]: val,
									[`${prefix}font-size-unit`]:
										getValue('font-size-unit'),
								});
							}}
							onReset={() =>
								onChangeFormat(
									{
										[`${prefix}font-size-unit`]:
											getDefault('font-size-unit'),
										[`${prefix}font-size`]:
											getDefault('font-size'),
									},
									{ isReset: true }
								)
							}
							minMaxSettings={minMaxSettings}
							allowedUnits={['px', 'em', 'rem', 'vw', '%']}
						/>
					</div>
				</div>

				<div className='maxi-typography-control__spacing-controls'>
					<AdvancedNumberControl
						className='maxi-typography-control__line-height'
						label={__('Line height', 'maxi-blocks')}
						enableUnit
						unit={getValue('line-height-unit') || ''}
						defaultUnit={getDefault('line-height-unit')}
						resetButtonClassName='maxi-reset-button--typography'
						onChangeUnit={val => {
							const currentValue = getValue('line-height');
							const { min, max } =
								minMaxSettingsLineHeight[val] || {};
							const newValue =
								max && currentValue > max
									? max
									: min && currentValue < min
									? min
									: currentValue;
							onChangeFormat({
								[`${prefix}line-height-unit`]: val,
								[`${prefix}line-height`]: newValue,
							});
						}}
						placeholder={getValue('line-height')}
						value={getValue('line-height', !isStyleCards)}
						defaultValue={getDefault('line-height')}
						onChangeValue={val => {
							onChangeFormat({
								[`${prefix}line-height`]: val,
								[`${prefix}line-height-unit`]:
									getValue('line-height-unit'),
							});
						}}
						onReset={() =>
							onChangeFormat(
								{
									[`${prefix}line-height-unit`]:
										getDefault('line-height-unit'),
									[`${prefix}line-height`]:
										getDefault('line-height'),
								},
								{ isReset: true }
							)
						}
						minMaxSettings={minMaxSettingsLineHeight}
						allowedUnits={['px', 'em', 'rem', 'vw', '%', '-']}
					/>
					{showBottomGap && (
						<AdvancedNumberControl
							className='maxi-typography-control__bottom-gap'
							label={__('Bottom gap', 'maxi-blocks')}
							enableUnit
							unit={getValue('bottom-gap-unit')}
							defaultUnit={getDefault('bottom-gap-unit')}
							resetButtonClassName='maxi-reset-button--typography'
							onChangeUnit={val => {
								const currentValue = getValue('bottom-gap');
								const maxValue = minMaxSettings[val]?.max;
								const newValue =
									maxValue && currentValue > maxValue
										? maxValue
										: currentValue;
								onChangeFormat(
									{
										[`${prefix}bottom-gap-unit`]: val,
										[`${prefix}bottom-gap`]: newValue,
									},
									{ forceDisableCustomFormats: true }
								);
							}}
							placeholder={getValue('bottom-gap')}
							value={getValue('bottom-gap')}
							defaultValue={getDefault(
								'bottom-gap',
								!isStyleCards
							)}
							onChangeValue={val => {
								onChangeFormat(
									{
										[`${prefix}bottom-gap`]: val,
										[`${prefix}bottom-gap-unit`]:
											getValue('bottom-gap-unit'),
									},
									{ forceDisableCustomFormats: true }
								);
							}}
							onReset={() =>
								onChangeFormat(
									{
										[`${prefix}bottom-gap-unit`]:
											getDefault('bottom-gap-unit'),
										[`${prefix}bottom-gap`]:
											getDefault('bottom-gap'),
									},
									{
										forceDisableCustomFormats: true,
										isReset: true,
									}
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
								rem: {
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
							allowedUnits={['px', 'em', 'rem', 'vw', '%']}
						/>
					)}
				</div>

				{/* Typography formatting buttons row */}
				<div
					className='maxi-typography-control__formatting-buttons'
					style={{
						display: 'flex',
						gap: '5px',
						marginBottom: '15px',
					}}
				>
					<Button
						className='maxi-typography-control__format-button maxi-typography-control__format-button--bold'
						onClick={() => {
							const currentWeight = getValue('font-weight');
							const isActive = currentWeight > 400;
							onChangeFormat({
								[`${prefix}font-weight`]: isActive ? 400 : 700,
							});
						}}
						aria-pressed={getValue('font-weight') > 400}
					>
						B
					</Button>
					<Button
						className='maxi-typography-control__format-button maxi-typography-control__format-button--italic'
						onClick={() => {
							const currentStyle = getValue('font-style');
							const isActive = currentStyle === 'italic';
							onChangeFormat({
								[`${prefix}font-style`]: isActive
									? 'normal'
									: 'italic',
							});
						}}
						aria-pressed={getValue('font-style') === 'italic'}
					>
						I
					</Button>
					<Button
						className='maxi-typography-control__format-button maxi-typography-control__format-button--underline'
						onClick={() => {
							const currentDecoration =
								getValue('text-decoration') || '';
							const isActive =
								currentDecoration.indexOf('underline') >= 0;
							let newDecoration;

							if (currentDecoration === 'unset') {
								newDecoration = 'underline';
							} else {
								newDecoration = isActive
									? currentDecoration
											.replace('underline', '')
											.trim()
									: `${currentDecoration} underline`.trim();
							}

							if (!newDecoration) newDecoration = 'unset';

							onChangeFormat({
								[`${prefix}text-decoration`]: newDecoration,
							});
						}}
						aria-pressed={
							(getValue('text-decoration') || '').indexOf(
								'underline'
							) >= 0
						}
					>
						U
					</Button>
					<Button
						className='maxi-typography-control__format-button maxi-typography-control__format-button--strikethrough'
						onClick={() => {
							const currentDecoration =
								getValue('text-decoration') || '';
							const isActive =
								currentDecoration.indexOf('line-through') >= 0;
							let newDecoration;

							if (currentDecoration === 'unset') {
								newDecoration = 'line-through';
							} else {
								newDecoration = isActive
									? currentDecoration
											.replace('line-through', '')
											.trim()
									: `${currentDecoration} line-through`.trim();
							}

							if (!newDecoration) newDecoration = 'unset';

							onChangeFormat({
								[`${prefix}text-decoration`]: newDecoration,
							});
						}}
						aria-pressed={
							(getValue('text-decoration') || '').indexOf(
								'line-through'
							) >= 0
						}
					>
						S
					</Button>
					<Button
						className='maxi-typography-control__format-button maxi-typography-control__format-button--capitalize'
						onClick={() => {
							const currentTransform =
								getValue('text-transform') || 'none';
							const isActive = currentTransform === 'capitalize';
							onChangeFormat({
								[`${prefix}text-transform`]: isActive
									? 'none'
									: 'capitalize',
							});
						}}
						aria-pressed={
							getValue('text-transform') === 'capitalize'
						}
					>
						Ag
					</Button>
					<Button
						className='maxi-typography-control__format-button maxi-typography-control__format-button--uppercase'
						onClick={() => {
							const currentTransform =
								getValue('text-transform') || 'none';
							const isActive = currentTransform === 'uppercase';
							onChangeFormat({
								[`${prefix}text-transform`]: isActive
									? 'none'
									: 'uppercase',
							});
						}}
						aria-pressed={
							getValue('text-transform') === 'uppercase'
						}
					>
						AG
					</Button>
					<Button
						className='maxi-typography-control__format-button maxi-typography-control__format-button--lowercase'
						onClick={() => {
							const currentTransform =
								getValue('text-transform') || 'none';
							const isActive = currentTransform === 'lowercase';
							onChangeFormat({
								[`${prefix}text-transform`]: isActive
									? 'none'
									: 'lowercase',
							});
						}}
						aria-pressed={
							getValue('text-transform') === 'lowercase'
						}
					>
						ag
					</Button>
				</div>

				<hr className='maxi-typography-control__formatting-separator' />

				{!disableColor && !isStyleCards && (
					<ColorControl
						label={__('Font', 'maxi-blocks')}
						className='maxi-typography-control__color'
						color={getValue('color')}
						prefix={prefix}
						paletteColor={getValue('palette-color')}
						paletteOpacity={getOpacityValue(
							`${prefix}palette-opacity`
						)}
						paletteStatus={getValue('palette-status')}
						paletteSCStatus={getValue('palette-sc-status')}
						onChangeInline={({ color }) =>
							onChangeInlineValue({ color })
						}
						onChange={({
							color,
							paletteColor,
							paletteStatus,
							paletteSCStatus,
							paletteOpacity,
						}) =>
							onChangeFormat({
								[`${prefix}color`]: color,
								[`${prefix}palette-color`]: paletteColor,
								[`${prefix}palette-status`]: paletteStatus,
								[`${prefix}palette-sc-status`]: paletteSCStatus,
								[`${prefix}palette-opacity`]: paletteOpacity,
							})
						}
						{...(listContext
							? {
									onReset: () => {
										onChangeFormat(
											{
												[`${prefix}color`]: undefined,
												[`${prefix}palette-color`]:
													undefined,
												[`${prefix}palette-status`]:
													undefined,
												[`${prefix}palette-sc-status`]:
													undefined,
												[`${prefix}palette-opacity`]:
													undefined,
											},
											undefined,
											true
										);
									},
							  }
							: {})}
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
						onChange={onChange}
						breakpoint={breakpoint}
						type='text'
						disableRTC
					/>
				)}

				<hr />
				{!disableFontFamily &&
					!disableColor &&
					!isStyleCards &&
					!hideAlignment && <hr style={{ margin: '15px 0' }} />}
				<AdvancedNumberControl
					className='maxi-typography-control__text-indent'
					label={__('Text indent', 'maxi-blocks')}
					enableUnit
					unit={getValue('text-indent-unit')}
					defaultUnit={getDefault('text-indent-unit')}
					onChangeUnit={val => {
						const currentValue = getValue('text-indent');
						const { min, max } = minMaxSettings[val] || {};
						const newValue =
							max && currentValue > max
								? max
								: min && currentValue < min
								? min
								: currentValue;
						onChangeFormat(
							{
								[`${prefix}text-indent-unit`]: val,
								[`${prefix}text-indent`]: newValue,
							},
							{ forceDisableCustomFormats: true }
						);
					}}
					placeholder={getValue('text-indent')}
					value={getValue('text-indent', !isStyleCards)}
					defaultValue={getDefault('text-indent')}
					onChangeValue={val => {
						onChangeFormat(
							{
								[`${prefix}text-indent`]: val,
								[`${prefix}text-indent-unit`]:
									getValue('text-indent-unit'),
							},
							{ forceDisableCustomFormats: true }
						);
					}}
					onReset={() =>
						onChangeFormat(
							{
								[`${prefix}text-indent-unit`]:
									getDefault('text-indent-unit'),
								[`${prefix}text-indent`]:
									getDefault('text-indent'),
							},
							{ forceDisableCustomFormats: true, isReset: true }
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
						rem: {
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
					allowedUnits={['px', 'em', 'rem', 'vw', '%']}
				/>
				<AdvancedNumberControl
					className='maxi-typography-control__word-spacing'
					label={__('Word Spacing', 'maxi-blocks')}
					enableUnit
					unit={getValue('word-spacing-unit')}
					defaultUnit={getDefault('word-spacing-unit')}
					onChangeUnit={val => {
						const currentValue = getValue('word-spacing');
						const { min, max } = minMaxSettings[val] || {};
						const newValue =
							max && currentValue > max
								? max
								: min && currentValue < min
								? min
								: currentValue;
						onChangeFormat(
							{
								[`${prefix}word-spacing-unit`]: val,
								[`${prefix}word-spacing`]: newValue,
							},
							{ forceDisableCustomFormats: true }
						);
					}}
					placeholder={getValue('word-spacing')}
					value={getValue('word-spacing')}
					defaultValue={getDefault('word-spacing', !isStyleCards)}
					onChangeValue={val => {
						onChangeFormat(
							{
								[`${prefix}word-spacing`]: val,
								[`${prefix}word-spacing-unit`]:
									getValue('word-spacing-unit'),
							},
							{ forceDisableCustomFormats: true }
						);
					}}
					onReset={() =>
						onChangeFormat(
							{
								[`${prefix}word-spacing-unit`]:
									getDefault('word-spacing-unit'),
								[`${prefix}word-spacing`]:
									getDefault('word-spacing'),
							},
							{ forceDisableCustomFormats: true, isReset: true }
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
						rem: {
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
					allowedUnits={['px', 'em', 'rem', 'vw', '%']}
				/>
				<AdvancedNumberControl
					className='maxi-typography-control__letter-spacing'
					label={__('Letter spacing', 'maxi-blocks')}
					enableUnit
					allowedUnits={['px', 'em', 'rem', 'vw']}
					unit={getValue('letter-spacing-unit')}
					defaultUnit={getDefault('letter-spacing-unit')}
					onChangeUnit={val => {
						const currentValue = getValue('letter-spacing');
						const { min, max } =
							minMaxSettingsLetterSpacing[val] || {};
						const newValue =
							max && currentValue > max
								? max
								: min && currentValue < min
								? min
								: currentValue;
						onChangeFormat({
							[`${prefix}letter-spacing-unit`]: val,
							[`${prefix}letter-spacing`]: newValue,
						});
					}}
					placeholder={getValue('letter-spacing')}
					value={getValue('letter-spacing', !isStyleCards)}
					defaultValue={getDefault('letter-spacing')}
					onChangeValue={val => {
						onChangeFormat({
							[`${prefix}letter-spacing`]: val,
							[`${prefix}letter-spacing-unit`]: getValue(
								'letter-spacing-unit'
							),
						});
					}}
					onReset={() =>
						onChangeFormat(
							{
								[`${prefix}letter-spacing-unit`]: getDefault(
									'letter-spacing-unit'
								),
								[`${prefix}letter-spacing`]:
									getDefault('letter-spacing'),
							},
							{ isReset: true }
						)
					}
					minMaxSettings={minMaxSettingsLetterSpacing}
					step={0.1}
				/>
				<SelectControl
					__nextHasNoMarginBottom
					label={__('Text transform', 'maxi-blocks')}
					className='maxi-typography-control__transform'
					value={getValue('text-transform')}
					defaultValue={getDefault('text-transform')}
					newStyle
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
					onReset={() =>
						onChangeFormat(
							{
								[`${prefix}text-transform`]:
									getDefault('text-transform'),
							},
							{ isReset: true }
						)
					}
				/>
				<SelectControl
					__nextHasNoMarginBottom
					label={__('Style', 'maxi-blocks')}
					className='maxi-typography-control__font-style'
					value={getValue('font-style')}
					defaultValue={getDefault('font-style')}
					newStyle
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
					onReset={() =>
						onChangeFormat(
							{
								[`${prefix}font-style`]:
									getDefault('font-style'),
							},
							{ isReset: true }
						)
					}
				/>
				<SelectControl
					__nextHasNoMarginBottom
					label={__('Text decoration', 'maxi-blocks')}
					className='maxi-typography-control__decoration'
					value={getValue('text-decoration')}
					defaultValue={getDefault('text-decoration')}
					newStyle
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
							label: __('Line through', 'maxi-blocks'),
							value: 'line-through',
						},
						{
							label: __('Underline', 'maxi-blocks'),
							value: 'underline',
						},
						{
							label: __('Underline overline', 'maxi-blocks'),
							value: 'underline overline',
						},
					]}
					onChange={val => {
						onChangeFormat({
							[`${prefix}text-decoration`]: val,
						});
					}}
					onReset={() =>
						onChangeFormat(
							{
								[`${prefix}text-decoration`]:
									getDefault('text-decoration'),
							},
							{ isReset: true }
						)
					}
				/>
				{!isStyleCards && (
					<>
						<SelectControl
							__nextHasNoMarginBottom
							label={__('Text orientation', 'maxi-blocks')}
							className='maxi-typography-control__orientation'
							value={getValue('text-orientation')}
							defaultValue={getDefault('text-orientation')}
							newStyle
							options={[
								{
									label: __('None', 'maxi-blocks'),
									value: 'unset',
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
									{ forceDisableCustomFormats: true }
								);
							}}
							onReset={() =>
								onChangeFormat(
									{
										[`${prefix}text-orientation`]:
											getDefault('text-orientation'),
									},
									{ isReset: true }
								)
							}
						/>
						<SelectControl
							__nextHasNoMarginBottom
							label={__('Text direction', 'maxi-blocks')}
							className='maxi-typography-control__direction'
							value={getValue('text-direction')}
							defaultValue={getDefault('text-direction')}
							newStyle
							options={[
								{
									label: __('Left to right', 'maxi-blocks'),
									value: 'ltr',
								},
								{
									label: __('Right to left', 'maxi-blocks'),
									value: 'rtl',
								},
							]}
							onChange={val => {
								onChangeFormat({
									[`${prefix}text-direction`]: val,
								});
							}}
							onReset={() =>
								onChangeFormat(
									{
										[`${prefix}text-direction`]:
											getDefault('text-direction'),
									},
									{ isReset: true }
								)
							}
						/>
					</>
				)}
				<SelectControl
					__nextHasNoMarginBottom
					label={__('White space', 'maxi-blocks')}
					className='maxi-typography-control__white-space'
					value={getValue('white-space')}
					defaultValue={getDefault('white-space')}
					newStyle
					options={[
						{
							label: __('Normal', 'maxi-blocks'),
							value: 'normal',
						},
						{
							label: __('No wrap', 'maxi-blocks'),
							value: 'nowrap',
						},
						{
							label: __('Pre', 'maxi-blocks'),
							value: 'pre',
						},
						{
							label: __('Pre line', 'maxi-blocks'),
							value: 'pre-line',
						},
						{
							label: __('Pre wrap', 'maxi-blocks'),
							value: 'pre-wrap',
						},
						{
							label: __('Break spaces', 'maxi-blocks'),
							value: 'break-spaces',
						},
					]}
					onChange={val => {
						onChangeFormat({
							[`${prefix}white-space`]: val,
						});
					}}
					onReset={() => {
						onChangeFormat(
							{
								[`${prefix}white-space`]:
									getDefault('white-space'),
							},
							{ isReset: true }
						);
					}}
				/>
				{!hideTextShadow && (
					<>
						<hr />
						<TextShadowControl
							className='maxi-typography-control__text-shadow'
							textShadow={getValue('text-shadow')}
							onChangeInline={val =>
								onChangeInlineValue({ 'text-shadow': val })
							}
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
						onChangeInline={onChangeInlineValue}
						onChangeFormat={onChangeFormat}
						prefix={prefix}
						breakpoint={breakpoint}
						textLevel={textLevel}
						isHover={isHover}
						clientId={clientId}
						getOpacityValue={getOpacityValue}
						isListItem={!!listContext}
					/>
				)}
			</div>
		</ResponsiveTabsControl>
	);
};

export default TypographyControl;
