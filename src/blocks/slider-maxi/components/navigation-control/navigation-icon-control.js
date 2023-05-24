/**
 * WordPress Dependencies
 */
import { sprintf, __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	getAttributeKey,
	getDefaultAttribute,
	getGroupAttributes,
	getAttributesValue,
	getLastBreakpointAttribute,
} from '../../../../extensions/attributes';

import {
	Icon,
	ResponsiveTabsControl,
	SvgWidthControl,
	SvgStrokeWidthControl,
	AdvancedNumberControl,
	AxisControl,
	SettingTabsControl,
	ColorControl,
	ToggleSwitch,
	BorderControl,
	BoxShadowControl,
} from '../../../../components';
import MaxiModal from '../../../../editor/library/modal';
import {
	setSVGContent,
	setSVGContentHover,
	setSVGStrokeWidth,
} from '../../../../extensions/svg';
import GradientControl from '../../../../components/gradient-control';
import { getColorRGBAString } from '../../../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { capitalize } from 'lodash';

/**
 * Styles and icons
 */
import {
	iconBorder,
	iconFill,
	backgroundColor,
	backgroundGradient,
	styleNone,
} from '../../../../icons';

/**
 * Component
 */
const NavigationIconControl = props => {
	const {
		className,
		onChangeInline = null,
		onChange,
		svgType = 'Filled',
		breakpoint,
		blockStyle,
		isHover = false,
		prefix,
		clientId,
	} = props;
	const [borderStatus, backgroundStatus, boxShadowStatus] =
		getAttributesValue({
			target: ['bo.s', 'b.s', 'bs.s'],
			props,
			prefix,
		});
	const iconBgActiveMedia = getLastBreakpointAttribute({
		target: 'b_am',
		prefix,
		breakpoint,
		attributes: props,
		isHover,
	});

	const [iconStyle, setIconStyle] = useState('color');
	const [iconBgActive, setIconBgActive] = useState(
		iconBgActiveMedia || 'none'
	);

	const classes = classnames('maxi-icon-control', className);

	const getBackgroundOptions = () => {
		const options = [];

		options.push({
			icon: <Icon icon={styleNone} />,
			value: 'none',
		});

		options.push({
			icon: <Icon icon={backgroundColor} />,
			value: 'color',
		});

		options.push({
			icon: <Icon icon={backgroundGradient} />,
			value: 'gradient',
		});

		return options;
	};

	const getOptions = () => {
		const options = [];

		if (svgType !== 'Shape')
			options.push({
				icon: <Icon icon={iconBorder} />,
				value: 'color',
			});
		else if (iconStyle === 'color') setIconStyle('fill');

		if (svgType !== 'Line')
			options.push({
				icon: <Icon icon={iconFill} />,
				value: 'fill',
			});
		else if (iconStyle === 'fill') setIconStyle('color');

		return options;
	};

	const minMaxSettings = {
		px: {
			min: 0,
			max: 999,
		},
		em: {
			min: 0,
			max: 999,
		},
		vw: {
			min: 0,
			max: 999,
		},
		'%': {
			min: 0,
			max: 100,
		},
	};

	const arrowShortPrefix = 'na-';
	const dotsShortPrefix = 'nd-';
	const shortPrefix =
		prefix === 'nab-i-' ? arrowShortPrefix : dotsShortPrefix;
	const isActive = prefix.slice(0, 2) === 'a-';
	const groupLabel = `${shortPrefix === 'nd-' ? 'dotIcon' : 'arrowIcon'}${
		isActive ? 'Active' : ''
	}${isHover ? 'Hover' : ''}`;
	const label = shortPrefix.includes('d') ? 'dots' : 'arrows';

	return (
		<div className={classes}>
			{!isHover &&
				!isActive &&
				breakpoint === 'general' &&
				shortPrefix === arrowShortPrefix &&
				['first', 'second'].map(current => (
					<MaxiModal
						type='navigation-icon'
						label={__(sprintf('Add %s icon', label), 'maxi-blocks')}
						style={blockStyle}
						onSelect={obj => onChange(obj)}
						onRemove={obj => onChange(obj)}
						icon={getAttributesValue({
							target: 'i_c',
							props,
							prefix: `${shortPrefix}${current[0]}-`,
						})}
						prefix={`${shortPrefix}${current[0]}-`}
					/>
				))}
			{!isHover &&
				!isActive &&
				breakpoint === 'general' &&
				shortPrefix === dotsShortPrefix && (
					<MaxiModal
						type='navigation-icon'
						title={__('Add dot icon', 'maxi-blocks')}
						style={blockStyle}
						onSelect={obj => onChange(obj)}
						onRemove={obj => onChange(obj)}
						icon={getAttributesValue({
							target: 'i_c',
							props,
							prefix: shortPrefix,
						})}
						prefix={shortPrefix}
					/>
				)}
			{getAttributesValue({
				target: 'naf-i_c',
				props,
			}) ||
				getAttributesValue({
					target: 'nas-i_c',
					props,
				}) ||
				(getAttributesValue({
					target: 'nd-i_c',
					props,
				}) && (
					<>
						<ResponsiveTabsControl breakpoint={breakpoint}>
							<>
								{!isActive && (
									<SvgWidthControl
										{...getGroupAttributes(
											props,
											groupLabel,
											isHover
										)}
										onChange={onChange}
										prefix={prefix}
										customLabel={`${capitalize(
											label
										)} size`}
										breakpoint={breakpoint}
										isHover={isHover}
										disableHeightFitContent
									/>
								)}
								{svgType !== 'Shape' && (
									<SvgStrokeWidthControl
										{...getGroupAttributes(
											props,
											groupLabel,
											isHover
										)}
										onChange={obj => {
											shortPrefix === arrowShortPrefix &&
												onChange({
													...obj,
													...[
														'first',
														'second',
													].reduce(
														(prev, current) => ({
															...prev,
															[`na${current[0]}-i_c`]:
																setSVGStrokeWidth(
																	getAttributesValue(
																		{
																			target: `na${current[0]}-i_c`,
																			props,
																		}
																	),
																	obj[
																		getAttributeKey(
																			{
																				key: '_str',
																				isHover,
																				prefix,
																				breakpoint,
																			}
																		)
																	]
																),
														})
													),
												});
											shortPrefix === dotsShortPrefix &&
												onChange({
													...obj,
													...(!isActive && {
														'nd-i_c':
															setSVGStrokeWidth(
																getAttributesValue(
																	{
																		target: 'nd-i_c',
																		props,
																	}
																),
																obj[
																	getAttributeKey(
																		{
																			key: 'str',
																			isHover,
																			prefix,
																			breakpoint,
																		}
																	)
																]
															),
													}),
												});
										}}
										prefix={prefix}
										customLabel={`${capitalize(
											label
										)} stroke width`}
										breakpoint={breakpoint}
										isHover={isHover}
									/>
								)}
								{!isHover && !isActive && (
									<>
										<AdvancedNumberControl
											label={__(
												`${capitalize(
													label
												)} horizontal spacing`,
												'maxi-blocks'
											)}
											min={-300}
											max={300}
											initial={1}
											step={1}
											breakpoint={breakpoint}
											value={getLastBreakpointAttribute({
												target: '_sh',
												prefix,
												breakpoint,
												attributes: props,
												isHover,
											})}
											onChangeValue={val => {
												onChange({
													[getAttributeKey({
														key: '_sh',
														isHover,
														prefix,
														breakpoint,
													})]:
														val !== undefined &&
														val !== ''
															? val
															: '',
												});
											}}
											onReset={() =>
												onChange({
													[getAttributeKey({
														key: '_sh',
														isHover,
														prefix,
														breakpoint,
													})]: getDefaultAttribute(
														getAttributeKey({
															key: '_sh',
															isHover,
															prefix,
															breakpoint,
														})
													),
												})
											}
											isHover={isHover}
										/>
										<AdvancedNumberControl
											label={__(
												`${capitalize(
													label
												)} vertical spacing`,
												'maxi-blocks'
											)}
											min={-100}
											max={200}
											initial={1}
											step={1}
											breakpoint={breakpoint}
											value={getLastBreakpointAttribute({
												target: '_sv',
												prefix,
												breakpoint,
												attributes: props,
												isHover,
											})}
											onChangeValue={val => {
												onChange({
													[getAttributeKey({
														key: '_sv',
														isHover,
														prefix,
														breakpoint,
													})]:
														val !== undefined &&
														val !== ''
															? val
															: '',
												});
											}}
											onReset={() =>
												onChange({
													[getAttributeKey({
														key: '_sv',
														isHover,
														prefix,
														breakpoint,
													})]: getDefaultAttribute(
														getAttributeKey({
															key: '_sv',
															isHover,
															prefix,
															breakpoint,
														})
													),
												})
											}
											isHover={isHover}
										/>
										{prefix.includes('d') && (
											<AdvancedNumberControl
												label={__(
													'Spacing between dots',
													'maxi-blocks'
												)}
												min={-10}
												max={100}
												initial={1}
												step={1}
												breakpoint={breakpoint}
												value={getLastBreakpointAttribute(
													{
														target: '_sb',
														prefix,
														breakpoint,
														attributes: props,
														isHover,
													}
												)}
												onChangeValue={val => {
													onChange({
														[getAttributeKey({
															key: '_sb',
															isHover,
															prefix,
															breakpoint,
														})]:
															val !== undefined &&
															val !== ''
																? val
																: '',
													});
												}}
												onReset={() =>
													onChange({
														[getAttributeKey({
															key: '_sb',
															isHover,
															prefix,
															breakpoint,
														})]: getDefaultAttribute(
															getAttributeKey({
																key: '_sb',
																isHover,
																prefix,
																breakpoint,
															})
														),
													})
												}
												isHover={isHover}
											/>
										)}
									</>
								)}
								{!isHover && (
									<AxisControl
										{...getGroupAttributes(
											props,
											'padding',
											false,
											prefix
										)}
										label={__(
											`${capitalize(label)} padding`,
											'maxi-blocks'
										)}
										onChange={onChange}
										breakpoint={breakpoint}
										target='padding'
										disableAuto
										optionType='string'
										minMaxSettings={minMaxSettings}
										prefix={prefix}
										noResponsiveTabs
									/>
								)}
							</>
						</ResponsiveTabsControl>
						{getOptions().length > 1 && (
							<SettingTabsControl
								label=''
								className='maxi-icon-styles-control'
								type='buttons'
								fullWidthMode
								selected={iconStyle}
								items={getOptions()}
								onChange={val => setIconStyle(val)}
							/>
						)}
						{iconStyle === 'color' && svgType !== 'Shape' && (
							<ColorControl
								label={__(
									`${capitalize(label)} line`,
									'maxi-blocks'
								)}
								color={getAttributesValue({
									target: 'str_cc',
									props,
									isHover,
									prefix,
								})}
								prefix={`${prefix}str-`}
								avoidBreakpointForDefault
								paletteColor={getAttributesValue({
									target: 'str_pc',
									props,
									isHover,
									prefix,
								})}
								paletteOpacity={getAttributesValue({
									target: 'str_po',
									props,
									isHover,
									prefix,
								})}
								paletteStatus={getAttributesValue({
									target: 'str_ps',
									props,
									isHover,
									prefix,
								})}
								onChangeInline={({ color }) =>
									onChangeInline &&
									onChangeInline(
										{ stroke: color },
										'[data-stroke]',
										true
									)
								}
								onChange={({
									color,
									paletteColor,
									paletteStatus,
									paletteOpacity,
								}) => {
									const strokeColorStr = getColorRGBAString({
										firstVar: getAttributeKey({
											key: 'stroke',
											isHover,
											prefix,
										}),
										secondVar: `color-${paletteColor}${
											isHover ? '-hover' : ''
										}`,
										opacity: paletteOpacity,
										blockStyle,
									});
									const onChangeObj = {
										[getAttributeKey({
											key: 'str_cc',
											isHover,
											prefix,
										})]: color,
										[getAttributeKey({
											key: 'str_pc',
											isHover,
											prefix,
										})]: paletteColor,
										[getAttributeKey({
											key: 'str_ps',
											isHover,
											prefix,
										})]: paletteStatus,
										[getAttributeKey({
											key: 'str_po',
											isHover,
											prefix,
										})]: paletteOpacity,
									};

									shortPrefix === arrowShortPrefix &&
										onChange(
											{
												...onChangeObj,
												...['first', 'second'].reduce(
													(prev, current) => {
														return {
															...prev,
															[`na${current[0]}-i_c`]:
																(isHover
																	? setSVGContentHover
																	: setSVGContent)(
																	getAttributesValue(
																		{
																			target: `na${current[0]}-i_c`,
																			props,
																		}
																	),
																	paletteStatus
																		? strokeColorStr
																		: color,
																	'stroke'
																),
														};
													},
													{}
												),
											},
											'[data-stroke]'
										);
									shortPrefix === dotsShortPrefix &&
										onChange(
											{
												...onChangeObj,
												...(!isActive && {
													'nd-i_c': (isHover
														? setSVGContentHover
														: setSVGContent)(
														getAttributesValue({
															target: 'nd-i_c',
															props,
														}),
														paletteStatus
															? strokeColorStr
															: color,
														'stroke'
													),
												}),
											},
											'[data-stroke]'
										);
								}}
								isHover={isHover}
							/>
						)}
						{iconStyle === 'fill' && svgType !== 'Line' && (
							<ColorControl
								label={__(
									`${capitalize(label)} fill`,
									'maxi-blocks'
								)}
								color={getAttributesValue({
									target: 'f_cc',
									props,
									isHover,
									prefix,
								})}
								prefix={`${prefix}f-`}
								avoidBreakpointForDefault
								paletteColor={getAttributesValue({
									target: 'f_pc',
									props,
									isHover,
									prefix,
								})}
								paletteOpacity={getAttributesValue({
									target: 'f_po',
									props,
									isHover,
									prefix,
								})}
								paletteStatus={getAttributesValue({
									target: 'f_ps',
									props,
									isHover,
									prefix,
								})}
								onChangeInline={({ color }) =>
									onChangeInline &&
									onChangeInline(
										{ fill: color },
										'[data-fill]',
										true
									)
								}
								onChange={({
									color,
									paletteColor,
									paletteStatus,
									paletteOpacity,
								}) => {
									const fillColorStr = getColorRGBAString({
										firstVar: getAttributeKey({
											key: 'fill',
											isHover,
											prefix,
										}),
										secondVar: `color-${paletteColor}${
											isHover ? '-hover' : ''
										}`,
										opacity: paletteOpacity,
										blockStyle,
									});
									const onChangeObj = {
										[getAttributeKey({
											key: 'f_cc',
											isHover,
											prefix,
										})]: color,
										[getAttributeKey({
											key: 'f_pc',
											isHover,
											prefix,
										})]: paletteColor,
										[getAttributeKey({
											key: 'f_ps',
											isHover,
											prefix,
										})]: paletteStatus,
										[getAttributeKey({
											key: 'f_po',
											isHover,
											prefix,
										})]: paletteOpacity,
									};

									shortPrefix === arrowShortPrefix &&
										onChange(
											{
												...onChangeObj,
												...['first', 'second'].reduce(
													(prev, current) => {
														return {
															...prev,
															[`na${current[0]}-i_c`]:
																(isHover
																	? setSVGContentHover
																	: setSVGContent)(
																	getAttributesValue(
																		{
																			target: `na${current[0]}-i_c`,
																			props,
																		}
																	),
																	paletteStatus
																		? fillColorStr
																		: color,
																	'fill'
																),
														};
													},
													{}
												),
											},
											'[data-fill]'
										);

									shortPrefix === dotsShortPrefix &&
										onChange(
											{
												...onChangeObj,
												...(!isActive && {
													'nd-i_c': (isHover
														? setSVGContentHover
														: setSVGContent)(
														getAttributesValue({
															target: 'nd-i_c',
															props,
														}),
														paletteStatus
															? fillColorStr
															: color,
														'fill'
													),
												}),
											},
											'[data-fill]'
										);
								}}
								isHover={isHover}
							/>
						)}
						<ToggleSwitch
							label={__(
								sprintf('Add %s border', label),
								'maxi-blocks'
							)}
							selected={borderStatus}
							onChange={val =>
								onChange({
									[`${prefix}bo.s`]: val,
								})
							}
						/>
						{borderStatus && (
							<BorderControl
								{...getGroupAttributes(
									props,
									['border', 'borderWidth', 'borderRadius'],
									isHover,
									prefix
								)}
								prefix={prefix}
								onChange={onChange}
								breakpoint={breakpoint}
								clientId={clientId}
								isHover={isHover}
							/>
						)}
						<ToggleSwitch
							label={__(
								sprintf('Add %s background', label),
								'maxi-blocks'
							)}
							selected={backgroundStatus}
							onChange={val =>
								onChange({
									[`${prefix}b.s`]: val,
								})
							}
						/>
						{backgroundStatus && (
							<>
								<SettingTabsControl
									type='buttons'
									fullWidthMode
									selected={iconBgActive}
									items={getBackgroundOptions()}
									onChange={val => {
										setIconBgActive(val);
										onChange({
											[getAttributeKey({
												key: 'b_am',
												isHover,
												prefix,
												breakpoint,
											})]: val,
										});
									}}
								/>
								{iconBgActive === 'color' && (
									<ColorControl
										label={__(
											`${capitalize(label)} background`,
											'maxi-blocks'
										)}
										paletteStatus={getLastBreakpointAttribute(
											{
												target: 'bc_ps',
												prefix,
												breakpoint,
												attributes: props,
												isHover,
											}
										)}
										paletteColor={getLastBreakpointAttribute(
											{
												target: 'bc_pc',
												prefix,
												breakpoint,
												attributes: props,
												isHover,
											}
										)}
										paletteOpacity={getLastBreakpointAttribute(
											{
												target: 'bc_po',
												prefix,
												breakpoint,
												attributes: props,
												isHover,
											}
										)}
										color={getLastBreakpointAttribute({
											target: 'bc_cc',
											prefix,
											breakpoint,
											attributes: props,
											isHover,
										})}
										prefix={`${prefix}bc-`}
										avoidBreakpointForDefault
										onChangeInline={({ color }) =>
											onChangeInline &&
											onChangeInline(
												{
													background: color,
												},
												`.maxi-slider-block__${
													shortPrefix ===
													arrowShortPrefix
														? 'arrow'
														: 'dot'
												}`
											)
										}
										onChange={({
											paletteStatus,
											paletteColor,
											paletteOpacity,
											color,
										}) => {
											onChange(
												{
													[getAttributeKey({
														key: 'bc_ps',
														isHover,
														prefix,
														breakpoint,
													})]: paletteStatus,
													[getAttributeKey({
														key: 'bc_pc',
														isHover,
														prefix,
														breakpoint,
													})]: paletteColor,
													[getAttributeKey({
														key: 'bc_po',
														isHover,
														prefix,
														breakpoint,
													})]: paletteOpacity,
													[getAttributeKey({
														key: 'bc_cc',
														isHover,
														prefix,
														breakpoint,
													})]: color,
												},
												shortPrefix === arrowShortPrefix
													? '.maxi-slider-block__arrow'
													: '.maxi-slider-block__dot'
											);
										}}
										isHover={isHover}
									/>
								)}
								{iconBgActive === 'gradient' && (
									<GradientControl
										label={__(
											`${capitalize(
												label
											)} background gradient`,
											'maxi-blocks'
										)}
										gradient={getLastBreakpointAttribute({
											target: 'bg_c',
											prefix,
											breakpoint,
											attributes: props,
											isHover,
										})}
										gradientOpacity={getLastBreakpointAttribute(
											{
												target: 'bg_o',
												prefix,
												breakpoint,
												attributes: props,
												isHover,
											}
										)}
										defaultGradient={getDefaultAttribute(
											getAttributeKey({
												key: 'bg_c',
												isHover,
												prefix,
												breakpoint,
											})
										)}
										onChange={val =>
											onChange({
												[getAttributeKey({
													key: 'bg_c',
													isHover,
													prefix,
													breakpoint,
												})]: val,
											})
										}
										onChangeOpacity={val =>
											onChange({
												[getAttributeKey({
													key: 'bg_o',
													isHover,
													prefix,
													breakpoint,
												})]: val,
											})
										}
										isHover={isHover}
									/>
								)}
							</>
						)}
						<ToggleSwitch
							label={__(
								sprintf('Add %s shadow', label),
								'maxi-blocks'
							)}
							selected={boxShadowStatus}
							onChange={val =>
								onChange({
									[`${prefix}bs.s`]: val,
								})
							}
						/>
						{boxShadowStatus && (
							<BoxShadowControl
								{...getGroupAttributes(
									props,
									'boxShadow',
									isHover,
									prefix
								)}
								prefix={prefix}
								label={`${capitalize(label)} box shadow`}
								onChange={onChange}
								breakpoint={breakpoint}
								clientId={clientId}
								isHover={isHover}
							/>
						)}
					</>
				))}
		</div>
	);
};

export default NavigationIconControl;
