/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AxisControl from '../axis-control';
import AdvancedNumberControl from '../advanced-number-control';
import BorderControl from '../border-control';
import BoxShadowControl from '../box-shadow-control';
import ColorControl from '../color-control';
import GradientControl from '../gradient-control';
import SettingTabsControl from '../setting-tabs-control';
import ToggleSwitch from '../toggle-switch';
import ResponsiveTabsControl from '../responsive-tabs-control';

import {
	getDefaultAttribute,
	getGroupAttributes,
	getColorRGBAString,
	getAttributeKey,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import {
	setSVGStrokeWidth,
	setSVGContent,
	setSVGContentHover,
} from '../../extensions/svg';
import SvgWidthControl from '../svg-width-control';
import SvgStrokeWidthControl from '../svg-stroke-width-control';
import MaxiModal from '../../editor/library/modal';
import Icon from '../icon';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles and icons
 */
import {
	iconBorder,
	iconFill,
	backgroundColor,
	backgroundGradient,
	styleNone,
} from '../../icons';

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

	const isActive = prefix.includes('-active');

	const classes = classnames('maxi-icon-control', className);

	const [iconStyle, setIconStyle] = useState('color');

	const iconBgActiveMedia = getLastBreakpointAttribute({
		target: `${prefix}-background-active-media`,
		breakpoint,
		attributes: props,
		isHover,
	});

	const [iconBgActive, setIconBgActive] = useState(
		iconBgActiveMedia || 'none'
	);

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

	const shortPrefix =
		prefix === 'navigation-arrow-both-icon'
			? 'navigation-arrow'
			: 'navigation-dot';

	let shortestPrefix = 'arrow';
	let labelLow = 'arrows';
	let labelCapital = 'Arrows';

	if (isActive) {
		shortestPrefix = 'dotActive';
		labelLow = 'dots';
		labelCapital = 'Dots';
	}
	if (!isActive && shortPrefix.includes('dot')) {
		shortestPrefix = 'dot';
		labelLow = 'dots';
		labelCapital = 'Dots';
	}

	return (
		<div className={classes}>
			{!isHover &&
				!isActive &&
				breakpoint === 'general' &&
				shortPrefix === 'navigation-arrow' && (
					<>
						<MaxiModal
							type='navigation-icon'
							title={__('Add first arrow icon', 'maxi-blocks')}
							style={blockStyle}
							onSelect={obj => onChange(obj)}
							onRemove={obj => onChange(obj)}
							icon={props[`${shortPrefix}-first-icon-content`]}
							prefix={`${shortPrefix}-first-`}
						/>
						<MaxiModal
							type='navigation-icon'
							title={__('Add second arrow icon', 'maxi-blocks')}
							style={blockStyle}
							onSelect={obj => onChange(obj)}
							onRemove={obj => onChange(obj)}
							icon={props[`${shortPrefix}-second-icon-content`]}
							prefix={`${shortPrefix}-second-`}
						/>
					</>
				)}
			{!isHover &&
				!isActive &&
				breakpoint === 'general' &&
				shortPrefix === 'navigation-dot' && (
					<MaxiModal
						type='navigation-icon'
						title={__('Add dot icon', 'maxi-blocks')}
						style={blockStyle}
						onSelect={obj => onChange(obj)}
						onRemove={obj => onChange(obj)}
						icon={props[`${shortPrefix}-icon-content`]}
						prefix={`${shortPrefix}-`}
					/>
				)}
			{(props['navigation-arrow-first-icon-content'] ||
				props['navigation-arrow-second-icon-content'] ||
				props['navigation-dot-icon-content']) && (
				<>
					{!isActive && (
						<ResponsiveTabsControl breakpoint={breakpoint}>
							<>
								<SvgWidthControl
									{...getGroupAttributes(
										props,
										shortPrefix === 'navigation-dot'
											? `dotIcon${isHover ? 'Hover' : ''}`
											: `arrowIcon${
													isHover ? 'Hover' : ''
											  }`,
										isHover
									)}
									onChange={onChange}
									prefix={`${prefix}-`}
									customLabel={`${labelCapital} size`}
									breakpoint={breakpoint}
									isHover={isHover}
								/>
								<SvgStrokeWidthControl
									{...getGroupAttributes(
										props,
										shortPrefix === 'navigation-dot'
											? `dotIcon${isHover ? 'Hover' : ''}`
											: `arrowIcon${
													isHover ? 'Hover' : ''
											  }`,
										isHover
									)}
									onChange={obj => {
										shortPrefix === 'navigation-arrow' &&
											onChange({
												...obj,
												'navigation-arrow-first-icon-content':
													setSVGStrokeWidth(
														props[
															'navigation-arrow-first-icon-content'
														],
														obj[
															`${prefix}-stroke-${breakpoint}${
																isHover
																	? '-hover'
																	: ''
															}`
														]
													),
												'navigation-arrow-second-icon-content':
													setSVGStrokeWidth(
														props[
															'navigation-arrow-second-icon-content'
														],
														obj[
															`${prefix}-stroke-${breakpoint}${
																isHover
																	? '-hover'
																	: ''
															}`
														]
													),
											});
										shortPrefix === 'navigation-dot' &&
											onChange({
												...obj,
												'navigation-dot-icon-content':
													setSVGStrokeWidth(
														props[
															'navigation-dot-icon-content'
														],
														obj[
															`${prefix}-stroke-${breakpoint}${
																isHover
																	? '-hover'
																	: ''
															}`
														]
													),
											});
									}}
									prefix={`${prefix}-`}
									customLabel={`${labelCapital} stroke width`}
									breakpoint={breakpoint}
									isHover={isHover}
								/>
								{!isHover && !isActive && (
									<>
										<AdvancedNumberControl
											label={__(
												`${labelCapital} horizontal spacing`,
												'maxi-blocks'
											)}
											min={-300}
											max={300}
											initial={1}
											step={1}
											breakpoint={breakpoint}
											value={
												props[
													`${prefix}-spacing-horizontal-${breakpoint}${
														isHover ? '-hover' : ''
													}`
												]
											}
											onChangeValue={val => {
												onChange({
													[`${prefix}-spacing-horizontal-${breakpoint}${
														isHover ? '-hover' : ''
													}`]:
														val !== undefined &&
														val !== ''
															? val
															: '',
												});
											}}
											onReset={() =>
												onChange({
													[`${prefix}-spacing-horizontal-${breakpoint}${
														isHover ? '-hover' : ''
													}`]: getDefaultAttribute(
														`${prefix}-spacing-horizontal-${breakpoint}${
															isHover
																? '-hover'
																: ''
														}`
													),
												})
											}
											isHover={isHover}
										/>
										<AdvancedNumberControl
											label={__(
												`${labelCapital} vertical spacing`,
												'maxi-blocks'
											)}
											min={-100}
											max={200}
											initial={1}
											step={1}
											breakpoint={breakpoint}
											value={
												props[
													`${prefix}-spacing-vertical-${breakpoint}${
														isHover ? '-hover' : ''
													}`
												]
											}
											onChangeValue={val => {
												onChange({
													[`${prefix}-spacing-vertical-${breakpoint}${
														isHover ? '-hover' : ''
													}`]:
														val !== undefined &&
														val !== ''
															? val
															: '',
												});
											}}
											onReset={() =>
												onChange({
													[`${prefix}-spacing-vertical-${breakpoint}${
														isHover ? '-hover' : ''
													}`]: getDefaultAttribute(
														`${prefix}-spacing-vertical-${breakpoint}${
															isHover
																? '-hover'
																: ''
														}`
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
												value={
													props[
														`${prefix}-spacing-between-${breakpoint}${
															isHover
																? '-hover'
																: ''
														}`
													]
												}
												onChangeValue={val => {
													onChange({
														[`${prefix}-spacing-between-${breakpoint}${
															isHover
																? '-hover'
																: ''
														}`]:
															val !== undefined &&
															val !== ''
																? val
																: '',
													});
												}}
												onReset={() =>
													onChange({
														[`${prefix}-spacing-between-${breakpoint}${
															isHover
																? '-hover'
																: ''
														}`]: getDefaultAttribute(
															`${prefix}-spacing-between-${breakpoint}${
																isHover
																	? '-hover'
																	: ''
															}`
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
											`${shortestPrefix}IconPadding`
										)}
										label={__(
											`${labelCapital} padding`,
											'maxi-blocks'
										)}
										onChange={onChange}
										breakpoint={breakpoint}
										target='padding'
										disableAuto
										optionType='string'
										minMaxSettings={minMaxSettings}
										prefix={`${prefix}-`}
										noResponsiveTabs
									/>
								)}
							</>
						</ResponsiveTabsControl>
					)}
					{svgType === 'Filled' && (
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
							label={__(`${labelCapital} line`, 'maxi-blocks')}
							color={
								props[
									`${prefix}-stroke-color${
										isHover ? '-hover' : ''
									}`
								]
							}
							prefix={`${prefix}-stroke-`}
							avoidBreakpointForDefault
							paletteColor={
								props[
									`${prefix}-stroke-palette-color${
										isHover ? '-hover' : ''
									}`
								]
							}
							paletteOpacity={
								props[
									`${prefix}-stroke-palette-opacity${
										isHover ? '-hover' : ''
									}`
								]
							}
							paletteStatus={
								props[
									`${prefix}-stroke-palette-status${
										isHover ? '-hover' : ''
									}`
								]
							}
							onChangeInline={({ color }) =>
								onChangeInline &&
								!isActive &&
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
									firstVar: `${prefix}-stroke${
										isHover ? '-hover' : ''
									}`,
									secondVar: `color-${paletteColor}${
										isHover ? '-hover' : ''
									}`,
									opacity: paletteOpacity,
									blockStyle,
								});

								shortPrefix === 'navigation-arrow' &&
									onChange({
										[`${prefix}-stroke-color${
											isHover ? '-hover' : ''
										}`]: color,
										[`${prefix}-stroke-palette-color${
											isHover ? '-hover' : ''
										}`]: paletteColor,
										[`${prefix}-stroke-palette-status${
											isHover ? '-hover' : ''
										}`]: paletteStatus,
										[`${prefix}-stroke-palette-opacity${
											isHover ? '-hover' : ''
										}`]: paletteOpacity,
										'navigation-arrow-first-icon-content':
											isHover
												? setSVGContentHover(
														props[
															'navigation-arrow-first-icon-content'
														],
														paletteStatus
															? strokeColorStr
															: color,
														'stroke'
												  )
												: setSVGContent(
														props[
															'navigation-arrow-first-icon-content'
														],
														paletteStatus
															? strokeColorStr
															: color,
														'stroke'
												  ),
										'navigation-arrow-second-icon-content':
											isHover
												? setSVGContentHover(
														props[
															'navigation-arrow-second-icon-content'
														],
														paletteStatus
															? strokeColorStr
															: color,
														'stroke'
												  )
												: setSVGContent(
														props[
															'navigation-arrow-second-icon-content'
														],
														paletteStatus
															? strokeColorStr
															: color,
														'stroke'
												  ),
									});
								shortPrefix === 'navigation-dot' &&
									onChange({
										[`${prefix}-stroke-color${
											isHover ? '-hover' : ''
										}`]: color,
										[`${prefix}-stroke-palette-color${
											isHover ? '-hover' : ''
										}`]: paletteColor,
										[`${prefix}-stroke-palette-status${
											isHover ? '-hover' : ''
										}`]: paletteStatus,
										[`${prefix}-stroke-palette-opacity${
											isHover ? '-hover' : ''
										}`]: paletteOpacity,
										'navigation-dot-icon-content': isHover
											? setSVGContentHover(
													props[
														'navigation-dot-icon-content'
													],
													paletteStatus
														? strokeColorStr
														: color,
													'stroke'
											  )
											: !isActive &&
											  setSVGContent(
													props[
														'navigation-dot-icon-content'
													],
													paletteStatus
														? strokeColorStr
														: color,
													'stroke'
											  ),
									});
							}}
							isHover={isHover}
						/>
					)}
					{iconStyle === 'color' && svgType !== 'Line' && (
						<ColorControl
							label={__(`${labelCapital} fill`, 'maxi-blocks')}
							color={
								props[
									`${prefix}-fill-color${
										isHover ? '-hover' : ''
									}`
								]
							}
							prefix={`${prefix}-fill-`}
							avoidBreakpointForDefault
							paletteColor={
								props[
									`${prefix}-fill-palette-color${
										isHover ? '-hover' : ''
									}`
								]
							}
							paletteOpacity={
								props[
									`${prefix}-fill-palette-opacity${
										isHover ? '-hover' : ''
									}`
								]
							}
							paletteStatus={
								props[
									`${prefix}-fill-palette-status${
										isHover ? '-hover' : ''
									}`
								]
							}
							onChangeInline={({ color }) =>
								onChangeInline &&
								!isActive &&
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
									firstVar: `${prefix}-fill${
										isHover ? '-hover' : ''
									}`,
									secondVar: `color-${paletteColor}${
										isHover ? '-hover' : ''
									}`,
									opacity: paletteOpacity,
									blockStyle,
								});

								shortPrefix === 'navigation-arrow' &&
									onChange({
										[`${prefix}-fill-color${
											isHover ? '-hover' : ''
										}`]: color,
										[`${prefix}-fill-palette-color${
											isHover ? '-hover' : ''
										}`]: paletteColor,
										[`${prefix}-fill-palette-status${
											isHover ? '-hover' : ''
										}`]: paletteStatus,
										[`${prefix}-fill-palette-opacity${
											isHover ? '-hover' : ''
										}`]: paletteOpacity,
										'navigation-arrow-first-icon-content':
											isHover
												? setSVGContentHover(
														props[
															'navigation-arrow-first-icon-content'
														],
														paletteStatus
															? fillColorStr
															: color,
														'fill'
												  )
												: setSVGContent(
														props[
															'navigation-arrow-first-icon-content'
														],
														paletteStatus
															? fillColorStr
															: color,
														'fill'
												  ),
										'navigation-arrow-second-icon-content':
											isHover
												? setSVGContentHover(
														props[
															'navigation-arrow-second-icon-content'
														],
														paletteStatus
															? fillColorStr
															: color,
														'fill'
												  )
												: setSVGContent(
														props[
															'navigation-arrow-second-icon-content'
														],
														paletteStatus
															? fillColorStr
															: color,
														'fill'
												  ),
									});

								shortPrefix === 'navigation-dot' &&
									onChange({
										[`${prefix}-fill-color${
											isHover ? '-hover' : ''
										}`]: color,
										[`${prefix}-fill-palette-color${
											isHover ? '-hover' : ''
										}`]: paletteColor,
										[`${prefix}-fill-palette-status${
											isHover ? '-hover' : ''
										}`]: paletteStatus,
										[`${prefix}-fill-palette-opacity${
											isHover ? '-hover' : ''
										}`]: paletteOpacity,
										[`${prefix}-content`]: isHover
											? setSVGContentHover(
													props[
														'navigation-dot-icon-content'
													],
													paletteStatus
														? fillColorStr
														: color,
													'fill'
											  )
											: !isActive &&
											  setSVGContent(
													props[
														'navigation-dot-icon-content'
													],
													paletteStatus
														? fillColorStr
														: color,
													'fill'
											  ),
									});
							}}
							isHover={isHover}
						/>
					)}
					<ToggleSwitch
						label={__(`Add ${labelLow} border`, 'maxi-blocks')}
						selected={props[`${prefix}-status-border`]}
						onChange={val =>
							onChange({
								[`${prefix}-status-border`]: val,
							})
						}
					/>
					{props[`${prefix}-status-border`] && (
						<BorderControl
							{...getGroupAttributes(props, [
								`${shortestPrefix}IconBorder${
									isHover ? 'Hover' : ''
								}`,

								`${shortestPrefix}IconBorderWidth${
									isHover ? 'Hover' : ''
								}`,
								`${shortestPrefix}IconBorderRadius${
									isHover ? 'Hover' : ''
								}`,
							])}
							prefix={`${prefix}-`}
							onChange={onChange}
							breakpoint={breakpoint}
							clientId={clientId}
							isHover={isHover}
						/>
					)}
					<ToggleSwitch
						label={__(`Add ${labelLow} background`, 'maxi-blocks')}
						selected={props[`${prefix}-status-background`]}
						onChange={val =>
							onChange({
								[`${prefix}-status-background`]: val,
							})
						}
					/>
					{props[`${prefix}-status-background`] && (
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
											'-background-active-media',
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
										'{labelCapital} background',
										'maxi-blocks'
									)}
									paletteStatus={getLastBreakpointAttribute({
										target: `${prefix}-background-palette-status`,
										breakpoint,
										attributes: props,
										isHover,
									})}
									paletteColor={getLastBreakpointAttribute({
										target: `${prefix}-background-palette-color`,
										breakpoint,
										attributes: props,
										isHover,
									})}
									paletteOpacity={getLastBreakpointAttribute({
										target: `${prefix}-background-palette-opacity`,
										breakpoint,
										attributes: props,
										isHover,
									})}
									color={getLastBreakpointAttribute({
										target: `${prefix}-background-color`,
										breakpoint,
										attributes: props,
										isHover,
									})}
									prefix={`${prefix}-background-`}
									avoidBreakpointForDefault
									onChangeInline={({ color }) =>
										onChangeInline &&
										onChangeInline(
											{
												background: color,
											},
											shortPrefix === 'navigation-arrow'
												? '.maxi-slider-block__arrow'
												: '.maxi-slider-block__dot'
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
													'-background-palette-status',
													isHover,
													prefix,
													breakpoint
												)]: paletteStatus,
												[getAttributeKey(
													'-background-palette-color',
													isHover,
													prefix,
													breakpoint
												)]: paletteColor,
												[getAttributeKey(
													'-background-palette-opacity',
													isHover,
													prefix,
													breakpoint
												)]: paletteOpacity,
												[getAttributeKey(
													'-background-color',
													isHover,
													prefix,
													breakpoint
												)]: color,
											},
											shortPrefix === 'navigation-arrow'
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
										`${labelCapital} background gradient`,
										'maxi-blocks'
									)}
									gradient={getLastBreakpointAttribute({
										target: `${prefix}-background-gradient`,
										breakpoint,
										attributes: props,
										isHover,
									})}
									gradientOpacity={getLastBreakpointAttribute(
										{
											target: `${prefix}-background-gradient-opacity`,
											breakpoint,
											attributes: props,
											isHover,
										}
									)}
									defaultGradient={getDefaultAttribute(
										getAttributeKey(
											'-background-gradient',
											isHover,
											prefix,
											breakpoint
										)
									)}
									onChange={val =>
										onChange({
											[getAttributeKey(
												'-background-gradient',
												isHover,
												prefix,
												breakpoint
											)]: val,
										})
									}
									onChangeOpacity={val =>
										onChange({
											[getAttributeKey(
												'-background-gradient-opacity',
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
						label={__(`Add ${labelLow} shadow`, 'maxi-blocks')}
						selected={props[`${prefix}-status-shadow`]}
						onChange={val =>
							onChange({
								[`${prefix}-status-shadow`]: val,
							})
						}
					/>
					{props[`${prefix}-status-shadow`] && (
						<BoxShadowControl
							{...getGroupAttributes(
								props,
								`${shortestPrefix}IconBoxShadow`,
								isHover
							)}
							prefix={`${prefix}-`}
							customLabel={`${labelCapital} box shadow`}
							onChange={onChange}
							breakpoint={breakpoint}
							clientId={clientId}
							isHover={isHover}
						/>
					)}
				</>
			)}
		</div>
	);
};

export default NavigationIconControl;
