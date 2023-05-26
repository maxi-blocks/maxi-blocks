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
							getAttributeKey({
								key: attributeKey,
								prefix: `${prefix}l-`,
							})
						),
					},
					{
						label: __('Hover', 'maxi-block'),
						value: 'hover_link',
						extraIndicatorsResponsive: [
							'_cc',
							'_pc',
							'_po',
							'_ps',
						].map(attributeKey =>
							getAttributeKey({
								key: attributeKey,
								prefix: `${prefix}_lih-`,
							})
						),
					},
					{
						label: __('Active', 'maxi-block'),
						value: 'active_link',
						extraIndicatorsResponsive: [
							'_cc',
							'_pc',
							'_po',
							'_ps',
						].map(attributeKey =>
							getAttributeKey({
								key: attributeKey,
								prefix: `${prefix}_lia-`,
							})
						),
					},
					{
						label: __('Visited', 'maxi-block'),
						value: 'visited_link',
						extraIndicatorsResponsive: [
							'_cc',
							'_pc',
							'_po',
							'_ps',
						].map(attributeKey =>
							getAttributeKey({
								key: attributeKey,
								prefix: `${prefix}_liv-`,
							})
						),
					},
				]}
				onChange={val => setLinkStatus(val)}
			/>
			{linkStatus === 'normal_link' && (
				<ColorControl
					label={__('Font', 'maxi-blocks')}
					className='maxi-typography-link_cc'
					color={getValue('_l_cc')}
					prefix={`${prefix}_l-`}
					paletteStatus={getValue('_l_ps')}
					paletteColor={getValue('_l_pc')}
					paletteOpacity={getValue('_l_po')}
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
								[getAttributeKey({
									key: '_ps',
									prefix: `${prefix}_l-`,
								})]: paletteStatus,
								[getAttributeKey({
									key: '_pc',
									prefix: `${prefix}_l-`,
								})]: paletteColor,
								[getAttributeKey({
									key: '_po',
									prefix: `${prefix}_l-`,
								})]: paletteOpacity,
								[getAttributeKey({
									key: '_cc',
									prefix: `${prefix}_l-`,
								})]: color,
							},
							{ forceDisableCustomFormats: false, tag: 'a' }
						)
					}
					textLevel={textLevel}
					deviceType={breakpoint}
					clientId={clientId}
					disableGradient
					globalProps={{ target: '_l', type: 'link' }}
				/>
			)}
			{linkStatus === 'hover_link' && (
				<ColorControl
					label={__('Font', 'maxi-blocks')}
					className='maxi-typography-link-hover_cc'
					color={getValue('_lih_cc')}
					prefix={`${prefix}_lih-`}
					paletteStatus={getValue('_lih_ps')}
					paletteColor={getValue('_lih_pc')}
					paletteOpacity={getValue('_lih_po')}
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
								[getAttributeKey({
									key: '_ps',
									prefix: `${prefix}_lih`,
								})]: paletteStatus,
								[getAttributeKey({
									key: '_pc',
									prefix: `${prefix}_lih`,
								})]: paletteColor,
								[getAttributeKey({
									key: '_po',
									prefix: `${prefix}_lih`,
								})]: paletteOpacity,
								[getAttributeKey({
									key: '_cc',
									prefix: `${prefix}_lih`,
								})]: color,
							},
							{ forceDisableCustomFormats: false, tag: 'a:hover' }
						)
					}
					textLevel={textLevel}
					deviceType={breakpoint}
					clientId={clientId}
					disableGradient
					globalProps={{ target: 'h', type: 'link' }}
				/>
			)}
			{linkStatus === 'active_link' && (
				<ColorControl
					label={__('Font', 'maxi-blocks')}
					className='maxi-typography-link-active_cc'
					color={getValue('_lia_cc')}
					prefix={`${prefix}_lia-`}
					paletteStatus={getValue('_lia_ps')}
					paletteColor={getValue('_lia_pc')}
					paletteOpacity={getValue('_lia_po')}
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
								[getAttributeKey({
									key: '_ps',
									prefix: `${prefix}_lia-`,
								})]: paletteStatus,
								[getAttributeKey({
									key: '_pc',
									prefix: `${prefix}_lia-`,
								})]: paletteColor,
								[getAttributeKey({
									key: '_po',
									prefix: `${prefix}_lia-`,
								})]: paletteOpacity,
								[getAttributeKey({
									key: '_cc',
									prefix: `${prefix}_lia-`,
								})]: color,
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
					globalProps={{ target: 'a', type: 'link' }}
				/>
			)}
			{linkStatus === 'visited_link' && (
				<ColorControl
					label={__('Font', 'maxi-blocks')}
					className='maxi-typography-link-visited_cc'
					color={getValue('_liv_cc')}
					prefix={`${prefix}_liv-`}
					paletteStatus={getValue('_liv_ps')}
					paletteColor={getValue('_liv_pc')}
					paletteOpacity={getValue('_liv_po')}
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
								[getAttributeKey({
									key: '_ps',
									prefix: `${prefix}_liv-`,
								})]: paletteStatus,
								[getAttributeKey({
									key: '_pc',
									prefix: `${prefix}_liv-`,
								})]: paletteColor,
								[getAttributeKey({
									key: '_po',
									prefix: `${prefix}_liv-`,
								})]: paletteOpacity,
								[getAttributeKey({
									key: '_cc',
									prefix: `${prefix}_liv-`,
								})]: color,
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
					globalProps={{ target: 'vi', type: 'link' }}
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
								[getAttributeKey({ key: '_ff', prefix })]:
									font.value,
								[getAttributeKey({
									key: 'font-options',
									prefix,
								})]: font.files,
							});
						}}
						fontWeight={getValue('_fwe')}
						fontStyle={getValue('_fst')}
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
								[getAttributeKey({ key: '_cc', prefix })]:
									color,
								[getAttributeKey({ key: '_pc', prefix })]:
									paletteColor,
								[getAttributeKey({ key: '_ps', prefix })]:
									paletteStatus,
								[getAttributeKey({ key: '_po', prefix })]:
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
							[getAttributeKey({ key: '_fs.u', prefix })]: val,
						});
					}}
					placeholder={getValue('_fs')}
					value={getValue('_fs', !isStyleCards)}
					defaultValue={getDefault('_fs')}
					onChangeValue={(val, unit) => {
						onChangeFormat({
							[getAttributeKey({ key: '_fs', prefix })]: val,
							...(unit && {
								[getAttributeKey({ key: '_fs.u', prefix })]:
									unit,
							}),
						});
					}}
					onReset={() =>
						onChangeFormat(
							{
								[getAttributeKey({ key: '_fs.u', prefix })]:
									getDefault('_fs.u'),
								[getAttributeKey({ key: '_fs', prefix })]:
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
							[getAttributeKey({ key: '_lhe.u', prefix })]: val,
						});
					}}
					placeholder={getValue('_lhe')}
					value={getValue('_lhe', !isStyleCards)}
					defaultValue={getDefault('_lhe')}
					onChangeValue={(val, unit) => {
						onChangeFormat({
							[getAttributeKey({ key: '_lhe', prefix })]: val,
							...(unit && {
								[getAttributeKey({ key: '_lhe.u', prefix })]:
									unit,
							}),
						});
					}}
					onReset={() =>
						onChangeFormat(
							{
								[getAttributeKey({ key: '_lhe.u', prefix })]:
									getDefault('_lhe.u'),
								[getAttributeKey({ key: '_lhe', prefix })]:
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
							[getAttributeKey({ key: '_ls.u', prefix })]: val,
						});
					}}
					placeholder={getValue('_ls')}
					value={getValue('_ls', !isStyleCards)}
					defaultValue={getDefault('_ls')}
					onChangeValue={val => {
						onChangeFormat({
							[getAttributeKey({ key: '_ls', prefix })]: val,
						});
					}}
					onReset={() =>
						onChangeFormat(
							{
								[getAttributeKey({ key: '_ls.u', prefix })]:
									getDefault('_ls.u'),
								[getAttributeKey({ key: '_ls', prefix })]:
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
							[getAttributeKey({ key: '_fwe', prefix })]: val,
						});
					}}
					onReset={() => {
						onChangeFormat(
							{
								[getAttributeKey({ key: '_fwe', prefix })]:
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
							[getAttributeKey({ key: '_ttr', prefix })]: val,
						});
					}}
					onReset={() =>
						onChangeFormat(
							{
								[getAttributeKey({ key: '_ttr', prefix })]:
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
							[getAttributeKey({ key: '_fst', prefix })]: val,
						});
					}}
					onReset={() =>
						onChangeFormat(
							{
								[getAttributeKey({ key: '_fst', prefix })]:
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
							[getAttributeKey({ key: '_td', prefix })]: val,
						});
					}}
					onReset={() =>
						onChangeFormat(
							{
								[getAttributeKey({ key: '_td', prefix })]:
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
										[getAttributeKey({
											key: '_to',
											prefix,
										})]: val,
									},
									{ forceDisableCustomFormats: true }
								);
							}}
							onReset={() =>
								onChangeFormat(
									{
										[getAttributeKey({
											key: '_to',
											prefix,
										})]: getDefault('_to'),
									},
									{ isReset: true }
								)
							}
						/>
						<SelectControl
							label={__('Text direction', 'maxi-blocks')}
							className='maxi-typography-control__direction'
							value={getValue('_tdi')}
							defaultValue={getDefault('_tdi')}
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
									[getAttributeKey({ key: '_tdi', prefix })]:
										val,
								});
							}}
							onReset={() =>
								onChangeFormat(
									{
										[getAttributeKey({
											key: '_tdi',
											prefix,
										})]: getDefault('_tdi'),
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
								[getAttributeKey({ key: '_ti.u', prefix })]:
									val,
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
								[getAttributeKey({ key: '_ti', prefix })]: val,
							},
							{ forceDisableCustomFormats: true }
						);
					}}
					onReset={() =>
						onChangeFormat(
							{
								[getAttributeKey({ key: '_ti.u', prefix })]:
									getDefault('_ti.u'),
								[getAttributeKey({ key: '_ti', prefix })]:
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
							[getAttributeKey({ key: '_ws', prefix })]: val,
						});
					}}
					onReset={() => {
						onChangeFormat(
							{
								[getAttributeKey({ key: '_ws', prefix })]:
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
								[getAttributeKey({ key: '_wsp.u', prefix })]:
									val,
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
								[getAttributeKey({ key: '_wsp', prefix })]: val,
							},
							{ forceDisableCustomFormats: true }
						);
					}}
					onReset={() =>
						onChangeFormat(
							{
								[getAttributeKey({ key: '_wsp.u', prefix })]:
									getDefault('_wsp.u'),
								[getAttributeKey({ key: '_wsp', prefix })]:
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
									[getAttributeKey({ key: '_bg.u', prefix })]:
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
									[getAttributeKey({ key: '_bg', prefix })]:
										val,
								},
								{ forceDisableCustomFormats: true }
							);
						}}
						onReset={() =>
							onChangeFormat(
								{
									[getAttributeKey({ key: '_bg.u', prefix })]:
										getDefault('_bg.u'),
									[getAttributeKey({ key: '_bg', prefix })]:
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
									[getAttributeKey({ key: '_tsh', prefix })]:
										val,
								});
							}}
							defaultColor={getLastBreakpointAttribute({
								target: '_pc',
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
