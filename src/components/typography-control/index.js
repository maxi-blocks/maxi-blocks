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
						font={getValue('_ff')}
						onChange={font => {
							onChangeFormat({
								[getAttributeKey('_ff', false, prefix)]:
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
					unit={getValue('_fs.u')}
					defaultUnit={getDefault('_fs.u')}
					onChangeUnit={val => {
						onChangeFormat({
							[getAttributeKey('_fs.u', false, prefix)]: val,
						});
					}}
					placeholder={getValue('_fs')}
					value={getValue('_fs', !isStyleCards)}
					defaultValue={getDefault('_fs')}
					onChangeValue={(val, unit) => {
						onChangeFormat({
							[getAttributeKey('_fs', false, prefix)]: val,
							...(unit && {
								[getAttributeKey('_fs.u', false, prefix)]: unit,
							}),
						});
					}}
					onReset={() =>
						onChangeFormat(
							{
								[getAttributeKey('_fs.u', false, prefix)]:
									getDefault('_fs.u'),
								[getAttributeKey('_fs', false, prefix)]:
									getDefault('_fs'),
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
					unit={getValue('_lhe.u') || ''}
					defaultUnit={getDefault('_lhe.u')}
					onChangeUnit={val => {
						onChangeFormat({
							[getAttributeKey('_lhe.u', false, prefix)]: val,
						});
					}}
					placeholder={getValue('_lhe')}
					value={getValue('_lhe', !isStyleCards)}
					defaultValue={getDefault('_lhe')}
					onChangeValue={(val, unit) => {
						onChangeFormat({
							[getAttributeKey('_lhe', false, prefix)]: val,
							...(unit && {
								[getAttributeKey('_lhe.u', false, prefix)]:
									unit,
							}),
						});
					}}
					onReset={() =>
						onChangeFormat(
							{
								[getAttributeKey('_lhe.u', false, prefix)]:
									getDefault('_lhe.u'),
								[getAttributeKey('_lhe', false, prefix)]:
									getDefault('_lhe'),
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
					unit={getValue('_ls.u')}
					defaultUnit={getDefault('_ls.u')}
					onChangeUnit={val => {
						onChangeFormat({
							[getAttributeKey('_ls.u', false, prefix)]: val,
						});
					}}
					placeholder={getValue('_ls')}
					value={getValue('_ls', !isStyleCards)}
					defaultValue={getDefault('_ls')}
					onChangeValue={val => {
						onChangeFormat({
							[getAttributeKey('_ls', false, prefix)]: val,
						});
					}}
					onReset={() =>
						onChangeFormat(
							{
								[getAttributeKey('_ls.u', false, prefix)]:
									getDefault('_ls.u'),
								[getAttributeKey('_ls', false, prefix)]:
									getDefault('_ls'),
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
							[getAttributeKey('_fwe', false, prefix)]: val,
						});
					}}
					onReset={() => {
						onChangeFormat(
							{
								[getAttributeKey('_fwe', false, prefix)]:
									getDefault('_fwe'),
							},
							{ isReset: true }
						);
					}}
					fontWeight={getValue('_fwe')}
					defaultFontWeight={getDefault('_fwe')}
					fontName={getValue('_ff')}
					fontStyle={getValue('_fst')}
					breakpoint={breakpoint}
				/>
				<SelectControl
					label={__('Text transform', 'maxi-blocks')}
					className='maxi-typography-control__transform'
					value={getValue('_ttr')}
					defaultValue={getDefault('_ttr')}
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
							[getAttributeKey('_ttr', false, prefix)]: val,
						});
					}}
					onReset={() =>
						onChangeFormat(
							{
								[getAttributeKey('_ttr', false, prefix)]:
									getDefault('_ttr'),
							},
							{ isReset: true }
						)
					}
				/>
				<SelectControl
					label={__('Style', 'maxi-blocks')}
					className='maxi-typography-control__font-style'
					value={getValue('_fst')}
					defaultValue={getDefault('_fst')}
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
							[getAttributeKey('_fst', false, prefix)]: val,
						});
					}}
					onReset={() =>
						onChangeFormat(
							{
								[getAttributeKey('_fst', false, prefix)]:
									getDefault('_fst'),
							},
							{ isReset: true }
						)
					}
				/>
				<SelectControl
					label={__('Text decoration', 'maxi-blocks')}
					className='maxi-typography-control__decoration'
					value={getValue('_td')}
					defaultValue={getDefault('_td')}
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
							[getAttributeKey('_td', false, prefix)]: val,
						});
					}}
					onReset={() =>
						onChangeFormat(
							{
								[getAttributeKey('_td', false, prefix)]:
									getDefault('_td'),
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
							value={getValue('_to')}
							defaultValue={getDefault('_to')}
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
										[getAttributeKey('_to', false, prefix)]:
											val,
									},
									{ forceDisableCustomFormats: true }
								);
							}}
							onReset={() =>
								onChangeFormat(
									{
										[getAttributeKey('_to', false, prefix)]:
											getDefault('_to'),
									},
									{ isReset: true }
								)
							}
						/>
						<SelectControl
							label={__('Text direction', 'maxi-blocks')}
							className='maxi-typography-control__direction'
							value={getValue('_td')}
							defaultValue={getDefault('_td')}
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
									[getAttributeKey('_td', false, prefix)]:
										val,
								});
							}}
							onReset={() =>
								onChangeFormat(
									{
										[getAttributeKey('_td', false, prefix)]:
											getDefault('_td'),
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
					unit={getValue('_ti.u')}
					defaultUnit={getDefault('_ti.u')}
					onChangeUnit={val => {
						onChangeFormat(
							{
								[getAttributeKey('_ti.u', false, prefix)]: val,
							},
							{ forceDisableCustomFormats: true }
						);
					}}
					placeholder={getValue('_ti')}
					value={getValue('_ti', !isStyleCards)}
					defaultValue={getDefault('_ti')}
					onChangeValue={val => {
						onChangeFormat(
							{
								[getAttributeKey('_ti', false, prefix)]: val,
							},
							{ forceDisableCustomFormats: true }
						);
					}}
					onReset={() =>
						onChangeFormat(
							{
								[getAttributeKey('_ti.u', false, prefix)]:
									getDefault('_ti.u'),
								[getAttributeKey('_ti', false, prefix)]:
									getDefault('_ti'),
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
					value={getValue('_ws')}
					defaultValue={getDefault('_ws')}
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
							[getAttributeKey('_ws', false, prefix)]: val,
						});
					}}
					onReset={() => {
						onChangeFormat(
							{
								[getAttributeKey('_ws', false, prefix)]:
									getDefault('_ws'),
							},
							{ isReset: true }
						);
					}}
				/>
				<AdvancedNumberControl
					className='maxi-typography-control__word-spacing'
					label={__('Word Spacing', 'maxi-blocks')}
					enableUnit
					unit={getValue('_wsp.u')}
					defaultUnit={getDefault('_wsp.u')}
					onChangeUnit={val => {
						onChangeFormat(
							{
								[getAttributeKey('_wsp.u', false, prefix)]: val,
							},
							{ forceDisableCustomFormats: true }
						);
					}}
					placeholder={getValue('_wsp')}
					value={getValue('_wsp')}
					defaultValue={getDefault('_wsp', !isStyleCards)}
					onChangeValue={val => {
						onChangeFormat(
							{
								[getAttributeKey('_wsp', false, prefix)]: val,
							},
							{ forceDisableCustomFormats: true }
						);
					}}
					onReset={() =>
						onChangeFormat(
							{
								[getAttributeKey('_wsp.u', false, prefix)]:
									getDefault('_wsp.u'),
								[getAttributeKey('_wsp', false, prefix)]:
									getDefault('_wsp'),
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
						unit={getValue('_bg.u')}
						defaultUnit={getDefault('_bg.u')}
						onChangeUnit={val => {
							onChangeFormat(
								{
									[getAttributeKey('_bg.u', false, prefix)]:
										val,
								},
								{ forceDisableCustomFormats: true }
							);
						}}
						placeholder={getValue('_bg')}
						value={getValue('_bg')}
						defaultValue={getDefault('_bg', !isStyleCards)}
						onChangeValue={val => {
							onChangeFormat(
								{
									[getAttributeKey('_bg', false, prefix)]:
										val,
								},
								{ forceDisableCustomFormats: true }
							);
						}}
						onReset={() =>
							onChangeFormat(
								{
									[getAttributeKey('_bg.u', false, prefix)]:
										getDefault('_bg.u'),
									[getAttributeKey('_bg', false, prefix)]:
										getDefault('_bg'),
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
							textShadow={getValue('_tsh')}
							onChangeInline={val =>
								onChangeInlineValue({ _tsh: val })
							}
							onChange={val => {
								onChangeFormat({
									[getAttributeKey('_tsh', false, prefix)]:
										val,
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
