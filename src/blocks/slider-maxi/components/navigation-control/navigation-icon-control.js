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
			target: ['border-status', 'background-status', 'box-shadow-status'],
			props,
			prefix,
		});
	const iconBgActiveMedia = getLastBreakpointAttribute({
		target: `${prefix}background-active-media`,
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

	const arrowShortPrefix = 'navigation-arrow-';
	const dotsShortPrefix = 'navigation-dot-';
	const shortPrefix =
		prefix === 'navigation-arrow-both-icon-'
			? arrowShortPrefix
			: dotsShortPrefix;
	const isActive = prefix.includes('active');
	const groupLabel = `${
		shortPrefix === 'navigation-dot-' ? 'dotIcon' : 'arrowIcon'
	}${isActive ? 'Active' : ''}${isHover ? 'Hover' : ''}`;
	const label = shortPrefix.includes('dot') ? 'dots' : 'arrows';

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
							target: 'icon-content',
							props,
							prefix: `${shortPrefix}${current}-`,
						})}
						prefix={`${shortPrefix}${current}-`}
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
							target: 'icon-content',
							props,
							prefix: shortPrefix,
						})}
						prefix={shortPrefix}
					/>
				)}
			{getAttributesValue({
				target: 'navigation-arrow-first-icon-content',
				props,
			}) ||
				getAttributesValue({
					target: 'navigation-arrow-second-icon-content',
					props,
				}) ||
				(getAttributesValue({
					target: 'navigation-dot-icon-content',
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
															[`navigation-arrow-${current}-icon-content`]:
																setSVGStrokeWidth(
																	getAttributesValue(
																		{
																			target: `navigation-arrow-${current}-icon-content`,
																			props,
																		}
																	),
																	obj[
																		getAttributeKey(
																			'stroke',
																			isHover,
																			prefix,
																			breakpoint
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
														'navigation-dot-icon-content':
															setSVGStrokeWidth(
																getAttributesValue(
																	{
																		target: 'navigation-dot-icon-content',
																		props,
																	}
																),
																obj[
																	getAttributeKey(
																		'stroke',
																		isHover,
																		prefix,
																		breakpoint
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
												target: `${prefix}spacing-horizontal`,
												breakpoint,
												attributes: props,
												isHover,
											})}
											onChangeValue={val => {
												onChange({
													[getAttributeKey(
														'spacing-horizontal',
														isHover,
														prefix,
														breakpoint
													)]:
														val !== undefined &&
														val !== ''
															? val
															: '',
												});
											}}
											onReset={() =>
												onChange({
													[getAttributeKey(
														'spacing-horizontal',
														isHover,
														prefix,
														breakpoint
													)]: getDefaultAttribute(
														getAttributeKey(
															'spacing-horizontal',
															isHover,
															prefix,
															breakpoint
														)
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
												target: `${prefix}spacing-vertical`,
												breakpoint,
												attributes: props,
												isHover,
											})}
											onChangeValue={val => {
												onChange({
													[getAttributeKey(
														'spacing-vertical',
														isHover,
														prefix,
														breakpoint
													)]:
														val !== undefined &&
														val !== ''
															? val
															: '',
												});
											}}
											onReset={() =>
												onChange({
													[getAttributeKey(
														'spacing-vertical',
														isHover,
														prefix,
														breakpoint
													)]: getDefaultAttribute(
														getAttributeKey(
															'spacing-vertical',
															isHover,
															prefix,
															breakpoint
														)
													),
												})
											}
											isHover={isHover}
										/>
										{prefix.includes('dot') && (
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
														target: `${prefix}spacing-between`,
														breakpoint,
														attributes: props,
														isHover,
													}
												)}
												onChangeValue={val => {
													onChange({
														[getAttributeKey(
															'spacing-between',
															isHover,
															prefix,
															breakpoint
														)]:
															val !== undefined &&
															val !== ''
																? val
																: '',
													});
												}}
												onReset={() =>
													onChange({
														[getAttributeKey(
															'spacing-between',
															isHover,
															prefix,
															breakpoint
														)]: getDefaultAttribute(
															getAttributeKey(
																'spacing-between',
																isHover,
																prefix,
																breakpoint
															)
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
									target: 'stroke-color',
									props,
									isHover,
									prefix,
								})}
								prefix={`${prefix}stroke-`}
								avoidBreakpointForDefault
								paletteColor={getAttributesValue({
									target: 'stroke-palette-color',
									props,
									isHover,
									prefix,
								})}
								paletteOpacity={getAttributesValue({
									target: 'stroke-palette-opacity',
									props,
									isHover,
									prefix,
								})}
								paletteStatus={getAttributesValue({
									target: 'stroke-palette-status',
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
										firstVar: getAttributeKey(
											'stroke',
											isHover,
											prefix
										),
										secondVar: `color-${paletteColor}${
											isHover ? '-hover' : ''
										}`,
										opacity: paletteOpacity,
										blockStyle,
									});
									const onChangeObj = {
										[getAttributeKey(
											'stroke-color',
											isHover,
											prefix
										)]: color,
										[getAttributeKey(
											'stroke-palette-color',
											isHover,
											prefix
										)]: paletteColor,
										[getAttributeKey(
											'stroke-palette-status',
											isHover,
											prefix
										)]: paletteStatus,
										[getAttributeKey(
											'stroke-palette-opacity',
											isHover,
											prefix
										)]: paletteOpacity,
									};

									shortPrefix === arrowShortPrefix &&
										onChange(
											{
												...onChangeObj,
												...['first', 'second'].reduce(
													(prev, current) => {
														return {
															...prev,
															[`navigation-arrow-${current}-icon-content`]:
																(isHover
																	? setSVGContentHover
																	: setSVGContent)(
																	getAttributesValue(
																		{
																			target: `navigation-arrow-${current}-icon-content`,
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
													'navigation-dot-icon-content':
														(isHover
															? setSVGContentHover
															: setSVGContent)(
															getAttributesValue({
																target: 'navigation-dot-icon-content',
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
									target: 'fill-color',
									props,
									isHover,
									prefix,
								})}
								prefix={`${prefix}fill-`}
								avoidBreakpointForDefault
								paletteColor={getAttributesValue({
									target: 'fill-palette-color',
									props,
									isHover,
									prefix,
								})}
								paletteOpacity={getAttributesValue({
									target: 'fill-palette-opacity',
									props,
									isHover,
									prefix,
								})}
								paletteStatus={getAttributesValue({
									target: 'fill-palette-status',
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
										firstVar: getAttributeKey(
											'fill',
											isHover,
											prefix
										),
										secondVar: `color-${paletteColor}${
											isHover ? '-hover' : ''
										}`,
										opacity: paletteOpacity,
										blockStyle,
									});
									const onChangeObj = {
										[getAttributeKey(
											'fill-color',
											isHover,
											prefix
										)]: color,
										[getAttributeKey(
											'fill-palette-color',
											isHover,
											prefix
										)]: paletteColor,
										[getAttributeKey(
											'fill-palette-status',
											isHover,
											prefix
										)]: paletteStatus,
										[getAttributeKey(
											'fill-palette-opacity',
											isHover,
											prefix
										)]: paletteOpacity,
									};

									shortPrefix === arrowShortPrefix &&
										onChange(
											{
												...onChangeObj,
												...['first', 'second'].reduce(
													(prev, current) => {
														return {
															...prev,
															[`navigation-arrow-${current}-icon-content`]:
																(isHover
																	? setSVGContentHover
																	: setSVGContent)(
																	getAttributesValue(
																		{
																			target: `navigation-arrow-${current}-icon-content`,
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
													'navigation-dot-icon-content':
														(isHover
															? setSVGContentHover
															: setSVGContent)(
															getAttributesValue({
																target: 'navigation-dot-icon-content',
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
									[`${prefix}border-status`]: val,
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
									[`${prefix}background-status`]: val,
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
											[getAttributeKey(
												'background-active-media',
												isHover,
												prefix,
												breakpoint
											)]: val,
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
												target: `${prefix}background-palette-status`,
												breakpoint,
												attributes: props,
												isHover,
											}
										)}
										paletteColor={getLastBreakpointAttribute(
											{
												target: `${prefix}background-palette-color`,
												breakpoint,
												attributes: props,
												isHover,
											}
										)}
										paletteOpacity={getLastBreakpointAttribute(
											{
												target: `${prefix}background-palette-opacity`,
												breakpoint,
												attributes: props,
												isHover,
											}
										)}
										color={getLastBreakpointAttribute({
											target: `${prefix}background-color`,
											breakpoint,
											attributes: props,
											isHover,
										})}
										prefix={`${prefix}background-`}
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
													[getAttributeKey(
														'background-palette-status',
														isHover,
														prefix,
														breakpoint
													)]: paletteStatus,
													[getAttributeKey(
														'background-palette-color',
														isHover,
														prefix,
														breakpoint
													)]: paletteColor,
													[getAttributeKey(
														'background-palette-opacity',
														isHover,
														prefix,
														breakpoint
													)]: paletteOpacity,
													[getAttributeKey(
														'bc_cc',
														isHover,
														prefix,
														breakpoint
													)]: color,
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
											target: `${prefix}background-gradient-content`,
											breakpoint,
											attributes: props,
											isHover,
										})}
										gradientOpacity={getLastBreakpointAttribute(
											{
												target: `${prefix}background-gradient-opacity`,
												breakpoint,
												attributes: props,
												isHover,
											}
										)}
										defaultGradient={getDefaultAttribute(
											getAttributeKey(
												'background-gradient-content',
												isHover,
												prefix,
												breakpoint
											)
										)}
										onChange={val =>
											onChange({
												[getAttributeKey(
													'background-gradient-content',
													isHover,
													prefix,
													breakpoint
												)]: val,
											})
										}
										onChangeOpacity={val =>
											onChange({
												[getAttributeKey(
													'background-gradient-opacity',
													isHover,
													prefix,
													breakpoint
												)]: val,
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
									[`${prefix}box-shadow-status`]: val,
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
