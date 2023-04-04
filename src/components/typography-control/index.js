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
import AdvancedNumberControl from '../advanced-number-control';
import AlignmentControl from '../alignment-control';
import ColorControl from '../color-control';
import FontFamilySelector from '../font-family-selector';
import ResponsiveTabsControl from '../responsive-tabs-control';
import SelectControl from '../select-control';
import TextShadowControl from '../text-shadow-control';
import SettingTabsControl from '../setting-tabs-control';
import FontWeightControl from '../font-weight-control';
import {
	setFormat,
	getTypographyValue,
	textContext,
} from '../../extensions/text/formats';
import {
	getAttributeKey,
	getDefaultAttribute,
	getGroupAttributes,
	getIsValid,
	getLastBreakpointAttribute,
} from '../../extensions/attributes';
import { getDefaultSCValue } from '../../extensions/style-cards';

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
	} = props;

	const [linkStatus, setLinkStatus] = useState('normal_link');

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
						label: __('Link', 'maxi-block'),
						value: 'normal_link',
						extraIndicatorsResponsive: [
							'_cc',
							'_pc',
							'_po',
							'_ps',
						].map(attributeKey =>
							getAttributeKey(
								attributeKey,
								false,
								`${prefix}link-`
							)
						),
					},
					{
						label: __('Hover', 'maxi-block'),
						value: 'hover_link',
						extraIndicatorsResponsive: [
							'hover-color',
							'hover-palette-color',
							'hover-palette-opacity',
							'hover-palette-status',
						].map(attributeKey =>
							getAttributeKey(
								attributeKey,
								false,
								`${prefix}link-`
							)
						),
					},
					{
						label: __('Active', 'maxi-block'),
						value: 'active_link',
						extraIndicatorsResponsive: [
							'active-color',
							'active-palette-color',
							'active-palette-opacity',
							'active-palette-status',
						].map(attributeKey =>
							getAttributeKey(
								attributeKey,
								false,
								`${prefix}link-`
							)
						),
					},
					{
						label: __('Visited', 'maxi-block'),
						value: 'visited_link',
						extraIndicatorsResponsive: [
							'visited-color',
							'visited-palette-color',
							'visited-palette-opacity',
							'visited-palette-status',
						].map(attributeKey =>
							getAttributeKey(
								attributeKey,
								false,
								`${prefix}link-`
							)
						),
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
					paletteColor={getValue('link-palette-color')}
					paletteOpacity={getValue('link-palette-opacity')}
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
								[getAttributeKey(
									'_ps',
									false,
									`${prefix}link-`
								)]: paletteStatus,
								[getAttributeKey(
									'_pc',
									false,
									`${prefix}link-`
								)]: paletteColor,
								[getAttributeKey(
									'_po',
									false,
									`${prefix}link-`
								)]: paletteOpacity,
								[getAttributeKey(
									'_cc',
									false,
									`${prefix}link-`
								)]: color,
							},
							{ forceDisableCustomFormats: false, tag: 'a' }
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
					color={getValue('link-hover-color')}
					prefix={`${prefix}link-hover-`}
					paletteStatus={getValue('link-hover-palette-status')}
					paletteColor={getValue('link-hover-palette-color')}
					paletteOpacity={getValue('link-hover-palette-opacity')}
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
								[getAttributeKey(
									'hover-palette-status',
									false,
									`${prefix}link-`
								)]: paletteStatus,
								[getAttributeKey(
									'hover-palette-color',
									false,
									`${prefix}link-`
								)]: paletteColor,
								[getAttributeKey(
									'hover-palette-opacity',
									false,
									`${prefix}link-`
								)]: paletteOpacity,
								[getAttributeKey(
									'hover-color',
									false,
									`${prefix}link-`
								)]: color,
							},
							{ forceDisableCustomFormats: false, tag: 'a:hover' }
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
					color={getValue('link-active-color')}
					prefix={`${prefix}link-active-`}
					paletteStatus={getValue('link-active-palette-status')}
					paletteColor={getValue('link-active-palette-color')}
					paletteOpacity={getValue('link-active-palette-opacity')}
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
								[getAttributeKey(
									'active-palette-status',
									false,
									`${prefix}link-`
								)]: paletteStatus,
								[getAttributeKey(
									'active-palette-color',
									false,
									`${prefix}link-`
								)]: paletteColor,
								[getAttributeKey(
									'active-palette-opacity',
									false,
									`${prefix}link-`
								)]: paletteOpacity,
								[getAttributeKey(
									'active-color',
									false,
									`${prefix}link-`
								)]: color,
							},
							{
								forceDisableCustomFormats: false,
								tag: 'a:active',
							}
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
					color={getValue('link-visited-color')}
					prefix={`${prefix}link-visited-`}
					paletteStatus={getValue('link-visited-palette-status')}
					paletteColor={getValue('link-visited-palette-color')}
					paletteOpacity={getValue('link-visited-palette-opacity')}
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
								[getAttributeKey(
									'visited-palette-status',
									false,
									`${prefix}link-`
								)]: paletteStatus,
								[getAttributeKey(
									'visited-palette-color',
									false,
									`${prefix}link-`
								)]: paletteColor,
								[getAttributeKey(
									'visited-palette-opacity',
									false,
									`${prefix}link-`
								)]: paletteOpacity,
								[getAttributeKey(
									'visited-color',
									false,
									`${prefix}link-`
								)]: color,
							},
							{
								forceDisableCustomFormats: false,
								tag: 'a:visited',
							}
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
		hideBottomGap = false,
		hideTextShadow = false,
		isStyleCards = false,
		disablePalette = false,
		disableFontFamily = false,
		clientId,
		styleCardPrefix,
		allowLink = false,
		blockStyle,
		globalProps,
	} = props;
	const { formatValue, onChangeTextFormat } =
		!isStyleCards && !disableCustomFormats ? useContext(textContext) : {};

	const typography =
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
			max: 300,
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
			min: -10,
			max: 30,
		},
		em: {
			min: -3,
			max: 10,
		},
		vw: {
			min: -3,
			max: 10,
		},
	};

	const getValue = (target, avoidSC = false) =>
		getTypographyValue({
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

	const getDefault = (target, keepBreakpoint = false) => {
		const prop = `${prefix}${target}`;

		const currentBreakpoint =
			(isStyleCards &&
				breakpoint === 'general' &&
				!keepBreakpoint &&
				baseBreakpoint) ||
			breakpoint;

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
		{ forceDisableCustomFormats = false, tag = '', isReset = false } = {}
	) => {
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

		if (!isEmpty(obj.formatValue)) {
			const newFormatValue = {
				...obj.formatValue,
				start: formatValue.start,
				end: formatValue.end,
			};
			delete obj.formatValue;

			onChangeTextFormat(newFormatValue);
		}

		if (!isReset) onChange(obj, getInlineTarget(tag));
		else onChange({ ...obj, isReset: true }, getInlineTarget(tag));
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
							onChangeFormat({
								[getAttributeKey('font-family', false, prefix)]:
									font.value,
								[getAttributeKey(
									'font-options',
									false,
									prefix
								)]: font.files,
							});
						}}
						fontWeight={getValue('font-weight')}
						fontStyle={getValue('font-style')}
						breakpoint={breakpoint}
					/>
				)}
				{!disableColor && !isStyleCards && (
					<ColorControl
						label={__('Font', 'maxi-blocks')}
						className='maxi-typography-control__color'
						color={getValue('_cc')}
						prefix={prefix}
						paletteColor={getValue('_pc')}
						paletteOpacity={getOpacityValue(`${prefix}_po`)}
						paletteStatus={getValue('_ps')}
						onChangeInline={({ color }) =>
							onChangeInlineValue({ color })
						}
						onChange={({
							color,
							paletteColor,
							paletteStatus,
							paletteOpacity,
						}) =>
							onChangeFormat({
								[getAttributeKey('_cc', false, prefix)]: color,
								[getAttributeKey('_pc', false, prefix)]:
									paletteColor,
								[getAttributeKey('_ps', false, prefix)]:
									paletteStatus,
								[getAttributeKey('_po', false, prefix)]:
									paletteOpacity,
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
						onChange={onChange}
						breakpoint={breakpoint}
						type='text'
						disableRTC
					/>
				)}
				<AdvancedNumberControl
					className='maxi-typography-control__size'
					label={__('Font size', 'maxi-blocks')}
					enableUnit
					unit={getValue('font-size-unit')}
					defaultUnit={getDefault('font-size-unit')}
					onChangeUnit={val => {
						onChangeFormat({
							[getAttributeKey('font-size-unit', false, prefix)]:
								val,
						});
					}}
					placeholder={getValue('font-size')}
					value={getValue('font-size', !isStyleCards)}
					defaultValue={getDefault('font-size')}
					onChangeValue={(val, unit) => {
						onChangeFormat({
							[getAttributeKey('font-size', false, prefix)]: val,
							...(unit && {
								[getAttributeKey(
									'font-size-unit',
									false,
									prefix
								)]: unit,
							}),
						});
					}}
					onReset={() =>
						onChangeFormat(
							{
								[getAttributeKey(
									'font-size-unit',
									false,
									prefix
								)]: getDefault('font-size-unit'),
								[getAttributeKey('font-size', false, prefix)]:
									getDefault('font-size'),
							},
							{ isReset: true }
						)
					}
					minMaxSettings={minMaxSettings}
					allowedUnits={['px', 'em', 'vw', '%']}
				/>
				<AdvancedNumberControl
					className='maxi-typography-control__line-height'
					label={__('Line height', 'maxi-blocks')}
					enableUnit
					unit={getValue('line-height-unit') || ''}
					defaultUnit={getDefault('line-height-unit')}
					onChangeUnit={val => {
						onChangeFormat({
							[getAttributeKey(
								'line-height-unit',
								false,
								prefix
							)]: val,
						});
					}}
					placeholder={getValue('line-height')}
					value={getValue('line-height', !isStyleCards)}
					defaultValue={getDefault('line-height')}
					onChangeValue={(val, unit) => {
						onChangeFormat({
							[getAttributeKey('line-height', false, prefix)]:
								val,
							...(unit && {
								[getAttributeKey(
									'line-height-unit',
									false,
									prefix
								)]: unit,
							}),
						});
					}}
					onReset={() =>
						onChangeFormat(
							{
								[getAttributeKey(
									'line-height-unit',
									false,
									prefix
								)]: getDefault('line-height-unit'),
								[getAttributeKey('line-height', false, prefix)]:
									getDefault('line-height'),
							},
							{ isReset: true }
						)
					}
					minMaxSettings={{
						...minMaxSettings,
						'%': {
							min: 0,
							max: 300,
							maxRange: 300,
						},
					}}
					allowedUnits={['px', 'em', 'vw', '%', '-']}
				/>
				<AdvancedNumberControl
					className='maxi-typography-control__letter-spacing'
					label={__('Letter spacing', 'maxi-blocks')}
					enableUnit
					allowedUnits={['px', 'em', 'vw']}
					unit={getValue('letter-spacing-unit')}
					defaultUnit={getDefault('letter-spacing-unit')}
					onChangeUnit={val => {
						onChangeFormat({
							[getAttributeKey(
								'letter-spacing-unit',
								false,
								prefix
							)]: val,
						});
					}}
					placeholder={getValue('letter-spacing')}
					value={getValue('letter-spacing', !isStyleCards)}
					defaultValue={getDefault('letter-spacing')}
					onChangeValue={val => {
						onChangeFormat({
							[getAttributeKey('letter-spacing', false, prefix)]:
								val,
						});
					}}
					onReset={() =>
						onChangeFormat(
							{
								[getAttributeKey(
									'letter-spacing-unit',
									false,
									prefix
								)]: getDefault('letter-spacing-unit'),
								[getAttributeKey(
									'letter-spacing',
									false,
									prefix
								)]: getDefault('letter-spacing'),
							},
							{ isReset: true }
						)
					}
					minMaxSettings={minMaxSettingsLetterSpacing}
					step={0.1}
				/>
				<hr />
				{!disableFontFamily &&
					!disableColor &&
					!isStyleCards &&
					!hideAlignment && <hr style={{ margin: '15px 0' }} />}
				<FontWeightControl
					onChange={val => {
						onChangeFormat({
							[getAttributeKey('font-weight', false, prefix)]:
								val,
						});
					}}
					onReset={() => {
						onChangeFormat(
							{
								[getAttributeKey('font-weight', false, prefix)]:
									getDefault('font-weight'),
							},
							{ isReset: true }
						);
					}}
					fontWeight={getValue('font-weight')}
					defaultFontWeight={getDefault('font-weight')}
					fontName={getValue('font-family')}
					fontStyle={getValue('font-style')}
					breakpoint={breakpoint}
				/>
				<SelectControl
					label={__('Text transform', 'maxi-blocks')}
					className='maxi-typography-control__transform'
					value={getValue('text-transform')}
					defaultValue={getDefault('text-transform')}
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
							[getAttributeKey('text-transform', false, prefix)]:
								val,
						});
					}}
					onReset={() =>
						onChangeFormat(
							{
								[getAttributeKey(
									'text-transform',
									false,
									prefix
								)]: getDefault('text-transform'),
							},
							{ isReset: true }
						)
					}
				/>
				<SelectControl
					label={__('Style', 'maxi-blocks')}
					className='maxi-typography-control__font-style'
					value={getValue('font-style')}
					defaultValue={getDefault('font-style')}
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
							[getAttributeKey('font-style', false, prefix)]: val,
						});
					}}
					onReset={() =>
						onChangeFormat(
							{
								[getAttributeKey('font-style', false, prefix)]:
									getDefault('font-style'),
							},
							{ isReset: true }
						)
					}
				/>
				<SelectControl
					label={__('Text decoration', 'maxi-blocks')}
					className='maxi-typography-control__decoration'
					value={getValue('text-decoration')}
					defaultValue={getDefault('text-decoration')}
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
							[getAttributeKey('text-decoration', false, prefix)]:
								val,
						});
					}}
					onReset={() =>
						onChangeFormat(
							{
								[getAttributeKey(
									'text-decoration',
									false,
									prefix
								)]: getDefault('text-decoration'),
							},
							{ isReset: true }
						)
					}
				/>
				{!isStyleCards && (
					<>
						<SelectControl
							label={__('Text orientation', 'maxi-blocks')}
							className='maxi-typography-control__orientation'
							value={getValue('text-orientation')}
							defaultValue={getDefault('text-orientation')}
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
										[getAttributeKey(
											'text-orientation',
											false,
											prefix
										)]: val,
									},
									{ forceDisableCustomFormats: true }
								);
							}}
							onReset={() =>
								onChangeFormat(
									{
										[getAttributeKey(
											'text-orientation',
											false,
											prefix
										)]: getDefault('text-orientation'),
									},
									{ isReset: true }
								)
							}
						/>
						<SelectControl
							label={__('Text direction', 'maxi-blocks')}
							className='maxi-typography-control__direction'
							value={getValue('text-direction')}
							defaultValue={getDefault('text-direction')}
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
									[getAttributeKey(
										'text-direction',
										false,
										prefix
									)]: val,
								});
							}}
							onReset={() =>
								onChangeFormat(
									{
										[getAttributeKey(
											'text-direction',
											false,
											prefix
										)]: getDefault('text-direction'),
									},
									{ isReset: true }
								)
							}
						/>
					</>
				)}
				<AdvancedNumberControl
					className='maxi-typography-control__text-indent'
					label={__('Text indent', 'maxi-blocks')}
					enableUnit
					unit={getValue('text-indent-unit')}
					defaultUnit={getDefault('text-indent-unit')}
					onChangeUnit={val => {
						onChangeFormat(
							{
								[getAttributeKey(
									'text-indent-unit',
									false,
									prefix
								)]: val,
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
								[getAttributeKey('text-indent', false, prefix)]:
									val,
							},
							{ forceDisableCustomFormats: true }
						);
					}}
					onReset={() =>
						onChangeFormat(
							{
								[getAttributeKey(
									'text-indent-unit',
									false,
									prefix
								)]: getDefault('text-indent-unit'),
								[getAttributeKey('text-indent', false, prefix)]:
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
				<SelectControl
					label={__('White space', 'maxi-blocks')}
					className='maxi-typography-control__white-space'
					value={getValue('white-space')}
					defaultValue={getDefault('white-space')}
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
							[getAttributeKey('white-space', false, prefix)]:
								val,
						});
					}}
					onReset={() => {
						onChangeFormat(
							{
								[getAttributeKey('white-space', false, prefix)]:
									getDefault('white-space'),
							},
							{ isReset: true }
						);
					}}
				/>
				<AdvancedNumberControl
					className='maxi-typography-control__word-spacing'
					label={__('Word Spacing', 'maxi-blocks')}
					enableUnit
					unit={getValue('word-spacing-unit')}
					defaultUnit={getDefault('word-spacing-unit')}
					onChangeUnit={val => {
						onChangeFormat(
							{
								[getAttributeKey(
									'word-spacing-unit',
									false,
									prefix
								)]: val,
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
								[getAttributeKey(
									'word-spacing',
									false,
									prefix
								)]: val,
							},
							{ forceDisableCustomFormats: true }
						);
					}}
					onReset={() =>
						onChangeFormat(
							{
								[getAttributeKey(
									'word-spacing-unit',
									false,
									prefix
								)]: getDefault('word-spacing-unit'),
								[getAttributeKey(
									'word-spacing',
									false,
									prefix
								)]: getDefault('word-spacing'),
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
				{!hideBottomGap && (
					<AdvancedNumberControl
						className='maxi-typography-control__bottom-gap'
						label={__('Bottom gap', 'maxi-blocks')}
						enableUnit
						unit={getValue('bottom-gap-unit')}
						defaultUnit={getDefault('bottom-gap-unit')}
						onChangeUnit={val => {
							onChangeFormat(
								{
									[getAttributeKey(
										'bottom-gap-unit',
										false,
										prefix
									)]: val,
								},
								{ forceDisableCustomFormats: true }
							);
						}}
						placeholder={getValue('bottom-gap')}
						value={getValue('bottom-gap')}
						defaultValue={getDefault('bottom-gap', !isStyleCards)}
						onChangeValue={val => {
							onChangeFormat(
								{
									[getAttributeKey(
										'bottom-gap',
										false,
										prefix
									)]: val,
								},
								{ forceDisableCustomFormats: true }
							);
						}}
						onReset={() =>
							onChangeFormat(
								{
									[getAttributeKey(
										'bottom-gap-unit',
										false,
										prefix
									)]: getDefault('bottom-gap-unit'),
									[getAttributeKey(
										'bottom-gap',
										false,
										prefix
									)]: getDefault('bottom-gap'),
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
				)}
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
									[getAttributeKey(
										'text-shadow',
										false,
										prefix
									)]: val,
								});
							}}
							defaultColor={getLastBreakpointAttribute({
								target: '_cc',
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
					/>
				)}
			</div>
		</ResponsiveTabsControl>
	);
};

export default TypographyControl;
